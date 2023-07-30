import dayjs from "dayjs";
import { SearchItem } from "interfaces";
import { useTranslation } from "react-i18next";
import { Button, Form, Input } from "semantic-ui-react";
import { DatePicker, Entity, Enum } from "..";
export interface FilterFormProps {
  onClose: Function;
  filter: SearchItem[];
  values: any;
  onChange: (values: any) => void;
  setQuery: (query: any) => void;
}
export default function FilterForm({
  onClose,
  filter,
  onChange,
  values,
  setQuery,
}: FilterFormProps): React.ReactElement {
  const { t } = useTranslation();
  function handleChange(name: string, value: any) {
    let tmp = { ...(values || {}) };
    tmp[name] = value;
    onChange(tmp);
  }
  function onSubmit() {
    setQuery(values);
    onClose();
  }
  return (
    <Form
      onSubmit={() => {
        onSubmit();
      }}
    >
      {filter.map((item, index) => {
        switch (item.control) {
          case "entity":
            return (
              <Form.Field key={index}>
                <label>{t(item.label)} </label>
                <Entity
                  value={values[item.field]}
                  values={values[item.field]}
                  gridName={item.gridName}
                  multiple={false}
                  onChange={(val: any) => {
                    handleChange(item.field, val);
                  }}
                />
              </Form.Field>
            );
          case "date":
            return (
              <div className="flex w-full gap-2" key={index}>
                <Form.Field className="w-full">
                  <label>{t("From date")}</label>
                  <DatePicker
                    isClearable
                    selected={
                      values[item.field] && values[item.field][0]
                        ? values[item.field][0]
                        : null
                    }
                    filterDate={(date) => {
                      let toDate = null;
                      if (values[item.field] && values[item.field][1]) {
                        toDate = values[item.field][1];
                      }
                      if (!toDate) return true;
                      return date < toDate;
                    }}
                    onChange={(val: Date) => {
                      if (!val) {
                        return handleChange(item.field, null);
                      }
                      let tmp: any = [];
                      if (values[item.field]) {
                        tmp = [...values[item.field]];
                      }
                      tmp[0] = dayjs(val).startOf("day").toDate();
                      handleChange(item.field, tmp);
                    }}
                    dateFormat="dd/MM/yyyy"
                  />
                </Form.Field>
                <Form.Field className="w-full">
                  <label>{t("To date")}</label>
                  <DatePicker
                    isClearable
                    selected={
                      values[item.field] && values[item.field][1]
                        ? values[item.field][1]
                        : null
                    }
                    filterDate={(date) => {
                      let fromDate = null;
                      if (values[item.field] && values[item.field][0]) {
                        fromDate = values[item.field][0];
                      }
                      if (!fromDate) return true;
                      return date > fromDate;
                    }}
                    onChange={(val: Date) => {
                      if (!val) {
                        return handleChange(item.field, null);
                      }
                      let tmp: any = [];
                      if (values[item.field]) {
                        tmp = [...values[item.field]];
                      }
                      tmp[1] = dayjs(val).startOf("day").toDate();
                      handleChange(item.field, tmp);
                    }}
                    dateFormat="dd/MM/yyyy"
                  />
                </Form.Field>
              </div>
            );
          case "input":
            return (
              <Form.Field key={index}>
                <label>{t(item.label)} </label>
                <Input
                  key={index}
                  defaultValue={values[item.field]}
                  name={item.field}
                  type="text"
                  onChange={(evt, { value }) => {
                    if (item.type === "number") {
                      handleChange(item.field, Number(value));
                    } else {
                      handleChange(item.field, value);
                    }
                  }}
                />
              </Form.Field>
            );
          case "enum":
            return (
              <Form.Field key={index}>
                <label>{t(item.label)} </label>
                <Enum
                  key={index}
                  multiple={item.multiple}
                  enumName={item.enum}
                  value={values[item.field]}
                  onChange={(val: any) => {
                    handleChange(item.field, val);
                  }}
                />
              </Form.Field>
            );
        }
      })}
      <div className="flex">
        <Button
          icon="close"
          onClick={() => {
            setQuery({});
            onChange({});
            onClose();
          }}
          content={t("Reset")}
          color="red"
          fluid
        />{" "}
        <Button icon="check" content={t("Apply")} primary fluid />
      </div>
    </Form>
  );
}
