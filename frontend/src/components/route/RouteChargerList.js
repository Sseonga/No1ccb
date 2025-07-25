import React from "react";

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

export default function RouteChargerList({ poi }) {
  if (!poi || !poi.evChargers || !poi.evChargers.evCharger) return null;
  const evChargers = poi.evChargers.evCharger;
  const chargers = Array.isArray(evChargers) ? evChargers : [evChargers];

  return (
    <div style={{ marginTop: 12, background: "#fafdff", borderRadius: 10, padding: 13 }}>
      <b style={{ fontSize: 16, color: "#222" }}>{poi.name || ""}</b>
      <div style={{ color: "#666", fontSize: 15, marginBottom: 7 }}>
        {poi.upperAddrName || ""} {poi.middleAddrName || ""} {poi.lowerAddrName || ""}
      </div>
      <b>⚡ 충전기 정보 ({chargers.length}대)</b>
      <table style={{ width: "100%", marginTop: 8, fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#eaf2f8" }}>
            <th>업체명</th>
            <th>충전기ID</th>
            <th>타입</th>
            <th>급속</th>
            <th>상태</th>
            <th>출력</th>
            <th>마지막충전</th>
          </tr>
        </thead>
        <tbody>
          {chargers.length === 0
            ? <tr>
                <td colSpan={7} style={{ color: "#bbb", textAlign: "center" }}>충전기 정보 없음</td>
              </tr>
            : chargers.map((ch, i) => (
              <tr key={ch.chargerId || i}>
                <td>{ch.operatorName || ""}</td>
                <td>{ch.chargerId || ""}</td>
                <td>{chargerTypeToKor(ch.type)}</td>
                <td>{ch.isFast === "Y" ? "O" : "-"}</td>
                <td style={{ color: chargerStatusColor(ch.status), fontWeight: 600 }}>
                  {chargerStatusToKor(ch.status)}
                </td>
                <td>{ch.powerType || ""}</td>
                <td>{formatDateTime(ch.chargingDateTime) || ""}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
