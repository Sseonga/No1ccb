import React, { useState } from 'react';
import AccommodationSaveButton from './AccommodationSaveButton';

/**
 * 숙소 추가 폼 컴포넌트
 * 새로운 숙소 정보를 입력받아 저장할 수 있는 폼
 */
const AccommodationAddForm = () => {
  // 숙소 정보 상태 관리
  const [accommodation, setAccommodation] = useState({
    name: '', // 숙소 이름
    description: '', // 숙소 소개
    details: '', // 상세 내용
    imageurl: '', // 이미지 URL
  });

  /**
   * 입력 필드 변경 처리 함수
   * @param {Event} e - 입력 필드 변경 이벤트
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccommodation({ ...accommodation, [name]: value });
  };

  /**
   * 이미지 URL 변경 처리 함수 (별도 처리용)
   * @param {string} imageurl - 변경된 이미지 URL
   */
  const handleUrlChange = (imageurl) => {
    setAccommodation({ ...accommodation, imageurl });
  };

  return (
    <div className="accommodation-add-form">
      {/* 폼 제목 */}
      <h2>숙소 추가</h2>

      <form>
        {/* 숙소 이름 입력 */}
        <div>
          <label>숙소 이름</label>
          <input
            type="text"
            name="name"
            value={accommodation.name}
            onChange={handleInputChange}
            placeholder="숙소 이름을 입력하세요"
          />
        </div>

        {/* 숙소 소개 입력 */}
        <div>
          <label>소개</label>
          <textarea
            name="description"
            value={accommodation.description}
            onChange={handleInputChange}
            placeholder="숙소 소개를 입력하세요"
          />
        </div>

        {/* 상세 내용 입력 */}
        <div>
          <label>상세내용</label>
          <textarea
            name="details"
            value={accommodation.details}
            onChange={handleInputChange}
            placeholder="상세 내용을 입력하세요"
          />
        </div>

        {/* 이미지 URL 입력 */}
        <div>
          <label>이미지 URL</label>
          <input
            type="text"
            name="imageurl"
            value={accommodation.imageurl}
            onChange={handleInputChange}
            placeholder="이미지 URL을 입력하세요"
          />
        </div>

        {/* 저장 버튼 컴포넌트 */}
        <AccommodationSaveButton accommodation={accommodation} />
      </form>
    </div>
  );
};

export default AccommodationAddForm;
