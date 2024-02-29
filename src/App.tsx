import 'App.css';
import Layout from 'layout';
import Login from 'pages/login';
import Register from 'pages/register';
import Tracking from 'pages/tracking';
import 'react-dropdown-tree-select/dist/styles.css';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import './bootstrap-iso.css';
import ModalManager from 'components/modal';

function App() {
  return (
    <div className="App">
      <ModalManager />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/tracking/:id" element={<Tracking />}></Route>
          <Route path="/*" element={<Layout />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
