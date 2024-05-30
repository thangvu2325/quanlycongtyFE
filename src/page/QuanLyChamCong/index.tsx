import { IconDownload, IconUpload } from "@tabler/icons-react";
import {
  Badge,
  Button,
  Calendar,
  Col,
  Flex,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import Radio from "antd/es/radio";
import Title from "antd/es/typography/Title";
import { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import dayLocaleData from "dayjs/plugin/localeData";
import type { BadgeProps, CalendarProps } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  authSelector,
  authorizationSelector,
  nhanvienRemainingSelector,
} from "../../redux/selectors";
import { nhanvienType } from "../../type/type";
import {
  chamcong,
  getNhanvienByMaNhanVien,
} from "../../services/nhanvienService";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../services/createInstance";
import { toast } from "react-toastify";
import { fetchDataNhanvien } from "../../redux/nhanvienSlice";
import { CellRenderInfo } from "rc-picker/lib/interface";
interface QuanLyChamCongPageProps {}
dayjs.extend(dayLocaleData);

const QuanLyChamCongPage: FunctionComponent<QuanLyChamCongPageProps> = () => {
  // Role > Quản Lí
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };
  const [modal, contextHolder] = Modal.useModal();
  const [nhanvien, setNhanvien] = useState<nhanvienType>();
  const nhanvienList = useAppSelector(nhanvienRemainingSelector).nhanvien;
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const { isAdministratorOrModeratorOrQuanLy, user } = useAppSelector(
    authorizationSelector
  );
  const authDate = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(authDate, dispatch, loginSuccess);
  const handleSelectedDay = async (
    value: Dayjs,
    cham_cong: boolean = false
  ) => {
    const date = new Date(value.toDate());
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    try {
      if (nhanvien) {
        if (!isAdministratorOrModeratorOrQuanLy && !cham_cong) {
          return;
        }
        const confirmed = await modal.confirm({
          title: <Title level={3}>Xác Nhận</Title>,
          content: (
            <Space>
              <Title level={3}>
                Bạn có xác nhận chấm công ngày {formattedDate} cho nhân viên{" "}
                {nhanvien?.ma_nhan_vien}{" "}
              </Title>
            </Space>
          ),
        });
        if (confirmed) {
          const res: { result: string } = await chamcong(
            axiosClient,
            nhanvien?.ma_nhan_vien,
            value.toDate().toString()
          );
          setNhanvien(
            nhanvienList.find((item) => {
              return item.ma_nhan_vien === nhanvien.ma_nhan_vien;
            })
          );
          dispatch(fetchDataNhanvien(axiosClient));
          toast(
            <Title level={2} style={{ color: "blue" }}>
              {res.result}
            </Title>
          );
        }
      } else {
        console.log("vui lòng chọn nhân viên");
        toast.warning(
          <Title level={2} style={{ color: "yellowgreen" }}>
            Vui lòng chọn nhân viên
          </Title>
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        <Title level={2} style={{ color: "red" }}>
          Chấm công thất bại
        </Title>
      );
      throw error;
    }
  };

  const onChangeSelect = (value: string) => {
    setNhanvien(
      nhanvienList.find((nhanvien) => nhanvien.ma_nhan_vien === value)
    );
  };
  useEffect(() => {}, [nhanvienList]);
  const cellRender = (
    current: Dayjs,
    info: CellRenderInfo<Dayjs>,
    cham_cong: Array<string>
  ) => {
    const foundDay = cham_cong?.find((day) =>
      dayjs(day).isSame(current, "day")
    );
    const listData = foundDay ? [{ type: "success", id: current.date() }] : [];
    if (info.type === "date")
      return (
        <ul className="events">
          {listData.map((item, index) => (
            <li key={index}>
              <Badge status={item.type as BadgeProps["status"]} />
            </li>
          ))}
        </ul>
      );
    return info.originNode;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNhanvienByMaNhanVien(
          axiosClient,
          user.ma_nhan_vien
        );
        setNhanvien(data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    if (!isAdministratorOrModeratorOrQuanLy) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="overflow-auto overscroll-contain pb-10">
      {contextHolder}
      <div className="px-6">
        <Flex justify="space-between" align="center" className="mb-4">
          <Flex vertical>
            <Title style={{ fontSize: "32px" }}>Quản Lý Chấm Công</Title>
            <Flex className="mt-2">
              <Link to={"#"}>
                <Title level={3}>
                  <Space className="px-3 py-[7px] hover:bg-[rgba(17,25,39,0.04)] rounded-md">
                    <IconUpload width={13.5} height={13.5}></IconUpload> Import
                  </Space>
                </Title>
              </Link>
              <Link to={"#"}>
                <Title level={3}>
                  <Space className="px-3 py-[7px] ml-2 hover:bg-[rgba(17,25,39,0.04)] rounded-md">
                    <IconDownload width={13.5} height={13.5}></IconDownload>
                    Export
                  </Space>
                </Title>
              </Link>
            </Flex>
          </Flex>
        </Flex>
        <Flex className="h-full mt-10 max-lg:flex-col items-start max-lg:items-center">
          <div className="w-2/3 max-lg:w-full px-4 max-lg:mb-4">
            <Calendar
              className="shadow-lg  border-[0.8px] border-solid border-[#ccc]"
              cellRender={(current, info) =>
                cellRender(
                  current,
                  info,
                  nhanvienList.find(
                    (item) => item.ma_nhan_vien === nhanvien?.ma_nhan_vien
                  )?.cham_cong ?? []
                )
              }
              onSelect={(dayjs) => handleSelectedDay(dayjs)}
              fullscreen={false}
              headerRender={({ value, type, onChange, onTypeChange }) => {
                const start = 0;
                const end = 12;
                const monthOptions = [];

                let current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current = current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let i = start; i < end; i++) {
                  monthOptions.push(
                    <Select.Option key={i} value={i} className="month-item">
                      {months[i]}
                    </Select.Option>
                  );
                }

                const year = value.year();
                const month = value.month();
                const options = [];
                for (let i = year - 10; i < year + 10; i += 1) {
                  options.push(
                    <Select.Option key={i} value={i} className="year-item">
                      {i}
                    </Select.Option>
                  );
                }
                return (
                  <div style={{ padding: 8 }}>
                    <Flex
                      align="center"
                      justify="space-between"
                      className="p-5 pt-2"
                    >
                      <Title level={1}>
                        Chấm Công Của Nhân Viên:{" "}
                        <i>{nhanvien?.ten_nhan_vien}</i>
                      </Title>
                      <Select
                        className={`${
                          isAdministratorOrModeratorOrQuanLy ? "" : "hidden"
                        }`}
                        style={{ width: "200px" }}
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={onChangeSelect}
                        filterOption={filterOption}
                        options={nhanvienList.map((nhanvien) => ({
                          value: nhanvien.ma_nhan_vien,
                          label: nhanvien.ma_nhan_vien,
                        }))}
                      />
                    </Flex>
                    <Row gutter={8}>
                      <Col>
                        <Radio.Group
                          size="small"
                          onChange={(e) => onTypeChange(e.target.value)}
                          value={type}
                        >
                          <Radio.Button value="month">Month</Radio.Button>
                          <Radio.Button value="year">Year</Radio.Button>
                        </Radio.Group>
                      </Col>
                      <Col>
                        <Select
                          size="small"
                          className="my-year-select"
                          value={year}
                          onChange={(newYear) => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}
                        >
                          {options}
                        </Select>
                      </Col>
                      <Col>
                        <Select
                          size="small"
                          value={month}
                          onChange={(newMonth) => {
                            const now = value.clone().month(newMonth);
                            onChange(now);
                          }}
                        >
                          {monthOptions}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                );
              }}
              onPanelChange={onPanelChange}
            />
          </div>
          <div className="lg:flex-1 max-lg:w-full  px-4 h-full ">
            <div className=" bg-[#fff] px-6 shadow-lg rounded-lg py-5 border-[0.8px] border-solid border-[#ccc]">
              <Title level={1} style={{ textAlign: "center" }}>
                Thông Tin Nhân Viên
              </Title>
              <div className="mt-6">
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Tên Nhân Viên:
                  </Title>
                  <span className="ml-4">{nhanvien?.ten_nhan_vien}</span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Mã Nhân Viên:
                  </Title>
                  <span className="ml-4">{nhanvien?.ma_nhan_vien}</span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Ngày Công:
                  </Title>
                  <span className="ml-4">
                    {nhanvien?.cham_cong?.filter(
                      (ngaycong) =>
                        new Date(ngaycong).getMonth() === new Date().getMonth()
                    )?.length ?? ""}
                  </span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Lương Cơ bản:
                  </Title>
                  <span className="ml-4">
                    {nhanvien?.salary_basic
                      ? `${Number(nhanvien?.salary_basic).toLocaleString()} VND`
                      : ""}
                  </span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Chức Vụ:
                  </Title>
                  <span className="ml-4">{nhanvien?.chuc_vu}</span>
                </Flex>
                <Flex align="center" className="mt-4">
                  <Title level={2} className="w-28">
                    Phòng Ban
                  </Title>
                  <span className="ml-4">{nhanvien?.phong_ban}</span>
                </Flex>
              </div>
              <Flex
                className={`mt-4 ${
                  isAdministratorOrModeratorOrQuanLy ? "hidden" : ""
                }`}
              >
                <Button
                  className="mx-auto"
                  type="primary"
                  onClick={() => {
                    handleSelectedDay(dayjs(new Date()), true);
                  }}
                >
                  Chấm Công
                </Button>
              </Flex>
            </div>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default QuanLyChamCongPage;
