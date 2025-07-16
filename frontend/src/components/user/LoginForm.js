import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './user.css'; // CSS 그대로 유지

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        'http://localhost:18090/api/user/login',
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { email, isAdmin } = response.data;

      // ✅ 세션 스토리지에 저장 (탭 종료 시 자동 삭제)
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('isAdmin', isAdmin ? 'Y' : 'N');

      alert('로그인 성공! 환영합니다.');

      // ✅ 리다이렉트
      if (isAdmin) {
        window.location.href = '/admin/accommodation'; // 관리자 페이지로
      } else {
        navigate('/'); // 일반 사용자 홈
      }

      // 폼 초기화
      setFormData({ email: '', password: '' });
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({
          password:
            error.response.data.message ||
            '이메일 또는 비밀번호가 올바르지 않습니다.',
        });
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="이메일"
          className={errors.email ? 'error' : ''}
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
          className={errors.password ? 'error' : ''}
        />

      </div>
        {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
      <button type="submit" className="login-btn" disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}

export default LoginForm;
