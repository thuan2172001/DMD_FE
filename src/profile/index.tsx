import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { Schema } from "components";
import dataServices from "../services/data";
import { UserRole } from "interfaces";
import { Loading } from "components";
import api from "services/api";
import ui from "services/ui";
import { Button, Card } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducer/store";
import { setUserInfo } from "reducer/user.slice";
function getFormInfo(userInfo: any) {
  switch (userInfo.role) {
    case UserRole.Teacher:
      return dataServices.getFormByName("profile-teacher");
    default:
      return dataServices.getFormByName("profile");
  }
}
export default function ProfilePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef();
  const { t } = useTranslation();
  const [submited, setSubmited] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.user);
  const [payload, setPayload] = useState<any>(null);
  const formInfo = getFormInfo(userInfo);
  const dispatch = useDispatch();
  useEffect(() => {
    async function loadProfile() {
      let rs = await api.post("/operation/api/get-profile", {});
      setPayload(rs.data[0]);
    }
    loadProfile();
  }, []);
  async function submit() {
    setSubmited(true);
    try {
      setLoading(true);
      let rs = await api.post(`/operation/api/update-profile`, payload);
      dispatch(setUserInfo(rs));
      setPayload(rs);
      ui.alert(t("Update user info successfully"));
    } catch (error) {
      ui.alert(t("Update user info fail"));
    } finally {
      setLoading(false);
    }
  }

  const onDrop = (acceptedFiles: any[]) => {
    if (!acceptedFiles.length) return;
    uploadAvatar(acceptedFiles[0]);
  };
  async function uploadAvatar(image: any) {
    setLoading(true);
    let rs = await api.postFormData(`/file/upload-image`, { image });
    setLoading(false);
    if (rs.code === "ok") {
      let tmp = { ...payload };
      tmp.avatar = rs.url;
      setPayload(tmp);
    } else {
      ui.alert(rs.message);
    }
  }
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return payload === null ? (
    <Loading />
  ) : (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <div className="flex justify-between">
            <p>{t("Profile")}</p>
            <Button
              content={t("Update")}
              primary
              labelPosition="left"
              icon="save"
              loading={loading}
              onClick={() => {
                submit();
              }}
            />
          </div>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <div>
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <span className="font-semibold text-xl text-blueGray-700"></span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-start">
            <div className="w-full lg:w-1/4 p-4 inline-block">
              <div className="flex justify-center">
                <div
                  className="relative w-36 cursor-pointer"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <img
                    alt="avatar"
                    src={payload?.avatar || "/default-avatar.png"}
                    className="rounded-full w-36 h-36 object-cover"
                  />
                  <i className="fas fa-edit text-primary-700 absolute bottom-0 right-0 text-xl" />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-3/4 p-4 inline-block">
              {payload !== null && (
                <Schema
                  controls={formInfo.controls}
                  ref={formRef}
                  showError={submited}
                  value={payload}
                  onChange={(val: any) => {
                    setPayload(val);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
