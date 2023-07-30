import { useTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";

export default function Empty({ text }: { text?: string }) {
  const { t } = useTranslation();
  return (
    <Message
      icon="search"
      header={t("No document here")}
      content={t("Please check your filter again")}
    />
  );
}
