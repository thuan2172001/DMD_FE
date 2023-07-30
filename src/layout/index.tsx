import { Loading } from "components";
import { EnumEntity, FormEntity, GridEntity, FormControl, SchemaControl, SchemaDataType } from "interfaces";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "reducer/store";
import { setUserInfo } from "reducer/user.slice";
import { data } from "services";
import api from "services/api";
import Header from "./header";
import Main from "./main";
import Sidebar from "./sidebar";

export default function Layout() {
  const [showMenu, setShowMenu] = useState(true);
  const user = useSelector((state: RootState) => state.user);
  const nav = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    async function loadUserInfo() {
      try {
        if (!localStorage.getItem("token")) {
          throw new Error("token_not_found");
        }
        let rs = await api.post("/operation/get-meta", {});
        let { userInfo } = rs;

        let grids: { [key: string]: GridEntity } = {};
        let enums: { [key: string]: EnumEntity } = {};
        rs.gridInfos.forEach((grid: GridEntity) => {
          grids[grid.name] = grid;
        });
        rs.enumInfos.forEach((item: EnumEntity) => {
          enums[item.name] = item;
        });

        let forms: { [key: string]: FormEntity } = {};
        rs.formInfos.forEach((item: FormEntity) => {
          forms[item.name] = item;
        });

        data.setMeta(grids, forms, enums, rs.menuInfos, rs.troopList, rs.skillList);
        dispatch(setUserInfo(userInfo));
      } catch (error) {
        localStorage.clear();
        nav("/login");
      }
    }
    loadUserInfo();
  }, []);
  return (
    <div>
      {user !== null ? (
        <div>
          <Header
            toggleMenu={() => {
              setShowMenu(!showMenu);
            }}
          />
          <Sidebar showMenu={showMenu} />
          <Main showMenu={showMenu} />
        </div>
      ) : (
        <div className="w-screen h-screen flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
}
