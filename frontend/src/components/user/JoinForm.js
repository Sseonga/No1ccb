import React, { useState } from 'react';
import axios from 'axios';

const JoinForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    verificationCode: '',
  });

  const [errors, setErrors] = useState({});
  const [emailVerification, setEmailVerification] = useState({
    isCodeSent: false,
    isVerified: false,
    isLoading: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';
    if (!emailVerification.isVerified) newErrors.email = '이메일 인증을 완료해주세요.';

    if (!formData.password || formData.password.length < 8)
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

    if (!formData.agreeTerms) newErrors.agreeTerms = '약관 동의가 필요합니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerificationCode = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: '유효한 이메일을 입력해주세요.',
      }));
      return;
    }

    setEmailVerification((prev) => ({ ...prev, isLoading: true }));

    try {
      await axios.post('http://localhost:18090/api/user/send-verification', {
        email: formData.email,
      });

      setEmailVerification((prev) => ({
        ...prev,
        isCodeSent: true,
        isLoading: false,
      }));

      alert('인증 코드가 발송되었습니다!');
    } catch (err) {
      setEmailVerification((prev) => ({ ...prev, isLoading: false }));
      alert('인증 코드 발송 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: '인증 코드를 입력해주세요.',
      }));
      return;
    }

    setEmailVerification((prev) => ({ ...prev, isLoading: true }));

    try {
      await axios.post('http://localhost:18090/api/user/verify-code', {
        email: formData.email,
        verificationCode: formData.verificationCode,
      });

      setEmailVerification((prev) => ({
        ...prev,
        isVerified: true,
        isLoading: false,
      }));

      setErrors((prev) => ({
        ...prev,
        email: '',
        verificationCode: '',
      }));

      alert('이메일 인증이 완료되었습니다!');
    } catch (err) {
      setEmailVerification((prev) => ({ ...prev, isLoading: false }));
      alert('인증 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:18090/api/user/join', {
        userEmail: formData.email,
        userPassword: formData.password,
      });

      alert('회원가입 성공!');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  return (
    <div className="join-form-container">
      <form onSubmit={handleSubmit} className="join-form">
        {/* 이메일 */}
        <div className="input-group">
          <div className="email-input-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={emailVerification.isVerified}
            />
            <button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={emailVerification.isLoading || emailVerification.isVerified}
              className="verification-btn"
            >
              {emailVerification.isLoading
                ? '발송중...'
                : emailVerification.isVerified
                ? '인증완료'
                : emailVerification.isCodeSent
                ? '재발송'
                : '인증확인'}
            </button>
          </div>

        </div>

        {errors.email && <span className="error-message">{errors.email}</span>}

        {/* 인증코드 */}
        {emailVerification.isCodeSent && !emailVerification.isVerified && (
          <div className="input-group">
            <div className="verification-input-container">
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="인증 코드를 입력하세요"
                className={`form-input ${errors.verificationCode ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={emailVerification.isLoading}
                className="verify-code-btn"
              >
                {emailVerification.isLoading ? '확인중...' : '확인'}
              </button>
            </div>
            {errors.verificationCode && (
              <span className="error-message">{errors.verificationCode}</span>
            )}
          </div>
        )}

        {/* 비밀번호 */}
        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호"
            className={`form-input ${errors.password ? 'error' : ''}`}
          />

        </div>

         {errors.password && <span className="error-message">{errors.password}</span>}

        {/* 비밀번호 확인 */}
        <div className="input-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="비밀번호 재확인"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {/* 약관 */}
        <div className="terms-section">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="checkbox-input"
            />
            <label htmlFor="agreeTerms" className="checkbox-label">
              개인정보 수집 및 이용에 동의합니다.(필수)
            </label>
          </div>
          {errors.agreeTerms && (
            <span className="error-message">{errors.agreeTerms}</span>
          )}
          <div className="terms-context">
            <p className="terms-text">
              "echo spot"은 회원가입 및 서비스 제공을 위해 아래와 같이
              개인정보를 수집·이용합니다.
              <br />
              수집항목: 이름, 이메일, 주소 등
              <br />
              이용목적: 회원가입, 서비스 제공, 고객상담, 마케팅 활동
              <br />
              보유기간: 회원탈퇴 시까지 (관련 법령에 따라 일정기간 보관)
              <br />
              개인정보 수집·이용에 동의하지 않으실 경우 회원가입이 제한될 수
              있습니다.
            </p>
          </div>
        </div>

        <div className="button-area-user">
          <button type="submit" className="submit-button">
            회원 가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinForm;