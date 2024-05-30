import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  notification,
  theme,
} from "antd";
import Modal from "antd/es/modal/Modal";
import Title from "antd/es/typography/Title";
import { Dispatch, FunctionComponent, useState } from "react";
import { createAxios } from "../../services/createInstance";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { authSelector } from "../../redux/selectors";
import { loginSuccess } from "../../redux/authSlice";
import { addCompany } from "../../services/companySecvice";
import { fetchDataCompany } from "../../redux/companySlice";
interface ModalCompanyProps {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}
type FieldType = {
  ten_cong_ty: string;
  phong_ban: Array<string>;
  chuc_vu: Array<string>;
};
const ModalCompany: FunctionComponent<ModalCompanyProps> = ({
  open,
  setOpen,
}) => {
  const { token } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const authData = useAppSelector(authSelector);

  const dispatch = useAppDispatch();
  const axiosClient = createAxios(authData, dispatch, loginSuccess);
  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      await addCompany(axiosClient, values);
      api["success"]({
        message: "Thêm Công Ty Thành Công!",
        description: <span>Công Ty Đã Thêm: {values.ten_cong_ty}</span>,
      });
      dispatch(fetchDataCompany(axiosClient));
      setLoading(false);
    } catch (error) {
      api["error"]({
        message: "Thêm Công Ty Thất Bại!",
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
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
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={2} className="w-28 text-left">
                    Tên Công Ty
                  </Title>
                }
                name="ten_cong_ty"
                rules={[
                  { required: true, message: "Làm ơn nhập tên công ty!" },
                ]}
              >
                <Input
                  placeholder="Nhập tên công ty"
                  style={{ width: "208px" }}
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
                  <Title level={2} className="w-28 text-left">
                    Phòng Ban
                  </Title>
                }
                name="phong_ban"
                rules={[
                  { required: true, message: "Làm ơn nhập tên công ty!" },
                ]}
              >
                <Select
                  style={{ width: "208px" }}
                  mode="multiple"
                  options={[
                    { value: "Ban giám đốc" },
                    { value: "Ban quản lý" },
                    { value: "Ban sản xuất" },
                    { value: "Marketing" },
                    { value: "Nhân sự" },
                    { value: "Tài chính kế toán" },
                    { value: "Kỹ Thuật và Công Nghệ" },
                  ]}
                />
              </Form.Item>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={2} className="w-28 text-left">
                    Chức Vụ
                  </Title>
                }
                name="chuc_vu"
                rules={[
                  { required: true, message: "Làm ơn nhập tên công ty!" },
                ]}
              >
                <Select
                  style={{ width: "208px" }}
                  mode="multiple"
                  options={[
                    { value: "Trưởng phòng bộ phận" },
                    { value: "Tổ trưởng" },
                    { value: "Nhân viên" },
                  ]}
                />
              </Form.Item>
            </Space>
          </Col>
        </Row>

        <Flex align="center" justify="end">
          <Button
            type="primary"
            htmlType="submit"
            style={{ background: token.colorPrimary }}
            className="mr-4"
            loading={loading}
          >
            Thêm Công Ty
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ModalCompany;
