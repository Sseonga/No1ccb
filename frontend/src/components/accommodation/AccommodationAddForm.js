import React, { useState } from 'react';
import AccommodationSaveButton from './AccommodationSaveButton';
import '../admin/admin.css';
/**
 * 숙소 추가 폼 컴포넌트
 * 새로운 숙소 정보를 입력받아 저장할 수 있는 폼
 */
const AccommodationAddForm = () => {
  // 숙소 정보 상태 관리
  const [accommodation, setAccommodation] = useState({
    accomName: '', // 숙소 이름
    accomDesc: '', // 숙소 소개
    accomCheckin: '', // 체크인 시간
    accomCheckout: '', // 체크아웃 시간
    accomAddress: '', // 숙소 주소
    accomAddressD: '', // 숙소 상세주소
    accomLat: '', // 위도
    accomLon: '', // 경도 (DB 컬럼명: ACCOM_LON)
    accomPhone: '', // 전화번호
    accomUrl: '', // 숙소 URL
    accomImgMain: '', // 메인 이미지 URL
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
   * @param {string} accomImgMain - 변경된 이미지 URL
   */
  const handleUrlChange = (accomImgMain) => {
    setAccommodation({ ...accommodation, accomImgMain });
  };

  /**
   * 저장 성공 시 폼 초기화 함수
   */
  const handleSaveSuccess = () => {
    setAccommodation({
      accomName: '',
      accomDesc: '',
      accomCheckin: '',
      accomCheckout: '',
      accomAddress: '',
      accomAddressD: '',
      accomLat: '',
      accomLon: '',
      accomPhone: '',
      accomUrl: '',
      accomImgMain: '',
    });
  };

  return (
    <div className="accommodation-add-form">
      {/* 폼 제목 */}
      <h2>숙소 추가</h2>

      <form>
        {/* 숙소 이름 입력 */}
        <div className="add-area">
          <div>
            <label>숙소 이름</label>
            <input
              type="text"
              name="accomName"
              value={accommodation.accomName}
              onChange={handleInputChange}
              placeholder="숙소 이름을 입력하세요"
            />
          </div>

          {/* 숙소 소개 입력 */}
          <div>
            <label>소개</label>
            <textarea
              name="accomDesc"
              value={accommodation.accomDesc}
              onChange={handleInputChange}
              placeholder="숙소 소개를 입력하세요"
            />
          </div>

          {/* 주소 입력 */}
          <div>
            <label>주소</label>
            <input
              type="text"
              name="accomAddress"
              value={accommodation.accomAddress}
              onChange={handleInputChange}
              placeholder="숙소 주소를 입력하세요"
            />
          </div>

          {/* 상세주소 입력 */}
          <div>
            <label>상세주소</label>
            <input
              type="text"
              name="accomAddressD"
              value={accommodation.accomAddressD}
              onChange={handleInputChange}
              placeholder="상세주소를 입력하세요"
            />
          </div>

          {/* 전화번호 입력 */}
          <div>
            <label>전화번호</label>
            <input
              type="text"
              name="accomPhone"
              value={accommodation.accomPhone}
              onChange={handleInputChange}
              placeholder="전화번호를 입력하세요"
            />
          </div>

          {/* 체크인 시간 입력 */}
          <div>
            <label>체크인 시간</label>
            <input
              type="time"
              name="accomCheckin"
              value={accommodation.accomCheckin}
              onChange={handleInputChange}
            />
          </div>

          {/* 체크아웃 시간 입력 */}
          <div>
            <label>체크아웃 시간</label>
            <input
              type="time"
              name="accomCheckout"
              value={accommodation.accomCheckout}
              onChange={handleInputChange}
            />
          </div>

          {/* 위도 입력 */}
          <div>
            <label>위도</label>
            <input
              type="number"
              step="0.000001"
              name="accomLat"
              value={accommodation.accomLat}
              onChange={handleInputChange}
              placeholder="위도 (예: 37.5013068)"
            />
          </div>

          {/* 경도 입력 */}
          <div>
            <label>경도</label>
            <input
              type="number"
              step="0.000001"
              name="accomLon"
              value={accommodation.accomLon}
              onChange={handleInputChange}
              placeholder="경도 (예: 127.0396597)"
            />
          </div>

          {/* 숙소 URL 입력 */}
          <div>
            <label>숙소 URL</label>
            <input
              type="url"
              name="accomUrl"
              value={accommodation.accomUrl}
              onChange={handleInputChange}
              placeholder="숙소 홈페이지 URL"
            />
          </div>

          {/* 메인 이미지 URL 입력 */}
          <div>
            <label>메인 이미지 URL</label>
            <input
              type="url"
              name="accomImgMain"
              value={accommodation.accomImgMain}
              onChange={handleInputChange}
              placeholder="메인 이미지 URL을 입력하세요"
            />
          </div>

          {/* 저장 버튼 컴포넌트 */}
          <AccommodationSaveButton
            accommodation={accommodation}
            onSaveSuccess={handleSaveSuccess}
          />
        </div>
      </form>
    </div>
  );
};

export default AccommodationAddForm;
