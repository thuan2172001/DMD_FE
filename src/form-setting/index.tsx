import { DatePicker, Loading } from "components";
import { ConfigDataType } from "interfaces";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
 Button,
 Card,
 Checkbox,
 Form,
 Input,
 TextArea,
} from "semantic-ui-react";
import { api, ui } from "services";

export default function FormSetting() {
 const { name } = useParams();
 const [config, setConfig] = useState<any>(null);
 useEffect(() => {
  async function loadConfig() {
   let rs = await api.post("/operation/api/get-config", { where: { name } });
   setConfig(rs.data[0]);
  }
  loadConfig();
 }, [name]);
 async function update() {
  let rs = await api.post("/operation/api/update-config", config);
  setConfig(rs);
  ui.alert("Update success");
 }
 function handleChange(name: string, value: any) {
  let tmp = _.cloneDeep(config);
  tmp[name] = value;
  setConfig(tmp);
 }
 function renderContent() {
  if (!config) {
   return <Loading />;
  }
  switch (config.type) {
   case ConfigDataType.Boolean:
    return (
     <div>
      <Checkbox
       toggle
       checked={config.value === "1"}
       onChange={(evt: any, { checked }) => {
        handleChange("value", checked ? "1" : "0");
       }}
      />
     </div>
    );
   case ConfigDataType.Date:
    return (
     <div>
      <DatePicker
       showTimeSelect
       dateFormat="yyyy/MM/dd HH:mm:ss"
       todayButton="Today"
       selected={config ? new Date(config.value) : null}
       onChange={(val: any) => {
        handleChange("value", val);
       }}
      />
      <p className="text-red-600 font-semibold">
       Display in local time (+
       {(new Date().getTimezoneOffset() / 60) * -1})
      </p>
     </div>
    );
   case ConfigDataType.Number:
    return (
     <div>
      <Input
       type="text"
       value={config?.value || ""}
       onChange={(evt: any) => {
        handleChange("value", evt.target.value);
       }}
      />
     </div>
    );
   case ConfigDataType.Object:
    return (
     <TextArea
      type="text"
      value={config?.value || ""}
      onChange={(evt: any) => {
       handleChange("value", evt.target.value);
      }}
     />
    );
   case ConfigDataType.String:
    return (
     <Input
      type="text"
      value={config?.value || ""}
      onChange={(evt: any) => {
       handleChange("value", evt.target.value);
      }}
     />
    );
  }
 }
 return (
  <div>
   <Card fluid>
    <Card.Content>
     <Card.Header>
      <div className="flex justify-between">
       <p>Edit Config</p>
       <Button
        icon="save"
        content="Save"
        primary
        onClick={() => {
         update();
        }}
        labelPosition="left"
       />
      </div>
     </Card.Header>
    </Card.Content>
    <Card.Content>
     <p className="text-3xl font-semibold">{config?.name}</p>
     <p>Description</p>
     <Input
      type="text"
      fluid
      value={config?.description || ""}
      onChange={(evt: any) => {
       let tmp = _.cloneDeep(config);
       tmp.description = evt.target.value;
       setConfig(tmp);
      }}
     />
     <Form className="mt-4">
      <Form.Field>
       <label>Value</label>
       {renderContent()}
      </Form.Field>
     </Form>
     <div className="mt-4"></div>
    </Card.Content>
   </Card>
  </div>
 );
}
