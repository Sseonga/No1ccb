import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../logo.png';
import './admin.css';

const AdminSidebar = () => {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/'; // 로그아웃 후 홈으로 이동
  };

  return (
    <div className="admin_sidebar">
      <Link to="/admin/accommodation">
        <img src={logo} alt="로고" width="100" height="100" />
      </Link>


      <NavLink
              to="/admin/AccommManage"
              className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
            >
              <i className="fa-solid fa-hotel"></i>
              <br />
              숙소관리
      </NavLink>

      <NavLink
        to="/admin/accommodation"
        className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
      >
        <i class="fa-solid fa-plus"></i>
        <br />
        숙소추가
      </NavLink>


      <NavLink
        to="/admin/report"
        className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
      >
        <i className="fa-solid fa-star"></i>
        <br />
        신고리뷰
      </NavLink>

      <NavLink
        to="/admin/userCare"
        className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
      >
        <i className="fa-solid fa-user-gear"></i>
        <br />
        회원관리
      </NavLink>

      {/* 로그아웃 버튼만 표시 */}
      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default AdminSidebar;
