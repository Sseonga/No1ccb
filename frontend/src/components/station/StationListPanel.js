// components/StationListPanel.js
import React, { useState } from "react";
import StationListCard from "./StationListCard";
import StationDetailPanel from "./StationDetailPanel";
import "./station.css";

const StationListPanel = ({ poiList }) => {

  const [selectedPoiId, setSelectedPoiId] = useState(null);

  const handleCardClick = (poiId) => {
    setSelectedPoiId((prev) => (prev === poiId ? null : poiId));
  };

  return (
    <div className="station-list-panel">
      <h3>주변 충전소 목록</h3>
      {poiList.map((poi) => (
        <div key={poi.id}>
          <StationListCard
            poi={poi}
            isSelected={selectedPoiId === poi.id}
            onClick={() => handleCardClick(poi.id)}
          />
          {selectedPoiId === poi.id && (
            <div className="station-detail-wrapper">
              <StationDetailPanel poi={poi} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default StationListPanel;
