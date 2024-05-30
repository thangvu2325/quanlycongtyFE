import { FunctionComponent, Key, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Table,
  notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import {
  IconChevronDown,
  IconDownload,
  IconPlus,
  IconSquareRoundedArrowDown,
  IconSquareRoundedArrowUp,
  IconUpload,
} from "@tabler/icons-react";
import { Link, useSearchParams } from "react-router-dom";

import { nhanvienType } from "../../type/type";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  authSelector,
  authorizationSelector,
  nhanvienRemainingSelector,
} from "../../redux/selectors";
import ModalNhanVien from "./ModalNhanVien";
import { editFilter, fetchDataNhanvien } from "../../redux/nhanvienSlice";
import { IconResetPassword } from "../../components/Icon";
import { resetPasswordRequest } from "../../services/userService";
import { createAxios } from "../../services/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { toast } from "react-toastify";
import { updateRoles } from "../../services/nhanvienService";
interface DataType {
  key: Key;
  ma_nhan_vien: string;
  ten_nhan_vien: string;
  so_dien_thoai: string;
  email: string;
  chuc_vu: string;
  phong_ban: string;
  roles: string;
}

interface NhanvienPageProps {}
type FieldType = {
  ten_nhan_vien?: string;
  ma_nhan_vien?: string;
  so_dien_thoai?: string;
  email?: string;
};
const NhanvienPage: FunctionComponent<NhanvienPageProps> = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "#",
      dataIndex: "key",
      sortDirections: ["descend"],
    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "ten_nhan_vien",
    },
    {
      title: "Mã Nhân Viên",
      dataIndex: "ma_nhan_vien",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "so_dien_thoai",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "roles",
    },
    {
      title: "Chức Vụ",
      dataIndex: "chuc_vu",
      filters: [
        {
          text: "Trưởng phòng bộ phận",
          value: "Trưởng phòng bộ phận",
        },
        {
          text: "Tổ trưởng",
          value: "Tổ trưởng",
        },
        {
          text: "Nhân viên",
          value: "Nhân viên",
        },
      ],

      onFilter: (value: string | boolean | React.Key, record) =>
        typeof value === "string" ? record.chuc_vu.indexOf(value) === 0 : true,
    },
    {
      title: "Phòng Ban",
      dataIndex: "phong_ban",
      filters: [
        {
          text: "Ban giám đốc",
          value: "Ban giám đốc",
        },
        {
          text: "Ban giám đốc",
          value: "Ban giám đốc",
        },
        {
          text: "Ban sản xuất",
          value: "Ban sản xuất",
        },
        {
          text: "Marketing",
          value: "Marketing",
        },
        {
          text: "Nhân sự",
          value: "Nhân sự",
        },
        {
          text: "Tài chính kế toán",
          value: "Tài chính kế toán",
        },
        {
          text: "Kỹ Thuật và Công Nghệ",
          value: "Kỹ Thuật và Công Nghệ",
        },
      ],

      onFilter: (value: string | boolean | React.Key, record) =>
        typeof value === "string"
          ? record.phong_ban.indexOf(value) === 0
          : true,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  const tokenData = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(tokenData, dispatch, loginSuccess);
  const { isAdministratorOrModerator } = useAppSelector(authorizationSelector);
  const resetPasswordForUser = async (email: string) => {
    try {
      const res: { newPassword: string } = await resetPasswordRequest(
        email,
        axiosClient
      );
      api["success"]({
        message: "Reset Mật Khẩu Thành Công!",
        description: (
          <span>
            Tài Khoản Đã Reset: {email}
            <br />
            Mật khẩu sau khi reset là: {res.newPassword}
            <br />
            Thông tin tài khoản mật khẩu đã được gửi tới email: {email}
          </span>
        ),
      });
    } catch (error: any) {
      api["error"]({
        message: "Reset Mật Khẩu",
        description: Array.isArray(error.response.data.message)
          ? error.response.data.message.toString()
          : error.response.data.message,
      });
    }
  };
  const updateRole = async (
    email: string,
    roles: string,
    action: "up" | "down" = "up"
  ) => {
    try {
      const res: { result: string } = await updateRoles(
        axiosClient,
        email,
        action,
        roles
      );
      toast.success(res.result);
      dispatch(fetchDataNhanvien(axiosClient));
    } catch (error: any) {
      toast.error(
        Array.isArray(error.response.data.message)
          ? error.response.data.message.toString()
          : error.response.data.message
      );
    }
  };
  const refDiv = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const dataTable = useAppSelector(nhanvienRemainingSelector)?.nhanvien.map(
    (nhanvien: nhanvienType, index) => ({
      ...nhanvien,
      key: (index + 1).toString(),
      action: (
        <Flex>
          <Popover
            trigger={"hover"}
            content={<Title level={5}>Reset Password</Title>}
          >
            <span
              className="p-1"
              onClick={() => {
                resetPasswordForUser(nhanvien.email);
              }}
            >
              <IconResetPassword
                width="16px"
                height="16px"
                className="hover:text-gray-light cursor-pointer"
              ></IconResetPassword>
            </span>
          </Popover>
          <Popover
            className={`${isAdministratorOrModerator ? "" : "hidden"}`}
            trigger={"hover"}
            content={<Title level={5}>Nâng Role</Title>}
          >
            <span
              className="p-1"
              onClick={() => {
                updateRole(nhanvien.email, nhanvien.roles, "up");
              }}
            >
              <IconSquareRoundedArrowUp
                width="16px"
                height="16px"
                className="hover:text-gray-light cursor-pointer"
              ></IconSquareRoundedArrowUp>
            </span>
          </Popover>

          <Popover
            trigger={"hover"}
            content={<Title level={5}>Hạ Role</Title>}
            className={`${isAdministratorOrModerator ? "" : "hidden"}`}
          >
            <span
              className="p-1"
              onClick={() => {
                updateRole(nhanvien.email, nhanvien.roles, "down");
              }}
            >
              <IconSquareRoundedArrowDown
                width="16px"
                height="16px"
                className="hover:text-gray-light cursor-pointer"
              ></IconSquareRoundedArrowDown>
            </span>
          </Popover>
        </Flex>
      ),
    })
  );
  const handleToggleShowSearchBox = () => {
    if (refDiv.current) {
      refDiv.current.classList.toggle("h-64");
    }
  };
  const onFinish = async (values: any) => {
    setSearchParams(values);
    dispatch(editFilter(values));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  // Modal
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    dispatch(
      editFilter({
        ten_nhan_vien: searchParams.get("ten_nhan_vien") ?? "",
        ma_nhan_vien: searchParams.get("ma_nhan_vien") ?? "",
        email: searchParams.get("email") ?? "",
        so_dien_thoai: searchParams.get("so_dien_thoai") ?? "",
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify
  const [api, contextHolder] = notification.useNotification();
  return (
    <div className="overflow-auto overscroll-contain w-full">
      <div className="px-6">
        {contextHolder}
        <Flex justify="space-between" align="center" className="mb-4">
          <Flex vertical>
            <Title style={{ fontSize: "32px" }}>Danh Sách Nhân Viên</Title>
            <Flex className="mt-2">
              <Link to={"#"}>
                <Title level={3}>
                  <Space className="px-3 py-[7px] hover:bg-[rgba(17,25,39,0.04)] rounded-md">
                    <IconUpload width={13.5} height={13.5}></IconUpload> Import
                  </Space>
                </Title>
              </Link>
              <Link to={"#"}>
                <Title level={3}>
                  <Space className="px-3 py-[7px] ml-2 hover:bg-[rgba(17,25,39,0.04)] rounded-md">
                    <IconDownload width={13.5} height={13.5}></IconDownload>
                    Export
                  </Space>
                </Title>
              </Link>
            </Flex>
          </Flex>
          <Button
            style={{ background: "#6366f1", color: "#fff" }}
            className="flex items-center"
            icon={<IconPlus></IconPlus>}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Title level={3} style={{ fontWeight: "600", color: "#fff" }}>
              New
            </Title>
          </Button>
        </Flex>
        <div className="bg-[#fff] shadow-lg rounded-lg ">
          <div
            className="transition-height duration-500 ease-in-out h-12 overflow-hidden"
            ref={refDiv}
          >
            <Title
              level={3}
              className="p-4 flex items-center outline-none font-semibold cursor-pointer select-none"
              onClick={handleToggleShowSearchBox}
            >
              <IconChevronDown
                width={20}
                height={20}
                className="mr-2"
              ></IconChevronDown>
              Thông tin tìm kiếm
            </Title>
            <div className={`w-3/4 mx-auto mb-4`}>
              <Form
                initialValues={{
                  ten_nhan_vien: searchParams.get("ten_nhan_vien") ?? "",
                  ma_nhan_vien: searchParams.get("ma_nhan_vien") ?? "",
                  email: searchParams.get("email") ?? "",
                  so_dien_thoai: searchParams.get("so_dien_thoai") ?? "",
                }}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Space className="p-3">
                      <Form.Item<FieldType>
                        label={
                          <Title level={3} className="w-28">
                            Tên Nhân Viên
                          </Title>
                        }
                        name="ten_nhan_vien"
                      >
                        <Input placeholder="Nhập Tên Nhân Viên"></Input>
                      </Form.Item>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space className="p-3">
                      <Form.Item<FieldType>
                        label={
                          <Title level={3} className="w-28">
                            Mã Nhân Viên
                          </Title>
                        }
                        name="ma_nhan_vien"
                      >
                        <Input placeholder="Nhập Mã Nhân Viên"></Input>
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Space className="p-3">
                      <Form.Item<FieldType>
                        label={
                          <Title level={3} className="w-28">
                            Email
                          </Title>
                        }
                        name="email"
                      >
                        <Input placeholder="Nhập Email Nhân Viên"></Input>
                      </Form.Item>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space className="p-3">
                      <Form.Item<FieldType>
                        label={
                          <Title level={3} className="w-28">
                            Số Điện Thoại
                          </Title>
                        }
                        name="so_dien_thoai"
                      >
                        <Input placeholder="Nhập Số Điện Thoại"></Input>
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
                <Flex justify="end">
                  <Button
                    style={{
                      background: "#ccc",
                      color: "#fff",
                      marginRight: "16px",
                    }}
                    className="flex items-center"
                    htmlType="reset"
                    onClick={() => {
                      setSearchParams({});
                    }}
                  >
                    <Title
                      level={3}
                      style={{
                        fontWeight: "600",
                        color: "#fff",
                        padding: "8px 16px",
                        height: "fit-content",
                      }}
                    >
                      Clear
                    </Title>
                  </Button>
                  <Button
                    style={{
                      background: "#6366f1",
                      color: "#fff",
                    }}
                    htmlType="submit"
                    className="flex items-center"
                  >
                    <Title
                      level={3}
                      style={{
                        fontWeight: "600",
                        color: "#fff",
                        padding: "8px 16px",
                        height: "fit-content",
                      }}
                    >
                      Tìm Kiếm
                    </Title>
                  </Button>
                </Flex>
              </Form>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={dataTable}
            pagination={{ pageSize: 3 }}
          />
        </div>
      </div>
      <ModalNhanVien open={open} setOpen={setOpen}></ModalNhanVien>
    </div>
  );
};

export default NhanvienPage;
