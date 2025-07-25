import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
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
import Tmap from "./components/station/Tmap";
import Sidebar from "./components/common/Sidebar";
import MyLocationButton from "./components/common/MyLocationButton";
import FilterPanel from "./components/station/Filterpanel";
import RoutePage from "./components/route/RoutePage";
import IntroCar from "./components/intro/IntroCar";
import LoginPanel from "./components/user/LoginPanel";

// 마이페이지 컴포넌트
import FavoriteListPanel from "./components/user/FavoriteListPanel"; // 마이페이지 레이아웃
import PasswordChangeForm from "./components/user/PasswordChangeForm";

import MyPageLayout from "./components/user/MyPageLayout";
import StationListPanel from "./components/station/StationListPanel";
import SearchAgainButton from "./components/common/SearchAgainButton";
import StationDetailPanel from "./components/station/StationDetailPanel";
import SpotListPanel from "./components/station/SpotListPanel";
import AccommodationPanel from "./components/accommodation/AccommodationPanel";
import MyStationPanel from "./components/user/MyStationPanel";
import AccommodationManage from "./components/accommodation/AccommodationManage";


// 관리자 여부 확인
const isAdmin = sessionStorage.getItem("isAdmin") === "Y";

// 사용자용 레이아웃
const UserLayout = () => {
  //DB 코드테이블 연동 필터 맵
  const [chargerTypeMap, setChargerTypeMap] = useState({});
  const [operatorMap, setOperatorMap] = useState({});

  useEffect(() => {
    fetch("/api/code/map")
      .then((res) => res.json())
      .then((data) => {
        setChargerTypeMap(data.CHARGER_TYPE || {});
        setOperatorMap(data.OPERATOR || {});
      })
      .catch((err) => console.error("공통코드 로딩 실패", err));
  }, []);

  const [filters, setFilters] = useState({
    type: [],
    parking: [],
    operator: [],
  });

  const myMarkerRef = useRef(null);
  const location = useLocation();
  const handleResetMarkers = useRef(null);
  //홈(전기차충전소 찾기 맵)
  const isHome = location.pathname === "/";
  const [poiList, setPoiList] = useState([]);
  const [filteredPoiList, setFilteredPoiList] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null); // 충전소 선택됨
  const [showSpotList, setShowSpotList] = useState(false); // 주변 편의시설 보기 모드
  const [center, setCenter] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // const [spotMarkers, setSpotMarkers] = useState([]);
  const spotMarkersRef = useRef([]);
  const [_, _setSpotMarkers] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState(null); // 리스트 하이라이트용
  const setSpotMarkers = (markers) => {
    spotMarkersRef.current = markers;
    _setSpotMarkers(markers); // 기존 상태도 유지
  };

  const mapRef = useRef(null); // Tmap Map 객체 보관용
  const [isMapMoved, setIsMapMoved] = useState(false);

  //현재 위치 받을수있으면 현재위치로 지도센터 설정
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lon: longitude }); // 중심 좌표 상태 업데이트
      },
      (err) => {
        console.warn("현재위치 조회 실패, 기본값 사용", err);
        setCenter({ lat: 36.81023, lon: 127.14644 }); // 천안역
      }
    );
  }, []);

  //center값 변경시 center기준으로 poi재검색후 poilist재설정
  useEffect(() => {
    const fetchPOIs = async () => {
      if (!center.lat || !center.lon) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=전기차 충전소&centerLat=${center.lat}&centerLon=${center.lon}&radius=5&count=20&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=WGS84GEO&reqCoordType=WGS84GEO&appKey=YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0`
        );
        const data = await res.json();
        // setPoiList(data?.searchPoiInfo?.pois?.poi ?? []);
        const pois = data?.searchPoiInfo?.pois?.poi ?? [];

        // poi.id + frontLat/frontLon만 추출
        const trimmedPOIs = pois.map((poi) => ({
          id: poi.pkey,
          lat: parseFloat(poi.frontLat),
          lng: parseFloat(poi.frontLon),
        }));

        // 백엔드에서 parkingId, parkingFee를 달아서 돌려주는 요청
        const parkingRes = await fetch("/api/charger/match-parking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trimmedPOIs),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API 에러: ${res.status} - ${text}`);
        }

        const matched = await parkingRes.json(); // { poiId, parkingId }[]

        // 원본 pois에 parkingId를 매핑해서 새 리스트 생성
        const parkingPois = pois.map((poi) => {
          const match = matched.find((m) => m.poiId === poi.pkey);
          return {
            ...poi,
            parkingId: match?.parkingId ?? null,
            parkingFee: match?.parkingFee ?? null,
          };
        });
        console.log(parkingPois);

        setPoiList(parkingPois);
      } catch (e) {
        console.error(e);
        setErrorMsg("API 에러 발생");
      }
      setLoading(false);
    };
    fetchPOIs();
  }, [center]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = poiList.filter((poi) => {
        const chargers = poi.evChargers?.evCharger ?? [];
        console.log(filters);
        console.log(chargers);

        // 🔌 충전 타입 필터
        if (filters.type.length > 0) {
          const hasMatchingCharger = chargers.some((ch) => {
            return filters.type.includes(ch.type); // 예: "CHARGER_TYPE_01"
          });
          if (!hasMatchingCharger) return false;
        }

        // 🅿️ 주차 필터
        if (
          filters.parking.length > 0 &&
          !filters.parking.includes(poi.parkingFee)
        ) {
          return false;
        }

        // ⚡️ 운영사 필터
        if (filters.operator.length > 0) {
          const hasMatchingOperator = chargers.some((ch) =>
            filters.operator.includes(ch.operatorId)
          );
          if (!hasMatchingOperator) return false;
        }

        return true;
      });

      setFilteredPoiList(filtered);
    };

    applyFilters();
  }, [filters, poiList]);

  //SpotListPanel 요청 편의시설 마커생성
  const addSpotMarkers = (spots) => {
    clearSpotMarkers(); // 기존 마커 제거
    console.log("spots:", spots);

    const newMarkers = spots.map((spot) => {
      const marker = new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(
          Number(spot.frontLat),
          Number(spot.frontLon)
        ),
        map: mapRef.current,
        icon: getSpotIconByCategory(spot.category),
        iconSize: new window.Tmapv2.Size(30, 30),
        title: spot.name,
      });

      marker.spotData = spot;

      marker.addListener("click", () => {
        setSelectedSpotId(spot.pkey); // 마커 클릭 시 리스트 highlight
        mapRef.current.setCenter(
          new window.Tmapv2.LatLng(Number(spot.frontLat), Number(spot.frontLon))
        );
      });

      return marker;
    });

    // 모든 마커 포함하는 지도 범위로 fitBounds
    const map = mapRef.current;
    const bounds = new window.Tmapv2.LatLngBounds();
    spots.forEach((spot) => {
      if (spot.frontLat && spot.frontLon) {
        bounds.extend(new window.Tmapv2.LatLng(spot.frontLat, spot.frontLon));
      }
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds);

    setSpotMarkers(newMarkers);
  };

  useEffect(() => {
    // 마커 아이콘 강조 업데이트
    spotMarkersRef.current.forEach((marker, idx) => {
      const spot = marker.spotData; // 아래에서 직접 저장할 예정
      const isSelected = selectedSpotId === spot?.pkey;

      marker.setIcon(
        isSelected
          ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // 강조 마커
          : getSpotIconByCategory(spot?.category)
      );
    });
  }, [selectedSpotId]);

  const clearSpotMarkers = () => {
    spotMarkersRef.current.forEach((m) => m.setMap(null));
    spotMarkersRef.current = [];
    _setSpotMarkers([]);
  };

  const getSpotIconByCategory = (category) => {
    switch (category) {
      case "cafe":
        return "/icons/marker-cafe.png";
      case "store":
        return "/icons/marker-store.png";
      case "food":
        return "/icons/marker-food.png";
      default:
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }
  };

  const spotSearchCenter = useMemo(() => {
    if (!selectedPoi) return null;
    return {
      lat: selectedPoi.frontLat,
      lon: selectedPoi.frontLon,
    };
  }, [selectedPoi]);

  const hideOn = [
    "/info",
    "/user",
    "/user/*",
    "/mypage/info",
    "/mypage/favorites",
    "/mypage/reviews",
    "/calc",
    "/route",
    "/hotel",
  ];
  const hideUI = hideOn.includes(location.pathname);

  return (
    <div className="container">
      <Sidebar />
      {!hideUI && isHome && poiList.length > 0 && !selectedPoi && (
        <StationListPanel
          poiList={filteredPoiList}
          selectedPoi={selectedPoi}
          onSelectPoi={(poi) => {
            if (poi === null && handleResetMarkers.current) {
              handleResetMarkers.current(); // ✅ 마커 다시 보이기
            }
            setSelectedPoi(poi);
            mapRef.current.setCenter(
              new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon)
            );
            setIsMapMoved(false);
          }}
        />
      )}
      {selectedPoi &&
        (showSpotList ? (
          <SpotListPanel
            selectedPoiName={selectedPoi.name}
            center={spotSearchCenter}
            onClose={() => {
              setShowSpotList(false);
              clearSpotMarkers(); // 닫을 때 마커 제거
            }}
            onSpotsFetched={(spots) => {
              addSpotMarkers(spots); // 마커 추가
            }}
            selectedSpotId={selectedSpotId}
            onSelectSpot={(id, lat, lon) => {
              setSelectedSpotId(id); // 리스트 클릭 → highlight
              mapRef.current.setCenter(new window.Tmapv2.LatLng(lat, lon)); // 지도 이동
            }}
          />
        ) : (
          <div className="station-list-panel">
            <StationDetailPanel
              poi={selectedPoi}
              onShowSpots={() => setShowSpotList(true)} // 주변 편의시설 버튼용
              onBack={() => {
                setSelectedPoi(null);
                handleResetMarkers.current();
              }}
            />
          </div>
        ))}

      <Routes>
        <Route
          path="/"
          element={
            <Tmap
              poiList={filteredPoiList}
              onMarkerClick={setSelectedPoi}
              mapRef={mapRef}
              myMarkerRef={myMarkerRef}
              onMapMoved={() => setIsMapMoved(true)}
              isHome={isHome}
              mapMoved={isMapMoved}
              showSpotList={showSpotList}
              onResetMarkers={(fn) => (handleResetMarkers.current = fn)}
              selectedPoi={selectedPoi}
            />
          }
        />
        <Route path="/hotel" element={<AccommodationPanel />} />
      </Routes>
      {isHome && !showSpotList && (
        <>
          <MyLocationButton tmapObjRef={mapRef} myMarkerRef={myMarkerRef} />
          {isMapMoved && (
            <SearchAgainButton
              onClick={() => {
                const center = mapRef.current.getCenter();
                setCenter({ lat: center._lat, lon: center._lng });
                setIsMapMoved(false);
                setSelectedPoi(null);
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

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/hotel" element={<AccommodationPanel />} />
        <Route path="/calc" element={<ChargePayCalc />} />
        <Route path="/info" element={<IntroCar />} />
        <Route path="/user/*" element={<LoginPanel />} />

        {/* ✅ 마이페이지 모달 라우팅 */}
        <Route path="/mypage" element={<MyPageLayout />}>
          <Route path="info" element={<PasswordChangeForm />} />
          <Route path="favorites" element={<FavoriteListPanel />} />
          <Route path="stations" element={<MyStationPanel />} />

          <Route index element={<Navigate to="info" replace />} />
        </Route>
      </Routes>
    </div>
  );
};

// App 컴포넌트
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 관리자 라우팅 */}
        {isAdmin ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="/admin/accommodation"
              element={<AccommodationAddForm />}
            />
            <Route path="/admin/report" element={<ReportReviewTable />} />
            <Route path="/admin/userCare" element={<UserManageTable />} />
            <Route path="/admin/AccommManage" element={<AccommodationManage />} />
          </Route>
        ) : (
          <>
            {/* 관리자 접근 차단 → 홈으로 리다이렉트 */}
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* 사용자 기본 레이아웃 */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
