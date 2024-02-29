import { Routes, Route } from 'react-router-dom';
import Profile from 'pages/profile';
import Home from 'pages/home';
import List from 'pages/list';
import Form from 'pages/form';
import Chart from 'pages/chart';
import Table from 'pages/table';
import ImportData from 'pages/import';
import ScanData from 'pages/scan';

export default function Routers({ showMenu }: { showMenu: boolean }) {
  return (
    <div>
      <div className={`p-5 pt-20 duration-200 ${showMenu && 'pl-[265px]'}`}>
        <Routes>
          <Route path="/" element={<ImportData />}></Route>
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
