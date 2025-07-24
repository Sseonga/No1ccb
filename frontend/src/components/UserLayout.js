import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "./common/Sidebar";
import RouteSearchPanel from "./route/RouteSearchPanel";
import RouteTmap from "./route/RouteTmap";
import StationListPanel from "./station/StationListPanel";
import ChargerList from "./station/ChargerList";

import { searchRouteWithPois } from "../utils/searchRouteWithPois";

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [selectedChargePoi, setSelectedChargePoi] = useState(null);

  const [poiList, setPoiList] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  // 초기 경로(from/to) 세팅 (route 페이지로부터)
  useEffect(() => {
    if (location.pathname === "/route" && location.state) {
      if (location.state.from) setFrom(location.state.from);
      if (location.state.to) setTo(location.state.to);
    }
  }, [location]);

  // 메인 화면 주변 충전소 클릭 → route 이동 + 출발지 또는 도착지 설정
  function handleChargeStationClick(poi, as = "from") {
    if (location.pathname !== "/route") {
      navigate("/route", { state: { [as]: poi.name } });
    } else {
      if (as === "from") setFrom(poi.name);
      else setTo(poi.name);
    }
    setSelectedChargePoi(poi);
  }

  // 길찾기 실행
  async function handleRouteSearch(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setRouteData(null);
    setSelectedChargePoi(null);
    try {
      const res = await searchRouteWithPois(from, to);
      setRouteData(res);
    } catch (err) {
      setErrorMsg(err.message || "검색 중 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  // 메인화면일 때 임의로 주변 충전소 리스트 (테스트용, 실제 API 호출하세요)
  useEffect(() => {
    if (location.pathname !== "/route") {
      // 예시 데이터로 임시 세팅
      setPoiList([
        { pkey: "1", name: "충전소 A", newAddressList: { newAddress: [{ fullAddress: "주소 A" }] } },
        { pkey: "2", name: "충전소 B", newAddressList: { newAddress: [{ fullAddress: "주소 B" }] } },
      ]);
    }
  }, [location]);

  return (
    <div className="container" style={{ display: "flex", height: "100vh", position: "relative" }}>
      <Sidebar />
      {location.pathname === "/route" ? (
        <>
          <div
            style={{
              width: 380,
              background: "#f6f7fb",
              borderRight: "1px solid #e0e4ea",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <RouteSearchPanel
              from={from}
              to={to}
              setFrom={setFrom}
              setTo={setTo}
              onSearch={handleRouteSearch}
              loading={loading}
              errorMsg={errorMsg}
              categoryBtns={[
                { key: "charge", label: "충전소" },
                { key: "cafe", label: "카페" },
                { key: "store", label: "편의점" },
                { key: "food", label: "음식점" },
              ]}
            />
            <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
              <h3>충전소 리스트</h3>
              {!routeData?.routePois?.length && <p>검색된 충전소가 없습니다.</p>}
              {routeData?.routePois?.map((cs) => (
                <div
                  key={cs.poi.pkey}
                  style={{
                    padding: 8,
                    marginBottom: 6,
                    cursor: "pointer",
                    backgroundColor:
                      selectedChargePoi?.pkey === cs.poi.pkey ? "#d0e7ff" : "#fff",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                  onClick={() => setSelectedChargePoi(cs.poi)}
                >
                  <b>{cs.poi.name}</b>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    {cs.poi.newAddressList?.newAddress?.[0]?.fullAddress || ""}
                  </div>
                </div>
              ))}

              {/* 🔽 리스트 바로 아래에 상세정보 */}
              {selectedChargePoi && (
                <div style={{
                  marginTop: 18,
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 0 8px rgba(0,0,0,0.05)",
                  padding: 16,
                  maxHeight: 300,
                  overflowY: "auto",
                  transition: "box-shadow .2s"
                }}>
                  <h4 style={{margin:0,marginBottom:10}}>{selectedChargePoi.name} 상세 정보</h4>
                  <ChargerList evChargers={selectedChargePoi.evChargers?.evCharger} />
                </div>
              )}
            </div>
          </div>
          <RouteTmap
            fromPoi={routeData?.fromPoi}
            toPoi={routeData?.toPoi}
            pathArr={routeData?.pathArr}
            routePois={routeData?.routePois}
            selectedChargePoi={selectedChargePoi}
            onSelectChargePoi={setSelectedChargePoi}
          />
          {/* 총 거리 왼쪽 위 표시 */}
          {routeData && routeData.totalDistance && (
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 24,
                zIndex: 9,
                background: "#fff",
                borderRadius: 8,
                padding: "8px 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                fontWeight: 600,
              }}
            >
              총 거리: {(routeData.totalDistance / 1000).toFixed(2)} km
            </div>
          )}
          {/* ✅ 기존 우측하단 충전소 상세 패널 완전히 제거됨 */}
        </>
      ) : (
        <StationListPanel
          poiList={poiList}
          selectedPoi={selectedPoi}
          onSelectPoi={(poi) => {
            setSelectedPoi(poi);
            handleChargeStationClick(poi, "from"); // 출발지로 설정하며 /route로 이동
          }}
        />
      )}
    </div>
  );
}

export default UserLayout;
