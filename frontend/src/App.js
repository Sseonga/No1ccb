import React, { useRef, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

// 관리자 컴포넌트
import AdminLayout from "./components/admin/AdminLayout";
import ReportReviewTable from "./components/admin/ReportReviewTable";
import AccommodationAddForm from "./components/accommodation/AccommodationAddForm";
import UserManageTable from "./components/admin/UserManageTable";

// 사용자 컴포넌트
import Tmap from "./components/station/Tmap";
import Sidebar from "./components/common/Sidebar";
import MyLocationButton from "./components/common/MyLocationButton";
import FilterPanel from "./components/station/Filterpanel";
import RouteSearchPanel from "./components/route/RouteSearchPanel";
import IntroCar from "./components/intro/IntroCar";
import LoginPanel from "./components/user/LoginPanel";

// 마이페이지 컴포넌트
import FavoriteListPanel from "./components/user/FavoriteListPanel"; // 마이페이지 레이아웃
import PasswordChangeForm from "./components/user/PasswordChangeForm";
import MyReview from "./components/user/MyReview";
import MyPageLayout from "./components/user/MyPageLayout";

// 관리자 여부 확인
const isAdmin = sessionStorage.getItem("isAdmin") === "Y";

// 사용자용 레이아웃
const UserLayout = () => {
  const [filters, setFilters] = useState({ type: [], parking: [], brand: [] });
  const tmapObjRef = useRef(null);
  const myMarkerRef = useRef(null);
  const location = useLocation();

  const hideOn = ["/info", "/user", "/user/*"];
  const hideUI = hideOn.includes(location.pathname);

  return (
    <div className="container">
      <Sidebar />
      <Tmap tmapObjRef={tmapObjRef} />
      {!hideUI && (
        <>
          <MyLocationButton
            tmapObjRef={tmapObjRef}
            myMarkerRef={myMarkerRef}
          />
          <FilterPanel filters={filters} onChange={setFilters} />
        </>
      )}

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/route" element={<RouteSearchPanel />} />
        <Route path="/hotel" element={<div>충전숙소 패널</div>} />
        <Route path="/rank" element={<div>랭킹 패널</div>} />
        <Route path="/info" element={<IntroCar />} />
        <Route path="/user/*" element={<LoginPanel />} />

        {/* ✅ 마이페이지 모달 라우팅 */}
        <Route path="/mypage" element={<MyPageLayout />}>
          <Route path="info" element={< PasswordChangeForm />} />
          <Route path="favorites" element={<FavoriteListPanel />} />
          <Route path="reviews" element={<MyReview />} />
          <Route index element={<Navigate to="info" replace />} />
        </Route>
      </Routes>
    </div>
  );
};

// App 컴포넌트
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 관리자 라우팅 */}
        {isAdmin ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/accommodation" element={<AccommodationAddForm />} />
            <Route path="/admin/report" element={<ReportReviewTable />} />
            <Route path="/admin/userCare" element={<UserManageTable />} />
          </Route>
        ) : (
          <>
            {/* 관리자 접근 차단 → 홈으로 리다이렉트 */}
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* 사용자 기본 레이아웃 */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
