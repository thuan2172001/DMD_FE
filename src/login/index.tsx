import { Button, Form, Header, Input } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import api from "services/api";
import { setUserInfo } from "reducer/user.slice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ui from "services/ui";
import { Language } from "components";
export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  function handleChange(name: string, value: string) {
    let tmp: any = { ...data };
    tmp[name] = value;
    setData(tmp);
  }
  async function onSubmit() {
    try {
      setLoading(true);
      let rs = await api.post(`/user/login`, data);
      localStorage.setItem("token", rs.token);
      dispatch(setUserInfo(rs.userInfo));
      nav("/");
    } catch (error) {
      ui.alert("Invalid account");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-screen h-screen bg-slate-800 flex items-center justify-center">
      <div className="max-w-[350px] w-full">
        <div className=" w-full rounded-md">
          <Header className="pb-4 text-2xl text-center" color="blue">
            {t("Login to your account")}
          </Header>

          <Form onSubmit={onSubmit}>
            <Form.Field>
              <Input
                icon="user"
                iconPosition="left"
                placeholder={t("User name")}
                onChange={(evt, { value }) => {
                  handleChange("user_name", value);
                }}
              />
            </Form.Field>
            <Form.Field>
              <Input
                placeholder={t("Password")}
                type="password"
                icon="lock"
                iconPosition="left"
                onChange={(evt, { value }) => {
                  handleChange("password", value);
                }}
              />
            </Form.Field>

            <div className="mt-2 flex gap-4">
              <Button
                fluid
                type="submit"
                icon="privacy"
                labelPosition="left"
                primary
                loading={loading}
                content={t("Login")}
              />
            </div>
            <div className="mt-4 flex justify-center text-white">
              <Language />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
