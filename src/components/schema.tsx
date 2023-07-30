import React, { useState, forwardRef, useImperativeHandle } from "react";
import { FormControl, SchemaControl, SchemaDataType } from "../interfaces";
import { useTranslation } from "react-i18next";
import dataServices from "../services/data";
import {
  DatePicker,
  Entity,
  Enum,
  Upload,
} from "components";
import dayjs from "dayjs";
import {
  Accordion,
  Card,
  Checkbox,
  Form,
  Input,
  TextArea,
} from "semantic-ui-react";
import UploadImage from "./upload-image";
import MultiLanguage from "./multi-language";
import Tree from "./tree";
import LockFeature from "./lock-feature";
import UploadIdentity from "./upload-identity";

interface FormViewProps {
  controls: FormControl[];
  showError?: boolean;
  onChange?: Function;
  value?: any;
}
function Schema(
  { controls, showError, value, onChange }: FormViewProps,
  ref: any
) {
  useImperativeHandle(ref, () => ({
    validate: validate,
  }));
  const { t } = useTranslation();
  const [errors, setErrors] = useState<any>({});
  let schemas: any = {};
  controls.forEach((c) => {
    if (c.control === SchemaControl.Schema) {
      schemas[c.field] = dataServices.getFormByName(c.schemaName);
      schemas[c.field].ref = React.createRef();
    }
  });
  function validate(input: any) {
    let pass = true;
    const errors: { [key: string]: string } = {};
    controls.forEach((ctrl) => {
      if (ctrl.control === SchemaControl.Schema) {
        if (
          !schemas[ctrl.field]?.ref.current.validate(input[ctrl.field] || {})
        ) {
          pass = false;
        }
      } else {
        //@ts-ignore
        if (ctrl.required) {
          if (ctrl.multiple) {
            if (!(input[ctrl.field] && input[ctrl.field].length)) {
              errors[ctrl.field] = t("Required");
              pass = false;
            }
          } else {
            if (input[ctrl.field] === null || input[ctrl.field] === undefined) {
              errors[ctrl.field] = t("Required");
              pass = false;
            }
          }
        }
      }
    });
    setErrors(errors);
    return pass;
  }

  function handleChange(field: string, val: any) {
    let tmp = Object.assign({}, value);
    tmp[field] = val;
    validate(tmp);
    onChange(tmp);
  }

  return (
    <div className="block w-full bg-white">
      {showError && Object.keys(errors).length > 0 && (
        <div className="w-full rounded-md bg-primary-900 text-white mt-2 p-2">
          <p className="text-xl font-semibold">
            {t("Missing required fields")}:{" "}
          </p>
          {Object.keys(errors).map((key, index) => {
            let ctrl = controls.find((i) => i.field === key);
            return (
              <p className="text-sm" key={index}>
                {t(ctrl?.label)}
              </p>
            );
          })}
        </div>
      )}
      <Form>
        {controls.map((ctrl, index) => {
          let isShow = true;
          let condition = ctrl.show;
          condition && Object.keys(condition).map((key: any) => {
            console.log(key)
            if (value[key] !== condition[key]) {
              isShow = false;
            }
          })

          if (!isShow) {
            return <></>
          }

          switch (ctrl.control) {
            case SchemaControl.Tree:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <Tree
                    value={value[ctrl.field] || []}
                    onChange={(val: any) => {
                      handleChange(ctrl.field, val);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Image:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <UploadImage
                    value={value[ctrl.field]}
                    onChange={(url: string) => {
                      handleChange(ctrl.field, url);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Upload:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <Upload
                    value={value[ctrl.field]}
                    onChange={(url: string) => {
                      handleChange(ctrl.field, url);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.TextArea:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <TextArea
                    placeholder={ctrl.placeholder}
                    fluid
                    type="text"
                    defaultValue={value[ctrl.field]}
                    onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
                      handleChange(ctrl.field, evt.target.value);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Date:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <DatePicker
                    isClearable
                    showTimeSelect
                    selected={
                      typeof value[ctrl.field] === "string"
                        ? new Date(value[ctrl.field])
                        : value[ctrl.field]
                    }
                    onChange={(val: Date) => {
                      if (!val) {
                        handleChange(ctrl.field, null);
                      } else {
                        handleChange(ctrl.field, dayjs(val).toDate());
                      }
                    }}
                    dateFormat="yyyy/MM/dd HH:mm"
                  />
                </Form.Field>
              );
            case SchemaControl.DateTime:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <DatePicker
                    isClearable
                    showTimeSelect
                    selected={
                      typeof value[ctrl.field] === "string"
                        ? new Date(value[ctrl.field])
                        : value[ctrl.field]
                    }
                    onChange={(val: Date) => {
                      if (!val) {
                        handleChange(ctrl.field, null);
                      } else {
                        handleChange(ctrl.field, dayjs(val).toDate());
                      }
                    }}
                    dateFormat="yyyy/MM/dd HH:mm"
                  />
                </Form.Field>
              );
            case SchemaControl.LockFeature:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <LockFeature
                    value={value[ctrl.field] || []}
                    onChange={(val: any) => {
                      handleChange(ctrl.field, val);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.UploadIdentity:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <UploadIdentity
                    value={value[ctrl.field] || []}
                    onChange={(val: any) => {
                      handleChange(ctrl.field, val);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.MultiLanguage:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <MultiLanguage
                    value={value[ctrl.field] || []}
                    onChange={(val: any) => {
                      handleChange(ctrl.field, val);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Schema:
              return (
                <div className="w-full float-left p-2 relative" key={index}>
                  <label>{t(ctrl.label)}</label>
                  <SchemaComponent
                    value={value[ctrl.field] || {}}
                    showError={showError}
                    controls={schemas[ctrl.field].controls}
                    ref={schemas[ctrl.field].ref}
                    onChange={(val: any) => {
                      handleChange(ctrl.field, val);
                    }}
                  />
                </div>
              );
            case SchemaControl.CheckList:
              return (
                <div className="w-full float-left p-2 relative" key={index}>
                  <label>{t(ctrl.label)}</label>
                  <p>Checklist</p>
                </div>
              );
            case SchemaControl.Checkbox:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <Checkbox
                    checked={value[ctrl.field]}
                    toggle
                    onChange={(evt: any, { checked }) => {
                      handleChange(ctrl.field, checked);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Entity:
              return (
                <Form.Field>
                  <label>{t(ctrl.label)}</label>
                  <Entity
                    displayField={ctrl.displayField || "name"}
                    disabled={ctrl.disabled}
                    value={value[ctrl.field]}
                    values={value[ctrl.field]}
                    gridName={ctrl.gridName}
                    multiple={false}
                    onChange={(val: any) => {
                      handleChange(ctrl.field, val);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Enum:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <Enum
                    placeholder={ctrl.placeholder}
                    value={value[ctrl.field]}
                    enumName={ctrl.enum}
                    multiple={ctrl.multiple}
                    onChange={(val) => {
                      handleChange(ctrl.field, val);
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Text:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <p className="text-gray-400 text-sm m-0 font-light">
                    {t(ctrl.description)}
                  </p>
                  <Input
                    fluid
                    maxLength={ctrl.maxLength ? ctrl.maxLength : null}
                    placeholder={ctrl.placeholder}
                    type="text"
                    value={value[ctrl.field]}
                    defaultValue={value[ctrl.field]}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      if (ctrl.dataType === SchemaDataType.Number) {
                        handleChange(ctrl.field, Number(evt.target.value))
                      } else {
                        handleChange(ctrl.field, evt.target.value);
                      }
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Number:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <p className="text-gray-400 text-sm m-0 font-light">
                    {t(ctrl.description)}
                  </p>
                  <Input
                    fluid
                    placeholder={ctrl.placeholder}
                    type="number"
                    min={value[ctrl.min]}
                    max={value[ctrl.max]}
                    value={value[ctrl.field]}
                    defaultValue={value[ctrl.field]}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      if (ctrl.dataType === SchemaDataType.Number) {
                        handleChange(ctrl.field, Number(evt.target.value))
                      } else {
                        handleChange(ctrl.field, evt.target.value);
                      }
                    }}
                  />
                </Form.Field>
              );
            case SchemaControl.Password:
              return (
                <Form.Field required={ctrl.required}>
                  <label>{t(ctrl.label)}</label>
                  <Input
                    placeholder={ctrl.placeholder}
                    fluid
                    type="password"
                    value={value[ctrl.field]}
                    defaultValue={value[ctrl.field]}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(ctrl.field, evt.target.value);
                    }}
                  />
                </Form.Field>
              );
            default:
              return <p key={index}>Unknown</p>;
          }
        })}
      </Form>
    </div>
  );
}
const SchemaComponent = forwardRef(Schema);
export default SchemaComponent;
