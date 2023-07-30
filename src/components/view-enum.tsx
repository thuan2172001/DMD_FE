import { EnumItem } from "interfaces";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "semantic-ui-react";
import { data } from "services";

export default function ViewEnum({
  enumName,
  value,
}: {
  enumName: string;
  value: number;
}) {
  const { t } = useTranslation();
  const itemInfo = useMemo(() => {
    let enumInfo = data.getEnum(enumName);
    return enumInfo.items.find((i: EnumItem) => Number(i.value) === value);
  }, [enumName, value]);
  //@ts-ignore
  return <Label color={itemInfo?.color}>{t(itemInfo?.label)}</Label>;
}
