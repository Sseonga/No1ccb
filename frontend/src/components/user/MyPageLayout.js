import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./mypage.css"; // 스타일 유지

const MyPageLayout = () => {
  return (
    <div className="mypage-container">
      <div className="mypage-box">
        <h2>마이페이지</h2>

        {/* 탭 메뉴 */}
        <div className="mypage-tabs">
          <NavLink
            to="/mypage/info"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            내 정보
          </NavLink>
          <NavLink
            to="/mypage/favorites"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            즐겨찾기
          </NavLink>
          <NavLink
            to="/mypage/reviews"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            내 평점/댓글
          </NavLink>
        </div>

        {/* 내용 영역 */}
        <div className="mypage-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyPageLayout;
