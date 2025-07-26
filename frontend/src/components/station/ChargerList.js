// components/ChargerList.js
import React from "react";

const ChargerList = ({ evChargers }) => {
  if (!evChargers) return null;

  const chargers = Array.isArray(evChargers) ? evChargers : [evChargers];

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#2c3e50" }}>
          ⚡ 충전기 정보 ({chargers.length}대)
        </div>
        <div style={{ fontSize: 13, color: "#555" }}>
          운영기관: <span style={{ fontWeight: 500 }}>{chargers[0].operatorName}</span>
        </div>
      </div>
      <table style={{ width: "100%", marginTop: 8, fontSize: 13, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eaf2f8", textAlign: "center" }}>
            {/* <th>운영기관</th> */}
            <th style={{ padding: "6px 8px" }}>충전기ID</th>
            <th style={{ padding: "6px 8px" }}>타입</th>
            <th style={{ padding: "6px 8px" }}>급속</th>
            <th style={{ padding: "6px 8px" }}>상태</th>
            <th style={{ padding: "6px 8px" }}>출력</th>
            {/* <th>마지막충전</th> */}
          </tr>
        </thead>
        <tbody>
          {chargers.map((ch, i) => (
            <tr key={ch.chargerId || i}>
              {/* <td>{ch.operatorName}</td> */}
              <td style={{ padding: "6px 8px" }}>{ch.chargerId}</td>
              <td style={{ padding: "6px 8px" }}>{chargerTypeToKor(ch.type)}</td>
              <td style={{ padding: "6px 8px" }}>{ch.isFast === "Y" ? "O" : "-"}</td>
              <td style={{ padding: "6px 8px", color: chargerStatusColor(ch.status), fontWeight: 600 }}>
                {chargerStatusToKor(ch.status)}
              </td>
              <td style={{ padding: "6px 8px" }}>{ch.powerType}</td>
              {/* <td>{formatDateTime(ch.chargingDateTime)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChargerList;

// 유틸 함수들
function chargerStatusToKor(status) {
  const map = {
    "0": "알수없음", "1": "통신이상", "2": "대기", "3": "충전중", "4": "중지", "5": "점검중", "6": "예약", "9": "미확인"
  };
  return map[status] || status;
}

function chargerStatusColor(status) {
  switch (status) {
    case "1": case "4": case "5": return "#e34040";
    case "3": return "#377ee6";
    case "9": return "#8e8e8e";
    default: return "#1ba72d";
  }
}

function chargerTypeToKor(type) {
  const map = {
    "01": "DC차데모", "02": "AC완속", "03": "DC차데모+AC3상",
    "04": "DC콤보", "05": "DC차데모+DC콤보", "06": "DC차데모+AC3상+DC콤보", "07": "AC급속3상"
  };
  return map[type] || type;
}

function formatDateTime(dt) {
  return dt ? dt.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6") : "";
}
