import axios from "axios";
import Config from "config";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
var saveData = (function () {
  var a: any = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data: Blob, fileName: any) {
    let url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();
async function downloadReport(data: any) {
  let csv = [["Date"]];
  data.datasets.forEach((s: any) => {
    csv[0].push(s.label);
  });
  for (var i = 0; i < data.labels.length; i++) {
    csv[i + 1] = [data.labels[i]];
    data.datasets.forEach((s: any) => {
      csv[i + 1].push(s.data[i]);
    });
  }
  let text = csv.map((s: string[]) => s.join(",")).join("\n");
  var blob = new Blob([text], {
    type: "text/plain;charset=utf-8;",
  });
  saveAs(blob, "report.csv");
}
async function post(url: string, data: any): Promise<any> {
  let rs = await fetch(`${Config.ApiHost}${url}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  switch (rs.status) {
    case 200:
      if (data.export || url.includes("operation/export-winner")) {
        console.log({ url });
        let data = await rs.blob();
        let now = dayjs().format("DD_MM_YYYY");
        saveData(data, `${now}.xlsx`);
        return rs;
      }
      let tmp = await rs.json();
      return tmp;
    default:
      let err = await rs.json();
      throw err;
  }
}

async function postFormData(
  url: string,
  data: any,
  cb?: Function
): Promise<any> {
  var formdata = new FormData();
  for (var i in data) {
    formdata.append(i, data[i]);
  }
  let tmp: any = await axios.request({
    method: "post",
    url: `${Config.ApiHost}${url}`,
    data: formdata,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "multipart/form-data",
    },
    onUploadProgress: (p) => {
      if (cb) cb(p);
      //this.setState({
      //fileprogress: p.loaded / p.total
      //})
    },
  });
  console.log("handle fe finish");
  if (tmp.code === "forbidden") {
    window.location.href = "/auth";
    throw new Error("forbidden");
  }
  return tmp.data;
}

async function insertOrder({ title, data }: { title: string; data: any }) {
  return post("/operation/insert-order", { title, data });
}

const api = {
  downloadReport,
  post,
  postFormData,
  insertOrder,
};
export default api;
