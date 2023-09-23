import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image } from "semantic-ui-react";
import { api, ui } from "services";

export default function UploadImage({ value, onChange, className = "" }: { value: string; onChange: Function; className?: string }) {
  const [loading, setLoading] = useState(false);

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
        console.log({reader: reader.result})
        onChange(reader.result);
      };
    } catch (error) {
      setLoading(false);
    }
  }
  return (
    <div className={`${className} relative w-36 cursor-pointer`} {...getRootProps()}>
      <input {...getInputProps()} />
      <Image rounded alt="avatar" src={value || "/default-avatar.png"} size="small" />
      <i className="fas fa-edit text-primary-700 absolute bottom-0 right-0 text-xl" />
    </div>
  );
}
