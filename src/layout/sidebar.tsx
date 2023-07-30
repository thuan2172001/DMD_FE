import { MenuEntity } from "interfaces";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "reducer/store";
import { Icon, Menu } from "semantic-ui-react";
import { data } from "services";
export default function Sidebar({ showMenu }: { showMenu: boolean }) {
  const { t } = useTranslation();
  let location = useLocation();
  const pathname = useMemo(() => {
    return location.pathname;
  }, [location]);
  const [open, setOpen] = useState<number[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const menus = useMemo(() => {
    let all = data.getMenus();
    let parent = all
      .filter((item: MenuEntity) => {
        if (item?.children?.length > 0) {
          return true;
        }
        if (_.intersection(item.permissions, user.permissions).length > 0) {
          return true;
        }
        return false;
      })
      .map((item: MenuEntity) => {
        let tmp = _.cloneDeep(item);
        if (tmp.children?.length) {
          let child = tmp.children.filter((child: MenuEntity) => {
            if (
              _.intersection(child.permissions, user.permissions).length > 0
            ) {
              return true;
            }
            return false;
          });
          tmp.children = child;
        }
        return tmp;
      });
    return parent;
  }, [user]);
  return (
    <div
      className={`duration-200 fixed ${
        showMenu ? "left-0" : "left-[-250px]"
      } left-0 top-0 z-10 pt-16 w-[250px] h-screen overflow-auto bg-[#1b1c1d]`}
    >
      <Menu vertical inverted fluid>
        {menus.map((i: any, index: number) => (
          <div key={index}>
            <Menu.Item
              active={i.url === pathname}
              className="w-full"
              as={i.children?.length > 0 ? "button" : "a"}
              onClick={() => {
                if (i.children?.length > 0) {
                  let tmp = [...open];
                  if (tmp.includes(index)) {
                    tmp = tmp.filter((t) => t !== index);
                  } else {
                    tmp.push(index);
                  }
                  setOpen(tmp);
                }
              }}
              href={i?.children?.length > 0 ? "" : `#${i.url}`}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="flex items-center">
                    <p className="mr-2 w-8 text-center">
                      {/* @ts-ignore */}
                      <Icon name={i.icon} size="large" />
                    </p>
                    <p>{t(i.name)}</p>
                  </p>
                </div>
                {i.children &&
                  i.children.length > 0 &&
                  (open.includes(index) ? (
                    <Icon name="angle down" />
                  ) : (
                    <Icon name="angle right" />
                  ))}
              </div>
            </Menu.Item>
            {i.children && i.children.length > 0 && open.includes(index) && (
              <Menu vertical inverted fluid className="pl-3">
                {i.children.map((c: any, cIndex: number) => (
                  <Menu.Item
                    as="a"
                    href={`#${c.url}`}
                    key={cIndex}
                    active={c.url === pathname}
                  >
                    <div className="flex items-center">
                      <p className="mr-2 w-8 text-center">
                        {/* @ts-ignore */}
                        <Icon name={c.icon} size="large" />
                      </p>
                      <p>{t(c.name)}</p>
                    </div>
                  </Menu.Item>
                ))}
              </Menu>
            )}
          </div>
        ))}
      </Menu>
    </div>
  );
}
