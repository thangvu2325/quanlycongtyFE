import { AxiosInstance } from "axios";

export const updateLuongNhanVen = async (
  axiosClient: AxiosInstance,
  month: number,
  cong_chuan: number
) => {
  try {
    await axiosClient.post("/tinhluong", {
      month,
      cong_chuan,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getAllLuong = async (axiosClient: AxiosInstance) => {
  try {
    const res = await axiosClient.get("/tinhluong");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
