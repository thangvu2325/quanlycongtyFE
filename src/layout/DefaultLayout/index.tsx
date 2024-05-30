import { FunctionComponent, ReactNode, Suspense, useEffect } from "react";
import { Layout } from "antd";
import Loading from "../../components/Loading/Loading";
import { Content } from "antd/es/layout/layout";
import HeaderComponent from "../components/HeaderComponent";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  authSelector,
  authorizationSelector,
  settingsSelector,
} from "../../redux/selectors";
import SiderComponent from "../components/SiderComponent";
import { fetchDataNhanvien } from "../../redux/nhanvienSlice";
import { createAxios } from "../../services/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { editCompany, toggleSidebarState } from "../../redux/settingsSlice";
import { fetchDataNghiphep } from "../../redux/nghiphepSlice";
import { fetchDataCompany } from "../../redux/companySlice";
import { fetchDataLuong } from "../../redux/luongSlice";
import { ToastContainer } from "react-toastify";
interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const authData = useAppSelector(authSelector);
  const {
    isAuthenticated,
    isAdministratorOrModerator,
    isAdministratorOrModeratorOrQuanLy,
    user,
    isQuanLy,
  } = useAppSelector(authorizationSelector);

  useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useAppDispatch();
  const axiosClient = createAxios(authData, dispatch, loginSuccess);
  useEffect(() => {
    if (isAdministratorOrModeratorOrQuanLy) {
      dispatch(fetchDataNhanvien(axiosClient));
      dispatch(fetchDataNghiphep(axiosClient));
      dispatch(fetchDataLuong(axiosClient));
      if (isQuanLy) {
        dispatch(editCompany(user.ma_cong_ty));
      }
    }
    if (isAdministratorOrModerator) {
      dispatch(fetchDataCompany(axiosClient));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const sideBarState = useAppSelector(settingsSelector).sideBarState;
  return (
    <Suspense fallback={<Loading />}>
      <div
        className={`bg-[rgba(17,25,39,0.75)] fixed top-0 hidden left-0 right-0 bottom-0 z-[5] ${
          sideBarState ? "max-lg:block" : "max-lg:hidden"
        }`}
        onClick={() => {
          dispatch(toggleSidebarState());
        }}
      ></div>
      <Layout style={{ width: "100%" }} className="flex flex-row">
        <SiderComponent></SiderComponent>
        <div className="w-full">
          <HeaderComponent></HeaderComponent>
          <Content className="pt-14">{children}</Content>
        </div>
      </Layout>
      <ToastContainer />
    </Suspense>
  );
};

export default DefaultLayout;
