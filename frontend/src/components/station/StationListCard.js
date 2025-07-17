// components/StationListCard.js
import React from "react";

const StationListCard = ({ poi, onClick, isSelected }) => {

  return (
    <div
      className={`station-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: "12px",
        borderBottom: "1px solid #ccc",
        backgroundColor: isSelected ? "#f4f8ff" : "white",
        transition: "background 0.3s"
      }}
    >
      <div><b>{poi.name}</b></div>
      <div style={{ fontSize: 12, color: "#666" }}>
        {poi.newAddressList?.newAddress?.[0]?.fullAddress ||
          `${poi.upperAddrName ?? ""} ${poi.middleAddrName ?? ""} ${poi.lowerAddrName ?? ""}`}
      </div>
    </div>
  );
};

export default StationListCard;
