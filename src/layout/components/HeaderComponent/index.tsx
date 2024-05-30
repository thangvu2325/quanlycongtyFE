import { theme, Divider, Dropdown, Flex, MenuProps, Space, Select } from "antd";
import { Header } from "antd/es/layout/layout";
import { FunctionComponent, cloneElement } from "react";
import {
  IconLayoutSidebarLeftExpand,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import Avatar from "../../../components/Avatar";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import {
  authSelector,
  authorizationSelector,
  companySelector,
  settingsSelector,
} from "../../../redux/selectors";
import { Link, useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { logOutRequest } from "../../../services/userService";
import { createAxios } from "../../../services/createInstance";
import { logOutSuccess } from "../../../redux/authSlice";
import { editCompany, toggleSidebarState } from "../../../redux/settingsSlice";
interface HeaderComponentProps {}
const items: MenuProps["items"] = [
  {
    key: "3",
    label: (
      <Link to="/settings">
        <Flex align="center">
          <IconSettings className="ml-[-8px] mr-[4px]"></IconSettings>Settings
        </Flex>
      </Link>
    ),
  },
  {
    key: "4",
    label: (
      <Link to={"/profile"}>
        <Flex align="center">
          <IconUser className="ml-[-8px] mr-[4px]"></IconUser>Profile
        </Flex>
      </Link>
    ),
  },
];
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
const HeaderComponent: FunctionComponent<HeaderComponentProps> = () => {
  const authData: tokenType = useAppSelector(authSelector);
  const { isAdministratorOrModerator } = useAppSelector(authorizationSelector);
  const companyData = useAppSelector(companySelector);
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ma_cong_ty = useAppSelector(settingsSelector).ma_cong_ty;
  const axiosClient = createAxios(authData, dispatch, logOutSuccess);
  const handleLogout = async () => {
    try {
      await logOutRequest(dispatch, authData.user.id, navigate, axiosClient);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Header className="shadow-sm fixed top-0 right-0 left-[280px] max-lg:left-0 max-lg:bg-[#fff] z-[2]">
      <Flex
        justify="space-between"
        align="center"
        className="max-w-7xl  mx-auto h-14"
      >
        <Flex className="ml-2" align="center">
          <span
            className="mr-2 cursor-pointer p-2 hover:bg-[rgba(108,115,127,0.1)] rounded-lg lg:hidden"
            onClick={() => {
              dispatch(toggleSidebarState());
            }}
          >
            <IconLayoutSidebarLeftExpand
              width={24}
              height={24}
            ></IconLayoutSidebarLeftExpand>
          </span>
          <span
            className={`mr-4 cursor-pointer  rounded-lg ${
              isAdministratorOrModerator ? "" : "hidden"
            }`}
          >
            <Select
              style={{ width: "200px" }}
              showSearch
              placeholder="Select a company"
              optionFilterProp="children"
              defaultValue={ma_cong_ty}
              filterOption={filterOption}
              onChange={(value) => {
                dispatch(editCompany(value));
              }}
              options={companyData.data.companys.map((company) => ({
                label: company.ten_cong_ty,
                value: company.id,
              }))}
            />
          </span>
        </Flex>
        <div className="cursor-pointer">
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow={false}
            trigger={["hover"]}
            align={{ offset: [-8, 8] }}
            dropdownRender={(dropdownMenu) => {
              return (
                <div className="w-52 bg-[#fff] shadow-xl border-[0.8px] border-solid border-[#ccc] rounded-lg">
                  <Space direction="vertical" className="p-4">
                    <Title
                      level={2}
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      {authData?.user?.fullName}
                    </Title>
                    <Title
                      level={3}
                      style={{
                        color: token.colorTextSecondary,
                        fontWeight: "400",
                      }}
                    >
                      {authData?.user?.email}
                    </Title>
                  </Space>
                  <Divider style={{ margin: "0" }} />
                  {cloneElement(dropdownMenu as React.ReactElement, {
                    style: {
                      boxShadow: "none",
                      background: "transparent",
                      padding: "8px 16px",
                    },
                  })}
                  <Divider style={{ margin: "0" }} />
                  <Flex align="center" justify="center" className="p-1">
                    <div
                      className="py-2 px-4 text-center hover:bg-[#f6f6f7] rounded cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </Flex>
                </div>
              );
            }}
          >
            <span
              onClick={() => {
                dispatch(toggleSidebarState());
              }}
            >
              <Avatar
                src={authData?.user?.Avatar}
                name={authData?.user?.fullName}
              ></Avatar>
            </span>
          </Dropdown>
        </div>
      </Flex>
    </Header>
  );
};

export default HeaderComponent;
