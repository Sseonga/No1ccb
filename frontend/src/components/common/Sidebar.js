import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../logo.png";

const Sidebar = () => {
  const email = sessionStorage.getItem("email");
  const isLoggedIn = !!email;
  const username = email ? email.split("@")[0] : "";
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/"; // 새로고침 포함한 홈 이동
  };

  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="로고" width="100" height="100" />
      </Link>

      <NavLink to="/" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
        <i className="fa-solid fa-location-dot"></i><br />주변충전소
      </NavLink>
      <NavLink to="/route" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
        <i className="fa-solid fa-diamond-turn-right"></i><br />길찾기
      </NavLink>
      <NavLink to="/hotel" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
        <i className="fa-solid fa-hotel"></i><br />충전숙소
      </NavLink>

      <NavLink to="/info" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
        <i className="fas fa-leaf"></i><br /> 에코스팟은?
      </NavLink>

      {/* 로그인 또는 사용자 이름 + 로그아웃 */}
      {!isLoggedIn ? (
      <div className="login-area">
        <Link to="/user" className="loginbtn">로그인</Link>
      </div>
      ) : (
        <div className="user-info">
          <span
            className="username"
            onClick={() => navigate("/mypage")}
            style={{ cursor: "pointer" }}
          >
            {username}
          </span>

            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>

        </div>
      )}
    </div>
  );
};

export default Sidebar;
