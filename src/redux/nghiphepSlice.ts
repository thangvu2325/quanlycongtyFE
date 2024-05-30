import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { nghiphepType } from "../type/type";
import { AxiosInstance } from "axios";
import { getAllRequestNghiPhep } from "../services/nhanvienService";
// Define a type for the slice state
export interface NghiPhepState {
  data: {
    nghiphep: Array<nghiphepType>;
    count: number;
  };
  filter: {
    ten_nhan_vien: string;
    ma_nhan_vien: string;
    ma_don: string;
    da_duyet: boolean;
    chua_duyet: boolean;
  };
  loading: string;
}
export const fetchDataNghiphep = createAsyncThunk(
  "nghiphep/fetchData",
  // if you type your function argument here
  async (axiosClient: AxiosInstance) => {
    try {
      const data = await getAllRequestNghiPhep(axiosClient);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
// Define the initial state using that type
const initialState: NghiPhepState = {
  data: {
    nghiphep: [],
    count: 0,
  },
  filter: {
    ten_nhan_vien: "",
    ma_nhan_vien: "",
    ma_don: "",
    da_duyet: false,
    chua_duyet: false,
  },
  loading: "idle",
};

export const nghiphepSlice = createSlice({
  name: "nghiphep",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    editFilterNghiPhep(state, action) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataNghiphep.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDataNghiphep.fulfilled, (state, action) => {
        state.loading = "success";
        state.data = action.payload;
      })
      .addCase(fetchDataNghiphep.rejected, (state) => {
        state.loading = "error";
      });
  },
});

export const { editFilterNghiPhep } = nghiphepSlice.actions;

export default nghiphepSlice.reducer;
