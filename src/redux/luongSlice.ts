import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { luongType } from "../type/type";
import { getAllLuong } from "../services/luongServices";
// Define a type for the slice state
export interface LuongState {
  data: {
    luongList: Array<luongType>;
    count: number;
  };
  filter: {
    ma_nhan_vien: string;
    ma_luong: string;
  };
  loading: string;
  error: string;
}
export const fetchDataLuong = createAsyncThunk(
  "luong/fetchData",
  // if you type your function argument here
  async (axiosClient: AxiosInstance) => {
    try {
      const data = await getAllLuong(axiosClient);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
// Define the initial state using that type
const initialState: LuongState = {
  data: {
    luongList: [],
    count: 0,
  },
  filter: {
    ma_nhan_vien: "",
    ma_luong: "",
  },
  loading: "idle",
  error: "",
};

export const luongSlice = createSlice({
  name: "luong",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    editFilterLuong(state, action) {
      return {
        ...state,
        filter: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataLuong.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDataLuong.fulfilled, (state, action) => {
        state.loading = "success";
        state.data = action.payload;
      })
      .addCase(fetchDataLuong.rejected, (state) => {
        state.loading = "error";
      });
  },
});

export const { editFilterLuong } = luongSlice.actions;

export default luongSlice.reducer;
