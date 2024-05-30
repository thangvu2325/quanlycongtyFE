import { IconPlus } from "@tabler/icons-react";
import { Divider, Input, Select, Space, Button } from "antd";
import { FunctionComponent, useRef, useState } from "react";
import type { InputRef } from "antd";

interface DropdownSelectProps {
  option: Array<string>;
  defaultSelect?: string;
  handleChangeSelect?: (value: string) => void;
  className?: string;
}
let index = 0;
const DropdownSelect: FunctionComponent<DropdownSelectProps> = ({
  option,
  defaultSelect,
  handleChangeSelect,
}) => {
  const [items, setItems] = useState(option);
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  return (
    <Select
      style={{ width: "165.94px" }}
      placeholder="Chọn Phòng Ban"
      allowClear
      onChange={(value) => {
        if (handleChangeSelect) {
          handleChangeSelect(value);
        }
      }}
      defaultValue={defaultSelect}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" onClick={addItem} style={{ width: "50px" }}>
              <IconPlus></IconPlus>
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({ label: item, value: item }))}
    ></Select>
  );
};

export default DropdownSelect;
