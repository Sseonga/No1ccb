import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './admin.css'; // 필요 시 포함

const AdminLayout = () => {
  // 관리자 권한 체크
  const isAdminValue = sessionStorage.getItem('isAdmin');
  const userEmail =
    sessionStorage.getItem('userEmail') || sessionStorage.getItem('email');

  // 디버깅 로그 추가
  console.log('=== AdminLayout 권한 체크 ===');
  console.log('userEmail (userEmail):', sessionStorage.getItem('userEmail'));
  console.log('userEmail (email):', sessionStorage.getItem('email'));
  console.log('최종 userEmail:', userEmail);
  console.log('isAdmin 값:', isAdminValue);
  console.log('isAdmin 타입:', typeof isAdminValue);

  // 다양한 형태의 관리자 값 허용
  const isAdmin =
    isAdminValue === 'true' ||
    isAdminValue === 'Y' ||
    isAdminValue === true ||
    isAdminValue === 'TRUE' ||
    isAdminValue === 'y';

  console.log('최종 isAdmin 결과:', isAdmin);

  // 로그인되지 않았거나 관리자가 아니면 홈으로 리다이렉트
  if (!userEmail || !isAdmin) {
    console.log('❌ 접근 차단됨');
    console.log('userEmail 존재:', !!userEmail);
    console.log('isAdmin 권한:', isAdmin);
    alert('관리자만 접근할 수 있는 페이지입니다.');
    return <Navigate to="/" replace />;
  }

  console.log('✅ 관리자 접근 허용');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
