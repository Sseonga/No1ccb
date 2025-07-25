import React, { useState } from 'react';
import AccommodationSaveButton from './AccommodationSaveButton';
import '../admin/admin.css';

const AccommodationAddForm = () => {
  const [accommodation, setAccommodation] = useState({
    accomName: '',
    accomDesc: '',
    accomCheckin: '',
    accomCheckout: '',
    accomAddress: '',
    accomLat: '',
    accomLon: '',
    accomUrl: '',
    accomImgMain1: '',
    createdId: Number(sessionStorage.getItem('userId')),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccommodation({ ...accommodation, [name]: value });
  };

  const handleSaveSuccess = () => {
    setAccommodation({
      accomName: '',
      accomDesc: '',
      accomCheckin: '',
      accomCheckout: '',
      accomAddress: '',
      accomLat: '',
      accomLon: '',
      accomUrl: '',
      accomImgMain1: '',
      createdId: Number(sessionStorage.getItem('userId')),
    });


  };

  return (
    <div className="accommodation-add-form">
      <h2>관리자페이지</h2>

      <form>
        <div className="add-area">
          <div className="table-name">숙소추가</div>

          {/* 숙소 이름 입력 */}
          <div className="accoset">
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
          <div className="accoset">
            <label>객실 정보</label>
            <input
              type="text"
              name="accomDesc"
              value={accommodation.accomDesc}
              onChange={handleInputChange}
              placeholder="객실 정보를 입력하세요"
            />
          </div>

          {/* 주소 입력 */}
          <div className="accoset">
            <label>주소</label>
            <input
              type="text"
              name="accomAddress"
              value={accommodation.accomAddress}
              onChange={handleInputChange}
              placeholder="숙소 주소를 입력하세요"
            />
          </div>

          {/* 체크인 시간 입력 */}
          <div className="accoset">
            <label>체크인</label>
            <input
              type="time"
              name="accomCheckin"
              className="inout"
              value={accommodation.accomCheckin}
              onChange={handleInputChange}
            />
          </div>

          {/* 체크아웃 시간 입력 */}
          <div className="accoset">
            <label>체크아웃</label>
            <input
              type="time"
              className="inout"
              name="accomCheckout"
              value={accommodation.accomCheckout}
              onChange={handleInputChange}
            />
          </div>

          {/* 위도 입력 */}
          <div className="accoset">
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
          <div className="accoset">
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
          <div className="accoset">
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
          <div className="accoset">
            <label>이미지 URL</label>
            <input
              type="url"
              name="accomImgMain1"
              value={accommodation.accomImgMain1}
              onChange={handleInputChange}
              placeholder="메인 이미지 URL을 입력하세요"
            />
          </div>

          {/* 생성자 ID 입력 (관리자 ID) */}



          {/* 저장 버튼 */}
          <div className="add_button">
            <AccommodationSaveButton
              accommodation={accommodation}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccommodationAddForm;
