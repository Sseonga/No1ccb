import React, { useState, useRef } from "react";
import Sidebar from "./components/common/Sidebar";
import RouteSearchPanel from "./components/route/RouteSearchPanel";
// ... Tmap, MyLocationButton 등 import

const UserLayout = () => {
  // ------ 길찾기 상태 ------
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [category, setCategory] = useState("charge");
  const [nearbyPois, setNearbyPois] = useState({ charge: [], cafe: [], store: [], food: [] });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedPoi, setSelectedPoi] = useState(null);

  // ------ 검색 함수 ------
  async function handleRouteSearch(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setNearbyPois({ charge: [], cafe: [], store: [], food: [] });
    setSelectedPoi(null);
    // 예시: 실제 검색 함수 대신, 간단한 더미 POI
    setTimeout(() => {
      setNearbyPois({
        charge: [
          { pkey: "1", name: "예시충전소1", newAddressList: { newAddress: [{ fullAddress: "천안시" }] } },
          { pkey: "2", name: "예시충전소2", newAddressList: { newAddress: [{ fullAddress: "수원시" }] } },
        ],
        cafe: [],
        store: [],
        food: [],
      });
      setCategory("charge");
      setSelectedPoi({
        pkey: "1",
        name: "예시충전소1",
        newAddressList: { newAddress: [{ fullAddress: "천안시" }] }
      });
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="container">
      <div className="sidebar-section">
        <Sidebar />
      </div>
      <RouteSearchPanel
        from={from} to={to}
        setFrom={setFrom} setTo={setTo}
        onSearch={handleRouteSearch}
        loading={loading}
        errorMsg={errorMsg}
        nearbyPois={nearbyPois}
        category={category}
        setCategory={setCategory}
        selectedPoi={selectedPoi}
        setSelectedPoi={setSelectedPoi}
      />
      <div style={{ flex: 1, height: "100vh", position: "relative" }}>
        {/* 여기에 Tmap 등 지도 컴포넌트 */}
        <div style={{ width: "100%", height: "100%", background: "#f8f8f8" }}>지도영역 (예시)</div>
      </div>
    </div>
  );
};

export default UserLayout;
