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
  const [totalDistance, setTotalDistance] = useState(null);

  const [routeOption, setRouteOption] = useState("0");
  const [trafficOption, setTrafficOption] = useState("N");

  const poiList = poiByCat[category] || [];
  const chargeList = poiByCat.charge || [];

  // ① 카페/편의점/음식점에서도 지도에 충전소(5개)도 항상 같이 표시 & 클릭
  //     - tmapPoiList는 현재탭 POI + 충전소5개 (중복 X)
  const tmapPoiList = [
    ...poiList,
    ...chargeList.filter(
      c =>
        c &&
        c.frontLat &&
        c.frontLon &&
        !poiList.some(p => p.pkey === c.pkey || p.id === c.id)
    ),
  ];

  async function handleSearch() {
    setLoading(true);
    setErrorMsg("");
    setSelectedCharger(null);

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

  function handleChargerClick(poi) {
    setSelectedCharger(poi);
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
              onClick={() => setCategory(btn.key)}
            >{btn.label}</button>
          )}
        </div>
        <div className="route-list-block">
          <b className="route-list-title">충전소 목록</b>
          <div className="route-list-inner">
            {category === "charge" && (
              <ul className="route-charge-list">
                {poiList.length === 0 ?
                  <div className="route-charge-list-empty">충전소 없음</div>
                  :
                  poiList.map((poi, i) => (
                    <li
                      key={poi.pkey || poi.id || i}
                      className={
                        "route-charge-list-item" +
                        (selectedCharger?.pkey === poi.pkey ? " selected" : "")
                      }
                      onClick={() => handleChargerClick(poi)}
                    >
                      <span className="route-charge-list-name">{poi.name}</span>
                      <span className="route-charge-list-addr">
                        {poi.upperAddrName || ""} {poi.middleAddrName || ""}
                      </span>
                    </li>
                  ))
                }
              </ul>
            )}
          </div>
        </div>
        <div className="route-chargerlist-wrap">
          {selectedCharger && <RouteChargerList poi={selectedCharger} />}
        </div>
        {errorMsg && <div className="route-error">{errorMsg}</div>}
      </div>
      <div className="route-maparea">
        <RouteTmap
          poiList={tmapPoiList}
          pathCoords={pathArr}
          fromPoi={fromPoi}
          toPoi={toPoi}
          selectedCharger={selectedCharger}
          onMarkerClick={handleChargerClick}
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
