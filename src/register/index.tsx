import { Button, Card, Form, Header, Input, Message } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import api from "services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ui from "services/ui";
export default function Register() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>({});
  function handleChange(name: string, value: string) {
    let tmp: any = { ...data };
    tmp[name] = value;
    setData(tmp);
  }
  async function onSubmit() {
    let requiredFields = [
      "user_name",
      "password",
      "confirm_password",
      "phone",
      "email",
      "skype",
      "name",
    ];
    for (var i = 0; i < requiredFields.length; i++) {
      let f = requiredFields[i];
      if (!data[f]) {
        setError(t("Please fill all the field data"));
        return;
      }
    }
    try {
      let rs = await api.post(`/user/register-user`, { ...data, role: 2 });
      setLoading(true);
      ui.alert(t("Register success"));
      localStorage.setItem("token", rs.token);
      nav("/");
    } catch (error: any) {
      ui.alert(t(error.message));
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-screen h-screen bg-slate-800 flex items-center justify-center">
      <div className="max-w-[400px] w-full">
        <div className=" w-full rounded-md">
          <Card fluid>
            <Card.Content
              header={
                <Header className="pb-4 text-2xl text-center" color="blue">
                  {t("Register account")}
                </Header>
              }
            />
            <Card.Content
              description={
                <Form onSubmit={onSubmit}>
                  {error !== "" && (
                    <Message
                      header={t("Error")}
                      color="red"
                      content={error}
                      icon="compose"
                    />
                  )}
                  <Input
                    fluid
                    icon="user"
                    placeholder={t("User name")}
                    onChange={(evt, { value }) => {
                      handleChange("user_name", value);
                    }}
                  />
                  <Input
                    className="mt-2"
                    fluid
                    icon="lock"
                    type="password"
                    placeholder={t("Password")}
                    onChange={(evt, { value }) => {
                      handleChange("password", value);
                    }}
                  />
                  <Input
                    className="mt-2"
                    fluid
                    icon="lock"
                    type="password"
                    placeholder={t("Confirm password")}
                    onChange={(evt, { value }) => {
                      handleChange("confirm_password", value);
                    }}
                  />
                  <Input
                    className="mt-2"
                    fluid
                    icon="address card"
                    placeholder={t("Full name")}
                    onChange={(evt, { value }) => {
                      handleChange("name", value);
                    }}
                  />
                  <Input
                    className="mt-2"
                    fluid
                    type="tel"
                    icon="phone"
                    placeholder={t("Phone")}
                    onChange={(evt, { value }) => {
                      handleChange("phone", value);
                    }}
                  />
                  <Input
                    className="mt-2"
                    fluid
                    type="email"
                    icon="mail"
                    placeholder={t("Email")}
                    onChange={(evt, { value }) => {
                      handleChange("email", value);
                    }}
                  />
                  <Input
                    className="mt-2"
                    fluid
                    icon="skype"
                    placeholder={t("Skype")}
                    onChange={(evt, { value }) => {
                      handleChange("skype", value);
                    }}
                  />
                  <div className="mt-2">
                    <Button
                      fluid
                      type="submit"
                      icon="check circle"
                      labelPosition="left"
                      content={t("Register")}
                      color="green"
                      loading={loading}
                    />
                  </div>
                </Form>
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
