import React, { useState, useEffect } from "react";
import './Accommodation.css';
import { checkLoginWithConfirm } from "../../util/auth";

const AccommodationDetail = ({ accommodation, onBack }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const userId = sessionStorage.getItem("userId");

  // 즐겨찾기 상태 조회
  const fetchFavoriteStatus = async () => {
    if (!userId || !accommodation?.accomId) return;

    try {
      const res = await fetch(
        `/api/favor/exist?userId=${parseInt(userId)}&stationId=${parseInt(accommodation.accomId)}&type=accommodation`
      );
      const data = await res.json();
      setIsFavorited(data.favorited);
    } catch (err) {
      console.error("숙소 즐겨찾기 여부 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchFavoriteStatus();
  }, [accommodation?.accomId, userId]);

  // 즐겨찾기 업데이트 이벤트 감지
  useEffect(() => {
    const handleFavoriteUpdate = () => {
      fetchFavoriteStatus();
    };

    window.addEventListener('favoriteUpdated', handleFavoriteUpdate);
    
    return () => {
      window.removeEventListener('favoriteUpdated', handleFavoriteUpdate);
    };
  }, [accommodation?.accomId, userId]);

  const handleToggleFavorite = async () => {
    if (!checkLoginWithConfirm()) return;

    try {
      const response = await fetch("/api/favor", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          stationId: parseInt(accommodation.accomId),
          poiInfo: {
            name: accommodation.accomName,
            frontLat: parseFloat(accommodation.accomLat) || 0,
            frontLon: parseFloat(accommodation.accomLon) || 0,
          },
          operatorId: "ACCOM_01", // 숙소 운영자 코드
          fullAddressRoad: accommodation.accomAddressD || accommodation.accomAddress,
        }),
      });

      if (response.ok) {
        setIsFavorited((prev) => !prev);
        alert(isFavorited ? "즐겨찾기에서 제거되었습니다." : "즐겨찾기에 추가되었습니다.");
        
        // 마이페이지 새로고침을 위한 이벤트 발생
        window.dispatchEvent(new Event('favoriteUpdated'));
      } else {
        alert("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("숙소 즐겨찾기 처리 실패:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  if (!accommodation) return null;

  return (
    <div style={{ padding: 24, position: "relative", height: "100%" }}>
      <div className="station-detail-top">
        {/* 뒤로가기 */}
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">
            <i className="fa-solid fa-arrow-left" style={{ fontSize: 12 }}></i>
          </span>
          목록으로
        </button>
        {/* 즐겨찾기 */}
        <button
          onClick={handleToggleFavorite}
          className={`favorite-btn ${isFavorited ? "active" : ""}`}
        >
          {isFavorited ? "★ 즐겨찾기" : "☆ 즐겨찾기"}
        </button>
      </div>

      {/* 숙소 이름 */}
      <h2 style={{ margin: "18px 0 0 0", fontSize: 18 }}>{accommodation.accomName}</h2>

      {/* 숙소 주소 */}
      <div style={{ color: "#888", marginBottom: 10, fontSize: 12 }}>
        {accommodation.accomAddress}
        {accommodation.accomAddressD ? ` (${accommodation.accomAddressD})` : ""}
      </div>

      {/* 대표 이미지 */}
      {accommodation.accomImgMain1 && (
        <img
          src={`/image/${accommodation.accomImgMain1}`}
          alt={accommodation.accomName}
          style={{ width: "100%", borderRadius: 12, margin: "10px 0" }}
        />
      )}

      {/* 객실 정보 박스 */}
      {accommodation.accomDesc && (
        <div style={{ margin: "10px 0", color: "#444" }}>
          <strong>
            <i className="fa-solid fa-door-closed"></i> 객실 정보<br />
          </strong>
          {accommodation.accomDesc}
        </div>
      )}

      {/* 체크인/체크아웃 박스 */}
      <div style={{ margin: "20px 0px 20px 0px", color: "#444" }}>
        <strong>
          <i className="fa-solid fa-key"></i> 체크인/체크아웃 안내<br />
        </strong>
        <div style={{ marginTop: 6, fontSize: 15 }}>
          <span style={{ fontWeight: 500 }}>
            <i className="fa-solid fa-arrow-right-to-bracket" style={{ color: "#1976d2", marginRight: 5 }}></i>
            체크인 가능시간:
          </span>{" "}
          <b style={{ color: "#1976d2" }}>
            {accommodation.accomCheckin
              ? `오후 ${accommodation.accomCheckin}시 가능`
              : "-"}
          </b>
        </div>
        <div style={{ fontSize: 15, marginTop: 4 }}>
          <span style={{ fontWeight: 500 }}>
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: "#b71c1c", marginRight: 5 }}></i>
            체크아웃 시간:
          </span>{" "}
          <b style={{ color: "#b71c1c" }}>
            {accommodation.accomCheckout
              ? `오전 ${accommodation.accomCheckout}시까지`
              : "-"}
          </b>
        </div>
      </div>
      더 많은 정보가 궁금하시다면?
      {/* 홈페이지 */}
      {accommodation.accomUrl && (
        <div style={{ margin: "0px 0" }}>

          <a
            href={accommodation.accomUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2196f3", textDecoration: "underline" }}
          >
            홈페이지 바로가기
          </a>
        </div>
      )}
    </div>
  );
};

export default AccommodationDetail;
