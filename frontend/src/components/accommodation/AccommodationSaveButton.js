import React from 'react';

/**
 * 숙소 저장 버튼 컴포넌트
 * 입력된 숙소 정보를 검증하고 저장하는 기능
 *
 * @param {Object} accommodation - 저장할 숙소 정보
 */
const AccommodationSaveButton = ({ accommodation }) => {
  /**
   * 입력 데이터 유효성 검증 함수
   * @returns {boolean} 유효성 검증 결과
   */
  const validateData = () => {
    if (!accommodation.name.trim()) {
      alert('숙소 이름을 입력해주세요.');
      return false;
    }
    if (!accommodation.description.trim()) {
      alert('숙소 소개를 입력해주세요.');
      return false;
    }
    if (!accommodation.details.trim()) {
      alert('상세 내용을 입력해주세요.');
      return false;
    }
    if (!accommodation.imageurl.trim()) {
      alert('이미지 URL을 입력해주세요.');
      return false;
    }
    return true;
  };

  /**
   * 저장 버튼 클릭 처리 함수
   * 유효성 검증 후 저장 로직 실행
   */
  const handleSave = () => {
    if (validateData()) {
      // 실제로는 API 호출로 서버에 저장
      console.log('숙소 저장:', accommodation);
      alert('숙소가 성공적으로 저장되었습니다!');
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      className="save-button"
      aria-label="숙소 정보 저장" // 접근성을 위한 라벨
    >
      저장
    </button>
  );
};

export default AccommodationSaveButton;
