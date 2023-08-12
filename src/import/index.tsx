import { Empty } from "components";
import ImagePopup from "components/image";
import _ from "lodash";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Form,
  Icon,
  Input,
  Message,
  Progress,
  Table,
} from "semantic-ui-react";
import { api, utils } from "services";
import ui from "services/ui";

export function isInvalid(errorValue: string[], header: string) {
  let status = errorValue?.includes(header) || errorValue?.includes("PDF");
  return status;
}

export function getErrorValue(rowData: any, text: string) {
  let tracking = rowData["Tracking"] ?? rowData["tracking_id"];
  let name = rowData["Tên*"] ?? rowData["customer_name"];
  let address = rowData["Địa chỉ*"] ?? rowData["address"];
  let city = rowData["Thành phố*"] ?? rowData["city"];
  // let country = rowData["Nước*"] ?? rowData["country"];
  let state = rowData["Bang*"] ?? rowData["state"];
  let pdf = rowData["PDF"] ?? rowData["pdf"];
  let textLower = text?.toLowerCase() ?? "";
  let textLowerStrim = textLower.replaceAll(" ", "");

  let checkName =
    textLower.includes(name?.toLowerCase()) ||
    textLower.includes(name?.replaceAll(" ", "")?.toLowerCase());
  let checkAddress =
    textLower.includes(address?.toLowerCase()) ||
    textLower.includes(address?.replaceAll(" ", "")?.toLowerCase()) ||
    textLowerStrim.includes(
      address?.replaceAll(" ", "")?.toLowerCase()
    );

  let errorValue = [];
  let checkExist = !!pdf

  let checkCity =
    textLower.includes(city?.toLowerCase()) ||
    textLower.includes(city?.replaceAll(" ", "")?.toLowerCase());
  // let checkCountry =
  //   textLower.includes(country?.toLowerCase()) ||
  //   textLower.includes(country?.replaceAll(" ", "")?.toLowerCase());
  let checkState =
    textLower.includes(state?.toLowerCase()) ||
    textLower.includes(state?.replaceAll(" ", "")?.toLowerCase());

  !checkExist && errorValue.push(...["PDF", "pdf"]);
  !checkName && errorValue.push(...["Tên*", "customer_name"]);
  !checkAddress && errorValue.push(...["Địa chỉ*", "address"]);
  !checkCity && errorValue.push(...["Thành phố*", "city"]);
  // !checkCountry && errorValue.push(...["Nước*", "country"]);
  !checkState && errorValue.push(...["Bang*", "state"]);

  if (errorValue.length && !requireCf.includes(tracking)) {
    requireCf.push(tracking);
  } else if (!errorValue.length && requireCf.includes(tracking)) {
    requireCf = requireCf.filter((i) => i !== tracking);
  }

  return errorValue;
}

let requireCf: string[] = [];

