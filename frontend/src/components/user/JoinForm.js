import React, { useState } from 'react';
import axios from 'axios';

/**
 * 회원가입 폼 컴포넌트
 * @param {Function} onSuccess - 회원가입 성공 시 실행될 콜백 함수
 */
const JoinForm = ({ onSuccess }) => {
  // UI 스타일링을 위한 인라인 스타일 정의
  const styles = {
    // 이메일 입력창과 인증 버튼을 가로로 배치
    emailInputContainer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    // 이메일 인증 버튼 스타일
    verificationBtn: {
      padding: '8px 12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      whiteSpace: 'nowrap',
    },
    // 인증 코드 입력창과 확인 버튼을 가로로 배치
    verificationInputContainer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    // 인증 코드 확인 버튼 스타일
    verifyCodeBtn: {
      padding: '8px 12px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      whiteSpace: 'nowrap',
    },
  };

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    email: '', // 사용자 이메일
    password: '', // 비밀번호
    confirmPassword: '', // 비밀번호 확인
    agreeTerms: false, // 약관 동의 여부
    verificationCode: '', // 이메일 인증 코드
  });

  // 입력 오류 메시지 상태 관리
  const [errors, setErrors] = useState({});

  // 이메일 인증 관련 상태 관리
  const [emailVerification, setEmailVerification] = useState({
    isCodeSent: false, // 인증 코드 발송 여부
    isVerified: false, // 이메일 인증 완료 여부
    isLoading: false, // 요청 처리 중 여부 (로딩 상태)
  });

  /**
   * 입력 필드 값 변경 처리 함수
   * @param {Event} e - 입력 이벤트 객체
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      // 체크박스는 checked 값을, 일반 입력은 value 값을 사용
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * 폼 유효성 검사 함수
   * @returns {boolean} 유효성 검사 통과 여부
   */
  const validateForm = () => {
    const newErrors = {};

    // 이메일 유효성 검사
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 이메일 인증 완료 여부 확인
    if (!emailVerification.isVerified) {
      newErrors.email = '이메일 인증을 완료해주세요.';
    }

    // 비밀번호 유효성 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호가 8자 이상이어야 합니다.';
    }

    // 중복 검사 로직 (기존 코드와 중복되어 있음)
    if (!formData.password || formData.password.length < 8)
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';

    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

    // 약관 동의 확인
    if (!formData.agreeTerms) newErrors.agreeTerms = '약관 동의가 필요합니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 이메일 인증 코드 발송 함수
   * 이메일 유효성을 검사한 후 인증 코드를 발송합니다.
   */
  const handleSendVerificationCode = async () => {
    console.log('=== 인증 코드 발송 시작 ===');
    console.log('입력된 이메일:', formData.email);

    // 이메일 입력 여부 확인
    if (!formData.email) {
      console.log('❌ 이메일 미입력');
      setErrors((prev) => ({ ...prev, email: '이메일을 먼저 입력해주세요.' }));
      return;
    }

    // 이메일 형식 검증
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      console.log('❌ 이메일 형식 오류');
      setErrors((prev) => ({
        ...prev,
        email: '올바른 이메일 형식이 아닙니다.',
      }));
      return;
    }

    // 로딩 상태로 변경
    setEmailVerification((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log('🔄 백엔드 API 호출 중...');

      // 실제 백엔드 API 호출
      const res = await axios.post(
        'http://localhost:18090/api/user/send-verification',
        {
          email: formData.email,
        }
      );

      console.log('✅ API 응답 성공:', res.data);

      // 발송 성공 처리
      setEmailVerification((prev) => ({
        ...prev,
        isCodeSent: true, // 코드 발송 완료
        isLoading: false, // 로딩 상태 해제
      }));

      console.log('📧 인증 코드 발송 완료');
      alert('인증 코드가 발송되었습니다!');
    } catch (err) {
      console.log('❌ API 호출 실패:', err);
      console.log('에러 상세:', err.response?.data);

      // 오류 발생 시 로딩 상태 해제
      setEmailVerification((prev) => ({ ...prev, isLoading: false }));
      alert(
        '인증 코드 발송에 실패했습니다: ' +
          (err.response?.data?.message || '서버 오류')
      );
    }
  };

  /**
   * 인증 코드 확인 함수
   * 사용자가 입력한 인증 코드를 검증합니다.
   */
  const handleVerifyCode = async () => {
    console.log('=== 인증 코드 확인 시작 ===');
    console.log('입력된 이메일:', formData.email);
    console.log('입력된 인증 코드:', formData.verificationCode);

    // 인증 코드 입력 여부 확인
    if (!formData.verificationCode) {
      console.log('❌ 인증 코드 미입력');
      setErrors((prev) => ({
        ...prev,
        verificationCode: '인증 코드를 입력해주세요.',
      }));
      return;
    }

    // 로딩 상태로 변경
    setEmailVerification((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log('🔄 백엔드 API 호출 중...');

      // 실제 백엔드 API 호출
      const res = await axios.post(
        'http://localhost:18090/api/user/verify-code',
        {
          email: formData.email,
          verificationCode: formData.verificationCode,
        }
      );

      console.log('✅ API 응답 성공:', res.data);

      // 인증 성공 처리
      setEmailVerification((prev) => ({
        ...prev,
        isVerified: true, // 인증 완료
        isLoading: false, // 로딩 상태 해제
      }));

      // 관련 오류 메시지 제거
      setErrors((prev) => ({ ...prev, email: '', verificationCode: '' }));
      alert('이메일 인증이 완료되었습니다!');
    } catch (err) {
      console.log('❌ API 호출 실패:', err);
      console.log('에러 상세:', err.response?.data);

      // 오류 발생 시 로딩 상태 해제
      setEmailVerification((prev) => ({ ...prev, isLoading: false }));
      alert(
        '인증 코드가 올바르지 않습니다: ' +
          (err.response?.data?.message || '서버 오류')
      );
    }
  };

  /**
   * 회원가입 폼 제출 처리 함수
   * @param {Event} e - 폼 제출 이벤트 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 폼 유효성 검사 실행
    if (!validateForm()) return;

    try {
      console.log('=== 회원가입 시도 ===');
      console.log('이메일:', formData.email);
      console.log('비밀번호 길이:', formData.password.length);
      console.log('이메일 인증 상태:', emailVerification.isVerified);

      // 백엔드 회원가입 API 호출
      const response = await axios.post(
        'http://localhost:18090/api/user/join',
        {
          userEmail: formData.email,
          userPassword: formData.password,
        }
      );

      console.log('✅ 회원가입 성공:', response.data);
      alert('회원가입 성공!');

      // 성공 콜백 함수 실행 (부모 컴포넌트에서 전달받은 함수)
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log('❌ 회원가입 실패:', err);
      console.log('에러 상세:', err.response?.data);

      // 오류 발생 시 사용자에게 알림
      alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  return (
    <div className="join-form-container">
      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit} className="join-form">
        {/* 이메일 입력 및 인증 섹션 */}
        <div className="input-group">
          <div
            className="email-input-container"
            style={styles.emailInputContainer}
          >
            {/* 이메일 입력 필드 */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              className={`form-input ${errors.email ? 'errors' : ''}`}
              disabled={emailVerification.isVerified} // 인증 완료 시 수정 불가
            />
            {/* 이메일 인증 버튼 */}
            <button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={
                emailVerification.isLoading || emailVerification.isVerified
              }
              className="verification-btn"
              style={styles.verificationBtn}
            >
              {/* 버튼 텍스트는 상태에 따라 동적으로 변경 */}
              {emailVerification.isLoading
                ? '발송중...'
                : emailVerification.isVerified
                ? '인증완료'
                : emailVerification.isCodeSent
                ? '재발송'
                : '인증확인'}
            </button>
          </div>
          {/* 이메일 관련 오류 메시지 */}
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* 인증 코드 입력 필드 (인증 코드 발송 후에만 표시) */}
        {emailVerification.isCodeSent && !emailVerification.isVerified && (
          <div className="input-group">
            <div
              className="verification-input-container"
              style={styles.verificationInputContainer}
            >
              {/* 인증 코드 입력 필드 */}
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="인증 코드를 입력하세요"
                className={`form-input ${
                  errors.verificationCode ? 'error' : ''
                }`}
                maxLength="6" // 인증 코드는 최대 6자리
              />
              {/* 인증 코드 확인 버튼 */}
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={emailVerification.isLoading}
                className="verify-code-btn"
                style={styles.verifyCodeBtn}
              >
                {emailVerification.isLoading ? '확인중...' : '확인'}
              </button>
            </div>
            {/* 인증 코드 관련 오류 메시지 */}
            {errors.verificationCode && (
              <span className="error-message">{errors.verificationCode}</span>
            )}
          </div>
        )}

        {/* 비밀번호 입력 섹션 */}
        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호"
            className={`form-input ${errors.password ? 'error' : ''}`}
          />
          {/* 비밀번호 관련 오류 메시지 */}
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        {/* 비밀번호 확인 입력 섹션 */}
        <div className="input-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="비밀번호 재확인"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          />
          {/* 비밀번호 확인 관련 오류 메시지 */}
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {/* 약관 동의 섹션 */}
        <div className="terms-section">
          <div className="checkbox-group">
            {/* 약관 동의 체크박스 */}
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
          {/* 약관 동의 관련 오류 메시지 */}
          {errors.agreeTerms && (
            <span className="error-message">{errors.agreeTerms}</span>
          )}

          {/* 개인정보 수집 및 이용 약관 내용 */}
          <div className="terms-context">
            <p className="terms-text">
              "echo spot"은 회원가입 및 서비스 제공을 위해 아래와 같이
              개인정보를 수집·이용합니다.
              <br />
              수집항목:이름,이메일,주소 등<br />
              이용목적:회원가입, 서비스 제공, 고객상담, 마케팅 활동
              <br />
              보유기간:회원탈퇴 시까지(관련 법령에 따라 일정기간 보관)
              <br />
              개인정보 수집·이용에 동의하지 않으실 경우 회원가입이 제한될 수
              있습니다.
            </p>
          </div>
        </div>

        {/* 회원가입 제출 버튼 */}
        <button type="submit" className="submit-button">
          회원 가입
        </button>
      </form>
    </div>
  );
};

// 회원가입 폼 컴포넌트를 기본 내보내기로 설정
export default JoinForm;
