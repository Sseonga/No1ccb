import React, { useState } from 'react';
import axios from 'axios';

// 💡 FindPasswordForm 컴포넌트
const FindPasswordForm = () => {
  // 1) 이메일/인증코드 입력값 관리 state
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 2) 에러 메시지 관리 state
  const [errors, setErrors] = useState({});

  // 3) 모달창 열림/닫힘
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 4) 인증코드 발송 여부
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 6) 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);

  // 7) 인증 완료 상태
  const [isVerified, setIsVerified] = useState(false);

  // 🔵 입력창 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔵 "인증코드 발송" 버튼 클릭 시
  const handleSendCode = async () => {
    console.log('=== 비밀번호 찾기 인증 코드 발송 시작 ===');
    console.log('입력된 이메일:', formData.email);

    const newErrors = {};
    // 이메일 입력 체크
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 에러 있으면 메시지 표시 후 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 로딩 상태 시작
    setIsLoading(true);
    setErrors({}); // 이전 에러 초기화

    try {
      console.log('🔄 백엔드 API 호출 중...');

      // 실제 백엔드 API 호출
      const response = await axios.post(
        'http://localhost:18090/api/user/send-password-reset-code',
        {
          email: formData.email,
        }
      );

      console.log('✅ API 응답 성공:', response.data);

      setIsCodeSent(true); // 인증코드 보냈다고 상태 변경
      alert('인증코드가 발송되었습니다.');
    } catch (error) {
      console.log('❌ API 호출 실패:', error);
      console.log('에러 상세:', error.response?.data);

      if (error.response?.status === 400) {
        // 가입되지 않은 이메일
        setErrors({
          email: error.response.data.message || '가입되지 않은 이메일입니다.',
        });
      } else {
        alert('인증코드 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔵 "인증확인" 버튼 클릭 시
  const handleVerifyCode = async () => {
    console.log('=== 비밀번호 찾기 인증 코드 확인 시작 ===');
    console.log('입력된 이메일:', formData.email);
    console.log('입력된 인증 코드:', formData.verificationCode);

    const newErrors = {};

    if (!formData.verificationCode) {
      newErrors.verificationCode = '인증코드를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 로딩 상태 시작
    setIsLoading(true);
    setErrors({}); // 이전 에러 초기화

    try {
      console.log('🔄 백엔드 API 호출 중...');

      // 실제 백엔드 API 호출
      const response = await axios.post(
        'http://localhost:18090/api/user/verify-password-reset-code',
        {
          email: formData.email,
          verificationCode: formData.verificationCode,
        }
      );

      console.log('✅ API 응답 성공:', response.data);

      setIsVerified(true); // 인증 완료 상태 변경
      alert('인증이 완료되었습니다.');
    } catch (error) {
      console.log('❌ API 호출 실패:', error);
      console.log('에러 상세:', error.response?.data);

      if (error.response?.status === 400) {
        setErrors({
          verificationCode:
            error.response.data.message ||
            '인증 코드가 올바르지 않거나 만료되었습니다.',
        });
      } else {
        alert('인증 확인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔵 "새 비밀번호 설정" 버튼 클릭 시
  const handlePasswordReset = async () => {
    console.log('=== 새 비밀번호 설정 시작 ===');
    console.log('입력된 이메일:', formData.email);
    console.log('입력된 인증 코드:', formData.verificationCode);

    const newErrors = {};

    // 이메일 체크
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 인증코드 체크
    if (!formData.verificationCode) {
      newErrors.verificationCode = '인증코드를 입력해주세요.';
    }

    // 인증 완료 여부 체크
    if (!isVerified) {
      newErrors.verificationCode = '인증을 먼저 완료해주세요.';
    }

    // 에러 있으면 메시지 표시 후 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 새 비밀번호 설정 모달 열기
    setIsModalOpen(true);
  };

  // 🔵 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsCodeSent(false);
    setIsVerified(false);
    setErrors({});
  };

  // 🔵 새 비밀번호 변경 함수
  const handleNewPasswordSubmit = async () => {
    console.log('=== 새 비밀번호 변경 시작 ===');
    console.log('입력된 이메일:', formData.email);
    console.log('새 비밀번호 길이:', formData.newPassword.length);

    const newErrors = {};

    // 새 비밀번호 유효성 검사
    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검사
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 에러 있으면 메시지 표시 후 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 로딩 상태 시작
    setIsLoading(true);
    setErrors({}); // 이전 에러 초기화

    try {
      console.log('🔄 새 비밀번호 변경 API 호출 중...');

      // 실제 백엔드 API 호출
      const response = await axios.post(
        'http://localhost:18090/api/user/change-password',
        {
          email: formData.email,
          verificationCode: formData.verificationCode,
          newPassword: formData.newPassword,
        }
      );

      console.log('✅ API 응답 성공:', response.data);

      alert('비밀번호가 성공적으로 변경되었습니다.');
      closeModal();
    } catch (error) {
      console.log('❌ API 호출 실패:', error);
      console.log('에러 상세:', error.response?.data);
      console.log('에러 상태 코드:', error.response?.status);
      console.log('에러 메시지:', error.message);
      console.log('요청 데이터:', {
        email: formData.email,
        verificationCode: formData.verificationCode,
        newPassword: formData.newPassword,
      });

      if (error.response?.status === 400) {
        setErrors({
          verificationCode:
            error.response.data.message ||
            '인증 코드가 올바르지 않거나 만료되었습니다.',
        });
      } else {
        alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------- 렌더링 부분 -----------------
  return (
    <div className="password-reset-container">
      <div className="password-reset-form">
        {/* 이메일 입력 + 인증코드 발송 */}
        <div className="input-group">
          <div className="input-with-button">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="human@echospot.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            <button
              type="button"
              className="send-button"
              onClick={handleSendCode}
              disabled={isLoading || isCodeSent}
            >
              {isLoading ? '발송중...' : isCodeSent ? '재발송' : '발송'}
            </button>
          </div>
        </div>

        {errors.email && <span className="error-message">{errors.email}</span>}

        {/* 인증코드 입력 + 인증확인 */}
        <div className="input-group">
          <div className="input-with-button">
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              placeholder="1231412"
              className={`form-input ${errors.verificationCode ? 'error' : ''}`}
            />
            <button
              type="button"
              className="check"
              name="verificationCode"
              onClick={handleVerifyCode}
              disabled={isLoading || !isCodeSent || isVerified}
            >
              {isLoading ? '확인중...' : isVerified ? '인증완료' : '인증확인'}
            </button>
          </div>
        </div>

        {errors.verificationCode && (
          <span className="error-message">{errors.verificationCode}</span>
        )}

        {/* 새 비밀번호 설정 버튼 */}
        <div className="button-area-user">
          <button
            type="button"
            className="reset-button"
            onClick={handlePasswordReset}
            disabled={isLoading || !isVerified}
          >
            {isLoading ? '처리중...' : '새 비밀번호 설정'}
          </button>
        </div>
      </div>

      {/* 새 비밀번호 설정 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>새 비밀번호 설정</h3>
              <button className="close-button" onClick={closeModal}>
                x
              </button>
            </div>
            <div className="modal-body">
              {/* 새 비밀번호 입력 */}
              <div className="password-input-group">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호 (8자 이상)"
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                />
                {errors.newPassword && (
                  <span className="error-message">{errors.newPassword}</span>
                )}
              </div>

              {/* 비밀번호 확인 입력 */}
              <div className="password-input-group">
                <label>확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호 확인"
                  className={`form-input ${
                    errors.confirmPassword ? 'error' : ''
                  }`}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <p className="notice">새 비밀번호는 8자 이상이어야 합니다.</p>
            </div>
            <div className="modal-footer">
              <button
                className="confirm-button"
                onClick={handleNewPasswordSubmit}
                disabled={isLoading}
              >
                {isLoading ? '변경중...' : '비밀번호 변경'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPasswordForm;
