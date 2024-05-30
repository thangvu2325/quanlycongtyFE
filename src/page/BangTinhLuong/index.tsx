import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { Button, Col, Flex, Form, Input, Row, Space, notification } from "antd";
import Title from "antd/es/typography/Title";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { authSelector, luongRemainingSelector } from "../../redux/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import Table, { ColumnsType } from "antd/es/table";
import { luongType } from "../../type/type";
import { createAxios } from "../../services/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { updateLuongNhanVen } from "../../services/luongServices";
import { editFilterLuong, fetchDataLuong } from "../../redux/luongSlice";
interface BangTinhLuongPageProps {}
type FieldType = {
  ma_nhan_vien: string;
  ma_luong: string;
};
interface DataType {
  key: string;
  ma_luong: string;
  month: number;
  cong_chuan: number;
  luong: number;
  thuong: number;
  salary_basic: number;
  ma_nhan_vien: string;
}
const columns: ColumnsType<DataType> = [
  {
    title: "#",
    dataIndex: "key",
    sortDirections: ["descend"],
  },
  {
    title: "Mã Lương",
    dataIndex: "ma_luong",
  },
  {
    title: "Mã Nhân Viên",
    dataIndex: "ma_nhan_vien",
  },
  {
    title: "Công Chuẩn",
    dataIndex: "cong_chuan",
  },
  {
    title: "Tháng",
    dataIndex: "month",
  },
  {
    title: "Thưởng",
    dataIndex: "thuong",
  },
  {
    title: "Lương cơ bản",
    dataIndex: "salary_basic",
  },
  {
    title: "Lương",
    dataIndex: "luong",
  },
];
const BangTinhLuongPage: FunctionComponent<BangTinhLuongPageProps> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const tokenData = useAppSelector(authSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const refDiv = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(tokenData, dispatch, loginSuccess);
  const [searchParams, setSearchParams] = useSearchParams();
  const dataTable = useAppSelector(luongRemainingSelector).luongList.map(
    (luong: luongType, index) => {
      return {
        ...luong,
        key: (index + 1).toString(),
      };
    }
  );
  const handleToggleShowSearchBox = () => {
    if (refDiv.current) {
      refDiv.current.classList.toggle("h-48");
    }
  };
  const updateLuong = async (values: { month: number; cong_chuan: number }) => {
    try {
      setLoading(true);
      await updateLuongNhanVen(axiosClient, values.month, values.cong_chuan);
      setLoading(false);
      dispatch(fetchDataLuong(axiosClient));
      api.success({ message: "Cập nhập thành công!" });
      dispatch(fetchDataLuong(axiosClient));
    } catch (error: any) {
      console.log(error);
      api.error({
        message: Array.isArray(error.response.data.message)
          ? error.response.data.message.toString()
          : error.response.data.message,
      });

      throw error;
    }
  };
  const onFinish = async (values: any) => {
    dispatch(editFilterLuong(values));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  // Modal
  useEffect(() => {
    dispatch(
      editFilterLuong({
        ma_nhan_vien: searchParams.get("ma_nhan_vien") ?? "",
        ma_luong: searchParams.get("ma_luong") ?? "",
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
            <Title style={{ fontSize: "32px" }}>Bảng Lương</Title>
            <Flex className="mt-2">
              <Title level={3}>
                <Form onFinish={updateLuong}>
                  <Flex align="center">
                    <Flex align="center">
                      <span className="mr-2">Công Chuẩn:</span>
                      <Form.Item<{ cong_chuan: string; month: string }>
                        name="cong_chuan"
                        style={{ margin: 0, marginRight: "8px" }}
                      >
                        <Input
                          type="number"
                          placeholder="Công chuẩn"
                          style={{ width: "160px" }}
                        ></Input>
                      </Form.Item>
                    </Flex>
                    <Flex align="center">
                      <span className="mr-2">Tháng:</span>
                      <Form.Item<{ cong_chuan: string; month: string }>
                        name="month"
                        style={{ margin: 0, marginRight: "8px" }}
                      >
                        <Input
                          type="number"
                          placeholder="Tháng"
                          style={{ width: "160px" }}
                        ></Input>
                      </Form.Item>
                    </Flex>
                    <Button
                      htmlType="submit"
                      type="primary"
                      style={{ marginLeft: "20px" }}
                      loading={loading}
                    >
                      Cập Nhật Lương
                    </Button>
                  </Flex>
                </Form>
              </Title>
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
                  ma_nhan_vien: searchParams.get("ma_nhan_vien") ?? "",
                  ma_luong: searchParams.get("ma_luong") ?? "",
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
                            Mã Nhân Viên
                          </Title>
                        }
                        name="ma_nhan_vien"
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
                            Mã Lương
                          </Title>
                        }
                        name="ma_luong"
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
    </div>
  );
};
export default BangTinhLuongPage;
