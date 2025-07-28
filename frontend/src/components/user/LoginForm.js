import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./user.css";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Google Identity Services 초기화
  useEffect(() => {
    // Google Identity Services 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "683525870756-p68k1e2o26m0nde7tp1em5uq2p47oio2.apps.googleusercontent.com",
          callback: handleGoogleLogin,
        });

        // 화면 크기에 따라 버튼 width 결정
        const renderGoogleButton = () => {
          const buttonWidth = window.innerWidth <= 600 ? 240 : 350; // 모바일이면 240px
          window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            {
              theme: "outline",
              size: "large",
              width: buttonWidth,
              text: "signin_with",
              locale: "ko",
            }
          );
        };

        renderGoogleButton(); // 초기 실행
        window.addEventListener("resize", renderGoogleButton);

        // cleanup
        return () => window.removeEventListener("resize", renderGoogleButton);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔵 일반 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post("/api/user/login", {
        email: formData.email,
        password: formData.password,
      });

      const { email, isAdmin, userId } = response.data;

      sessionStorage.setItem("email", email);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("isAdmin", isAdmin ? "Y" : "N");

      alert("로그인 성공! 환영합니다.");

      if (isAdmin) {
        window.location.href = "/admin/accommodation";
      } else {
        navigate("/");
      }

      setFormData({ email: "", password: "" });
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({
          password:
            error.response.data.message ||
            "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔵 구글 로그인 처리 (최신 방식)
  const handleGoogleLogin = async (response) => {
    console.log("=== 구글 로그인 성공 ===");
    console.log("구글 JWT 토큰:", response.credential);

    setIsLoading(true);

    try {
      // JWT 토큰을 디코딩해서 사용자 정보 추출
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      console.log("사용자 정보:", payload);

      // 백엔드로 구글 토큰 전송
      const backendResponse = await axios.post(
        "http://localhost:18090/api/user/google-login",
        {
          token: response.credential,
          email: payload.email,
          name: payload.name,
          googleId: payload.sub,
        }
      );

      const { email, isAdmin } = backendResponse.data;

      sessionStorage.setItem("email", email);
      sessionStorage.setItem("isAdmin", isAdmin ? "Y" : "N");

      alert("구글 로그인 성공! 환영합니다.");

      if (isAdmin) {
        window.location.href = "/admin/accommodation";
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("구글 로그인 처리 실패:", error);
      alert("구글 로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      {/* 일반 로그인 폼 */}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="이메일"
            className={errors.email ? "error" : ""}
          />
        </div>
        {errors.email && <span className="error-message">{errors.email}</span>}

        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호"
            className={errors.password ? "error" : ""}
          />
        </div>
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}

        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 구분선 */}
      <div className="divider">
        <span>또는</span>
      </div>

      {/* 구글 로그인 버튼 (최신 방식) */}
      <div className="google-login-section">
        <div id="google-signin-button"></div>
      </div>
    </div>
  );
}

export default LoginForm;
