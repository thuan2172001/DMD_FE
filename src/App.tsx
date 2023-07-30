import "./bootstrap-iso.css";
import "react-dropdown-tree-select/dist/styles.css";
import "App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "layout";
import Login from "login";
import ModalManager from "modal";
import Register from "register";

function App() {
  return (
    <div className="App">
      <ModalManager />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/*" element={<Layout />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
