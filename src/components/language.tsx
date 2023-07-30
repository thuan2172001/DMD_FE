import { useTranslation } from "react-i18next";
import { Dropdown, Flag } from "semantic-ui-react";
import i18n from "i18n";
import { useState } from "react";
export default function Language() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  function changeLanguage(lng: string) {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  }
  return (
    <Dropdown
      trigger={
        <span>
          Language &nbsp;
          {language === "vi" ? <Flag name="vn" /> : <Flag name="england" />}
        </span>
      }
      direction="left"
      pointing
    >
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            changeLanguage("vi");
          }}
          content={
            <p>
              <Flag name="vn" /> {t("Vietnamese")}
            </p>
          }
        />
        <Dropdown.Item
          onClick={() => {
            changeLanguage("en");
          }}
          content={
            <p>
              <Flag name="england" /> {t("English")}
            </p>
          }
        />
      </Dropdown.Menu>
    </Dropdown>
  );
}
