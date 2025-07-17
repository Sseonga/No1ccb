// components/StationDetailPanel.js
import React from "react";
import ChargerList from "./ChargerList";
import ReviewLinkButton from "./ReviewLinkButton";

const StationDetailPanel = ({ poi }) => {

  return (
    <div className="station-detail-panel" style={{
      background: "#fafafa",
      padding: "12px",
      border: "1px solid #ddd",
      animation: "slide-down 0.3s ease",
    }}>
      <div><b>건물명:</b> {poi.buildingName || "-"}</div>
      <div><b>전화번호:</b> {poi.telNo || "-"}</div>
      <div><b>업종:</b> {[poi.upperBizName, poi.middleBizName].filter(Boolean).join(" ")}</div>

      <ChargerList evChargers={poi.evChargers?.evCharger} />
    </div>
  );
};

export default StationDetailPanel;
