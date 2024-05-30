import { IconDownload, IconUpload } from "@tabler/icons-react";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Select,
  Space,
  theme,
} from "antd";
import Title from "antd/es/typography/Title";
import { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import { authSelector, nhanvienRemainingSelector } from "../../redux/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { nhanvienType } from "../../type/type";
import { tinhLuong } from "../../services/nhanvienService";
import { createAxios } from "../../services/createInstance";
import { loginSuccess } from "../../redux/authSlice";

interface TinhLuongPageProps {}
type FieldType = {
  ma_nhan_vien?: string;
  month?: string;
  ngay_lam_viec?: string;
  isTet?: boolean;
};
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
const TinhLuongPage: FunctionComponent<TinhLuongPageProps> = () => {
  const [luong, setLuong] = useState<{ salary: number }>();
  const [month, setMonth] = useState<number>(0);
  const [nhanvien, setNhanvien] = useState<nhanvienType>();
  const nhanvienList = useAppSelector(nhanvienRemainingSelector).nhanvien;
  const { token } = theme.useToken();
  const tokenData = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(tokenData, dispatch, loginSuccess);
  const handleChangeMonth = (value: number) => {
    setMonth(value);
  };
  const onFinish = async (values: any) => {
    try {
      const data = await tinhLuong(axiosClient, values);
      if (data) {
        setLuong(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="overflow-auto overscroll-contain pb-4">
      <div className="px-6">
        <Flex justify="space-between" align="center" className="mb-4">
          <Flex vertical>
            <Title style={{ fontSize: "32px" }}>Quản Lý Lương</Title>
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
        </Flex>
        <div className="w-full">
          <Form
            className="p-4 bg-[#fff] rounded-lg shadow-lg"
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "80px 0",
              paddingBottom: "40px",
            }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Flex className="ml-auto" justify="center">
              <div className="mx-4 w-1/2">
                <Form.Item<FieldType>
                  label={
                    <Title level={2} className="w-56 text-left">
                      Mã Nhân Viên
                    </Title>
                  }
                  name="ma_nhan_vien"
                  rules={[
                    { required: true, message: "Please input this Field!" },
                  ]}
                >
                  <Select
                    style={{ width: "200px" }}
                    showSearch
                    onChange={(value) =>
                      setNhanvien(
                        nhanvienList.find(
                          (nhanvien) => nhanvien.ma_nhan_vien === value
                        )
                      )
                    }
                    placeholder="Select a month"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={nhanvienList.map((nhanvien) => {
                      return {
                        label: nhanvien.ma_nhan_vien,
                        value: nhanvien.ma_nhan_vien,
                      };
                    })}
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  label={
                    <Title level={2} className="w-56 text-left">
                      Tháng
                    </Title>
                  }
                  name="month"
                  rules={[
                    { required: true, message: "Please input this Field!" },
                  ]}
                >
                  <Select
                    style={{ width: "200px" }}
                    showSearch
                    placeholder="Select a month"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    onChange={handleChangeMonth}
                    options={[
                      { label: "Tháng 1", value: "1" },
                      { label: "Tháng 2", value: "2" },
                      { label: "Tháng 3", value: "3" },
                      { label: "Tháng 4", value: "4" },
                      { label: "Tháng 5", value: "5" },
                      { label: "Tháng 6", value: "6" },
                      { label: "Tháng 7", value: "7" },
                      { label: "Tháng 8", value: "8" },
                      { label: "Tháng 9", value: "9" },
                      { label: "Tháng 10", value: "10" },
                      { label: "Tháng 11", value: "11" },
                      { label: "Tháng 12", value: "12" },
                    ]}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  label={
                    <Title level={2} className="w-56 text-left">
                      Công Chuẩn
                    </Title>
                  }
                  name="ngay_lam_viec"
                  rules={[
                    { required: true, message: "Please input this Field!" },
                  ]}
                >
                  <Input
                    className="w-[200px]"
                    placeholder="Nhập Ngày Công Chuẩn"
                  ></Input>
                </Form.Item>
                <Form.Item<FieldType>
                  name="isTet"
                  valuePropName="checked"
                  wrapperCol={{ offset: 2, span: 16 }}
                  style={{ marginRight: "auto" }}
                >
                  <Checkbox>
                    <Title level={2} className="w-56 text-left">
                      Thưởng Tết
                    </Title>
                  </Checkbox>
                </Form.Item>
              </div>
              <div className="mx-4 w-[256px]">
                <Flex align="center">
                  <Title level={2} className="w-28">
                    Tên Nhân Viên:
                  </Title>
                  <span className="ml-4">{nhanvien?.ten_nhan_vien}</span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Mã Nhân Viên:
                  </Title>
                  <span className="ml-4">{nhanvien?.ma_nhan_vien}</span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Ngày Công:
                  </Title>
                  <span className="ml-4">
                    {nhanvien?.cham_cong?.filter(
                      (ngaycong: string) =>
                        new Date(ngaycong).getMonth() === month - 1
                    )?.length ?? ""}
                  </span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Lương Cơ bản:
                  </Title>
                  <span className="ml-4">
                    {nhanvien?.salary_basic
                      ? `${Number(nhanvien?.salary_basic).toLocaleString()} VND`
                      : ""}
                  </span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Chức Vụ:
                  </Title>
                  <span className="ml-4">{nhanvien?.chuc_vu}</span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Phòng Ban
                  </Title>
                  <span className="ml-4">{nhanvien?.phong_ban}</span>
                </Flex>
              </div>
            </Flex>

            <Form.Item
              wrapperCol={{ span: 16 }}
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <Flex align="center" justify="center">
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: token.colorPrimary }}
                  className="mr-4"
                >
                  Tính Lương
                </Button>
                <Flex align="center">
                  <Title level={2}>Lương:</Title>
                  <span className="ml-4">
                    {luong ? luong?.salary.toLocaleString() + " VND" : ""}
                  </span>
                </Flex>
              </Flex>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default TinhLuongPage;
