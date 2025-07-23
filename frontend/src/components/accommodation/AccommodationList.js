import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccommodationList.css';

/**
 * 추천 숙소 목록 컴포넌트
 * 관리자가 추가한 숙소들을 사용자에게 보여주는 페이지
 */
const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 컴포넌트 마운트 시 숙소 목록 조회
   */
  useEffect(() => {
    fetchAccommodations();
  }, []);

  /**
   * 숙소 목록 조회 함수
   */
  const fetchAccommodations = async () => {
    try {
      console.log('=== 숙소 목록 조회 시작 ===');
      setLoading(true);

      const response = await axios.get(
        'http://localhost:18090/api/accommodation/list'
      );

      console.log('서버 응답:', response.data);
      setAccommodations(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error('숙소 목록 조회 실패:', error);
      setError('숙소 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로딩 중 표시
   */
  if (loading) {
    return (
      <div className="accommodation-list-container">
        <div className="loading">숙소 정보를 불러오는 중...</div>
      </div>
    );
  }

  /**
   * 에러 발생 시 표시
   */
  if (error) {
    return (
      <div className="accommodation-list-container">
        <div className="error">{error}</div>
        <button onClick={fetchAccommodations} className="retry-btn">
          다시 시도
        </button>
      </div>
    );
  }

  /**
   * 숙소 목록이 비어있을 때
   */
  if (accommodations.length === 0) {
    return (
      <div className="accommodation-list-container">
        <div className="empty-message">
          <h2>추천 숙소</h2>
          <p>아직 등록된 숙소가 없습니다.</p>
          <p>관리자가 추천 숙소를 추가하면 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  /**
   * 숙소 목록 렌더링
   */
  return (
    <div className="accommodation-list-container">
      <h2 className="page-title">⭐ 추천 숙소</h2>
      <p className="page-subtitle">
        전기차 충전소 근처 추천 숙소를 소개합니다!
      </p>

      <div className="accommodations-grid">
        {accommodations.map((accom) => (
          <div key={accom.accomId} className="accommodation-card">
            <div className="card-image">
              <img
                src={accom.imageurl}
                alt={accom.name}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg'; // 기본 이미지
                }}
              />
            </div>

            <div className="card-content">
              <h3 className="accommodation-name">{accom.name}</h3>
              <p className="accommodation-description">{accom.description}</p>

              <div className="accommodation-details">
                <p>{accom.details}</p>
              </div>

              <div className="card-footer">
                <span className="created-date">
                  등록일: {accom.createdDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="refresh-section">
        <button onClick={fetchAccommodations} className="refresh-btn">
          🔄 새로고침
        </button>
      </div>
    </div>
  );
};

export default AccommodationList;
