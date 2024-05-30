import axios, { AxiosInstance } from "axios";
import { userRegister } from "../type/type";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import {
  logOutFailed,
  logOutStart,
  logOutSuccess,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../redux/authSlice";

export const registerRequest = async (
  user: userRegister,
  navigate: NavigateFunction,
  dispatch: AppDispatch
) => {
  dispatch(registerStart());
  try {
    await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/auth/register",
      user
    );
    dispatch(registerSuccess());
    navigate("/login");
    return true;
  } catch (error) {
    dispatch(registerFailed());
    console.log("Err fetch data");
    return error;
  }
};
export const loginRequest = async (
  user: userRegister,
  navigate: NavigateFunction,
  dispath: AppDispatch
) => {
  try {
    dispath(loginStart());
    const response = await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/auth/login",
      user
    );
    dispath(loginSuccess(response.data));
    navigate("/");
    return response.data;
  } catch (error) {
    console.log("Err fetch data");
    throw error;
  }
};
export const resetPasswordRequest = async (
  email: string,
  axiosClient: AxiosInstance
) => {
  try {
    const response = await axiosClient.post(
      process.env.REACT_APP_API_BASE_URL + "/auth/resetpassword",
      { email }
    );
    return response.data;
  } catch (error) {
    console.log("Err fetch data");
    throw error;
  }
};
export const logOutRequest = async (
  dispatch: AppDispatch,
  id: string,
  navigate: NavigateFunction,
  axiosClient: AxiosInstance
) => {
  dispatch(logOutStart());
  try {
    await axiosClient.post(
      process.env.REACT_APP_API_BASE_URL + "/auth/logout",
      { id: id }
    );
    dispatch(logOutSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(logOutFailed());
  }
};
