import { Routes, Route } from "react-router-dom";
import Profile from "profile";
import Home from "home";
import List from "list";
import Form from "form";
import Chart from "chart";
import Table from "table";
import ImportData from "import";
import ScanData from "scan";
import Import17TrackData from "import/import-17track";

export default function Main({ showMenu }: { showMenu: boolean }) {
  return (
    <div>
      <div className={`p-5 pt-20 duration-200 ${showMenu && "pl-[265px]"}`}>
        <Routes>
          <Route path="/" element={<ImportData />}></Route>
          <Route path="/import-17track" element={<Import17TrackData />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/scan-data" element={<ScanData />}></Route>
          <Route path="/dashboard" element={<Home />}></Route>
          <Route path="/list/:name" element={<List />}></Route>
          <Route path="/form/:name/:mode" element={<Form />}></Route>
          <Route path="/chart/:type" element={<Chart />}></Route>
          <Route path="/table/:type" element={<Table />}></Route>
          <Route path="/import-data" element={<ImportData />}></Route>
          <Route path="/label-scan" element={<ScanData />}></Route>
          <Route path="/view-data" element={<ImportData />}></Route>
        </Routes>
      </div>
    </div>
  );
}
