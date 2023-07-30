import React, { useState, useEffect, useRef } from "react";
import { Button as IButton, FormEntity, BidConfigEntity } from "interfaces";
import qs from "querystring";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import dataServices from "../services/data";
import Schema from "./schema";
import { api, ui } from "services";
import { Button, Card } from "semantic-ui-react";
interface FormViewProps {
  formName: string;
  params: { mode: string; id?: any; embed?: any };
  onCreated?: (data: any) => void;
  onCancel?: Function;
  onChange?: Function;
  customView?: any;
}
function FormView({
  formName,
  params,
  onCreated,
  onChange,
  customView,
}: FormViewProps): React.ReactElement {
  const { t } = useTranslation();
  const mainSchemaRef = useRef();
  const [submited, setSubmited] = useState<boolean>(false);
  const [payload, setPayload] = useState<any>(params.embed || {});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const formInfo: FormEntity = dataServices.getFormByName(formName);
  const [loading, setLoading] = useState<boolean>(true);

  let { mode, id } = params;
  const button: IButton = formInfo.buttons.find(
    (i) => i.pageMode === params.mode
  );
  const [successMessage, setSuccessMessage] = useState<string>(
    t(button?.successMessage)
  );
  async function loadData() {
    let postfn = api.post;
    let rs    
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

  function validate(input: any) {
    const errors: { [key: string]: string } = {};
    //@ts-ignore
    return mainSchemaRef.current.validate(input);
  }
  async function onButtonClick(btn: IButton) {
    setSubmited(true);
    if (!validate(payload)) {
      return;
    }
    if (btn.confirmText) {
      await ui.confirm(t(btn.confirmText));
    }
    try {      
      setSubmitting(true);
      let postfn = api.post;
      let rs
     rs = await postfn(btn.api, payload);
      if (onCreated) {
        onCreated(rs);
      }
      ui.alert(t(btn.successMessage || "Success"));
    } catch (error: any) {
      ui.alert(t(btn.failMessage || error.message || "Fail"));
    } finally {
      if (!btn.disableReload && params.mode === "edit") {
        loadData();
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
                  {formInfo.buttons
                    .filter((i) => i.pageMode === params.mode)
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
            />
          </Card.Content>
          {customView !== undefined && <Card.Content content={customView} />}
        </Card>
      )}
    </div>
  );
}
export default FormView;
