import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasswordChangeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 로그인된 사용자 정보 가져오기 (sessionStorage에서)
  useEffect(() => {
    const userEmail =
      sessionStorage.getItem('email') || // 로그인 시 저장된 키 사용
      localStorage.getItem('email') ||
      ''; // 기본값을 빈 문자열로 변경

    console.log('=== 로그인된 사용자 이메일 확인 ===');
    console.log(
      'sessionStorage에서 가져온 이메일:',
      sessionStorage.getItem('email')
    );
    console.log(
      'localStorage에서 가져온 이메일:',
      localStorage.getItem('email')
    );
    console.log('최종 설정된 이메일:', userEmail);

    if (userEmail) {
      setFormData((prev) => ({ ...prev, email: userEmail }));
    } else {
      alert('로그인이 필요합니다. 먼저 로그인해주세요.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '로그인이 필요합니다.';
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '새 비밀번호는 8자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('=== 비밀번호 변경 시작 ===');
    console.log('이메일:', formData.email);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔄 비밀번호 변경 API 호출 중...');

      const response = await axios.post(
        'http://localhost:18090/api/user/change-current-password',
        {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      console.log('✅ 비밀번호 변경 성공:', response.data);
      alert('비밀번호가 성공적으로 변경되었습니다.');

      // 폼 초기화
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      if (onSubmit) {
        onSubmit(response.data);
      }
    } catch (error) {
      console.log('❌ 비밀번호 변경 실패:', error);
      console.log('에러 상세:', error.response?.data);

      if (error.response?.status === 400) {
        setErrors({
          currentPassword:
            error.response.data.message || '현재 비밀번호가 올바르지 않습니다.',
        });
      } else if (error.response?.status === 404) {
        setErrors({
          email: '사용자를 찾을 수 없습니다.',
        });
      } else {
        alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-change-container">
      <h3>비밀번호 변경</h3>

      <div className="change_area">
        <div className="label_area"><label>이메일</label></div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={true} // 로그인된 사용자 이메일이므로 수정 불가
          className="form-input disabled"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="change_area">
        <div className="label_area"><label>현재 비밀번호</label></div>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="현재 비밀번호를 입력하세요"
          className={`form-input ${errors.currentPassword ? 'error' : ''}`}
        />

      </div>

        {errors.currentPassword && (
                  <span className="error-message">{errors.currentPassword}</span>
                )}

      <div className="change_area">
        <div className="label_area"><label>새 비밀번호</label></div>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="새 비밀번호를 입력하세요 (8자 이상)"
          className={`form-input ${errors.newPassword ? 'error' : ''}`}
        />

      </div>

        {errors.newPassword && (
                  <span className="error-message">{errors.newPassword}</span>
                )}

      <div className="change_area">
        <div className="label_area"><label>비밀번호 확인</label></div>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="새 비밀번호를 다시 입력하세요"
          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
        />

      </div>

        {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
        <div className="change-button">
          <button
            type="button"
            className="change-password-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
    </div>
  );
};

export default PasswordChangeForm;
