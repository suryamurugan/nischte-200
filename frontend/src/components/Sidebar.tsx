import React from "react";
import { IoMdClose } from "react-icons/io";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";

import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white  mt-[23px] mr-[38px]
      ${
        isOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      } 
      transform origin-top-right transition-all duration-300 ease-in-out z-30`}
    >
      <ProSidebar>
        <div className="p-4">
          <button onClick={onClose} className="float-right">
            <IoMdClose size={24} />
          </button>
        </div>
        <Menu className="mt-2">
          <MenuItem component={<Link to="/shops" />}> Shops </MenuItem>
          <MenuItem> About us</MenuItem>
          <MenuItem> Contact us</MenuItem>
          <SubMenu label="Owners">
            <MenuItem> Manage shops</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>
    </div>
  );
};
