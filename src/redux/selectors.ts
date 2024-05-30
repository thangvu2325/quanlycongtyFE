import { RootState } from "./store";
import { NhanvienState } from "./nhanvienSlice";
import { createSelector } from "@reduxjs/toolkit";
import { SettingsState } from "./settingsSlice";
import { NghiPhepState } from "./nghiphepSlice";
import { CompanyState } from "./companySlice";
import { userType } from "../type/type";
import { LuongState } from "./luongSlice";
export const luongSelector = (state: RootState): LuongState => state.luong;

export const authSelector = (state: RootState): tokenType =>
  state.persistedReducer.auth.login.currentUser;
export const nhanvienSelector = (state: RootState): NhanvienState => {
  return state.nhanvien;
};
export const companySelector = (state: RootState): CompanyState => {
  return state.company;
};
// Settings
export const settingsSelector = (state: RootState): SettingsState =>
  state.persistedReducer.settings;
export const nhanvienRemainingSelector = createSelector(
  nhanvienSelector,
  settingsSelector,
  (nhanvienData, settingsData) => {
    const nhanvienList = nhanvienData.data.nhanvien;
    const filter = nhanvienData.filter;
    // const isTenNhanVien =
    const isCheckSearch: (text: string, filter: string) => boolean = (
      text,
      filter
    ) => {
      return !!(
        text &&
        text
          ?.trim()
          ?.toUpperCase()
          ?.includes(filter ? filter.trim().toUpperCase() : "")
      );
    };
    let nhanvienSort = nhanvienList.filter((nhanvien) => {
      const isCheckCompany = settingsData.ma_cong_ty
        ? isCheckSearch(nhanvien.ma_cong_ty, settingsData.ma_cong_ty)
        : false;
      const isTenNhanVien = isCheckSearch(
        nhanvien.ten_nhan_vien,
        filter.ten_nhan_vien
      );
      const isMaNhanVien = isCheckSearch(
        nhanvien.ma_nhan_vien,
        filter.ma_nhan_vien
      );
      const isEmail = isCheckSearch(nhanvien.email, filter.email);
      const isSoDienThoai = isCheckSearch(
        nhanvien.so_dien_thoai,
        filter.so_dien_thoai
      );

      return (
        isTenNhanVien &&
        isMaNhanVien &&
        isEmail &&
        isSoDienThoai &&
        isCheckCompany
      );
    });
    return { nhanvien: nhanvienSort, count: nhanvienSort.length };
  }
);

// Nghi phep
export const nghiphepSelector = (state: RootState): NghiPhepState =>
  state.nghiphep;
export const nghiphepRemainingSelector = createSelector(
  nghiphepSelector,
  nhanvienRemainingSelector,
  (nghiphepData, nhanvienData) => {
    const nghiphepList = nghiphepData.data.nghiphep.filter((nghiphep) =>
      nhanvienData.nhanvien.some(
        (nhanvien) => nghiphep.ma_nhan_vien === nhanvien.ma_nhan_vien
      )
    );
    const filter = nghiphepData.filter;
    const isCheckSearch: (text: string, filter: string) => boolean = (
      text,
      filter
    ) => {
      return !!(
        text &&
        text
          .trim()
          .toUpperCase()
          .includes(filter ? filter?.trim()?.toUpperCase() : "")
      );
    };

    let nghiphepSort = nghiphepList?.filter((nghiphep) => {
      const isTenNhanVien = isCheckSearch(
        nghiphep.ten_nhan_vien,
        filter.ten_nhan_vien
      );
      const isCheckDuyet =
        filter.chua_duyet && filter.da_duyet
          ? true
          : filter.chua_duyet || filter.da_duyet
          ? nghiphep.status === filter.da_duyet
          : filter.chua_duyet && filter.da_duyet
          ? false
          : true;

      const isMaNhanVien = isCheckSearch(
        nghiphep.ma_nhan_vien,
        filter.ma_nhan_vien
      );
      const isMaDon = isCheckSearch(nghiphep.id, filter.ma_don);

      return isTenNhanVien && isMaNhanVien && isMaDon && isCheckDuyet;
    });
    return { nghiphep: nghiphepSort, count: nghiphepSort.length };
  }
);
export const companyRemainingSelector = createSelector(
  companySelector,
  (companyData) => {
    const filter = companyData.filter;
    const companyList = companyData.data.companys;
    const isCheckSearch: (text: string, filter: string) => boolean = (
      text,
      filter
    ) => {
      return !!(
        text &&
        text
          .trim()
          .toUpperCase()
          .includes(filter ? filter?.trim()?.toUpperCase() : "")
      );
    };

    let companySort = companyList?.filter((company) => {
      const isMaCongTy = isCheckSearch(company.ma_cong_ty, filter.ma_cong_ty);
      const isTenCongTy = isCheckSearch(
        company.ten_cong_ty,
        filter.ten_cong_ty
      );

      return isMaCongTy && isTenCongTy;
    });
    return { companyList: companySort, count: companySort.length };
  }
);
export const luongRemainingSelector = createSelector(
  luongSelector,
  (luongData) => {
    const filter = luongData.filter;
    const luongList = luongData.data.luongList;
    const isCheckSearch: (text: string, filter: string) => boolean = (
      text,
      filter
    ) => {
      return !!(
        text &&
        text
          .trim()
          .toUpperCase()
          .includes(filter ? filter?.trim()?.toUpperCase() : "")
      );
    };

    let luongSort = luongList?.filter((luong) => {
      const isMaNhanVien = isCheckSearch(
        luong.ma_nhan_vien,
        filter.ma_nhan_vien
      );
      const isMaLuong = isCheckSearch(luong.ma_luong, filter.ma_luong);

      return isMaNhanVien && isMaLuong;
    });
    return { luongList: luongSort, count: luongSort.length };
  }
);
export const authorizationSelector = createSelector(
  authSelector,
  (
    authData
  ): {
    isAuthenticated: boolean;
    user: userType;
    isQuanLy: boolean;
    isModerator: boolean;
    isQuanLyOrModerator: boolean;
    isAdministratorOrModerator: boolean;
    isAdministratorOrModeratorOrQuanLy: boolean;
    isAdministrator: boolean;
  } => {
    const user = authData?.user;
    const isQuanLy = user?.roles === "Quản Lý";
    const isModerator = user?.roles === "Moderator";
    const isAdministrator = user?.roles === "Administrator";
    const isAuthenticated = user && !!Object.keys(user).length;
    const isQuanLyOrModerator = isQuanLy || isModerator;
    const isAdministratorOrModerator = isAdministrator || isModerator;
    const isAdministratorOrModeratorOrQuanLy =
      isAdministratorOrModerator || isQuanLy;
    return {
      isAuthenticated,
      user,
      isQuanLy,
      isModerator,
      isQuanLyOrModerator,
      isAdministratorOrModerator,
      isAdministratorOrModeratorOrQuanLy,
      isAdministrator,
    };
  }
);
// luong
