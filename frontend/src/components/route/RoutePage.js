import React, { useState } from "react";
import RouteSearchPanel from "./RouteSearchPanel";
import RouteTmap from "./RouteTmap";
import { searchRouteWithPois } from "./searchRouteWithPois"; // 아래 예시 참고

function RoutePage() {
  const [from, setFrom] = useState("천안역");
  const [to, setTo] = useState("수원역");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pathCoords, setPathCoords] = useState([]);
  const [fromPoi, setFromPoi] = useState(null);
  const [toPoi, setToPoi] = useState(null);
  const [nearbyPois, setNearbyPois] = useState({ charge: [], cafe: [], store: [], food: [] });
  const [category, setCategory] = useState("charge");
  const [selectedPoi, setSelectedPoi] = useState(null);

  // 검색 핸들러 (위의 "handleRouteSearch" 로직 분리)
  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true); setErrorMsg("");
    try {
      const { pathArr, fromPoi, toPoi, poisByCat } = await searchRouteWithPois(from, to);
      setPathCoords(pathArr);
      setFromPoi(fromPoi);
      setToPoi(toPoi);
      setNearbyPois(poisByCat);
      setCategory("charge");
      setSelectedPoi((poisByCat.charge || [])[0] || null);
    } catch (err) {
      setErrorMsg(err.message || "검색 실패");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <RouteSearchPanel
        from={from} to={to} setFrom={setFrom} setTo={setTo}
        onSearch={handleSearch}
        loading={loading}
        errorMsg={errorMsg}
        nearbyPois={nearbyPois}
        category={category}
        setCategory={setCategory}
        selectedPoi={selectedPoi}
        setSelectedPoi={setSelectedPoi}
      />
      <RouteTmap
        pathCoords={pathCoords}
        fromPoi={fromPoi}
        toPoi={toPoi}
        nearbyPois={nearbyPois}
        category={category}
        selectedPoi={selectedPoi}
        onSelectPoi={setSelectedPoi}
      />
    </div>
  );
}
export default RoutePage;
