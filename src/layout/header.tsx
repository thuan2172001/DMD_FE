import { Dropdown, Image, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { RootState } from "reducer/store";
import { Link, useNavigate } from "react-router-dom";
import { ui } from "services";
import { Language } from "components";
import { useTranslation } from "react-i18next";
export default function Header({ toggleMenu }: { toggleMenu: Function }) {
  const { t } = useTranslation();
  const user: any = useSelector((state: RootState) => state.user);
  const nav = useNavigate();
  async function onLogoutClick() {
    await ui.confirm(t("Are you sure want to logout?"));
    localStorage.clear();
    nav("/login");
  }

  return (
    <Menu inverted fluid fixed="top">
      <Link to="/">
        <Menu.Item className="w-[197px] text-center">
          <Image src="logo.png" className="block mx-auto h-8" />
        </Menu.Item>
      </Link>

      <Menu.Item
        onClick={() => {
          toggleMenu();
        }}
      >
        <i className="icon bars" />
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Language />
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            trigger={
              <span>
                {`${t("Hi")} ${user.name}`}{" "}
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  avatar
                  className="object-cover"
                />
              </span>
            }
            direction="left"
            pointing
          >
            <Dropdown.Menu>
              <Dropdown.Item
                icon="user"
                text={t("Profile")}
                as="a"
                href="#/profile"
              />
              <Dropdown.Item
                icon="log out"
                text={t("Log out")}
                onClick={onLogoutClick}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
