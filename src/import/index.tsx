import { Empty } from "components";
import ImagePopup from "components/image";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Form, Input, Message, Progress, Table } from "semantic-ui-react";
import { api, utils } from "services";
import ui from "services/ui";

export default function ImportData() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>({});
  const [tableHeaderData, setTableHeader] = useState([])
  const [tableCellData, setTableCell] = useState([])
  const [percentage, setPercentage] = useState(100);

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
        let pdfData = await utils.cropPdfCenterToImages(setPercentage, selectedFilePdf);
        console.log({ excelData, pdfData })

        console.log(pdfData[0])

        let pdfFormat: any = {};

        pdfData.map((pdfDataText) => {
          let arr = pdfDataText.text.split('\n');
          let key = (pdfDataText.pageKey ?? arr[arr.length - 3]).replaceAll(' ', '');
          let metadata = pdfDataText;
          pdfFormat[key] = metadata;
        })

        let tableHeader = Object.keys(excelData[0]);
        tableHeader.push(...["Page", "PDF", "Status"]);

        let tableCell = excelData.map((rowData) => {
          let tracking = rowData['Tracking'];
          let name = rowData['Tên*'] ?? rowData["Name"];
          let address = rowData['Địa chỉ*'] ?? rowData["Address"];
          let city = rowData['Thành phố*'] ?? rowData["City"];
          let state = rowData['Bang*'] ?? rowData["State"];

          console.log({ name, address, city, state })

          let pdfData: {
            page: number;
            src: string;
            text: string;
          } = pdfFormat[tracking]

          let checkExist = !!pdfData?.src;

          let textLower = pdfData?.text?.toLowerCase() ?? ""
          let textLowerStrim = textLower.replaceAll(' ', '')

          let checkName = textLower.includes(name?.toLowerCase()) || textLower.includes(name?.replaceAll(' ', '')?.toLowerCase())
          let checkAddress = textLower.includes(address?.toLowerCase()) ||
            textLower.includes(address?.replaceAll(' ', '')?.toLowerCase()) ||
            textLowerStrim.includes(address?.replaceAll(' ', '')?.toLowerCase())

          let checkCity = textLower.includes(city?.toLowerCase()) || textLower.includes(city?.replaceAll(' ', '')?.toLowerCase())
          let checkState = textLower.includes(state?.toLowerCase()) || textLower.includes(state?.replaceAll(' ', '')?.toLowerCase())

          let errorValue = [];

          !checkExist && errorValue.push('PDF');
          !checkName && errorValue.push(...['Tên*', 'Name']);
          !checkAddress && errorValue.push(...['Địa chỉ*', 'Address'])
          !checkCity && errorValue.push(...['Thành phố*', 'City'])
          !checkState && errorValue.push(...['Bang*', 'State'])

          return {
            ...rowData,
            PDF: pdfData?.src,
            Page: pdfData?.page,
            Status: checkExist && checkName && checkAddress && checkCity && checkState,
            text: pdfData?.text,
            errorValue
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
      "title",
    ];
    for (var i = 0; i < requiredFields.length; i++) {
      let f = requiredFields[i];
      if (!data[f]) {
        setError(t("Please fill all the field data"));
        return;
      }
    }
    try {
      let payload: any = {
        title: data['title'],
        data: tableCellData.map(dt => {
          return {
            tracking_id: dt['Tracking'],
            customer_name: dt['Tên*'],
            address: dt['Địa chỉ*'],
            state: dt['Bang*'],
            zip: dt['ZIP*'],
            country: dt['Nước*'],
            pdf: dt['PDF'],
            page: dt['Page'],
            status: dt['Status'],
            text_note: dt['text'],
          }
        })
      }
      await api.insertOrder(payload);
      ui.alert(t("Insert Success"));
      // TODO: HANDLE API
      console.log("API SENT WITH PAYLOAD", payload)
    } catch (error: any) {
      ui.alert(t(error.message));
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full justify-center mx-auto self-center">
        <Card fluid>
          <div className="text-2xl text-center font-bold py-4">
            {t("Import data")}
          </div>

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
                <div className="flex gap-8">
                  <div className="mt-2">
                    <div>
                      Title
                    </div>
                    <Input
                      className="mt-2 w-80"
                      fluid
                      placeholder={t("Title")}
                      onChange={(evt, { value }) => {
                        handleChange("title", value);
                      }}
                    />
                  </div>

                  <div className="mt-2">
                    <div>
                      Select metadata file (xlsx, csv)
                    </div>
                    <Input
                      className="mt-2"
                      type="file"
                      ref={excel}
                    />
                  </div>

                  <div className="mt-2">
                    <div>
                      Select barcode file (pdf only)
                    </div>
                    <Input
                      className="mt-2"
                      type="file"
                      ref={pdf}
                    />
                  </div>
                </div>


                <div className="mt-2 w-80">
                  {loading && percentage != 100 ? <div>
                    <Progress value={percentage.toFixed(1)} total={100} progress='percent' color='teal' />
                  </div> : <div className="flex gap-4">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setTableCell([])
                        check();
                      }}
                      fluid
                      color="blue"
                      loading={loading}
                    >
                      Get data
                    </Button>
                    {tableCellData?.length ?
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          onSubmit();
                        }}
                        fluid
                        color="green"
                        loading={loading}
                      >
                        Save data
                      </Button> : <></>
                    }
                  </div>
                  }
                </div>
              </Form>
            }
          />
        </Card>

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
                {tableCellData.map((col) => {
                  let errorValue = col.errorValue;
                  errorValue.length && console.log({errorValue})

                  return (
                    <Table.Row>
                      {tableHeaderData.map((header, idx) => {
                        if (header === "PDF") {
                          return (
                            <Table.Cell key={header + idx}>
                              {col[header] ?
                                <ImagePopup imageUrl={col[header]} /> : <></>}
                            </Table.Cell>
                          )
                        }
                        if (header === 'Status') {
                          return (
                            <Table.Cell key={header + idx}>
                              {col[header] ?
                                <div className="font-bold text-[#21BA45]">Valid data</div>
                                : <div className="font-bold text-[#FF0000] cursor-pointer" onClick={() => {
                                  console.log(col.text)
                                }}>Invalid data</div>
                              }
                            </Table.Cell>
                          )
                        }
                        return (
                          <Table.Cell key={header + idx} className={`${errorValue?.includes(header) && "alert-field"}`}>
                            {col[header]}
                          </Table.Cell>
                        )
                      })}
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
            <div>
              {!loading && tableCellData.length === 0 ? <Empty /> : null}
            </div>
          </div>
        </Card.Content>
      </div>
    </div>
  );
}
