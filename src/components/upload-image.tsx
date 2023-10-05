import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image } from "semantic-ui-react";
import { api, ui, utils } from "services";

export default function UploadImage({ value, onChange, className = "" }: { value: string; onChange: Function; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("image");

  useEffect(() => {
    if (value.includes("data:application/pdf") || typeof value === 'object') {
      setType("pdf");
    } else {
      setType('image')
    }
  }, [value])

  const onDrop = (acceptedFiles: any[]) => {
    if (!acceptedFiles.length) return;
    uploadAvatar(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  async function uploadAvatar(image: any) {
    try {
      setLoading(true);
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function () {
        let result: any = reader.result.toString();
        if (result.includes("data:application/pdf")) {
          result = utils.base64ToUint8Array(result);
          setType("pdf");
        } else {
          setType('image')
        }
        onChange(result);
      };
    } catch (error) {
      console.log({error})
      setLoading(false);
    }
  }
  return (
    <div className={`${className} relative w-36 cursor-pointer`} {...getRootProps()}>
      <input {...getInputProps()} />
      {type === "pdf" ? (
        <img src='/assets/images/pdf.png' className="not-force"/>
      ) : (
        <Image rounded alt="avatar" src={value || "/default-avatar.png"} size="small" />
      )}
      <i className="fas fa-edit text-primary-700 absolute bottom-0 right-0 text-xl" />
    </div>
  );
}
