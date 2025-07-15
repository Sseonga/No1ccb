import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../logo.png";
import "./admin.css";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/accommodation">
        <img src={logo} alt="로고" width="100" height="100" />
      </Link>

      <NavLink
        to="/accommodation"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <i className="fa-solid fa-hotel"></i>
        <br />
        숙소추가
      </NavLink>

      <NavLink
        to="/report"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <i className="fa-solid fa-star"></i>
        <br />
        신고리뷰
      </NavLink>

      <NavLink
        to="/userCare"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <i className="fa-solid fa-user-gear"></i>
        <br />
        회원관리
      </NavLink>
    </div>
  );
};

export default AdminSidebar;
