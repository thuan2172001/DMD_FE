import { useDropzone } from "react-dropzone";
import React, { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "services/api";
import ui from "services/ui";
import { Button } from "semantic-ui-react";
interface Props {
  value: string;
  onChange: Function;
}
export default function Upload({ value, onChange }: Props): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [percent, setPercent] = useState<number>(0);
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    uploadFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  async function uploadFile(file: any) {
    setLoading(true);
    let rs = await api.postFormData(
      `/file/upload-file`,
      { file },
      (progress: any) => {
        setPercent(Math.round((progress.loaded / progress.total) * 100));
      }
    );
    setLoading(false);
    if (rs.code === "ok") {
      onChange(rs.url);
    } else {
      ui.alert(rs.message);
    }
  }
  function getFileName(file: string) {
    let arr = file.split("/");
    return arr[arr.length - 1];
  }
  return loading ? (
    <p className="relative cursor-pointer border p-2 h-11 w-full">
      {t("Uploaded")} : {percent}%
    </p>
  ) : (
    <div className="flex">
      <div
        style={{ borderRadius: ".28571429rem" }}
        className="relative cursor-pointer border p-2 h-11 w-full rounded-l-none"
        {...getRootProps()}
      >
        {value && (
          <p className="w-full overflow-ellipsis h-8  text-left whitespace-nowrap overflow-hidden">
            {getFileName(value)}
          </p>
        )}
        <input {...getInputProps()} />
      </div>
      {value !== null && (
        <Button
          as="a"
          href={value}
          target="_blank"
          icon="external alternate"
          labelPosition="left"
          content={t("View")}
        ></Button>
      )}
    </div>
  );
}
