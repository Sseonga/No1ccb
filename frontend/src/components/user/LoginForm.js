import React, { useState } from 'react';
import axios from 'axios';
import './user.css'; // CSS 파일 import 추가

function LoginForm() {
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 에러 메시지 상태 관리
  const [errors, setErrors] = useState({});

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 로그인 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== 로그인 시도 ===');
    console.log('이메일:', formData.email);
    console.log('비밀번호 길이:', formData.password.length);

    // 유효성 검사
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

    // 로딩 시작
    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔄 로그인 API 호출 중...');
      console.log('전송 데이터:', {
        email: formData.email,
        password: formData.password,
      });

      // 백엔드 로그인 API 호출
      const response = await axios.post(
        'http://localhost:18090/api/user/login',
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log('✅ 로그인 성공:', response.data);
      alert('로그인 성공! 환영합니다.');

      // 성공 시 폼 초기화
      setFormData({
        email: '',
        password: '',
      });
    } catch (error) {
      console.log('❌ 로그인 실패:', error);
      console.log('에러 상세:', error.response?.data);
      console.log('에러 상태코드:', error.response?.status);

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
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="input-group">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="비밀번호"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <button type="submit" className="login-btn" disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}

export default LoginForm;
