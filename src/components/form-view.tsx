import React, { useState, useEffect, useRef } from "react";
import { AlertType, Button as IButton, FormEntity } from "interfaces";
import qs from "querystring";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import dataServices from "../services/data";
import Schema from "./schema";
import { api, ui, utils } from "services";
import { Button, Card, Icon } from "semantic-ui-react";
import { getErrorValue } from "import";
import _ from "lodash";
import { CancelModal } from "modal/cancel-modal";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
interface FormViewProps {
  formName: string;
  params: { mode: string; id?: any; embed?: any };
  onCreated?: (data: any) => void;
  onCancel?: Function;
  onChange?: Function;
  customView?: any;
}
function FormView({ formName, params, onCreated, onChange, customView }: FormViewProps): React.ReactElement {
  const { t } = useTranslation();
  const mainSchemaRef = useRef();
  const [submited, setSubmited] = useState<boolean>(false);
  const [payload, setPayload] = useState<any>(params.embed || {});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formInfo, setFormInfo] = useState<FormEntity>(dataServices.getFormByName(formName));
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState([]);
  let { mode, id } = params;
  const [popup, setPopup] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // if (formName === "edit-order") {
    //   let deepClone = _.cloneDeep(formInfo);
    //   deepClone.buttons.push({
    //     icon: "cancel",
    //     color: "red",
    //     label: "Cancel",
    //     action: "popup",
    //     position: "row",
    //     pageMode: "edit",
    //     popupName: "cancel-order",
    //   });
    //   setFormInfo(deepClone);
    // }
  }, [formName]);

  useEffect(() => {
    if (formName === "edit-order") {
      let errors = getErrorValue(payload, payload.text_note);
      payload.status = errors.length === 0;
      payload.errorValue = errors;
      setErrors(errors);
    }
  }, [payload]);

  async function loadData() {
    let postfn = api.post;
    let rs;
    rs = await postfn(`${formInfo.api}`, {
      where: { id },
      offset: 0,
      limit: 1,
    });
    setPayload(rs?.data[0]);
    setLoading(false);
  }
  useEffect(() => {
    if (!(mode === "edit" && id)) {
      setPayload(params.embed || {});
      setLoading(false);
      return;
    }
    loadData();
  }, [formInfo, mode, id]);

  useEffect(() => {
    if (formName === "edit-order") {
      let errors = getErrorValue(payload, payload.text_note);
      payload.status = errors.length === 0;
      payload.errorValue = errors;
    }
  }, [payload]);

  function validate(input: any) {
    const errors: { [key: string]: string } = {};
    //@ts-ignore
    return mainSchemaRef.current.validate(input);
  }

  async function handleReplace(btn: IButton) {
    setSubmitting(true);

    try {
      // @ts-ignore
      let dataRes: { page: number; pageKey: string; src: string; text: string, pdf: string }[] = await window.cropPdfCenterToImages(PDFDocument, (percentage) => {
        if (percentage == "100") {
          setSubmitting(false);
        }
      }, payload.pdf);

      let pdf = dataRes?.find((pdfDataText) => {
        let arr = pdfDataText.text.split("\n");
        let key = (pdfDataText.pageKey ?? arr[arr.length - 3]).replaceAll(" ", "");
        console.log(key, payload.tracking_id);
        return key === payload.tracking_id;
      });

      if (!pdf) {
        throw Error("New Label not found !");
      }

      let errors = getErrorValue(payload, pdf.text);

      let payloadBody = {
        ...payload,
        pdf: pdf.pdf,
        page: pdf.page,
        status: errors.length === 0,
        text_note: pdf.text,
      };

      let rs = await api.post("/order/request-replace", {
        ...payloadBody,
      });

      setPayload(rs);
      nav(`/form/edit-form/edit?id=${rs.id}`);
      ui.alert("Success", AlertType.Success);
    } catch (err: any) {
      ui.alert(t(err.message), AlertType.Danger);
    } finally {
      setSubmitting(false);
    }
  }

  async function onButtonClick(btn: IButton) {
    if (btn.api === "/order/request-replace") {
      await handleReplace(btn);
      return;
    }

    setSubmited(true);
    if (!validate(payload)) {
      return;
    }
    if (btn.confirmText) {
      await ui.confirm(t(btn.confirmText));
    }
    if (formName === "edit-order") {
      let errors = getErrorValue(payload, payload.text_note);
      payload.status = errors.length === 0;
      payload.errorValue = errors;
    }
    if (payload?.errorValue?.length) {
      await ui.confirm(
        `There are some unmatch data (${payload.errorValue
          .filter((i: any, index: number) => index % 2 === 1)
          .join(", ")}). Are you sure want to save it ?`
      );
    }
    let isReturnForm = ["edit-order"].includes(formName);

    try {
      setSubmitting(true);
      let postfn = api.post;
      let rs = await postfn(btn.api, payload);
      if (onCreated) {
        onCreated(rs);
      }
      if (isReturnForm && rs.id) {
        setPayload(rs);
      }
      ui.alert(t(btn.successMessage || "Success"));
    } catch (error: any) {
      ui.alert(t(btn.failMessage || error.message || "Fail"));
    } finally {
      if (!btn.disableReload && params.mode === "edit") {
        if (!isReturnForm) {
          loadData();
        }
      }
      setSubmitting(false);
    }
  }
  function renderButton(btn: IButton, index: number) {
    switch (btn.action) {
      case "api":
        return (
          <Button
            loading={submitting}
            className="ml-2"
            key={index}
            //@ts-ignore
            color={btn.color}
            labelPosition="left"
            icon={btn.icon}
            onClick={() => {
              onButtonClick(btn);
            }}
            content={t(btn.label)}
          />
        );
      case "popup":
        return (
          <Button
            //@ts-ignore
            color={btn.color || "blue"}
            className="mr-1"
            icon={btn.icon}
            content={t(btn.label)}
            key={index}
            onClick={async () => {
              if (btn.popupName) {
                setPopup({
                  popupName: btn.popupName,
                  item: payload,
                });
              }
            }}
          />
        );
      case "redirect":
        let url = btn.redirectUrl;
        //check data item
        if (btn.redirectUrlEmbed && Object.keys(btn.redirectUrlEmbed).length) {
          let params: any = {};
          for (var i in btn.redirectUrlEmbed) {
            let val = btn.redirectUrlEmbed[i];
            if (typeof val === "string" && val[0] === "$") {
              let key = val.substr(1, val.length - 1);
              params[i] = payload[key];
            } else {
              params[i] = val;
            }
          }
          let embed: any = {};
          if (btn.redirectUrlEmbed.embed) {
            for (var i in btn.redirectUrlEmbed.embed) {
              let val = btn.redirectUrlEmbed.embed[i];
              if (typeof val === "string" && val[0] === "$") {
                let key = val.substr(1, val.length - 1);
                embed[i] = payload[key];
              } else {
                embed[i] = val;
              }
            }
            params.embed = JSON.stringify(embed);
          }

          url += `?${qs.stringify(params)}`;
        }
        if (payload) {
          for (var i in payload) {
            url = url.replace(new RegExp(`{${i}}`, "g"), payload[i]);
          }
        }
        return (
          <Button
            //@ts-ignore
            color={btn.color}
            loading={submitting}
            href={`#${url}`}
            as="a"
            key={index}
            className="ml-1"
            icon={btn.icon}
            labelPosition="left"
            content={t(btn.label)}
          ></Button>
        );
    }
  }
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Card fluid>
          <Card.Content>
            <Card.Header>
              <div className="flex justify-between items-center">
                <p style={{ margin: 0 }}>{t(formInfo.label || "Unknown")}</p>
                <div>
                  <Button
                    color="teal"
                    onClick={() => {
                      nav(-1);
                    }}
                  >
                    <Icon name="undo" />
                    Back
                  </Button>
                  {formInfo.buttons
                    .filter((i) => {
                      if (i.pageMode !== params.mode) return false;
                      if (i.require) {
                        let isShow = true;
                        Object.keys(i.require).map((fieldKey) => {
                          let value = i.require[fieldKey];
                          if (value !== payload[fieldKey]) {
                            isShow = false;
                          }
                        });
                        if (!isShow) return false;
                      }
                      return true;
                    })
                    .map((btn: IButton, index: number) => {
                      return renderButton(btn, index);
                    })}
                </div>
              </div>
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <Schema
              controls={formInfo.controls}
              ref={mainSchemaRef}
              showError={submited}
              value={payload}
              onChange={(val: any) => {
                if (onChange) {
                  onChange(val);
                }
                setPayload(val);
              }}
              errorFields={errors}
              totalGrid={formInfo.totalGrid ?? 1}
            />
          </Card.Content>
          {customView !== undefined && <Card.Content content={customView} />}

          <CancelModal
            isOpen={popup?.popupName === "cancel-order"}
            item={popup?.item}
            close={() => {
              setPopup(null);
            }}
          />
        </Card>
      )}
    </div>
  );
}
export default FormView;
