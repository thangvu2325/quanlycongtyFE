import { Button, Checkbox, Flex, Form, Space, theme } from "antd";
import Title from "antd/es/typography/Title";
import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../../services/userService";
import { useAppDispatch } from "../../redux/hook";
interface RegisterPageProps {}
type FieldType = {
  email?: string;
  password?: string;
  rule?: string;
};
const RegisterPage: FunctionComponent<RegisterPageProps> = () => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const { rule, ...user } = values;
    try {
      await registerRequest(user, navigate, dispatch);
    } catch (error) {
      console.log("err:" + error);
      return false;
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Flex className="py-[120px] mx-auto" justify="center">
      <Form
        className=" bg-[#fff] w-[552px] shadow-lg px-[24px] py-[32px] rounded-[20px]"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Space direction="vertical" className="mb-[32px]">
          <Title level={1}>Register</Title>
          <Flex>
            <Title
              level={3}
              style={{ color: token.colorTextSecondary, fontWeight: "400" }}
            >
              Already have an account?
            </Title>
            <Link to={"/login"}>
              <Title
                level={3}
                style={{ color: token.colorLink, fontWeight: "400" }}
                className="ml-2"
              >
                Log in
              </Title>
            </Link>
          </Flex>
        </Space>
        <Form.Item<FieldType>
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Flex
            vertical
            className="border-2 border-solid border-[#e5e7eb] rounded-lg focus-within:border-[#6366f1] focus-within:shadow-blue shadow-sm pb-[8px]"
          >
            <Title
              level={4}
              className={`font-medium leading-[1.4375em] select-none pt-1 px-[12px]`}
              style={{ color: token.colorTextSecondary }}
            >
              Email Address
            </Title>
            <input type="email " className="outline-none px-[12px] " />
          </Flex>
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          className="mb-[6px]"
        >
          <Flex
            vertical
            className="border-2 border-solid border-[#e5e7eb] rounded-lg focus-within:border-[#6366f1] focus-within:shadow-blue shadow-sm  pb-[8px]"
          >
            <Title
              level={4}
              className={`font-medium leading-[1.4375em] select-none pt-1 px-3`}
              style={{ color: token.colorTextSecondary }}
            >
              Password
            </Title>
            <input type="password" className="outline-none px-[12px]" />
          </Flex>
        </Form.Item>
        <Form.Item<FieldType>
          name="rule"
          valuePropName="checked"
          className="ml-3 mb-[6px]"
        >
          <Checkbox>I have read the Terms and Conditions</Checkbox>
        </Form.Item>
        <Form.Item className="w-full mt-[16px]">
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: token.colorPrimary }}
            className=" block w-full hover:bg-[#4338ca] h-[48px] rounded-xl"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default RegisterPage;
