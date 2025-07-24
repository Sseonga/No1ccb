import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/admin/AdminLayout";
import ReportReviewTable from "./components/admin/ReportReviewTable";
import UserManageTable from "./components/admin/UserManageTable";

import UserLayout from "./components/UserLayout";

const isAdmin = sessionStorage.getItem("isAdmin") === "Y";

const App = () => (
  <BrowserRouter>
    <Routes>
      {isAdmin ? (
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="report" element={<ReportReviewTable />} />
          <Route path="userCare" element={<UserManageTable />} />
        </Route>
      ) : (
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
      )}
      <Route path="/*" element={<UserLayout />} />
    </Routes>
  </BrowserRouter>
);

export default App;
