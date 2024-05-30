import { ComponentType } from "react";

type RouteType = {
  path: string;
  component: ComponentType;
  layout?: any;
};
type iconType = {
  width?: string;
  height?: string;
  className?: string;
};
type userType = {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
  roles: string;
  ma_nhan_vien: string;
  ma_cong_ty: string;
};
type userRegister = {
  email: string;
  password: string;
};
type nhanvienType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ma_nhan_vien: string;
  ten_nhan_vien: string;
  ma_cong_ty: string;
  email: string;
  so_dien_thoai: string;
  chuc_vu: string;
  phong_ban: string;
  cham_cong: Array<string>;
  salary_basic: string;
  salary_Ot: string;
  roles: string;
};
type nghiphepType = {
  id: string;
  ma_don: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ma_nhan_vien: string;
  ten_nhan_vien: string;
  status: boolean;
  date: Date;
  li_do: string;
};
type companyType = {
  id: string;
  createdAt: string;
  ma_cong_ty: string;
  updatedAt: string;
  deletedAt: string;
  ten_cong_ty: string;
  phong_ban: Array<string>;
  chuc_vu: Array<string>;
};
type luongType = {
  id: string;
  ma_luong: string;
  month: number;
  cong_chuan: 20;
  luong: number;
  thuong: number;
  salary_basic: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ma_nhan_vien: string;
};
