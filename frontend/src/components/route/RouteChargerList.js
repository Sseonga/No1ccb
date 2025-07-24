// src/components/station/RouteChargerList.js
import React from "react";

function RouteChargerList({ evChargers }) {
  if (!evChargers || evChargers.length === 0) return <p>충전기 정보가 없습니다.</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
      <thead>
        <tr>
          <th>업체명</th>
          <th>충전기ID</th>
          <th>타입</th>
          <th>급속/완속</th>
          <th>상태</th>
          <th>출력</th>
          <th>마지막충전</th>
        </tr>
      </thead>
      <tbody>
        {evChargers.map((charger, idx) => (
          <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
            <td>{charger.bizName}</td>
            <td>{charger.chargerId}</td>
            <td>{charger.chargerType}</td>
            <td>{charger.chargeTp}</td>
            <td style={{ color: charger.status === "대기" ? "green" : "red" }}>
              {charger.status}
            </td>
            <td>{charger.output}</td>
            <td>{charger.lastChargingTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RouteChargerList;
