import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

// 관리자 컴포넌트
import AdminLayout from "./components/admin/AdminLayout";
import ReportReviewTable from "./components/admin/ReportReviewTable";
import AccommodationAddForm from "./components/accommodation/AccommodationAddForm";
import UserManageTable from "./components/admin/UserManageTable";
import ChargePayCalc from "./components/calc/ChargePayCalc";

// 사용자 컴포넌트
import Sidebar from "./components/common/Sidebar";
import Tmap from "./components/station/Tmap";
import RoutePage from "./components/route/RoutePage";
import AccommodationPanel from "./components/accommodation/AccommodationPanel";
import IntroCar from "./components/intro/IntroCar";
import LoginPanel from "./components/user/LoginPanel";
import FavoriteListPanel from "./components/user/FavoriteListPanel";
import PasswordChangeForm from "./components/user/PasswordChangeForm";
import MyPageLayout from "./components/user/MyPageLayout";
import StationListPanel from "./components/station/StationListPanel";
import SearchAgainButton from "./components/common/SearchAgainButton";
import StationDetailPanel from "./components/station/StationDetailPanel";
import SpotListPanel from "./components/station/SpotListPanel";
import MyStationPanel from "./components/user/MyStationPanel";
import MyLocationButton from "./components/common/MyLocationButton";
import FilterPanel from "./components/station/Filterpanel";

// 관리자 여부 확인
const isAdmin = sessionStorage.getItem("isAdmin") === "Y";

