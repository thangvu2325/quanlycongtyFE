import {
  IconChevronDown,
  IconDownload,
  IconHttpDelete,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Tag,
  notification,
} from "antd";
import Title from "antd/es/typography/Title";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authSelector, companyRemainingSelector } from "../../redux/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import Table, { ColumnsType } from "antd/es/table";
import { companyType } from "../../type/type";
import ModalCompany from "./ModalCompany";
import { createAxios } from "../../services/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { editFilterCompany, fetchDataCompany } from "../../redux/companySlice";
import { deleteCompany } from "../../services/companySecvice";
interface CompanyPageProps {}
type FieldType = {
  ten_cong_ty: string;
  ma_cong_ty: string;
};
interface DataType {
  key: string;
  ma_cong_ty: string;
  ten_cong_ty: string;
}
const options = ["gold", "lime", "green", "cyan"];
const columns: ColumnsType<DataType> = [
  {
    title: "#",
    dataIndex: "key",
    sortDirections: ["descend"],
  },
  {
    title: "Mã Công Ty",
    dataIndex: "ma_cong_ty",
  },
  {
    title: "Tên Công Ty",
    dataIndex: "ten_cong_ty",
  },
  {
    title: "Phòng Ban",
    dataIndex: "phong_ban",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];
const CompanyPage: FunctionComponent<CompanyPageProps> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const tokenData = useAppSelector(authSelector);
  const [api, contextHolder] = notification.useNotification();
  const refDiv = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(tokenData, dispatch, loginSuccess);
  const deleteCompanyRequest = async (id: string) => {
    try {
      await deleteCompany(axiosClient, id);
      api["success"]({
        message: "Thêm Công Ty Thành Công!",
      });
      dispatch(fetchDataCompany(axiosClient));
    } catch (error) {
      api["error"]({
        message: "Xóa Công Ty Thất Bại!",
      });
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const dataTable = useAppSelector(companyRemainingSelector).companyList.map(
    (company: companyType, index) => {
      return {
        ...company,
        key: (index + 1).toString(),
        phong_ban: company.phong_ban
          ? company.phong_ban.map((phongban: string) => (
              <Tag
                color={options[Math.floor(Math.random() * 4)]}
                style={{ marginRight: 3 }}
                key={phongban} // Add a unique key for each Tag
              >
                {phongban}
              </Tag>
            ))
          : [],
        action: (
          <Flex>
            <Popover
              trigger={"hover"}
              content={<Title level={5}>Delete</Title>}
            >
              <span
                className="p-1"
                onClick={() => {
                  deleteCompanyRequest(company.id);
                }}
              >
                <IconHttpDelete
                  width="16px"
                  height="16px"
                  className="hover:text-gray-light cursor-pointer"
                ></IconHttpDelete>
              </span>
            </Popover>
          </Flex>
        ),
      };
    }
  );
  const handleToggleShowSearchBox = () => {
    if (refDiv.current) {
      refDiv.current.classList.toggle("h-48");
    }
  };
  const onFinish = async (values: any) => {
    setSearchParams(values);
    dispatch(editFilterCompany(values));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  // Modal
  useEffect(() => {
    dispatch(
      editFilterCompany({
        ten_cong_ty: searchParams.get("ten_cong_ty") ?? "",
        ma_cong_ty: searchParams.get("ma_cong_ty") ?? "",
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-auto overscroll-contain pb-4">
      <div className="px-6">
        {contextHolder}
        <Flex justify="space-between" align="center" className="mb-4">
          <Flex vertical>
            <Title style={{ fontSize: "32px" }}>Thêm Công Ty</Title>
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
                  ma_cong_ty: searchParams.get("ma_cong_ty") ?? "",
                  ten_cong_ty: searchParams.get("ten_cong_ty") ?? "",
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
                            Mã Công Ty
                          </Title>
                        }
                        name="ma_cong_ty"
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
                            Tên Công Ty
                          </Title>
                        }
                        name="ten_cong_ty"
                      >
                        <Input placeholder="Nhập Mã Nhân Viên"></Input>
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
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
      <ModalCompany open={open} setOpen={setOpen}></ModalCompany>
    </div>
  );
};
export default CompanyPage;
