import React, { useState } from "react";
import AuthTabMenu from "./AuthTabMenu";
import LoginForm from "./LoginForm";
import JoinForm from "./JoinForm";
import FindPasswordForm from "./FindPasswordForm";
import "./user.css";

function LoginPanel() {
  const [activeTab, setActiveTab] = useState("login"); // 기본 로그인 탭

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleJoinSuccess = () => {
    setActiveTab("login"); // 회원가입 후 로그인 탭으로 전환
  };

  return (
    <div className="login-container">
      <h1 className="h2">회원</h1>
      <AuthTabMenu activeTab={activeTab} onTabClick={handleTabClick} />

      <div className="login-form-box">
        {activeTab === "login" && <LoginForm />}
        {activeTab === "signup" && <JoinForm onSuccess={handleJoinSuccess} />}
        {activeTab === "findpw" && <FindPasswordForm />}
      </div>
    </div>
  );
}

export default LoginPanel;
