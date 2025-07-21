// components/StationListPanel.js

import React from "react";
import StationListCard from "./StationListCard";
import StationDetailPanel from "./StationDetailPanel";
import "./station.css";

const StationListPanel = ({ poiList, selectedPoi, onSelectPoi }) => {
  // 선택된 충전소가 있다면 상세 화면만 보여주기
  if (selectedPoi) {
    return (
      <div className="station-list-panel">
        <button className="back-button" onClick={() => onSelectPoi(null)}>← 목록으로</button>
        <StationDetailPanel poi={selectedPoi} />
      </div>
    );
  }

  // 선택 안 했을 경우 리스트 전체 보여주기
  return (
    <div className="station-list-panel">
      <h3>주변 충전소 목록</h3>
      {poiList.map((poi) => (
        <StationListCard
          key={poi.id}
          poi={poi}
          onClick={() => onSelectPoi(poi)}
        />
      ))}
    </div>
  );
};

export default StationListPanel;
