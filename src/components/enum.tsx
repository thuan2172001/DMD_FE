import { useMemo } from "react";
import dataService from "../services/data";
import { EnumItem, EnumEntity } from "interfaces";
import { Select } from "semantic-ui-react";
interface EnumProps {
  value: string | number | string[] | number[];
  enumName?: string;
  multiple?: boolean;
  dataType?: "string" | "number" | "boolean" | "array" | "object";
  onChange?: (val: string | number | string[] | number[], raw?: any) => void;
  placeholder?: string;
  disabledValue?: any[];
  optionList?: any[]
}
function Enum({
  value,
  enumName,
  multiple,
  onChange,
  placeholder,
  disabledValue = [],
  optionList
}: EnumProps): React.ReactElement {
  const enumInfo = useMemo((): EnumEntity => {
    let rs: EnumEntity = dataService.getEnum(enumName);
    return rs;
  }, [enumName]);
  if (!enumInfo && !optionList) {
    return <p>Enum not found</p>;
  }

  return (
    <div>
      <Select
        placeholder={placeholder}
        fluid
        multiple={multiple}
        value={value === undefined ? (multiple ? [] : null) : value}
        options={optionList ? optionList.map((i) => {
          return { text: i.label, value: i.value };
        }) : enumInfo.items
          .filter((i) => !disabledValue.includes(i.value))
          .map((i) => {
            return { text: i.label, value: i.value };
          })}
        onChange={(evt: any, val: any) => {
          let raw = optionList ? optionList.find(el => el.value == val.value) : enumInfo.items.find((e: EnumItem) => e.value == val.value);
          onChange(val.value, raw);
        }}
      />
    </div>
  );
}
export default Enum;
