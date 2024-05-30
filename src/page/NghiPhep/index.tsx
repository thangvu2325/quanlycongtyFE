import { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import {
  IconChevronDown,
  IconDownload,
  IconEyeCheck,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { Link, useSearchParams } from "react-router-dom";
import { nghiphepType } from "../../type/type";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  authSelector,
  authorizationSelector,
  nghiphepRemainingSelector,
} from "../../redux/selectors";
import {
  editFilterNghiPhep,
  fetchDataNghiphep,
} from "../../redux/nghiphepSlice";
import ModalNghiPhep from "./ModalNghiPhep";
import { confirmRequestNghiPhep } from "../../services/nhanvienService";
import { createAxios } from "../../services/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { toast } from "react-toastify";
interface DataType {
  key: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ma_nhan_vien: string;
  ten_nhan_vien: string;
  date: string;
  li_do: string;
  status: string; // Make sure 'status' property is present in DataType
}

interface NghiPhepPageProps {}
type FieldType = {
  ten_nhan_vien?: string;
  ma_nhan_vien?: string;
  ma_don?: string;
  da_duyet: boolean;
  chua_duyet: boolean;
};
const NghiPhepPage: FunctionComponent<NghiPhepPageProps> = () => {
  const { isAdministratorOrModerator } = useAppSelector(authorizationSelector);
  const columns: ColumnsType<DataType> | null = [
    {
      title: "#",
      dataIndex: "key",
      sortDirections: ["descend"],
    },
    {
      title: "Mã Đơn",
      dataIndex: "ma_don",
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
      title: "Lí Do",
      dataIndex: "li_do",
    },
    {
      title: "Đơn tạo ngày",
      dataIndex: "createdAt",
    },
    {
      title: "Nghỉ ngày",
      dataIndex: "date",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
    },
  ];
  if (isAdministratorOrModerator) {
    columns.push({
      title: "Action",
      dataIndex: "action",
    });
  }
  const dispatch = useAppDispatch();
  const refDiv = useRef<HTMLDivElement>(null);
  const authData = useAppSelector(authSelector);
  const axiosClient = createAxios(authData, dispatch, loginSuccess);
  const handleRequestDuyetDon = async (ma_don: string) => {
    try {
      const res = await confirmRequestNghiPhep(axiosClient, ma_don);
      toast.success(<Title level={2}>{res.result}</Title>);
      dispatch(fetchDataNghiphep(axiosClient));
    } catch (error: any) {
      toast.error(
        Array.isArray(error.response.data.message)
          ? error.response.data.message.toString()
          : error.response.data.message
      );
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const dataTable = useAppSelector(nghiphepRemainingSelector)?.nghiphep.map(
    (nghiphep: nghiphepType, index) => ({
      ...nghiphep,
      status: nghiphep.status ? "Đã Duyệt" : "Chưa Duyệt",
      key: (index + 1).toString(),
      createdAt: new Date(nghiphep.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      date: new Date(nghiphep.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      action: (
        <Flex>
          <Popover
            trigger={"hover"}
            content={<Title level={5}>Duyệt Đơn</Title>}
          >
            <span
              className="p-1"
              onClick={() => {
                handleRequestDuyetDon(nghiphep.ma_don);
              }}
            >
              <IconEyeCheck
                width="16px"
                height="16px"
                className="hover:text-gray-light cursor-pointer"
              ></IconEyeCheck>
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
    console.log(values);
    dispatch(editFilterNghiPhep(values));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  // Modal
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    dispatch(
      editFilterNghiPhep({
        ten_nhan_vien: searchParams.get("ten_nhan_vien") ?? "",
        ma_nhan_vien: searchParams.get("ma_nhan_vien") ?? "",
        ma_don: searchParams.get("ma_don") ?? "",
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="overflow-auto overscroll-contain w-full">
      <div className="px-6">
        <Flex justify="space-between" align="center" className="mb-4">
          <Flex vertical>
            <Title style={{ fontSize: "32px" }}>Danh Sách Nghỉ Phép</Title>
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
                            Mã Đơn
                          </Title>
                        }
                        name="ma_don"
                      >
                        <Input placeholder="Nhập Email Nhân Viên"></Input>
                      </Form.Item>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Flex align="center" className="p-3">
                      <Form.Item<FieldType>
                        name="da_duyet"
                        valuePropName="checked"
                      >
                        <Checkbox>
                          <Title level={3} className="w-20">
                            Đã Duyệt
                          </Title>
                        </Checkbox>
                      </Form.Item>
                      <Form.Item<FieldType>
                        name="chua_duyet"
                        valuePropName="checked"
                      >
                        <Checkbox>
                          <Title level={3} className="w-20">
                            Chưa Duyệt
                          </Title>
                        </Checkbox>
                      </Form.Item>
                    </Flex>
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
      <ModalNghiPhep open={open} setOpen={setOpen}></ModalNghiPhep>
    </div>
  );
};

export default NghiPhepPage;
