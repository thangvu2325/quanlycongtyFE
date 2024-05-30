import { Flex, Layout, Typography } from "antd";
import { Header, Content } from "antd/es/layout/layout";
import { FunctionComponent, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import { authorizationSelector } from "../../redux/selectors";
import { ToastContainer } from "react-toastify";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FunctionComponent<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(authorizationSelector);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return (
    <Layout>
      <Header>
        <Flex align="center" className="max-w-7xl  mx-auto h-14">
          <Typography.Title italic>Work Flow Hub</Typography.Title>
        </Flex>
      </Header>
      <Content className="w-full h-screen">{children}</Content>
      <ToastContainer />
    </Layout>
  );
};

export default AuthLayout;
