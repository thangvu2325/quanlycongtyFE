import { createSlice } from "@reduxjs/toolkit";
import { userType } from "../type/type";
// Define a type for the slice state
interface authSliceState {
  login: {
    currentUser: {
      user: userType;
      backendTokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
    };
    isFetching: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    error: boolean;
  };
  register: {
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
  logout: {
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
}

// Define the initial state using that type
const initialState: authSliceState = {
  login: {
    currentUser: {
      user: {} as userType,
      backendTokens: {
        accessToken: "",
        refreshToken: "",
        expiresIn: 0,
      },
    },
    isFetching: false,
    errorMessage: null,
    successMessage: null,
    error: false,
  },
  register: {
    isFetching: false,
    error: false,
    success: false,
  },
  logout: {
    isFetching: false,
    error: false,
    success: false,
  },
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.errorMessage = null;
      state.login.successMessage = "Đăng nhập thành công!";
      state.login.error = false;
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.errorMessage = action.payload;
      state.login.successMessage = null;
      state.login.error = true;
    },
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    logOutSuccess: (state) => {
      state.logout.isFetching = false;
      state.login.currentUser = {
        user: {} as userType,
        backendTokens: {
          accessToken: "",
          refreshToken: "",
          expiresIn: 0,
        },
      };
      state.logout.error = false;
    },
    logOutFailed: (state) => {
      state.logout.isFetching = false;
      state.logout.error = true;
    },
    logOutStart: (state) => {
      state.logout.isFetching = true;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logOutStart,
  logOutSuccess,
  logOutFailed,
} = authSlice.actions;

export default authSlice.reducer;
