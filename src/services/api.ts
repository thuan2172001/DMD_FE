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

async function battlePost(url: any, data?: {}) {
  if (!data) {
    data = {};
  }
  let response = await fetch(`${Config.ApiHost}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  let rs = await response.json();
  if (response.status !== 200) {
    throw rs;
  }
  return rs;
}

async function hackCreatePlot(
  wallet_address: any,
  plot_race: any,
  plot_rarity: any,
  plot_type: any,
  amount: any,
  sub_plot_type: any
) {
  return post("/cheat/create-plot", {
    wallet_address,
    plot_race,
    plot_rarity,
    plot_type,
    amount,
    sub_plot_type,
  });
}
async function hackCreateEgg(
  wallet_address: any,
  mongen_race: any,
  mongen_rarity: any,
  amount: any,
  mark: any
) {
  return post("/cheat/create-mongen", {
    wallet_address,
    mongen_race,
    mongen_rarity,
    amount,
    mongen_mark: mark
  });
}
async function hackSkiptime(address: any, plot_id: any, time: any) {
  return post("/cheat/skip-time", { address, plot_id, time });
}
async function hackDeleteCustomer(wallet_address: any) {
  return post("/cheat/delete-customer", { address: wallet_address });
}
async function hackCustomerTransaction(
  wallet_address: any,
  amount: any,
  type: any
) {
  return post("/cheat/customer-transaction", {
    address: wallet_address,
    amount,
    type,
  });
}
async function hackCreateTroops(troop_id: any, mongen_id: any, quantity: any) {
  return post("/cheat/create-troops", { troop_id, mongen_id, quantity });
}
async function hackTutorialProcess(wallet_address: any, process: any) {
  return post("/cheat/change-tutorial-process", {
    wallet_address,
    process,
  });
}
async function deleteName(wallet_address: any) {
  return post("/cheat/delete-customer-name", { wallet_address });
}
async function outBattle(data: any) {
  return post("/cheat/out-battle", data);
}
async function recalculateStake() {
  return post("/cheat/recalculate-stake", {});
}
async function convertMongenToEgg(mongen_id: any) {
  return post("/cheat/convert-mongen-to-egg", { mongen_id });
}
async function cheatClaimLevelReward(wallet_address: any, level_reward: any) {
  return post("/cheat/claim-level-reward", {
    wallet_address,
    level_reward,
  });
}
async function cheatClaimBattlefrontSeasonReward() {
  return post("/cheat/cheat-claim-battlefront-season", {});
}
async function cheatSetQuestTime(wallet_address: any, time: any) {
  return post("/cheat/set-quest-time", { wallet_address, time });
}
async function cheatResetSharing(wallet_address: any) {
  return post("/cheat/reset-sharing", { wallet_address });
}
async function cheatSetFaucetTime(time: any) {
  return post("/cheat/set-faucet-time", { time });
}
async function addWhitelist(type: any, identity: any) {
  return post("/cheat/add-whitelist", { type, identity });
}
async function getPool() {
  return post("/cheat/get-box-pool", {});
}
async function cheatCreateBox(wallet_address: any, pool_id: any) {
  return post("/cheat/create-box", { wallet_address, pool_id });
}
async function cheatAdventureStar(wallet_address: any, value: any) {
  return post("/cheat/cheat-adventure_star", { wallet_address, value });
}
async function cheatAdventureStarReward(wallet_address: any, value: any) {
  return post("/cheat/cheat-adventure_star_reward", { wallet_address, value });
}
async function getMongenInfo(mongen_id: any) {
  return post("/cheat/get-mongen-info", { mongen_id });
}
async function updateTroopMongen(mongen_id: any, troops: any) {
  return post("/cheat/update-troop-mongen", { mongen_id, troops });
}
async function updateSkillMongen(mongen_id: any, skill_list: any, type: any) {
  return post("/cheat/update-skill-mongens", { mongen_id, skill_list, type });
}
async function updateMoraleValue(mongen_id: any, type: any, amount: any) {
  return post("/cheat/cheat-mongen-morale", { mongen_id, amount, type });
}
async function hackgenerateInvest() {
  return post("/cheat/generate-invest", {});
}
async function hackClaimScholarReward() {
  return post("/cheat/handle-claim-scholar-reward", {});
}

async function randomMorale(mongen_id: any) {
  return post("/cheat/random-mongen-morale", { mongen_id });
}

async function hackUpdateCurse({ curseCode, curseLevel, wallet_address }: any) {
  return post("/cheat/cheat-curse-data", {
    curse_code: curseCode,
    curse_level: curseLevel,
    wallet_address,
  });
}
async function hackOpenPlusQuest(wallet_address: string) {
  return post("/cheat/cheat-open-plus-quest", {
    wallet_address,
  });
}

async function loadData({
  identity,
  loginType,
  userId,
  mongenId,
  plotId,
  transactionId,
  queryType,
  limit,
  offset,
  table,
  dateFrom,
  dateTo,
  filters,
  from_address,
}: any) {
  return post("/operation/query-data", {
    identity,
    loginType,
    userId,
    mongenId,
    plotId,
    transactionId,
    queryType,
    limit,
    offset,
    table,
    dateFrom,
    dateTo,
    filters,
    from_address,
  });
}

async function hackDateBattlefront({ customer_id, date }: any) {
  return battlePost("/cheat/cheat-day-battlefront", { customer_id, date });
}

async function hackPlusPoint(wallet_address: string, amount: any) {
  return battlePost("/cheat/cheat-dailyquest-plus-point", {
    wallet_address,
    amount,
  });
}
async function hackAdventureStage(wallet_address: string, stage_id: any) {
  return battlePost("/cheat/cheat-stage-adventure", {
    wallet_address,
    stage_id,
  });
}
async function skipFusionWait(wallet_address: string) {
  return post("/cheat/skip-fusion-waittime", {
    wallet_address,
  });
}
async function resetFusionLimit() {
  return post("/cheat/reset-current-fusion-limit", {});
}

async function hackDaoRevenue(data: any) {
  return post("/cheat/update-dao-revenue", data)
}

async function hackGetDaoRevenue() {
  return post("/cheat/cheat-get-dao-revenue", {})
}

async function hackCalculateStakeDao() {
  return post("/cheat/cheat-calculate-stake", {})
}

const api = {
  hackGetDaoRevenue,
  hackCalculateStakeDao,
  hackDaoRevenue,
  skipFusionWait,
  resetFusionLimit,
  cheatResetSharing,
  hackOpenPlusQuest,
  hackAdventureStage,
  hackPlusPoint,
  loadData,
  hackUpdateCurse,
  randomMorale,
  updateMoraleValue,
  downloadReport,
  post,
  cheatAdventureStarReward,
  cheatAdventureStar,
  cheatCreateBox,
  addWhitelist,
  getPool,
  cheatSetFaucetTime,
  cheatSetQuestTime,
  cheatClaimLevelReward,
  convertMongenToEgg,
  battlePost,
  recalculateStake,
  hackCreatePlot,
  hackCreateEgg,
  hackSkiptime,
  hackDeleteCustomer,
  hackCustomerTransaction,
  hackCreateTroops,
  hackTutorialProcess,
  deleteName,
  getMongenInfo,
  updateTroopMongen,
  updateSkillMongen,
  hackgenerateInvest,
  outBattle,
  hackClaimScholarReward,
  hackDateBattlefront,
  cheatClaimBattlefrontSeasonReward,
  postFormData
};
export default api;
