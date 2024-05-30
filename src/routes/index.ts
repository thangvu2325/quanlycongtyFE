// Layouts

// Pages
import { lazy } from "react";
import { RouteType } from "../type/type";
import routes from "../config/route";
import AuthLayout from "../layout/AuthLayout";
const Home = lazy(() => import("../page/Home"));
const LoginPage = lazy(() => import("../page/Login"));
const RegisterPage = lazy(() => import("../page/Register"));
const NhanvienPage = lazy(() => import("../page/NhanVien"));
const QuanLyChamCongPage = lazy(() => import("../page/QuanLyChamCong"));
const BangTinhLuongPage = lazy(() => import("../page/BangTinhLuong"));

const TinhLuongPage = lazy(() => import("../page/TinhLuong"));
const NghiPhepPage = lazy(() => import("../page/NghiPhep"));
const CompanyPage = lazy(() => import("../page/Company"));
// Public routes

const publicRoutes: Array<RouteType> = [
  { path: routes.home, component: Home },
  {
    path: routes.login,
    component: LoginPage,
    layout: AuthLayout,
  },
  {
    path: routes.register,
    component: RegisterPage,
    layout: AuthLayout,
  },
  {
    path: routes.nhanvien,
    component: NhanvienPage,
  },
  {
    path: routes.quanlychamcong,
    component: QuanLyChamCongPage,
  },
  {
    path: routes.tinhluong,
    component: TinhLuongPage,
  },
  {
    path: routes.nghiphep,
    component: NghiPhepPage,
  },
  {
    path: routes.company,
    component: CompanyPage,
  },
  {
    path: routes.bangtinhluong,
    component: BangTinhLuongPage,
  },
  {
    path: "*",
    component: Home,
  },
];

const privateRoutes: Array<RouteType> = [];

export { publicRoutes, privateRoutes };
