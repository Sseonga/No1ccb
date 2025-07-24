import React, { useState } from "react";
import RouteSearchPanel from "./RouteSearchPanel";
import RouteTmap from "./RouteTmap";

const CATEGORY_BTNS = [
  { key: "charge", label: "충전소" },
  { key: "cafe", label: "카페" },
  { key: "store", label: "편의점" },
  { key: "food", label: "음식점" }
];
const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

function RoutePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [category, setCategory] = useState("charge");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [route, setRoute] = useState({
    pathArr: null, fromPoi: null, toPoi: null,
    chargeStations: [], poiByCat: {}, totalDistance: null
  });

  // 주소 → 좌표 변환
  async function getCoordByKeyword(keyword) {
    const poiUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(keyword)}&count=1&resCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
    const res = await fetch(poiUrl);
    const data = await res.json();
    const poi = data?.searchPoiInfo?.pois?.poi?.[0];
    return poi ? { ...poi, lat: parseFloat(poi.frontLat), lon: parseFloat(poi.frontLon) } : null;
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true); setErrorMsg(""); setRoute({});
    try {
      // 출발/도착 좌표
      const fromPoi = await getCoordByKeyword(from);
      const toPoi = await getCoordByKeyword(to);
      if (!fromPoi || !toPoi) throw new Error("출발/도착지 검색 실패");

      // 경로 계산
      const routeRes = await fetch(
        "https://apis.openapi.sk.com/tmap/routes?version=1&format=json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", appKey: TMAP_APPKEY },
          body: JSON.stringify({
            startX: String(fromPoi.lon),
            startY: String(fromPoi.lat),
            endX: String(toPoi.lon),
            endY: String(toPoi.lat),
            reqCoordType: "WGS84GEO",
            resCoordType: "WGS84GEO",
            searchOption: "0",
            trafficInfo: "N"
          })
        }
      );
      const routeData = await routeRes.json();
      if (!routeData.features) throw new Error("경로 데이터 없음");
      let pathArr = [];
      let totalDistance = 0;
      routeData.features.filter(f => f.geometry.type === "LineString").forEach(feature => {
        feature.geometry.coordinates.forEach(coord => pathArr.push(coord));
        totalDistance += feature.properties.distance || 0;
      });

      // 10,30,50,70,90% 지점에서 충전소 검색
      const ratios = [0.1, 0.3, 0.5, 0.7, 0.9];
      const idxs = ratios.map(r => Math.floor(pathArr.length * r));
      const midPoints = idxs.map(idx => {
        const [lon, lat] = pathArr[idx];
        return { lon, lat };
      });
      const chargeStations = (await Promise.all(midPoints.map(async pt => {
        const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent("전기차 충전소")}&centerLat=${pt.lat}&centerLon=${pt.lon}&radius=2&count=1&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
        const res = await fetch(url); const data = await res.json();
        return data?.searchPoiInfo?.pois?.poi?.[0] || null;
      }))).filter(Boolean);

      // 50% 충전소 기준 주변 POI
      const center = chargeStations[2] || chargeStations[0];
      const catMap = { cafe: "카페", store: "편의점", food: "음식점" };
      let poiByCat = { charge: chargeStations, cafe: [], store: [], food: [] };
      for (let k of ["cafe", "store", "food"]) {
        if (center) {
          const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(catMap[k])}&centerLat=${center.frontLat}&centerLon=${center.frontLon}&radius=1&count=6&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
          const res = await fetch(url);
          const data = await res.json();
          poiByCat[k] = (data?.searchPoiInfo?.pois?.poi ?? []).filter(Boolean);
        }
      }
      setRoute({
        fromPoi, toPoi, pathArr, chargeStations, poiByCat, totalDistance
      });
    } catch (err) {
      setErrorMsg(err.message || "에러 발생");
      setRoute({});
    }
    setLoading(false);
  }

  // 마커 클릭 상세
  function onPoiClick(poi, cat) {
    alert(`${poi.name}\n${poi.newAddressList?.newAddress?.[0]?.fullAddress || ""}`);
    // 커스텀: InfoWindow 등 원하는 컴포넌트로 교체 가능
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: 380, background: "#f6f7fb", borderRight: "1px solid #e0e4ea", boxSizing: "border-box" }}>
        <RouteSearchPanel
          from={from} to={to} setFrom={setFrom} setTo={setTo}
          onSearch={handleSearch} loading={loading} errorMsg={errorMsg}
          category={category} setCategory={setCategory} categoryBtns={CATEGORY_BTNS}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0, position: "relative", height: "100vh" }}>
        <RouteTmap
          fromPoi={route.fromPoi}
          toPoi={route.toPoi}
          pathArr={route.pathArr}
          chargeStations={route.chargeStations}
          poiByCat={route.poiByCat}
          category={category}
          onPoiClick={onPoiClick}
          totalDistance={route.totalDistance}
        />
        {route.totalDistance && (
          <div style={{
            position: "absolute", top: 16, left: 24, zIndex: 9,
            background: "#fff", borderRadius: 8, padding: "8px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.08)", fontWeight: 600
          }}>
            총 거리: {(route.totalDistance / 1000).toFixed(2)} km
          </div>
        )}
      </div>
    </div>
  );
}
export default RoutePage;
