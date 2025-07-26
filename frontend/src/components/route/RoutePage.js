import React, { useState } from "react";
import RouteTmap from "./RouteTmap";
import RouteChargerList from "./RouteChargerList";
import RouteSearchPanel from "./RouteSearchPanel";
import { searchRouteWithPois } from "../../utils/searchRouteWithPois";
import "./route.css";

const CATEGORY_BTNS = [
  { key: "charge", label: "충전소" },
  { key: "cafe", label: "카페" },
  { key: "store", label: "편의점" },
  { key: "food", label: "음식점" }
];

// 플레이스홀더 상세 컴포넌트 예시
function CafeDetailComponent({ poi }) {
  return (
    <div style={{ padding: 10, background: "#fff", borderRadius: 6, marginTop: 6 }}>
      <b>{poi.name || "카페 상세 정보"}</b>
      <div>카페 상세정보를 여기 표시하세요.</div>
    </div>
  );
}

function StoreDetailComponent({ poi }) {
  return (
    <div style={{ padding: 10, background: "#fff", borderRadius: 6, marginTop: 6 }}>
      <b>{poi.name || "편의점 상세 정보"}</b>
      <div>편의점 상세정보를 여기 표시하세요.</div>
    </div>
  );
}

function FoodDetailComponent({ poi }) {
  return (
    <div style={{ padding: 10, background: "#fff", borderRadius: 6, marginTop: 6 }}>
      <b>{poi.name || "음식점 상세 정보"}</b>
      <div>음식점 상세정보를 여기 표시하세요.</div>
    </div>
  );
}

function RoutePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [category, setCategory] = useState("charge");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pathArr, setPathArr] = useState([]);
  const [fromPoi, setFromPoi] = useState(null);
  const [toPoi, setToPoi] = useState(null);
  const [poiByCat, setPoiByCat] = useState({ charge: [], cafe: [], store: [], food: [] });
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [selectedChargerIdx, setSelectedChargerIdx] = useState(null);
  const [totalDistance, setTotalDistance] = useState(null);

  const [routeOption, setRouteOption] = useState("0");
  const [trafficOption, setTrafficOption] = useState("N");

  const poiList = poiByCat[category] || [];

  async function handleSearch() {
    setLoading(true);
    setErrorMsg("");
    setSelectedCharger(null);
    setSelectedChargerIdx(null);
    try {
      const result = await searchRouteWithPois(from, to, {
        routeOption,
        trafficOption,
      });
      setPathArr(result.pathArr || []);
      setFromPoi(result.fromPoi || null);
      setToPoi(result.toPoi || null);
      setPoiByCat(result.poiByCat || { charge: [], cafe: [], store: [], food: [] });
      setTotalDistance(result.totalDistance || null);
    } catch (error) {
      setErrorMsg(error.message || "에러 발생");
    } finally {
      setLoading(false);
    }
  }

  function handleChargerClick(poi, idx) {
    setSelectedCharger(poi);
    setSelectedChargerIdx(idx);
  }

  return (
    <div className="route-container">
      {/* 사이드 패널 */}
      <div className="route-sidebar">
        <RouteSearchPanel
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          onSearch={handleSearch}
          loading={loading}
          routeOption={routeOption}
          setRouteOption={setRouteOption}
          trafficOption={trafficOption}
          setTrafficOption={setTrafficOption}
        />
        <div className="route-category-btns">
          {CATEGORY_BTNS.map(btn =>
            <button
              key={btn.key}
              type="button"
              className={
                "route-category-btn" + (category === btn.key ? " route-category-btn--active" : "")
              }
              onClick={() => {
                setCategory(btn.key);
                setSelectedCharger(null);
                setSelectedChargerIdx(null);
              }}
            >{btn.label}</button>
          )}
        </div>
        <div className="route-list-block">
          <b className="route-list-title">{CATEGORY_BTNS.find(c => c.key === category)?.label} 목록</b>
          <div className="route-list-inner">
            <ul className={`route-${category}-list`}>
              {poiList.length === 0
                ? <div className="route-charge-list-empty">{CATEGORY_BTNS.find(c => c.key === category)?.label} 없음</div>
                : poiList.map((poi, i) => (
                  <React.Fragment key={poi.pkey || poi.id || i}>
                    <li
                      className={
                        `route-charge-list-item${selectedChargerIdx === i ? " selected" : ""}`
                      }
                      onClick={() => handleChargerClick(poi, i)}
                    >
                      <span className="route-charge-list-name">{poi.name}</span>
                      <span className="route-charge-list-addr">
                        {poi.upperAddrName || ""} {poi.middleAddrName || ""}
                      </span>
                    </li>
                    {selectedChargerIdx === i && (
                      <div className="route-chargerlist-wrap">
                        {category === "charge" && <RouteChargerList poi={poi} />}
                        {category === "cafe" && <CafeDetailComponent poi={poi} />}
                        {category === "store" && <StoreDetailComponent poi={poi} />}
                        {category === "food" && <FoodDetailComponent poi={poi} />}
                      </div>
                    )}
                  </React.Fragment>
                ))
              }
            </ul>
          </div>
        </div>
        {errorMsg && <div className="route-error">{errorMsg}</div>}
      </div>
      <div className="route-maparea">
        <RouteTmap
          poiList={poiList}
          pathCoords={pathArr}
          fromPoi={fromPoi}
          toPoi={toPoi}
          selectedCharger={selectedCharger}
        />
        {totalDistance &&
          <div className="route-totaldistance">
            총 거리: {(totalDistance / 1000).toFixed(2)} km
          </div>
        }
      </div>
    </div>
  );
}

export default RoutePage;
