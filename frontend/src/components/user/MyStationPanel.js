import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


// API 기본 URL 자동 감지 함수
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = process.env.REACT_APP_API_PORT || '18090';
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`;
  }
  return `http://${hostname}:${port}`;
};

const MyStationPanel = () => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // 이메일 정보 획득
  const email =
    localStorage.getItem('email') || sessionStorage.getItem('email');

  // 1. 전체 브랜드 목록 조회
  const fetchAllBrands = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(`${getApiBaseUrl()}/api/brands/all`);

      const brands = (response.data.brands || []).map((brand) => ({
        brand_id:
          brand.brand_id ||
          brand.brandId ||
          brand.CODE_DETAIL_ID ||
          brand.BRAND_ID,
        brand_name:
          brand.brand_name ||
          brand.brandName ||
          brand.CODE_DETAIL_NAME ||
          brand.BRAND_NAME ||
          '알 수 없는 운영사',
      }));
      setAvailableBrands(brands);
    } catch (error) {
      // 실패 시 임시 데이터
      const mockBrands = [
        { brand_id: 'OP_001', brand_name: '한국전력공사' },
        { brand_id: 'OP_002', brand_name: '환경부' },
        { brand_id: 'OP_003', brand_name: 'SK네트웍스' },
        { brand_id: 'OP_004', brand_name: 'GS칼텍스' },
        { brand_id: 'OP_005', brand_name: 'S-Oil' },
        { brand_id: 'OP_006', brand_name: '현대자동차' },
        { brand_id: 'OP_007', brand_name: '기아' },
        { brand_id: 'OP_008', brand_name: '포스코에너지' },
      ];
      setAvailableBrands(mockBrands);
      setError('서버 연결 실패 - 임시 데이터로 표시 중');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. 사용자의 선호 브랜드 목록 조회
  const fetchUserBrands = useCallback(async () => {
    if (!email) {
      setSelectedBrands([]);
      return;
    }
    try {
      setError(null);
      const response = await axios.get(
        `${getApiBaseUrl()}/api/brands/${email}/active`
      );
      // 서버가 brands 배열을 리턴한다고 가정
      const brands = response.data.brands || [];
      // 브랜드 ID만 뽑아 배열로 저장
      const selectedBrandIds = brands.map(
        (brand) => brand.brand_id || brand.brandId || brand.CODE_DETAIL_ID
      );
      setSelectedBrands(selectedBrandIds);
    } catch (error) {
      setSelectedBrands([]);
    }
  }, [email]);

  // 컴포넌트 마운트 시 데이터 요청
  useEffect(() => {
    fetchAllBrands();
  }, [fetchAllBrands]);

  useEffect(() => {
    if (email) fetchUserBrands();
    else setLoading(false);
  }, [email, fetchUserBrands]);

  // 브랜드 선택/해제 핸들러
  const handleBrandToggle = async (brandId) => {
    if (!email) {
      setError('로그인이 필요합니다.');
      return;
    }
    if (isProcessing) return;

    const isCurrentlySelected = selectedBrands.includes(brandId);
    const updatedBrands = isCurrentlySelected
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(updatedBrands);

    try {
      setIsProcessing(true);
      setError(null);
      // 서버 동기화(선호도 토글)
      if (isCurrentlySelected) {
        // DELETE 요청
        await axios.delete(`${getApiBaseUrl()}/api/brands/${email}/${brandId}`);
      } else {
        // POST 요청
        await axios.post(`${getApiBaseUrl()}/api/brands/${email}/toggle`, {
          brandId: brandId,
          isActive: true,
        });
      }
    } catch (error) {
      setError('서버와 동기화 중 오류 발생(로컬에서는 UI만 반영됨)');
    } finally {
      setIsProcessing(false);
    }
  };

  // 에러 상태
  if (error && availableBrands.length === 0) {
    return (
      <div className="mystation-wrapper">
        <div className="mystation-panel">
          <div className="error-state">
            <h3>오류가 발생했습니다</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              페이지 새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="mystation-wrapper">
        <div className="mystation-panel">
          <div className="loading">브랜드 설정을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 메인 화면
  return (
    <div className="mystation-wrapper">
      <div className="mystation-panel">
        <div className="panel-header">
          <h3>내 충전소 운영사 설정</h3>
          <p className="panel-description">
            선호하는 충전소 운영사를 선택하면 메인 화면에서 해당 운영사의
            충전소만 우선적으로 표시됩니다.
          </p>
          {!email && (
            <div className="login-notice">
              <p>⚠️ 로그인 후 이용 가능합니다.</p>
            </div>
          )}
        </div>
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
          </div>
        )}
        <div className="brand-content">
          <div className="brand-list">
            {availableBrands.map((brand, index) => (
              <div
                key={brand.brand_id || `brand-${index}`}
                className="brand-card"
              >
                <div className="brand-info">
                  <h4 className="brand-name">
                    {brand.brand_name || '알 수 없는 운영사'}
                  </h4>
                  <p className="brand-description">
                    {brand.brand_name || '알 수 없는 운영사'} 운영 충전소를 메인
                    화면에서 우선 표시
                  </p>
                </div>
                <div className="brand-actions">
                  <button
                    className={`toggle-btn ${
                      selectedBrands.includes(brand.brand_id)
                        ? 'active'
                        : 'inactive'
                    } ${isProcessing ? 'processing' : ''}`}
                    onClick={() => handleBrandToggle(brand.brand_id)}
                    disabled={!email || isProcessing}
                  >
                    {isProcessing
                      ? '처리 중...'
                      : selectedBrands.includes(brand.brand_id)
                      ? '선택됨'
                      : '선택 안됨'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedBrands.length > 0 && (
            <div className="selected-summary">
              <h4>선택된 운영사: {selectedBrands.length}개</h4>
              <div className="selected-brands">
                {selectedBrands.map((brandId, index) => {
                  const brand = availableBrands.find(
                    (b) => b.brand_id === brandId
                  );
                  return (
                    <span key={index} className="selected-brand-tag">
                      {brand ? brand.brand_name : brandId}
                    </span>
                  );
                })}
              </div>
              <p className="summary-note">
                메인 화면에서 선택된 운영사의 충전소가 우선적으로 표시됩니다.
              </p>
            </div>
          )}
          {selectedBrands.length === 0 && email && (
            <div className="empty-state">
              <p>선택된 운영사가 없습니다.</p>
              <p>
                원하는 운영사를 선택하여 메인 화면에서 해당 충전소를 우선
                표시해보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStationPanel;
