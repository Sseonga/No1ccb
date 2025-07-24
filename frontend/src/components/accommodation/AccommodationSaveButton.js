import React, { useState } from 'react';
import axios from 'axios';

/**
 * 숙소 저장 버튼 컴포넌트
 * 입력된 숙소 정보를 검증하고 저장하는 기능
 *
 * @param {Object} accommodation - 저장할 숙소 정보
 * @param {Function} onSaveSuccess - 저장 성공 시 콜백 함수
 */
const AccommodationSaveButton = ({ accommodation, onSaveSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 입력 데이터 유효성 검증 함수
   * @returns {boolean} 유효성 검증 결과
   */
  const validateData = () => {
    if (!accommodation.accomName.trim()) {
      alert('숙소 이름을 입력해주세요.');
      return false;
    }
    if (!accommodation.accomDesc.trim()) {
      alert('숙소 소개를 입력해주세요.');
      return false;
    }
    if (!accommodation.accomAddress.trim()) {
      alert('숙소 주소를 입력해주세요.');
      return false;
    }
    if (!accommodation.accomPhone.trim()) {
      alert('전화번호를 입력해주세요.');
      return false;
    }
    // 위도, 경도는 선택사항이지만 둘 다 입력되어야 함
    if (accommodation.accomLat && !accommodation.accomLon) {
      alert('경도도 함께 입력해주세요.');
      return false;
    }
    if (accommodation.accomLon && !accommodation.accomLat) {
      alert('위도도 함께 입력해주세요.');
      return false;
    }
    return true;
  };

  /**
   * 저장 버튼 클릭 처리 함수
   * 유효성 검증 후 API 호출로 서버에 저장
   */
  const handleSave = async () => {
    if (!validateData()) return;

    setIsLoading(true);

    try {
      console.log('=== 숙소 저장 시작 ===');
      console.log('숙소 데이터:', accommodation);

      const response = await axios.post(
        'http://localhost:18090/api/accommodation/add',
        accommodation
      );

      console.log('서버 응답:', response.data);
      alert('숙소가 성공적으로 저장되었습니다!');

      // 저장 성공 시 콜백 함수 실행 (폼 초기화 등)
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('숙소 저장 실패:', error);

      if (error.response?.data?.message) {
        alert(`저장 실패: ${error.response.data.message}`);
      } else {
        alert('숙소 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      className="save-button"
      disabled={isLoading}
      style={{
        backgroundColor: isLoading ? '#ccc' : '#007bff',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        fontSize: '16px',
        marginTop: '20px',
      }}
      aria-label="숙소 정보 저장"
    >
      {isLoading ? '저장 중...' : '저장하기'}
    </button>
  );
};

export default AccommodationSaveButton;