const UserLayout = () => {
  const location = useLocation();

  // 경로가 /route 인지 확인
  const isRoute = location.pathname === "/route";

  // 상태 및 훅 유지
  const [chargerTypeMap, setChargerTypeMap] = useState({});
  const [operatorMap, setOperatorMap] = useState({});

  const [filters, setFilters] = useState({
    type: [],
    parking: [],
    operator: [],
  });

  const myMarkerRef = useRef(null);
  const handleResetMarkers = useRef(null);

  const isHome = location.pathname === "/";

  const [poiList, setPoiList] = useState([]);
  const [filteredPoiList, setFilteredPoiList] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showSpotList, setShowSpotList] = useState(false);

  const [center, setCenter] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mapRef = useRef(null);
  const [isMapMoved, setIsMapMoved] = useState(false);

  // 현재 위치 받기
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lon: longitude });
      },
      () => {
        setCenter({ lat: 36.81023, lon: 127.14644 }); // 기본값
      }
    );
  }, []);

  // POI 불러오기
  useEffect(() => {
    if (!center.lat || !center.lon) return;

    const fetchPOIs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=전기차 충전소&centerLat=${center.lat}&centerLon=${center.lon}&radius=5&count=20&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0`
        );
        const data = await res.json();
        const pois = data?.searchPoiInfo?.pois?.poi ?? [];

        const trimmedPOIs = pois.map((poi) => ({
          id: poi.pkey,
          lat: parseFloat(poi.frontLat),
          lng: parseFloat(poi.frontLon),
        }));

        const parkingRes = await fetch("/api/charger/match-parking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trimmedPOIs),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API 에러: ${res.status} - ${text}`);
        }

        const matched = await parkingRes.json();
        const parkingPois = pois.map((poi) => {
          const match = matched.find((m) => m.poiId === poi.pkey);
          return {
            ...poi,
            parkingId: match?.parkingId ?? null,
            parkingFee: match?.parkingFee ?? null,
          };
        });

        setPoiList(parkingPois);
      } catch (e) {
        console.error(e);
        setErrorMsg("API 에러 발생");
      }
      setLoading(false);
    };

    fetchPOIs();
  }, [center]);

  // 필터 적용
  useEffect(() => {
    const filtered = poiList.filter((poi) => {
      const chargers = poi.evChargers?.evCharger ?? [];

      if (filters.type.length > 0) {
        if (!chargers.some((ch) => filters.type.includes(ch.type))) return false;
      }

      if (filters.parking.length > 0 && !filters.parking.includes(poi.parkingFee))
        return false;

      if (filters.operator.length > 0) {
        if (!chargers.some((ch) => filters.operator.includes(ch.operatorId))) return false;
      }

      return true;
    });

    setFilteredPoiList(filtered);
  }, [filters, poiList]);

  // 숨길 UI 경로 리스트
  const hideOn = [
    "/info",
    "/user",
    "/user/*",
    "/mypage/info",
    "/mypage/favorites",
    "/mypage/reviews",
    "/calc",
    "/hotel",
  ];
  const hideUI = hideOn.includes(location.pathname);

  return (
    <div className="container" style={{ height: "100vh" }}>
      <Sidebar />
      <main
        className="main-content"
        style={{
          flexGrow: 1,
          position: "relative",
          display: isRoute ? "block" : "flex",
          flexDirection: isRoute ? "column" : "row",
          overflow: "hidden",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div style={{ display: "flex", flexGrow: 1, height: "100%" }}>
                  {/* 좌측: 주변 충전소 리스트 패널 or 상세 패널 */}
                  {!hideUI && isHome && (
                    <div
                      style={{
                        width: 300,
                        overflowY: "auto",
                        borderRight: "1px solid #ddd",
                        backgroundColor: "#fff",
                        padding: 10,
                        boxSizing: "border-box",
                        zIndex: 10,
                      }}
                    >
                      {!selectedPoi ? (
                        <StationListPanel
                          poiList={filteredPoiList}
                          selectedPoi={selectedPoi}
                          onSelectPoi={(poi) => {
                            if (poi === null && handleResetMarkers.current) {
                              handleResetMarkers.current();
                            }
                            setSelectedPoi(poi);
                          }}
                        />
                      ) : (
                        <StationDetailPanel
                          poi={selectedPoi}
                          onShowSpots={() => setShowSpotList(true)}
                          onBack={() => {
                            setSelectedPoi(null);
                            if (handleResetMarkers.current) {
                              handleResetMarkers.current();
                            }
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* 우측: 지도 */}
                  <div style={{ flexGrow: 1, position: "relative" }}>
                    <Tmap
                      poiList={filteredPoiList}
                      onMarkerClick={setSelectedPoi}
                      mapRef={mapRef}
                      myMarkerRef={myMarkerRef}
                      onMapMoved={() => setIsMapMoved(true)}
                      hideUI={hideUI}
                      mapMoved={isMapMoved}
                      onResetMarkers={(fn) => (handleResetMarkers.current = fn)}
                      selectedPoi={selectedPoi}
                    />
                  </div>
                </div>

                {/* 주변 편의시설 패널 */}
                {selectedPoi && showSpotList && (
                  <SpotListPanel
                    selectedPoiName={selectedPoi.name}
                    center={{ lat: selectedPoi.frontLat, lon: selectedPoi.frontLon }}
                    onClose={() => setShowSpotList(false)}
                    onBackToStation={() => setShowSpotList(false)}
                  />
                )}

                {isHome && (
                  <>
                    <MyLocationButton tmapObjRef={mapRef} myMarkerRef={myMarkerRef} />
                    {isMapMoved && (
                      <SearchAgainButton
                        onClick={() => {
                          const center = mapRef.current.getCenter();
                          setCenter({ lat: center._lat, lon: center._lng });
                          setIsMapMoved(false);
                        }}
                      />
                    )}
                    <FilterPanel
                      filters={filters}
                      onChange={setFilters}
                      poiList={poiList}
                      chargerTypeMap={chargerTypeMap}
                      operatorMap={operatorMap}
                    />
                  </>
                )}
              </>
            }
          />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/hotel" element={<AccommodationPanel />} />
          <Route path="/calc" element={<ChargePayCalc />} />
          <Route path="/info" element={<IntroCar />} />
          <Route path="/user/*" element={<LoginPanel />} />
          <Route path="/mypage" element={<MyPageLayout />}>
            <Route path="info" element={<PasswordChangeForm />} />
            <Route path="favorites" element={<FavoriteListPanel />} />
            <Route path="stations" element={<MyStationPanel />} />
            <Route index element={<Navigate to="info" replace />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {isAdmin ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/accommodation" element={<AccommodationAddForm />} />
            <Route path="/admin/report" element={<ReportReviewTable />} />
            <Route path="/admin/userCare" element={<UserManageTable />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
