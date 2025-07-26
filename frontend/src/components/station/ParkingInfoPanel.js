// components/ParkingInfoPanel.js
import React, { useEffect, useState } from "react";

const ParkingInfoPanel = ({ parkingId }) => {
  const [parking, setParking] = useState(null);

  useEffect(() => {
    if (!parkingId) return;

    fetch(`/api/charger/parking/${parkingId}`)
      .then((res) => res.json())
      .then((data) => setParking(data))
      .catch((err) => console.error("주차장 정보 조회 실패", err));
  }, [parkingId]);

  if (!parking) return null;

  return (
    <div className="parking-info-panel">
      <h4>🚗 연계 주차장 정보</h4>
      <div><b>이름:</b> {parking.parkingName}</div>
      <div><b>유형:</b> {parking.parkingType}</div>
      <div><b>지번주소:</b> {parking.parkingAddress}</div>
      <div><b>도로명주소:</b> {parking.parkingAddressD}</div>
      <div><b>운영요일:</b> {parking.parkingOperating}</div>
      <div><b>주차 가능 대수:</b> {parking.parkingCapacity}대</div>
      <div><b>요금:</b> {parking.parkingFee}</div>
      <div><b>전화번호:</b> {parking.tel || "-"}</div>
    </div>
  );
};

export default ParkingInfoPanel;
