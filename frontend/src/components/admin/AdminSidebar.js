import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../logo.png";
import "./admin.css";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="로고" width="100" height="100" />
      </Link>

      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <i className="fa-solid fa-location-dot"></i>
        <br />
        숙소추가
      </NavLink>
      <NavLink
        to="/route"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <i className="fa-solid fa-diamond-turn-right"></i>
        <br />
        리뷰 및 신고 관리
      </NavLink>
      <NavLink
        to="/hotel"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <i className="fa-solid fa-hotel"></i>
        <br />
        회원관리
      </NavLink>

    </div>
  );
};

export default AdminSidebar;
