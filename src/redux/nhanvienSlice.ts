import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { nhanvienType } from "../type/type";
import { AxiosInstance } from "axios";
import { getAllNhanVien } from "../services/nhanvienService";
// Define a type for the slice state
export interface NhanvienState {
  data: {
    nhanvien: Array<nhanvienType>;
    count: number;
  };
  filter: {
    ten_nhan_vien: string;
    ma_nhan_vien: string;
    email: string;
    so_dien_thoai: string;
    ma_cong_ty: string;
  };
  loading: string;
  error: string;
}
export const fetchDataNhanvien = createAsyncThunk(
  "nhanvien/fetchData",
  // if you type your function argument here
  async (axiosClient: AxiosInstance) => {
    try {
      const data = await getAllNhanVien(axiosClient);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
// Define the initial state using that type
const initialState: NhanvienState = {
  data: {
    nhanvien: [],
    count: 0,
  },
  filter: {
    ten_nhan_vien: "",
    ma_nhan_vien: "",
    email: "",
    so_dien_thoai: "",
    ma_cong_ty: "",
  },
  loading: "idle",
  error: "",
};

export const NhanvienSlice = createSlice({
  name: "nhanvien",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    editFilter(state, action) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataNhanvien.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDataNhanvien.fulfilled, (state, action) => {
        state.loading = "success";
        state.data = action.payload;
      })
      .addCase(fetchDataNhanvien.rejected, (state) => {
        state.loading = "error";
      });
  },
});

export const { editFilter } = NhanvienSlice.actions;

export default NhanvienSlice.reducer;
