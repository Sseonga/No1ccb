import React from "react";
import SpotDetailPanel from "./SpotDetailPanel";

const SpotListCard = ({ poi, isOpen, onClick }) => {
  return (
    <li className={`spot-list-card ${isOpen ? "open" : ""}`}>
      <div className="poi-title" onClick={onClick}>
        {poi.name}
      </div>
      <div className={`spot-detail-wrapper ${isOpen ? "visible" : "hidden"}`}>
        <SpotDetailPanel poi={poi} />
      </div>
    </li>
  );
};

export default SpotListCard;
