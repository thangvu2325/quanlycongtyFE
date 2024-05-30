import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  theme,
} from "antd";
import Modal from "antd/es/modal/Modal";
import { Dayjs } from "dayjs";
import Title from "antd/es/typography/Title";
import { Dispatch, FunctionComponent, useState } from "react";
import { createRequestNghiViec } from "../../services/nhanvienService";
import { createAxios } from "../../services/createInstance";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { authSelector, nhanvienRemainingSelector } from "../../redux/selectors";
import { loginSuccess } from "../../redux/authSlice";
import { toast } from "react-toastify";
import { fetchDataNghiphep } from "../../redux/nghiphepSlice";
interface ModalNghiPhepProps {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}
type FieldType = {
  ma_nhan_vien: string;
  li_do: string;
  date: Date;
};
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
const ModalNghiPhep: FunctionComponent<ModalNghiPhepProps> = ({
  open,
  setOpen,
}) => {
  const nhanvienList = useAppSelector(nhanvienRemainingSelector).nhanvien;
  const { token } = theme.useToken();
  const [loading, setLoading] = useState<boolean>(false);
  const authData = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(authData, dispatch, loginSuccess);
  const onFinish = async (values: {
    ma_nhan_vien: string;
    li_do: string;
    date: Dayjs;
  }) => {
    setLoading(true);
    setLoading(false);
    toast.success(
      <Title level={3} style={{ color: token.colorPrimary }}>
        Thêm Thành Công
      </Title>
    );
    // console.log(values.date.format("MM-DD-YYYY").toString());
    try {
      await createRequestNghiViec(axiosClient, {
        ...values,
        date: values.date.format("MM-DD-YYYY").toString(),
      });
      dispatch(fetchDataNghiphep(axiosClient));
    } catch (error) {
      toast.error(
        <Title level={3} style={{ color: "red" }}>
          Thêm Thất Bại
        </Title>
      );
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      open={open}
      title={<Title level={1}>Tạo Đơn Nghỉ Phép</Title>}
      onCancel={() => {
        setOpen(false);
      }}
      footer={[]}
    >
      <Form
        name="FormNghiPhep"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={3} className="w-28 text-left">
                    Mã Nhân Viên
                  </Title>
                }
                rules={[
                  {
                    required: true,
                    message: "Làm ơn nhập mã nhân viên!",
                  },
                ]}
                name="ma_nhan_vien"
                style={{ marginBottom: "0" }}
              >
                <Select
                  style={{ width: "200px" }}
                  showSearch
                  placeholder="Select a ma_nhan_vien"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={nhanvienList.map((nhanvien) => ({
                    value: nhanvien.ma_nhan_vien,
                    label: nhanvien.ma_nhan_vien,
                  }))}
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
                  <Title level={3} className="w-28 text-left">
                    Lí Do Nghỉ
                  </Title>
                }
                rules={[
                  {
                    required: true,
                    message: "Làm ơn điền vào lí do nghỉ!",
                  },
                ]}
                name="li_do"
                style={{ marginBottom: "0" }}
              >
                <Input.TextArea
                  placeholder="Nhập Lí Do Nghỉ"
                  style={{ width: "200px" }}
                ></Input.TextArea>
              </Form.Item>
            </Space>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Space className="p-3">
              <Form.Item<FieldType>
                label={
                  <Title level={3} className="w-28 text-left">
                    Ngày Nghỉ
                  </Title>
                }
                rules={[
                  {
                    required: true,
                    message: "Làm ơn chọn ngày nghỉ!",
                  },
                ]}
                name="date"
                style={{ marginBottom: "0" }}
              >
                <DatePicker
                  placeholder="Chọn ngày nghỉ"
                  style={{ width: "200px" }}
                />
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

export default ModalNghiPhep;