export default function ImportData() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>({});
  const [tableHeaderData, setTableHeader] = useState([]);
  const [tableCellData, setTableCell] = useState([]);
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
      setLoading(true);
      let excelFileInput = excel.current.inputRef.current;
      let pdfFileInput = pdf.current.inputRef.current;
      if (
        excelFileInput &&
        pdfFileInput &&
        excelFileInput.files.length &&
        pdfFileInput.files.length
      ) {
        const selectedFileExcel = excelFileInput.files[0];
        const selectedFilePdf = pdfFileInput.files[0];

        let excelData = await utils.handleFileExcel(selectedFileExcel);
        let pdfData = await utils.cropPdfCenterToImages(
          setPercentage,
          selectedFilePdf
        );

        let pdfFormat: any = {};

        pdfData.map((pdfDataText) => {
          let arr = pdfDataText.text.split("\n");
          let key = (pdfDataText.pageKey ?? arr[arr.length - 3]).replaceAll(
            " ",
            ""
          );
          let metadata = pdfDataText;
          pdfFormat[key] = metadata;
        });

        let tableHeader = Object.keys(excelData[0]);
        tableHeader.push(...["Page", "PDF", "Status"]);

        let tableCell = excelData.map((rowData) => {
          let tracking = rowData["Tracking"];
          let pdfData: {
            page: number;
            src: string;
            text: string;
          } = _.cloneDeep(pdfFormat[tracking]);

          delete pdfFormat[tracking]

          let formatData: any = {
            ...rowData,
            PDF: pdfData?.src,
            Page: pdfData?.page,
            text: pdfData?.text,
          };

          let errorValue = getErrorValue(formatData, pdfData?.text);
          console.log({errorValue, length: errorValue.length , status: errorValue.length  === 0})

          formatData = {
            ...formatData,
            errorValue,
            Status: errorValue.length === 0
          }

          return formatData
        });

        let missingTableCell = Object.keys(pdfFormat).map((tracking) => {
          let pdfData: {
            page: number;
            src: string;
            text: string;
          } = _.cloneDeep(pdfFormat[tracking]);
          delete pdfFormat[tracking]

          let formatData: any = {
            PDF: pdfData?.src,
            Page: pdfData?.page,
            text: pdfData?.text,
          };

          formatData = {
            ...formatData,
            Tracking: 'Tracking ID Not found',
            errorValue: ["Tracking"],
            Status: false
          }

          return formatData;
        })

        setTableHeader(tableHeader);
        setTableCell([...tableCell, ...missingTableCell]);
      }
    } catch (err) {
      console.log({ err });
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    let requiredFields = ["title"];
    for (var i = 0; i < requiredFields.length; i++) {
      let f = requiredFields[i];
      if (!data[f]) {
        setError(t("Please fill all the field data"));
        return;
      }
    }
    try {
      if (requireCf.length) {
        await ui.confirm(
          "There are some unmatch data. Are you sure want to save it ?"
        );
      }
      let payload: any = {
        title: data["title"],
        data: tableCellData.map((dt) => {
          return {
            tracking_id: dt["Tracking"],
            customer_name: dt["Tên*"],
            address: dt["Địa chỉ*"],
            state: dt["Bang*"],
            zip: dt["ZIP*"],
            country: dt["Nước*"],
            city: dt["Thành phố*"],
            pdf: dt["PDF"],
            page: dt["Page"],
            status: dt["Status"],
            text_note: dt["text"],
          };
        }),
      };
      await api.insertOrder(payload);
      ui.alert(t("Insert Success"));
      setTableCell([])
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
                    <div>Title</div>
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
                    <div>Select metadata file (xlsx, csv)</div>
                    <Input className="mt-2" type="file" ref={excel} />
                  </div>

                  <div className="mt-2">
                    <div>Select barcode file (pdf only)</div>
                    <Input className="mt-2" type="file" ref={pdf} />
                  </div>
                </div>

                <div className="mt-2 w-80">
                  {loading && percentage != 100 ? (
                    <div>
                      <Progress
                        value={percentage.toFixed(1)}
                        total={100}
                        progress="percent"
                        color="teal"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setTableCell([]);
                          check();
                        }}
                        fluid
                        color="blue"
                        loading={loading}
                      >
                        Get data
                      </Button>
                      {tableCellData?.length ? (
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
                        </Button>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
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
                        onClick={() => { }}
                        className={className}
                      >
                        {t(col)}
                      </Table.HeaderCell>
                    );
                  })}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableCellData.map((col, dataidx) => {
                  let errorValue = col.errorValue;

                  return (
                    <Table.Row>
                      {tableHeaderData.map((header, idx) => {
                        if (header === "PDF") {
                          return (
                            <Table.Cell
                              key={header + idx}
                              className={`${isInvalid(errorValue, header) && "alert-field"}`}
                            >
                              {col[header] ? (
                                <ImagePopup imageUrl={col[header]} />
                              ) : (
                                <></>
                              )}
                            </Table.Cell>
                          );
                        }
                        if (header === "Status") {
                          return (
                            <Table.Cell key={header + idx}>
                              {col[header] ? (
                                <div className="font-bold text-[#21BA45]">
                                  Valid data
                                </div>
                              ) : (
                                <div
                                  className="font-bold text-[#FF0000] cursor-pointer"
                                  onClick={() => {
                                    console.log(col.text);
                                  }}
                                >
                                  Invalid data
                                </div>
                              )}
                            </Table.Cell>
                          );
                        }
                        return (
                          <DataInput
                            idx={idx}
                            col={col}
                            header={header}
                            onChange={(value: string) => {
                              let deepClone = _.cloneDeep(tableCellData);
                              col[header] = value;

                              const errors = getErrorValue(col, col.text)
                              col.Status = errors.length === 0;
                              col.errorValue = errors;
                              deepClone[dataidx] = col;
                              setTableCell(deepClone);
                            }}
                          />
                        );
                      })}
                    </Table.Row>
                  );
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

export const DataInput = ({
  idx,
  col,
  header,
  onChange
}: {
  idx: number;
  col: any;
  header: string;
  onChange: any
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(col[header])

  return (
    <Table.Cell
      key={header + idx}
      className={`${isInvalid(col.errorValue, header) && "alert-field"}`}
    >
      {!isEdit ? (
        <div className="flex gap-2 justify-between">
          <div>{value}</div>
          <Icon
            name="edit"
            color='blue'
            className="cursor-pointer"
            onClick={() => {
              setIsEdit(true);
            }}
          />
        </div>
      ) : (
        <div className="flex gap-2 justify-between">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              if (e.target.value) {
                setValue(e.target.value)
              }
            }}
            className="unset-input"
          />
          <Icon
            name="save"
            color="green"
            className="cursor-pointer"
            onClick={() => {
              setIsEdit(false);
              onChange(value)
            }}
          />
        </div>
      )}
    </Table.Cell>
  );
};
