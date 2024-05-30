import { createSlice } from "@reduxjs/toolkit";
// Define a type for the slice state
export interface SettingsState {
  sideBarState: boolean;
  ma_cong_ty: string;
}

// Define the initial state using that type
const initialState: SettingsState = {
  sideBarState: false,
  ma_cong_ty: "",
};

export const SettingsSlice = createSlice({
  name: "settings",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleSidebarState(state) {
      state.sideBarState = !state.sideBarState;
    },
    editCompany(state, action) {
      state.ma_cong_ty = action.payload;
    },
  },
});

export const { toggleSidebarState, editCompany } = SettingsSlice.actions;

export default SettingsSlice.reducer;
