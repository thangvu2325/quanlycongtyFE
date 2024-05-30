import { AxiosInstance } from "axios";

export const getAllCompany = async (axiosClient: AxiosInstance) => {
  try {
    const res = await axiosClient.get("/company");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const addCompany = async (
  axiosClient: AxiosInstance,
  company: {
    ten_cong_ty: string;
    phong_ban: Array<string>;
    chuc_vu: Array<string>;
  }
) => {
  try {
    await axiosClient.post("/company", company);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const deleteCompany = async (axiosClient: AxiosInstance, id: string) => {
  try {
    const res = await axiosClient.delete(`/company/${id}`, {});
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
