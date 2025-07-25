// components/StationDetailPanel.js
import React, { useEffect, useState } from "react";
import ChargerList from "./ChargerList";
import StationReportPopup from "./StationReportPopup";
import SpotListPanel from "./SpotListPanel";
import { checkLoginWithConfirm } from "../../util/auth";

const isLogined = sessionStorage.getItem("userId");

const StationDetailPanel = ({ poi, onShowSpots, onBack }) => {
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 임시 상태
  const [showReportPopup, setShowReportPopup] = useState(false); // 팝업 상태
  const [showSpotList, setShowSpotList] = useState(false); // 주변 편의시설 찾기 상태

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!userId || !poi?.pkey) return;

      try {
        const res = await fetch(
          `/api/favor/exist?userId=${userId}&stationId=${poi.pkey}`
        );
        const data = await res.json();
        setIsFavorited(data.favorited); // 백엔드에서 true/false로 응답
      } catch (err) {
        console.error("즐겨찾기 여부 조회 실패:", err);
      }
    };

    fetchFavoriteStatus();
  }, [poi?.pkey, userId]);

  const handleToggleFavorite = async () => {
    if (!checkLoginWithConfirm()) return;

    try {
      const userId = sessionStorage.getItem("userId");
      const response = await fetch("/api/favor", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          stationId: poi.pkey,
          poiInfo: poi,
          operatorId: poi.evChargers?.evCharger?.[0]?.operatorId,
          fullAddressRoad: poi.newAddressList?.newAddress?.[0]?.fullAddressRoad,
        }),
      });

      if (response.ok) {
        setIsFavorited((prev) => !prev);
      } else {
        alert("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleReport = () => {
    if (!checkLoginWithConfirm()) return;

    setShowReportPopup(true);
  };

  return (
    <div className="station-detail-panel">
      {/* 즐겨찾기 & 신고 버튼 */}
      <div className="station-detail-top">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">
            <i className="fa-solid fa-arrow-left" style={{ fontSize: 12 }}></i>
          </span>{" "}
          목록으로
        </button>
        <div>
          <button
            onClick={handleToggleFavorite}
            className={`favorite-btn ${isFavorited ? "active" : ""}`}
          >
            {isFavorited ? "★ 즐겨찾기" : "☆ 즐겨찾기"}
          </button>
          <span> </span>
          <button onClick={handleReport} className="report-btn">
            🚩 신고하기
          </button>
        </div>
      </div>

      <div>
        <b>충전소명:</b> {poi.name || "-"}
      </div>
      <div>
        <b>전화번호:</b> {poi.telNo || "-"}
      </div>
      <div>
        <b>업종:</b>{" "}
        {[poi.upperBizName, poi.middleBizName].filter(Boolean).join(" ")}
      </div>
      <div>
        <b>주소:</b> {poi.newAddress || poi.roadName || "-"}
      </div>
      <div>
        <b>주차장:</b> {poi.parkingId ? "연계됨" : "정보 없음"}
      </div>

      <ChargerList evChargers={poi.evChargers?.evCharger} />

      {showReportPopup && (
        <StationReportPopup
          stationId={poi.id}
          onClose={() => setShowReportPopup(false)}
        />
      )}

      <button onClick={onShowSpots} className="spot-search-btn">
        주변 편의시설 찾기
      </button>

      {showSpotList && (
        <SpotListPanel
          center={{ lat: poi.frontLat, lon: poi.frontLon }}
          onClose={() => setShowSpotList(false)}
        />
      )}
    </div>
  );
};

export default StationDetailPanel;
