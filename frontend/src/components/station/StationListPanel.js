// components/StationListPanel.js

import React from "react";
import StationListCard from "./StationListCard";
import StationDetailPanel from "./StationDetailPanel";
import "./station.css";

const StationListPanel = ({ poiList, selectedPoi, onSelectPoi }) => {
  // 선택 안 했을 경우 리스트 전체 보여주기
  return (
    <div className="station-list-panel">
      <h3>주변 충전소 목록</h3>
      {poiList.length === 0 ? (
        <div className="no-result">검색된 충전소가 없습니다.</div>
      ) : (
        poiList.map((poi) => (
          <StationListCard
            key={poi.id}
            poi={poi}
            onClick={() => onSelectPoi(poi)}
          />
        ))
      )}
    </div>
  );
};

export default StationListPanel;
