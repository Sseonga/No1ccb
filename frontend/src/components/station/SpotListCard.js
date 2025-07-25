import React, { forwardRef } from "react";
import SpotDetailPanel from "./SpotDetailPanel";

const SpotListCard = forwardRef(({ poi, isOpen, onClick }, ref) => {
  return (
    <li ref={ref} className={`spot-list-card ${isOpen ? "open" : ""}`}>
      <div className="poi-title" onClick={onClick}>
        {poi.name}
      </div>
      <div className={`spot-detail-wrapper ${isOpen ? "visible" : "hidden"}`}>
        <SpotDetailPanel poi={poi} />
      </div>
    </li>
  );
});

export default SpotListCard;
