import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactJson from "react-json-view";
import { Button, Modal } from "semantic-ui-react";
import { api, ui } from "services";

export default function UploadIdentity({
  value,
  onChange,
}: {
  value: any;
  onChange: Function;
}) {
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState<boolean>(false);
  const onDrop = (acceptedFiles: any[]) => {
    if (!acceptedFiles.length) return;
    processFile(acceptedFiles[0]);
  };
  function processFile(file: any) {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = (e) => {
      // Do whatever you want with the file contents
      const binaryStr = e.target.result;
      // @ts-ignore
      var workbook = XLSX.read(binaryStr, {
        type: "binary",
      });
      var Sheet = workbook.SheetNames[0];

      //Read all rows from First Sheet into an JSON array.
      // @ts-ignore
      var excelRows = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[Sheet]
      );
      let newVal: number[][] = [[], [], [], [], [], []];
      excelRows.forEach((row: any) => {
        newVal[Number(row.type)].push(row.address);
      });
      onChange(newVal);
      ui.alert("Upload Ok!");
    };
    reader.readAsBinaryString(file);
  }
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  async function uploadAvatar(image: any) {
    setLoading(true);
    let rs = await api.postFormData(`/file/upload-image`, { image });
    setLoading(false);
    if (rs.code === "ok") {
      onChange(rs.url);
    } else {
      ui.alert(rs.message);
    }
  }
  return (
    <div className="w-full flex gap-2">
      <Modal
        open={showData}
        closeIcon
        onClose={() => {
          setShowData(false);
        }}
      >
        <Modal.Content>
          <ReactJson
            src={value || []}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            name="input"
          />
        </Modal.Content>
      </Modal>
      <div className="relative cursor-pointer" {...getRootProps()}>
        <input {...getInputProps()} />
        <Button icon="upload" content="Upload" color="olive" />
      </div>
      <Button
        icon="download"
        content="Download Template"
        as="a"
        href="/template/identity.xlsx"
        target="_blank"
      />
      <Button
        icon="eye"
        content="View Data"
        color="teal"
        onClick={() => {
          setShowData(true);
        }}
      />
    </div>
  );
}
