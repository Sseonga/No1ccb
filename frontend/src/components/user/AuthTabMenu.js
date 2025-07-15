import React from "react";

function AuthTabMenu({ activeTab, onTabClick }) {
  return (
    <div className="auth-tab-menu">
      <button
        className={activeTab === "login" ? "active" : ""}
        onClick={() => onTabClick("login")}
      >
        로그인
      </button>
      <button
        className={activeTab === "signup" ? "active" : ""}
        onClick={() => onTabClick("signup")}
      >
        회원가입
      </button>
      <button
        className={activeTab === "findpw" ? "active" : ""}
        onClick={() => onTabClick("findpw")}
      >
        비밀번호 찾기
      </button>
    </div>
  );
}
export default AuthTabMenu;
