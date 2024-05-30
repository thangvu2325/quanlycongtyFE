import { AxiosInstance } from "axios";

export const getAllNhanVien = async (axiosClient: AxiosInstance) => {
  try {
    const res = await axiosClient.get("/nhanvien");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getNhanvienByMaNhanVien = async (
  axiosClient: AxiosInstance,
  ma_nhan_vien: string
) => {
  try {
    const res = await axiosClient.get(`/nhanvien/${ma_nhan_vien}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const updateRoles = async (
  axiosClient: AxiosInstance,
  email: string,
  action: "up" | "down" = "up",
  roles: string
) => {
  try {
    const res = await axiosClient.post(`/users/${email}/roles`, {
      action,
      roles,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const addNhanVien = async (
  axiosClient: AxiosInstance,
  nhanvien: {
    firstName: string;
    lastName: string;
    email: string;
    so_dien_thoai: string;
    chuc_vu: string;
    phong_ban: string;
    ma_cong_ty: string;
  }
) => {
  try {
    const res = await axiosClient.post("/nhanvien", nhanvien);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const tinhLuong = async (
  axiosClient: AxiosInstance,
  body: {
    ma_nhan_vien?: string;
    month?: string;
    ngay_lam_viec?: string;
    isTet?: boolean;
  }
) => {
  try {
    const res = await axiosClient.post("/nhanvien/tinhLuong", body);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const chamcong = async (
  axiosClient: AxiosInstance,
  ma_nhan_vien: string,
  date?: string
) => {
  try {
    const res = await axiosClient.post(`/nhanvien/tinhluong/${ma_nhan_vien}`, {
      date,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// Nghi phep
export const getAllRequestNghiPhep = async (axiosClient: AxiosInstance) => {
  try {
    const res = await axiosClient.get("/nghiphep");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const createRequestNghiViec = async (
  axiosClient: AxiosInstance,
  nghiphepData: {
    ma_nhan_vien: string;
    li_do: string;
    date: string;
  }
) => {
  try {
    const res = await axiosClient.post(`/nghiphep`, nghiphepData);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const confirmRequestNghiPhep = async (
  axiosClient: AxiosInstance,
  ma_don: string
) => {
  try {
    const res = await axiosClient.post(`/nghiphep/${ma_don}`, {});
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
