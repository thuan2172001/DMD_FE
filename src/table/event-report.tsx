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
import { api } from "services";
import dayjs from "dayjs";
import { Button, Card, Form, Select, Table } from "semantic-ui-react";
import { DatePicker } from "components";
import _ from "lodash";
import saveAs from "file-saver";
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
export default function EventReportTable() {
  const [loading, setLoading] = useState<boolean>(true);
  const [earn, setEarn] = useState<{ options: any; data: any }>(null);
  const [eventGroup, setEventGroup] = useState(-1);
  const [eventGroups, setEventGroups] = useState([]);
  async function loadData() {
    setLoading(true);
    try {
      let rs = await api.post("/operation/get-event-report", {
        eventGroup,
      });
      setEarn(rs);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  async function getEventGroup() {
    try {
      let rs = await api.post("/operation/api/get-event-groups", {});
      setEventGroups(rs.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  function download() {
    let text = earn?.data?.downloadData?.map((s: string[]) => s.join(",")).join("\n");
    var blob = new Blob([text], {
      type: "text/plain;charset=utf-8;",
    });
    saveAs(blob, "report.csv");
  }
  useEffect(() => {
    getEventGroup();
  }, []);

  const renderTable = (data: any) => {
    return (
      <Table style={{ margin: "0px" }} celled striped>
        <Table.Header>
          {data?.labels?.map((label: string) => (
            <Table.HeaderCell style={{ textAlign: "center" }}>
              {label}
            </Table.HeaderCell>
          ))}
        </Table.Header>
        <Table.Body>
          {data?.datasets?.map((dataset: any) => {
            return (
              <Table.Row>
                {dataset?.map((data: any) => {
                  if (data.labels) {
                    return renderTable(data);
                  }
                  return (
                    <Table.Cell style={{ textAlign: "center" }}>
                      {data}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  };

  return (
    <div>
      <Card fluid>
        {earn !== null && (
          <Card.Content>{renderTable(earn?.data)}</Card.Content>
        )}
        <Card.Content>
          <Form className="flex gap-2 w-full">
            <Form.Field className="w-full">
              <label>View by</label>
              <Select
                placeholder={"Select Event Group"}
                fluid
                value={eventGroup}
                options={eventGroups.map((i) => {
                  return { text: i.name, value: i.id };
                })}
                onChange={(evt: any, val: any) => {
                  setEventGroup(val.value);
                }}
              />
            </Form.Field>
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
            </div>
            <div>
              <Form.Field>
                <Button
                  style={{marginTop: '15px'}}
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
