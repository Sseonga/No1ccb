import React, { useState } from 'react';

/**
 * 숙소 저장 버튼 컴포넌트
 * @param {Object} props
 * @param {Object} props.accommodation - 숙소 정보 객체
 * @param {Function} props.onSaveSuccess - 저장 성공 시 호출되는 콜백
 */
const AccommodationSaveButton = ({ accommodation, onSaveSuccess }) => {
  const [loading, setLoading] = useState(false);

  // accommodation 데이터를 가공해서 빈 문자열을 null로 변환
  const sanitizeAccommodation = (data) => {
    const sanitized = { ...data };
    Object.keys(sanitized).forEach((key) => {
      // 숫자 필드는 Number로 변환, 빈 문자열은 null 처리
      if (key === 'accomLat' || key === 'accomLon') {
        sanitized[key] = sanitized[key] === '' ? null : Number(sanitized[key]);
      } else {
        sanitized[key] = sanitized[key] === '' ? null : sanitized[key];
      }
    });
    return sanitized;
  };

  // 저장 요청
  const handleSave = async () => {
    if (!accommodation.accomName || !accommodation.accomAddress) {
      alert('숙소 이름과 주소는 필수입니다.');
      return;
    }


    if (!window.confirm('숙소 정보를 저장하시겠습니까?')) return;
    console.log("숙소 저장 직전 accommodation 전체:", accommodation);
    console.log("createdId 타입:", typeof accommodation.createdId, accommodation.createdId);

    try {
      setLoading(true);

      const sanitizedAccommodation = sanitizeAccommodation(accommodation);

      const response = await fetch('/api/accommodation/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedAccommodation),
      });

      const result = await response.json();
      console.log('숙소 저장 응답:', result);

      if (result.success) {
        alert('숙소가 성공적으로 등록되었습니다.');
        onSaveSuccess && onSaveSuccess(); // 폼 초기화
      } else {
        alert('숙소 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('숙소 저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="save-button"
      onClick={handleSave}
      disabled={loading}
    >
      {loading ? '저장 중...' : '숙소 저장'}
    </button>
  );
};

export default AccommodationSaveButton;
