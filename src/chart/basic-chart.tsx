import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
//@ts-ignore
import faker from "faker";
import { api } from "services";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Select,
  Statistic,
} from "semantic-ui-react";
import { DatePicker } from "components";
import _ from "lodash";
const RESOURCES = ["MAG", "MSTR", "FOOD"];
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);
export default function BasicChart({
  url,
  showVersion,
  chartType,
  showResources,
  value,
  showItemType,
  showDetail,
  source = "analytic",
  showTimeSelect = false,
  showFusionResources,
}: {
  source?: "backend" | "analytic";
  showDetail?: boolean;
  showItemType?: boolean;
  value?: any;
  url: string;
  showVersion?: boolean;
  chartType: "bar" | "line" | "pie";
  showResources?: boolean;
  showTimeSelect?: boolean;
  showFusionResources?: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [earn, setEarn] = useState<{ options: any; data: any }>(null);
  const [dateFrom, setDateFrom] = useState(
    value?.dateFrom || dayjs().add(-1, "week").startOf("day").toDate()
  );
  const [dateTo, setDateTo] = useState(
    value?.dateTo || dayjs().add(1, "day").toDate()
  );
  const [versions, setVersions] = useState<string>("");
  const [resource, setResource] = useState<string>(value?.resource || "mstr");
  const [group, setGroup] = useState<string>(value?.group || "date");
  const [type, setType] = useState<string>(value?.type);
  const [totalOnly, setTotalOnly] = useState<boolean>(
    value?.totalOnly || false
  );
  async function loadData() {
    setLoading(true);
    try {
      if (source === "backend") {
        let rs = await api.post(url, {
          dateFrom: dateFrom,
          dateTo: dateTo,
          versions,
          resource,
          type,
          groupBy: group,
          totalOnly,
        });
        setEarn(rs);
      } else {
        let rs = await api.post(url, {
          dateFrom: dateFrom,
          dateTo: dateTo,
          versions,
          resource,
          type,
          groupBy: group,
          totalOnly,
        });
        setEarn(rs);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, []);
  function download() {
    api.downloadReport(earn.data);
  }
  return (
    <div>
      <Card fluid>
        {earn !== null && (
          <Card.Content>
            {chartType === "bar" && (
              <Bar options={earn.options} data={earn.data} />
            )}
            {chartType === "line" && (
              <Line options={earn.options} data={earn.data} />
            )}
            {chartType === "pie" && (
              <Pie options={earn.options} data={earn.data} />
            )}
          </Card.Content>
        )}
        <Card.Content>
          <Form className="flex gap-2 w-full">
            <Form.Field className="w-full">
              <label>View by</label>
              <Select
                placeholder={"Select view time"}
                fluid
                value={group}
                options={["minute", "hour", "date", "week", "month"].map(
                  (i) => {
                    return { text: i, value: i };
                  }
                )}
                onChange={(evt: any, val: any) => {
                  setGroup(val.value);
                }}
              />
            </Form.Field>
            <Form.Field className="w-full">
              <label>From</label>
              <DatePicker
                todayButton="Today"
                selected={dateFrom}
                showTimeSelect
                onChange={(val: Date) => {
                  if (!val) {
                    setDateFrom(null);
                  } else {
                    showTimeSelect
                      ? setDateFrom(dayjs(val).toDate())
                      : setDateFrom(dayjs(val).startOf("day").toDate());
                  }
                }}
                dateFormat="yyyy/MM/dd HH:mm"
              />
            </Form.Field>
            <Form.Field className="w-full">
              <label>To</label>
              <DatePicker
                showTimeSelect
                todayButton="Today"
                selected={dateTo}
                onChange={(val: Date) => {
                  if (!val) {
                    setDateTo(null);
                  } else {
                    showTimeSelect
                      ? setDateTo(dayjs(val).toDate())
                      : setDateTo(dayjs(val).endOf("day").toDate());
                  }
                }}
                dateFormat="yyyy/MM/dd HH:mm"
              />
            </Form.Field>
            {showItemType && (
              <Form.Field className="w-full">
                <label>Type</label>
                <Select
                  placeholder={"Select type"}
                  fluid
                  value={type}
                  options={["mongen", "plot", "land"].map((i) => {
                    return { text: i, value: i };
                  })}
                  onChange={(evt: any, val: any) => {
                    setType(val.value);
                  }}
                />
              </Form.Field>
            )}
            {showResources && (
              <Form.Field className="w-full">
                <label>Type</label>
                <Select
                  placeholder={"Select type"}
                  fluid
                  value={resource}
                  options={[
                    { text: "mstr", value: "mstr" },
                    { text: "s-mag", value: "mag" },
                    { text: "food", value: "food" },
                    { text: "pigment", value: "pigment" },
                    { text: "stake_mag", value: "stake_mag" },
                    { text: "dailyquest_points", value: "dailyquest_points" },
                  ].map((i) => {
                    return i;
                  })}
                  onChange={(evt: any, val: any) => {
                    setResource(val.value);
                  }}
                />
              </Form.Field>
            )}
            {showFusionResources && (
              <Form.Field className="w-full">
                <label>Type</label>
                <Select
                  placeholder={"Select type"}
                  fluid
                  value={resource}
                  options={[
                    { text: "elixir", value: "elixir" },
                    { text: "mutated gen", value: "mutated_gen" },
                  ].map((i) => {
                    return i;
                  })}
                  onChange={(evt: any, val: any) => {
                    setResource(val.value);
                  }}
                />
              </Form.Field>
            )}
            {showDetail && (
              <Form.Field className="w-full">
                <label>Show Detail</label>
                <Checkbox
                  checked={!totalOnly}
                  toggle
                  onChange={(evt: any, { checked }) => {
                    setTotalOnly(!checked);
                  }}
                />
              </Form.Field>
            )}
            <div>
              <Form.Field>
                <label>Action</label>
                <Button
                  loading={loading}
                  color="blue"
                  icon="search"
                  content="Search"
                  labelPosition="left"
                  onClick={loadData}
                />
              </Form.Field>
              <Form.Field>
                <Button
                  loading={loading}
                  color="teal"
                  icon="download"
                  content="Download CSV"
                  labelPosition="left"
                  onClick={download}
                />
              </Form.Field>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
