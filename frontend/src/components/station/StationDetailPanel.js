// components/StationDetailPanel.js
import React, { useState } from "react";
import ChargerList from "./ChargerList";
import StationReportPopup from "./StationReportPopup";
import SpotListPanel from "./SpotListPanel";

const StationDetailPanel = ({ poi, onShowSpots, onBack }) => {
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 임시 상태
  const [showReportPopup, setShowReportPopup] = useState(false); // 팝업 상태
  const [showSpotList, setShowSpotList] = useState(false); // 주변 편의시설 찾기 상태

  const handleToggleFavorite = () => {
    setIsFavorited((prev) => !prev);
    console.log(`${poi.name} 즐겨찾기 상태: ${!isFavorited}`);
    // TODO: 로그인 여부 확인 + API 연결 예정
  };

  const handleReport = () => {
    setShowReportPopup(true);
  };

  return (
    <div className="station-detail-panel">
      {/* 즐겨찾기 & 신고 버튼 */}
      <div className="station-detail-top">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span> 목록으로
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
