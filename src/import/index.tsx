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
  let status = errorValue?.includes(header) || (errorValue?.includes("PDF") && header !== '');
  return status;
}

export function getErrorValue(rowData: any, text: string) {
  let tracking = rowData["Tracking"] ?? rowData["tracking_id"];
  let name = rowData["Tên*"] ?? rowData["customer_name"];
  let address = rowData["Địa chỉ*"] ?? rowData["address"];
  let city = rowData["Thành phố*"] ?? rowData["city"];
  // let country = rowData["Nước*"] ?? rowData["country"];
  let state = rowData["Bang*"] ?? rowData["state"];
  let zip = rowData["ZIP*"] ?? rowData["zip"];
  let pdf = rowData["PDF"] ?? rowData["pdf"];
  let textLower = text?.toString()?.toLowerCase() ?? "";
  let textLowerStrim = textLower.replaceAll(" ", "");

  let checkName =
    textLower.includes(name?.toString()?.toLowerCase()) ||
    textLower.includes(name?.toString()?.replaceAll(" ", "")?.toLowerCase());
  let checkAddress =
    textLower.includes(address?.toString()?.toLowerCase()) ||
    textLower.includes(address?.toString()?.replaceAll(" ", "")?.toLowerCase()) ||
    textLowerStrim.includes(
      address?.toString()?.replaceAll(" ", "")?.toLowerCase()
    );

  let errorValue = [];
  let checkExist = !!pdf

  let checkCity =
    textLower.includes(city?.toString()?.toLowerCase()) ||
    textLower.includes(city?.toString()?.replaceAll(" ", "")?.toLowerCase());
  // let checkCountry =
  //   textLower.includes(country?.toString()?.toLowerCase()) ||
  //   textLower.includes(country?.toString()?.replaceAll(" ", "")?.toLowerCase());
  let checkState =
    textLower.includes(state?.toString()?.toLowerCase()) ||
    textLower.includes(state?.toString()?.replaceAll(" ", "")?.toLowerCase());
  let checkZip =
    textLower.includes(zip?.toString()?.toLowerCase()) ||
    textLower.includes(zip?.toString()?.replaceAll(" ", "")?.toLowerCase());

  !checkExist && errorValue.push(...["PDF", "pdf"]);
  !checkName && errorValue.push(...["Tên*", "customer_name"]);
  !checkAddress && errorValue.push(...["Địa chỉ*", "address"]);
  !checkCity && errorValue.push(...["Thành phố*", "city"]);
  // !checkCountry && errorValue.push(...["Nước*", "country"]);
  !checkState && errorValue.push(...["Bang*", "state"]);
  !checkZip && errorValue.push(...["ZIP*", "zip"]);

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

  const [excelName, setExcelName] = useState('');
  const [pdfName, setPdfName] = useState('')

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
      let excelFileInput = excel.current;
      let pdfFileInput = pdf.current;
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
          console.log({ errorValue, length: errorValue.length, status: errorValue.length === 0 })

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

                <div className="mt-2">
                  <div>Title</div>
                  <Input
                    className="mt-2 w-[474px]"
                    fluid
                    placeholder={t("Title")}
                    onChange={(evt, { value }) => {
                      handleChange("title", value);
                    }}
                  />
                </div>
                <div className="flex gap-8">
                  <div className="mt-2">
                    <div>Metadata file *</div>
                    <div className="flex items-center justify-center w-full mt-2">
                      <label htmlFor="dropzone-file-excel" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        {!excelName ? <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 px-4">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">XLSX or CSV</p>
                        </div> :
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 min-w-[217px]">
                            <img className="w-14" src='/assets/images/excel.svg' />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 px-4">
                              <span className="font-semibold">{excelName}</span>
                            </p>
                          </div>}
                        <input id="dropzone-file-excel" type="file" className="hidden" ref={excel} onChange={(e) => {
                          let fileName = e?.target?.files?.[0]?.name;
                          if (fileName) {
                            setExcelName(fileName)
                          }
                        }} />
                      </label>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div>Barcode File *</div>
                    <div className="flex items-center justify-center w-full mt-2">
                      <label htmlFor="dropzone-file-pdf" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        {!pdfName ? <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 px-4">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PDF Only</p>
                        </div> :
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 min-w-[217px]">
                            <img className="w-14" src='/assets/images/pdf.png' />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 px-4">
                              <span className="font-semibold">{pdfName}</span>
                            </p>
                          </div>}
                        <input id="dropzone-file-pdf" type="file" className="hidden" ref={pdf} onChange={(e) => {
                          let fileName = e?.target?.files?.[0]?.name;
                          if (fileName) {
                            setPdfName(fileName)
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 w-[474px]">
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
                        <Icon name='sync'></Icon>
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
                          <Icon name='save'></Icon>
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
            style={{ height: "calc(100vh - 320px)" }}
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
                              className={`${isInvalid(errorValue, header) && "fa alert-field"}`}
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
      className={``}
    >
      {!isEdit ? (
        <div className="flex gap-2 justify-between text-sm">
          <span className={`${isInvalid(col.errorValue, header) && "fa alert-field"}`}>{value}</span>
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
        <div className="flex gap-2 justify-between text-sm">
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
