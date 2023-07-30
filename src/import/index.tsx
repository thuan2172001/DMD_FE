import { Button, Card, Form, Header, Input, Message, Table, TableHeaderCell } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import api from "services/api";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ui from "services/ui";
import { utils } from "services";
import { Empty } from "components";
export default function ImportData() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>({});
  const [tableHeaderData, setTableHeader] = useState([])
  const [tableCellData, setTableCell] = useState([])

  const excel = useRef<any>();
  const pdf = useRef<any>();

  function handleChange(name: string, value: string) {
    let tmp: any = { ...data };
    tmp[name] = value;
    setData(tmp);
  }

  async function check() {
    try {
      setLoading(true)
      let excelFileInput = excel.current.inputRef.current;;
      let pdfFileInput = pdf.current.inputRef.current;;
      if (excelFileInput && pdfFileInput && excelFileInput.files.length && pdfFileInput.files.length) {
        const selectedFileExcel = excelFileInput.files[0];
        const selectedFilePdf = pdfFileInput.files[0];

        let excelData = await utils.handleFileExcel(selectedFileExcel);
        let pdfData = await utils.cropPdfCenterToImages(selectedFilePdf);
        console.log({ excelData, pdfData })

        let pdfFormat: any = {};

        pdfData.map((pdfDataText) => {
          let arr = pdfDataText.text.split('\n');
          let key = arr[arr.length - 3].replaceAll(' ', '');
          let metadata = pdfDataText;
          pdfFormat[key] = metadata;
        })

        let tableHeader = Object.keys(excelData[0]);
        tableHeader.push(...["Page", "PDF"]);

        let tableCell = excelData.map((rowData) => {
          let tracking = rowData['Tracking'];
          let pdfData: {
            page: number;
            src: string;
            text: string;
          } = pdfFormat[tracking]

          return {
            ...rowData,
            PDF: pdfData.src,
            Page: pdfData.page
          }
        })

        setTableHeader(tableHeader);
        setTableCell(tableCell)
      }
    } catch (err) {
      console.log({ err })
    } finally {
      setLoading(false)
    }
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
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-full h-full">
        <div className="w-full rounded-md">
          <Card fluid>
            <Card.Content
              header={
                <Header className="pb-4 text-2xl text-center" color="blue">
                  {t("Import data")}
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
                    className="mt-2 w-80"
                    fluid
                    placeholder={t("Title")}
                    onChange={(evt, { value }) => {
                      handleChange("title", value);
                    }}
                  />
                  <Input
                    className="mt-2 w-80"
                    fluid
                    icon="lock"
                    type="text"
                    placeholder={t("Description")}
                    onChange={(evt, { value }) => {
                      handleChange("desc", value);
                    }}
                  />
                  <div>
                    <Input
                      className="mt-2"
                      type="file"
                      ref={excel}
                      label="Select your data file (xlsx, csv)"
                    />
                  </div>
                  <div>
                    <Input
                      className="mt-2"
                      type="file"
                      ref={pdf}
                      label="Select your data file (pdf)"
                    />
                  </div>
                  <div className="mt-2 w-80">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        check();
                      }}
                      fluid
                      color="green"
                      loading={loading}
                    >Check data</Button>
                  </div>
                </Form>
              }
            />
          </Card>
        </div>

        <Card.Content>
          <div
            className="block w-full overflow-x-auto relative"
            style={{ height: "calc(100vh - 250px)" }}
          >
            <Table celled sortable>
              <Table.Header>
                <Table.Row>
                  {tableHeaderData.map((col, index) => {
                    let className =
                      "sticky top-0 px-3 text-white align-middle border border-solid border-blueGray-100 py-2 text-base border-l-0 border-r-0 border-t-0 whitespace-nowrap font-normal text-left cursor-pointer z-20 bg-gradient-to-t from-primary-400 to-primary-600";
                    if (col.fixed === "right") {
                      className += " right-0";
                    }
                    return (
                      <Table.HeaderCell
                        key={index}
                        onClick={() => {
                        }}
                        className={className}
                      >
                        {t(col)}
                      </Table.HeaderCell>
                    );
                  })}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableCellData.map((col, colIndex) => {
                  return (
                    <Table.Row>
                      {tableHeaderData.map((header) => {
                        return (
                          <Table.Cell key={header} >
                            {col[header]}
                          </Table.Cell>
                        )
                      })}
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
            {!loading && tableCellData.length === 0 ? <Empty /> : null}
          </div>
        </Card.Content>
      </div>
    </div>
  );
}
