import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { companyType } from "../type/type";
import { getAllCompany } from "../services/companySecvice";
// Define a type for the slice state
export interface CompanyState {
  data: {
    companys: Array<companyType>;
    companyCount: number;
  };
  filter: {
    ten_cong_ty: string;
    ma_cong_ty: string;
  };
  loading: string;
  error: string;
}
export const fetchDataCompany = createAsyncThunk(
  "company/fetchData",
  // if you type your function argument here
  async (axiosClient: AxiosInstance) => {
    try {
      const data = await getAllCompany(axiosClient);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
// Define the initial state using that type
const initialState: CompanyState = {
  data: {
    companys: [],
    companyCount: 0,
  },
  filter: {
    ten_cong_ty: "",
    ma_cong_ty: "",
  },
  loading: "idle",
  error: "",
};

export const companySlice = createSlice({
  name: "company",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    editFilterCompany(state, action) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataCompany.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDataCompany.fulfilled, (state, action) => {
        state.loading = "success";
        state.data = action.payload;
      })
      .addCase(fetchDataCompany.rejected, (state) => {
        state.loading = "error";
      });
  },
});

export const { editFilterCompany } = companySlice.actions;

export default companySlice.reducer;
