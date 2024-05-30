import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  notification,
  theme,
} from "antd";
import Modal from "antd/es/modal/Modal";
import Title from "antd/es/typography/Title";
import { Dispatch, FunctionComponent, useCallback, useState } from "react";
import { addNhanVien } from "../../services/nhanvienService";
import { createAxios } from "../../services/createInstance";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  authSelector,
  companySelector,
  settingsSelector,
} from "../../redux/selectors";
import { loginSuccess } from "../../redux/authSlice";
import DropdownSelect from "./DropdownSelect";
import { fetchDataNhanvien } from "../../redux/nhanvienSlice";
interface ModalNhanVienProps {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}
type FieldType = {
  firstName: string;
  lastName: string;
  email: string;
  so_dien_thoai: string;
  chuc_vu: string;
  phong_ban: string;
};
const ModalNhanVien: FunctionComponent<ModalNhanVienProps> = ({
  open,
  setOpen,
}) => {
  const { token } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const [chucVu, setChucVu] = useState<string>("");
  const [phongBan, setPhongBan] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const ma_cong_ty = useAppSelector(settingsSelector).ma_cong_ty;
  const authData = useAppSelector(authSelector);
  const companyData = useAppSelector(companySelector);
  const companySelect = companyData.data.companys.find(
    (company) => company.id === ma_cong_ty
  );
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(authData, dispatch, loginSuccess);
  const onFinish = async (values: FieldType) => {
    setLoading(true);
    const res = await addNhanVien(axiosClient, {
      ...values,
      chuc_vu: chucVu,
      phong_ban: phongBan,
      ma_cong_ty: ma_cong_ty,
    });
    api["success"]({
      message: "Thêm Nhân Viên Thành Công!",
      description: (
        <span>
          Nhân Viên Đã Thêm: {values.lastName + values.firstName}
          <br />
          Email là: {values.email}
          <br />
          Mật Khẩu là: {res.password}
          <br />
          Thông tin tài khoản mật khẩu đã được gửi tới email: {values.email}
        </span>
      ),
    });
    dispatch(fetchDataNhanvien(axiosClient));
    setLoading(false);
    try {
    } catch (error) {}
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  //  Dropdown Select

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeChucvu = useCallback((value: string) => setChucVu(value), []);
  const changePhongBan = useCallback((value: string) => setPhongBan(value), []);
  return (
    <Modal
      open={open}
      title={<Title level={1}>Thêm Nhân Viên </Title>}
      onCancel={() => {
        setOpen(false);
      }}
      footer={[]}
    >
      {contextHolder}
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={16}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={<Title level={3}>Họ và Tên Đệm</Title>}
                name="lastName"
                style={{ marginBottom: "0" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your Họ và Tên Đệm!",
                  },
                ]}
              >
                <Input placeholder="Nhập Họ Tên Đệm"></Input>
              </Form.Item>
            </Space>
          </Col>
          <Col span={8}>
            <Space className="p-3 pl-0">
              <Form.Item<FieldType>
                label={<Title level={3}>Tên</Title>}
                name="firstName"
                style={{ marginBottom: "0" }}
                rules={[{ required: true, message: "Please input your Tên!" }]}
              >
                <Input placeholder="Nhập Tên"></Input>
              </Form.Item>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={3} className="w-[94.8px] text-left">
                    Số Điện Thoại
                  </Title>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input your Số Điện Thoại!",
                  },
                ]}
                name="so_dien_thoai"
                style={{ marginBottom: "0" }}
              >
                <Input
                  placeholder="Nhập Số Điện Thoại"
                  style={{ width: "165.94px" }}
                ></Input>
              </Form.Item>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={3} className="w-[94.8px] text-left">
                    Email
                  </Title>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
                name="email"
                style={{ marginBottom: "0" }}
              >
                <Input
                  style={{ width: "165.94px" }}
                  placeholder="Nhập Email Nhân Viên"
                ></Input>
              </Form.Item>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={3} className="w-[106px] text-left">
                    Phòng Ban
                  </Title>
                }
                style={{ marginBottom: "0" }}
              >
                <DropdownSelect
                  handleChangeSelect={changePhongBan}
                  option={companySelect?.phong_ban ?? []}
                ></DropdownSelect>
              </Form.Item>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={3} className="w-[106px] text-left">
                    Chức Vụ
                  </Title>
                }
                initialValue={chucVu}
                style={{ marginBottom: "0" }}
              >
                <DropdownSelect
                  handleChangeSelect={changeChucvu}
                  option={companySelect?.chuc_vu ?? []}
                ></DropdownSelect>
              </Form.Item>
            </Space>
          </Col>
        </Row>

        <div className="text-right mt-4">
          <Button
            key="back"
            onClick={() => {
              setOpen(false);
            }}
          >
            Quay Lại
          </Button>
          <Button
            htmlType="submit"
            key="submit"
            type="primary"
            loading={loading}
            style={{ background: token.colorPrimary, marginLeft: "16px" }}
          >
            Thêm
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalNhanVien;
