import {
  Button as IButton,
  GridColumn,
  CellDisplay,
  GridEntity,
} from "interfaces";
import { useState, useEffect, useMemo } from "react";
import Config from "config";
import dayjs from "dayjs";
import dataService from "../../services/data";
import { useTranslation } from "react-i18next";
import Lightbox from "react-image-lightbox";
import qs from "querystring";
import {
  Empty,
  Loading,
  MultiLanguage,
  ViewEnum,
} from "components";
import utils from "../../services/utils";
import ReactJson from "react-json-view";
import { api, ui } from "services";
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Image,
  Label,
  Modal,
  Pagination,
  Table,
} from "semantic-ui-react";
import FilterForm from "./filter-form";
import { Link } from "react-router-dom";
import Tree from "components/tree";

interface GridProps {
  gridName: string;
  canSelect?: boolean;
  selectedItems?: any[];
  onChangeSelectedItems?: Function;
  onItemSelected?: Function;
  disableButton?: boolean;
}
function getFieldData(obj: any, field: string) {
  let arr = field.split(".");
  if (arr.length) {
    let rs = obj;
    arr.forEach((f) => {
      if (rs === null || rs === undefined) {
        return rs;
      }
      rs = rs[f];
    });
    return rs;
  } else {
    return obj[field];
  }
}
function GridView({
  gridName,
  canSelect,
  selectedItems,
  onItemSelected,
  disableButton,
}: GridProps): React.ReactElement {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [viewImage, setViewImage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [gridInfo, setGridInfo] = useState<GridEntity>(null);
  const [total, setTotal] = useState<number>(0);
  const [json, setJson] = useState<any>(null);
  const [mail, setMail] = useState<any>(null);
  const [reward, setReward] = useState<any>(null);
  const [ticketId, setTicketId] = useState<number>(null);
  const [bidreward, setBidReward] = useState<any>(null);
  const [tree, setTree] = useState<any>(null);
  const [language, setLanguage] = useState<any>(null);
  const [order, setOrder] = useState<[field: string, order: "DESC" | "ASC"]>([
    "id",
    "DESC",
  ]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(Config.PageSize);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({});
  const [query, setQuery] = useState<any>({});
  const [timestamp, setTimestamp] = useState<number>(0);
  const [rewardRarity, setRewardRarity] = useState<any>(null);
  function getFileName(str: string) {
    if (!str) return str;
    return str.split("/").pop();
  }
  const columns = useMemo((): GridColumn[] => {
    if (!gridInfo) return [];
    const cols = [];

    gridInfo.columns.forEach((i: any) => {
      let tmp = {
        label: i.label,
        field: i.field,
        sorter: true,
        sortField: i.sortField,
        render: (val: any, row: any) => {
          switch (i.display) {
            case CellDisplay.TreeView:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setTree(val);
                  }}
                >
                  {val === null ? "..." : `${JSON.stringify(val || [])}`}
                </span>
              );
            case CellDisplay.RewardRarity:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setRewardRarity(val);
                  }}
                >
                  View
                </span>
              );
            case CellDisplay.Ticket:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setTicketId(row.id);
                  }}
                >
                  View
                </span>
              );
            case CellDisplay.MultiLanguage:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setLanguage(val);
                  }}
                >
                  {val[0].content}
                </span>
              );
            case CellDisplay.Mail:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setMail(val);
                  }}
                >
                  {val[0].content}
                </span>
              );
            case CellDisplay.Reward:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setReward(val);
                  }}
                >
                  {val?.length} items
                </span>
              );
            case CellDisplay.BidItem:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setBidReward(val);
                  }}
                >
                  {val?.length} items
                </span>
              );
            case CellDisplay.File:
              return (
                <a target="_blank" href={val}>
                  {getFileName(val)}
                </a>
              );
            case CellDisplay.Link:
              let url = i.url;
              for (var f in row) {
                url = url.replaceAll(`{{${f}}}`, row[f]);
              }

              return (
                <Link to={url}>
                  <span className="text-blue-600">{val}</span>
                </Link>
              );
            case CellDisplay.Image:
              if (val) {
                return (
                  <Image
                    alt="cell image"
                    src={val || "/default.jpg"}
                    size="tiny"
                    rounded
                    onClick={() => {
                      setViewImage(val);
                    }}
                  />
                );
              } else {
                return (
                  <Image
                    alt="cell image"
                    size="tiny"
                    src={val || "/default.jpg"}
                    rounded
                  />
                );
              }

            case CellDisplay.Enum:
              return <ViewEnum enumName={i.enumName} value={Number(val)} />;
            case CellDisplay.Text:
              return <span>{val}</span>;
            case CellDisplay.JSON:
              return (
                <span
                  className="cursor-pointer text-blue-800 hover:underline max-w-[150px] overflow-hidden text-ellipsis inline-block"
                  onClick={() => {
                    setJson(val);
                  }}
                >
                  {JSON.stringify(val)}
                </span>
              );
            case CellDisplay.Date:
              return <span>{dayjs(val).format("YYYY/MM/DD HH:mm:ss")}</span>;
            case CellDisplay.ArrayString:
              return (
                <>
                  {val?.map((i: any, iIndex: number) => (
                    <Label key={iIndex}>{i}</Label>
                  ))}
                </>
              );
            case CellDisplay.Chain:
              let chain = gridInfo.tokens?.find((el: any) => el?.chainId == val)
              return chain?.name
          }
        },
      };
      cols.push(tmp);
    });
    const rowButtons = gridInfo?.buttons
      ? gridInfo?.buttons?.filter((i) => i.position === "row")
      : [];

    if (rowButtons?.length > 0 && !disableButton) {
      cols.push({
        label: "Actions",
        field: "",
        display: CellDisplay.Text,
        fixed: "right",
        width: 80,
        //@ts-ignore
        render: (val, row) => {
          return rowButtons?.map((item, index) =>
            renderButton(item, index, row)
          );
        },
      });
    }
    return cols;
  }, [gridInfo]);
  useEffect(() => {
    let rs = dataService.getGrid(gridName);
    if (!rs) {
      return console.error("Grid not found: ", gridName);
    }
    setFilter({});
    setOrder(["id", "DESC"]);
    setCurrentPage(0);
    setPageSize(Config.PageSize);
    setTotal(0);
    setData([]);
    setGridInfo(rs);
    setGridInfo(rs);
  }, [gridName]);

  useEffect(() => {
    let isMount = true;
    async function fetch({ offset, limit, order, where }: any) {
      if (!gridInfo) {
        return;
      }
      setLoading(true);
      let queryOption: any = {
        where,
        offset,
        limit,
        order,
      };
      let postfn = api.post;
      let rs = await postfn(`${gridInfo.api}`, queryOption);
      if (!isMount) return;
      setTotal(gridInfo.host === "bridge" ? rs?.total : rs?.count);
      setData(rs.data);
      setLoading(false);
    }
    let where: any = {};
    if (gridInfo?.filter && gridInfo?.filter?.length > 0) {
      gridInfo.filter.forEach((item) => {
        if (!query[item.field]) return;
        if (item.multiple && !(query[item.field] && query[item.field].length))
          return;
        if (query[item.field]) {
          switch (item.type) {
            case "date":
              if (!where[item.field]) {
                where[item.field] = {};
              }
              if (query[item.field][0]) {
                where[item.field]["$gte"] = query[item.field][0];
              }
              if (query[item.field][1]) {
                where[item.field]["$lte"] = query[item.field][1];
              }
              break;
            case "text":
              where[item.field] = { $substring: query[item.field] };
              break;
            default:
              where[item.field] = query[item.field];
              break;
          }
        }
      });
    }
    fetch({
      offset: currentPage * pageSize,
      limit: pageSize,
      order: [order],
      where,
    });
    return () => {
      isMount = false;
    };
  }, [gridInfo, currentPage, pageSize, order, query, timestamp]);
  if (!gridInfo) {
    return <p>{t("Loading...")}</p>;
  }
  function renderButton(btn: IButton, index: number, item?: any) {
    if (disableButton) {
      return null;
    }
    if (btn.hideExpression) {
      if (utils.checkExpression(btn.hideExpression, item)) {
        return;
      }
    }
    switch (btn.action) {
      case "api":
        return (
          <Button
            //@ts-ignore
            color={btn.color || "blue"}
            className="mr-1"
            icon={btn.icon}
            content={t(btn.label)}
            size={btn.position === "top" ? "medium" : "mini"}
            key={index}
            primary
            onClick={async () => {
              if (btn.confirmText) {
                await ui.confirm(t(btn.confirmText));
              }
              try {
                let postfn = api.post;
                await postfn(btn.api, item);
                setTimestamp(new Date().getTime());
                ui.alert(t(btn.successMessage || "Success"));
              } catch (error: any) {
                ui.alert(t(btn.failMessage || t(error.message) || "Fail"));
              }
            }}
          />
        );
      case "redirect":
        let url = btn.redirectUrl;
        //check data item
        if (btn.redirectUrlEmbed && Object.keys(btn.redirectUrlEmbed).length) {
          let params: any = {};
          for (var i in btn.redirectUrlEmbed) {
            let val = btn.redirectUrlEmbed[i];
            if (typeof val === "string" && val[0] === "$") {
              let key = val.substr(1, val.length - 1);
              params[i] = item[key];
            } else {
              params[i] = val;
            }
          }
          let embed: any = {};
          if (btn.redirectUrlEmbed.embed) {
            for (var i in btn.redirectUrlEmbed.embed) {
              let val = btn.redirectUrlEmbed.embed[i];
              if (typeof val === "string" && val[0] === "$") {
                let key = val.substr(1, val.length - 1);
                embed[i] = item[key];
              } else {
                embed[i] = val;
              }
            }
            params.embed = JSON.stringify(embed);
          }
          url += `?${qs.stringify(params)}`;
        }
        if (item) {
          for (var i in item) {
            url = url.replace(new RegExp(`{${i}}`, "g"), item[i]);
          }
        }
        return (
          <Button
            //@ts-ignore
            color={btn.color || "blue"}
            as="a"
            size={btn.position === "top" ? "medium" : "mini"}
            icon={btn.icon}
            href={`#${url}`}
            key={index}
            content={t(btn.label)}
          />
        );
    }
  }
  function isSelect(item: any): boolean {
    for (var i = 0; i < selectedItems.length; i++) {
      if (selectedItems[i]?.id === item.id) {
        return true;
      }
    }
    return false;
  }
  function onItemSelect(item: any): void {
    onItemSelected(item);
  }

  async function exportData() {
    let labels = columns?.map((i: any) => i.label);
    let keys = columns?.map((i: any) => i.field);

    let csvContent = "data:text/csv;charset=utf-8," + labels.join(",") + "\n";
    data?.map((data: any) => {
      let t = keys.map((key: string) => data[key]).join(',') + '\n';
      csvContent += t;
    })

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file named "my_data.csv".
  }


  return (
    <div>
      <Modal
        size="large"
        open={tree !== null}
        onClose={() => {
          setTree(null);
        }}
        closeIcon
      >
        <Modal.Header>Tree view</Modal.Header>
        <Modal.Content>
          <Tree value={tree} onChange={() => { }} viewOnly />
        </Modal.Content>
      </Modal>
      <Modal
        open={language !== null}
        onClose={() => {
          setLanguage(null);
        }}
        closeIcon
      >
        <Modal.Header>Language detail</Modal.Header>
        <Modal.Content>
          <MultiLanguage value={language} onChange={() => { }} viewOnly />
        </Modal.Content>
      </Modal>
      <Modal
        open={json !== null}
        onClose={() => {
          setJson(null);
        }}
        closeIcon
      >
        <Modal.Content>
          <ReactJson
            src={json}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            name="input"
          />
        </Modal.Content>
      </Modal>
      {viewImage && (
        <Lightbox
          mainSrc={viewImage}
          onCloseRequest={() => {
            setViewImage("");
          }}
        />
      )}
      <Modal open={openFilter} onClose={() => setOpenFilter(false)} size="tiny">
        <Modal.Header>{t("Filter")}</Modal.Header>
        <Modal.Content>
          <FilterForm
            setQuery={(q: any) => {
              setQuery(q);
            }}
            onChange={setFilter}
            values={filter || {}}
            filter={gridInfo.filter}
            onClose={() => {
              setOpenFilter(false);
            }}
          />
        </Modal.Content>
      </Modal>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <div className="flex justify-between items-center">
              <p style={{ margin: 0 }}>
                <span>{t(gridInfo.label)}</span>{" "}
                <span className="text-sm text-gray-400">({total})</span>
              </p>
              <div>
                {gridInfo.buttons
                  ?.filter((i) => i.position === "top")
                  .map((button, index) => {
                    return renderButton(
                      button,
                      index,
                      button.embedData ?? null
                    );
                  })}
                {gridInfo.filter?.length > 0 && (
                  <Button
                    icon="search"
                    content={t("Filter")}
                    basic
                    primary
                    labelPosition="left"
                    className="ml-2 relative"
                    onClick={() => {
                      setOpenFilter(true);
                    }}
                  />
                )}
                <Button
                  color="green"
                  icon="download"
                  content="Export"
                  labelPosition="left"
                  onClick={() => exportData()}
                />
              </div>
            </div>
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <div
            className="block w-full overflow-x-auto relative"
            style={{ height: "calc(100vh - 250px)" }}
          >
            <Table celled sortable>
              <Table.Header>
                <Table.Row>
                  {canSelect && (
                    <Table.HeaderCell className="sticky top-0 px-3 text-white align-middle border border-solid border-blueGray-100 py-2 text-base border-l-0 border-r-0 border-t-0 whitespace-nowrap font-normal text-left cursor-pointer z-20 bg-gradient-to-t from-primary-400 to-primary-600">
                      {t("Select")}
                    </Table.HeaderCell>
                  )}
                  {columns.map((col, index) => {
                    let className =
                      "sticky top-0 px-3 text-white align-middle border border-solid border-blueGray-100 py-2 text-base border-l-0 border-r-0 border-t-0 whitespace-nowrap font-normal text-left cursor-pointer z-20 bg-gradient-to-t from-primary-400 to-primary-600";
                    if (col.fixed === "right") {
                      className += " right-0";
                    }
                    return (
                      <Table.HeaderCell
                        key={index}
                        sorted={
                          order[0] === (col.sortField || col.field) &&
                            col.sorter
                            ? order[1] === "DESC"
                              ? "descending"
                              : "ascending"
                            : null
                        }
                        onClick={() => {
                          if (!col.sorter) return;
                          let f = col.sortField || col.field;
                          let s: [field: string, order: "DESC" | "ASC"] = [
                            ...order,
                          ];
                          if (s[0] === f) {
                            s[1] = s[1] === "DESC" ? "ASC" : "DESC";
                          } else {
                            s[0] = f;
                            s[1] = "DESC";
                          }
                          setOrder(s);
                        }}
                        className={className}
                      >
                        {t(col.label)}
                      </Table.HeaderCell>
                    );
                  })}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((dt, dtIndex) => (
                  <Table.Row
                    key={dtIndex}
                    className={`hover:bg-primary-100 ${canSelect && "cursor-pointer"
                      }`}
                  >
                    {canSelect && (
                      <Table.Cell className="text-center">
                        <Checkbox
                          checked={isSelect(dt)}
                          toggle
                          onChange={(evt, { checked }) => {
                            if (!canSelect) return;
                            onItemSelect(dt);
                          }}
                        />
                      </Table.Cell>
                    )}
                    {columns.map((col, colIndex) => {
                      let className =
                        "border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-2 text-left";
                      if (col.fixed === "right") {
                        className += " sticky right-0 bg-white";
                      }
                      return (
                        <Table.Cell key={colIndex} className={className}>
                          {
                            //@ts-ignore
                            col.render
                              ? //@ts-ignore
                              col.render(getFieldData(dt, col.field), dt)
                              : getFieldData(dt, col.field)
                          }
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {!loading && data.length === 0 ? <Empty /> : null}
          </div>
        </Card.Content>
        <Card.Content extra>
          <div className="flex justify-between p-4 pb-0">
            <div className="flex gap-2 items-center">
              <div className="w-52 relative">
                <Dropdown
                  onChange={(evt: any, { value }) => {
                    setPageSize(Number(value));
                  }}
                  value={pageSize}
                  fluid
                  selection
                  options={[
                    { value: 10, text: `10 ${t("items per page")}` },
                    { value: 20, text: `20 ${t("items per page")}` },
                    { value: 50, text: `50 ${t("items per page")}` },
                  ]}
                />
              </div>

              {loading && (
                <>
                  <Loading /> <p>{t("Loading")}</p>
                </>
              )}
            </div>
            <Pagination
              activePage={currentPage + 1}
              onPageChange={(page: any, rs: any) => {
                setCurrentPage(rs.activePage - 1);
              }}
              size="mini"
              totalPages={Math.ceil(total / pageSize)}
            />
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
export default GridView;
