import React from "react";

const SpotDetailPanel = ({ poi, onClose }) => {
  return (
    <div className="spot-detail-panel">
      <button className="close-btn" onClick={onClose}>닫기</button>
      <h3>{poi.name}</h3>
      <div><b>전화번호:</b> {poi.telNo || "-"}</div>
      <div><b>주소:</b> {poi.roadName || poi.newAddress || "-"}</div>
      <div><b>업종:</b> {[poi.upperBizName, poi.middleBizName].filter(Boolean).join(" ")}</div>
    </div>
  );
};

export default SpotDetailPanel;
