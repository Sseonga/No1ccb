import React, { useState } from "react";

const CATEGORY_BTNS = [
  { key: "charge", label: "충전소" },
  { key: "cafe", label: "카페" },
  { key: "store", label: "편의점" },
  { key: "food", label: "음식점" }
];

// POI 상세 정보 컴포넌트 (원한다면 아래 주석 풀고 사용)
function PoiDetail({ poi }) {
  if (!poi) return null;
  return (
    <div style={{ margin: "10px 0", padding: 10, background: "#f6fafd", borderRadius: 8 }}>
      <b>{poi.name}</b>
      <div style={{ color: "#555", fontSize: 14 }}>
        {poi.newAddressList?.newAddress?.[0]?.fullAddress ||
          poi.upperAddrName ||
          ""}
      </div>
    </div>
  );
}

function RouteSearchPanel(props) {
  // props가 없으면 내부에서 자체적으로 상태 관리
  const [from, setFrom] = useState(props.from || "");
  const [to, setTo] = useState(props.to || "");
  const [loading, setLoading] = useState(props.loading || false);
  const [errorMsg, setErrorMsg] = useState(props.errorMsg || "");
  const [category, setCategory] = useState(props.category || "charge");
  const [selectedPoi, setSelectedPoi] = useState(props.selectedPoi || null);
  const [nearbyPois, setNearbyPois] = useState(props.nearbyPois || {
    charge: [],
    cafe: [],
    store: [],
    food: []
  });

  // 부모에서 온 값이 있으면 우선, 없으면 내부 값 사용
  const poiList =
    (props.nearbyPois && props.category && props.nearbyPois[props.category]) ?
      props.nearbyPois[props.category] :
      (nearbyPois[category] || []);

  // 검색 버튼 동작 (props.onSearch 우선, 없으면 기본)
  const handleSearch = (e) => {
    if (props.onSearch) return props.onSearch(e);
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setErrorMsg("검색 API 연결 필요 (샘플)");
      setNearbyPois({
        charge: [],
        cafe: [],
        store: [],
        food: []
      });
      setSelectedPoi(null);
    }, 800);
  };

  return (
    <div style={{
      width: "100%",
      borderRight: "1px solid #eee",
      background: "#fff",
      height: "100vh",
      overflowY: "auto"
    }}>
      <div style={{ fontWeight: "bold", fontSize: 17, padding: "22px 18px 12px" }}>
        경로 검색 & 중간 충전소
      </div>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 6, padding: 10 }}>
        <input value={from} onChange={e => (props.setFrom ? props.setFrom(e.target.value) : setFrom(e.target.value))} placeholder="출발지"
          style={{ flex: 1, border: "1px solid #ccd", borderRadius: 8, padding: 8, fontSize: 15 }} />
        <span style={{ alignSelf: "center" }}>→</span>
        <input value={to} onChange={e => (props.setTo ? props.setTo(e.target.value) : setTo(e.target.value))} placeholder="도착지"
          style={{ flex: 1, border: "1px solid #ccd", borderRadius: 8, padding: 8, fontSize: 15 }} />
        <button type="submit"
          style={{
            padding: "0 18px", background: "#377ee6", color: "#fff", border: "none",
            borderRadius: 7, fontWeight: 600
          }}>검색</button>
      </form>
      {(props.loading || loading) && <div style={{ margin: 10 }}>불러오는 중...</div>}
      {(props.errorMsg || errorMsg) && <div style={{ color: "red", margin: 10 }}>{props.errorMsg || errorMsg}</div>}

      {/* 카테고리 버튼 */}
      <div style={{ display: "flex", gap: 4, padding: "0 10px" }}>
        {CATEGORY_BTNS.map(btn =>
          <button
            key={btn.key}
            type="button"
            onClick={() => {
              if (props.setCategory) props.setCategory(btn.key);
              else setCategory(btn.key);
              if (props.setSelectedPoi) {
                props.setSelectedPoi((props.nearbyPois?.[btn.key] || [])[0] || null);
              } else {
                setSelectedPoi((nearbyPois[btn.key] || [])[0] || null);
              }
            }}
            style={{
              flex: 1,
              padding: "9px 0",
              background: (props.category || category) === btn.key ? "#377ee6" : "#f3f6fb",
              color: (props.category || category) === btn.key ? "#fff" : "#222",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              marginBottom: 3
            }}
          >{btn.label}</button>
        )}
      </div>
      {/* POI 리스트 */}
      <div style={{ margin: "9px 0 6px", padding: "0 12px" }}>
        {poiList.length === 0 ? (
          <div style={{ color: "#aaa", fontSize: 15 }}>검색 결과 없음</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {poiList.map((poi, i) => (
              <li key={poi.pkey || poi.id || i}
                style={{
                  marginBottom: 7,
                  padding: "7px 6px",
                  background: (props.selectedPoi || selectedPoi)?.pkey === poi.pkey ? "#e9f2fe" : "",
                  borderRadius: 7,
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (props.setSelectedPoi) props.setSelectedPoi(poi);
                  else setSelectedPoi(poi);
                }}
              >
                <b>{poi.name}</b>
                <span style={{ fontSize: 13, color: "#555", marginLeft: 7 }}>
                  {poi.newAddressList?.newAddress?.[0]?.fullAddress || poi.upperAddrName || ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* POI 상세 정보 예시 */}
      {(props.selectedPoi || selectedPoi) && <PoiDetail poi={props.selectedPoi || selectedPoi} />}
    </div>
  );
}

export default RouteSearchPanel;
