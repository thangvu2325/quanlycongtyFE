import { ConfigProvider, Flex, Menu } from "antd";
import { Fragment, FunctionComponent, useRef } from "react";
import { IconLogo } from "../../../components/Icon";
import Title from "antd/es/typography/Title";
import { IconHome2, IconSettings } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { useAppSelector } from "../../../redux/hook";
import {
  authSelector,
  authorizationSelector,
  settingsSelector,
} from "../../../redux/selectors";
type MenuItem = Required<MenuProps>["items"][number];
interface SiderComponentProps {}
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const SiderComponent: FunctionComponent<SiderComponentProps> = () => {
  const { pathname } = useLocation();
  const authData: tokenType = useAppSelector(authSelector);
  const currentUser = authData?.user;
  const refDiv = useRef<HTMLDivElement>(null);
  const siderState = useAppSelector(settingsSelector).sideBarState;
  if (refDiv.current && !siderState) {
    refDiv.current.classList.toggle("min-w-[280px]");
  }
  const { isAdministratorOrModerator, isAdministratorOrModeratorOrQuanLy } =
    useAppSelector(authorizationSelector);
  const items: MenuItem[] = [
    isAdministratorOrModerator
      ? getItem("Quản Lý Công ty", "sub1", <Fragment></Fragment>, [
          getItem(
            <Link to={"/company"}>Thêm Công Ty</Link>,
            "/company",
            <Fragment></Fragment>
          ),
        ])
      : null,
    isAdministratorOrModeratorOrQuanLy
      ? getItem("Quản Lý Nhân Viên", "sub2", <Fragment></Fragment>, [
          getItem(
            <Link to={"/nhanvien"}>Danh sách nhân viên</Link>,
            "/nhanvien",
            <Fragment></Fragment>
          ),
        ])
      : null,
    getItem("Quản Lý Chấm Công", "sub3", <Fragment></Fragment>, [
      isAdministratorOrModeratorOrQuanLy
        ? getItem(
            <Link to={"/luong"}>Tính Lương</Link>,
            "/luong",
            <Fragment></Fragment>
          )
        : null,
      getItem(
        <Link to={"/luong/quanlychamcong"}>Chấm Công</Link>,
        "/quanlychamcong",
        <Fragment></Fragment>
      ),
      getItem(
        <Link to={"/luong/bangtinhluong"}>Bảng Tính Lương</Link>,
        "/bangtinhluong",
        <Fragment></Fragment>
      ),
    ]),
    isAdministratorOrModeratorOrQuanLy
      ? getItem("Quản Lý Nghỉ Phép", "sub4", <Fragment></Fragment>, [
          getItem(
            <Link to={"/nghiphep"}>Danh sách nghỉ phép</Link>,
            "/nghiphep",
            <Fragment></Fragment>
          ),
        ])
      : null,
  ];

  return (
    <div
      ref={refDiv}
      className={` overflow-hidden overflow-y-scroll max-lg:fixed max-lg:top-0 max-lg:z-[10]  min-w-[280px]  max-w-[280px] h-[100vh] transition-all ease-out scrollCustom bg-[#001529] ${
        siderState
          ? "max-lg:left-0 max-lg:animate-sidebarShow"
          : "max-lg:left-[-280px]"
      }`}
    >
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedBg: "rgba(255,255,255,0.04)",
              itemSelectedColor: "#fff",
              itemPaddingInline: 0,
              itemMarginInline: 0,
              itemHoverColor: "#fff",
              itemHoverBg: "rgba(255,255,255,0.04)",
            },
          },
        }}
      >
        <Flex align={"center"} className="p-6">
          <div className="border-[0.8px] border-solid border-[#2F3746] rounded-md">
            <IconLogo width="40px" height="40px" className="p-1"></IconLogo>
          </div>
          <Flex vertical className="ml-4">
            <Title level={2} style={{ color: "#fff" }}>
              {currentUser?.fullName}
            </Title>
            <Title level={3} style={{ color: "#9da4ae", marginTop: "0" }}>
              Role: {currentUser?.roles}
            </Title>
          </Flex>
        </Flex>
        <div className="px-4">
          <ul className="text-[#fff]">
            <li className="hover:bg-[rgba(255,255,255,0.04)] rounded-lg">
              <Link to={"/"} className="flex items-center py-[6px] px-[16px]">
                <IconHome2 className="mr-[16px] text-[#9da4ae]"></IconHome2>
                <Title level={3} style={{ color: "#9da4ae", marginTop: "0" }}>
                  Overview
                </Title>
              </Link>
            </li>
            <li className="hover:bg-[rgba(255,255,255,0.04)] rounded-lg mt-[4px]">
              <Link
                to={"/settings"}
                className="flex items-center py-[6px] px-[16px]"
              >
                <IconSettings className="mr-[16px] text-[#9da4ae]"></IconSettings>
                <Title level={3} style={{ color: "#9da4ae", marginTop: "0" }}>
                  Setting
                </Title>
              </Link>
            </li>
          </ul>
          <div className="mt-4">
            <Title
              level={4}
              style={{
                color: "#9da4ae",
                marginTop: "0",
                textTransform: "uppercase",
                marginLeft: "8px",
                marginBottom: "8px",
              }}
            >
              Concepts
            </Title>
            <Menu
              inlineIndent={16}
              defaultSelectedKeys={[pathname]}
              defaultOpenKeys={[pathname]}
              mode="inline"
              style={{ backgroundColor: "transparent", color: "#9da4ae" }}
              items={items}
            />
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default SiderComponent;
