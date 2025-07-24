import React, { useEffect, useRef, useState } from "react";

// Tmap: 충전소 리스트(poiList)를 기반으로 Tmap 위에 마커를 표시하고, 마커 클릭 시 동작을 처리하는 컴포넌트
const AccomTmap = ({
  poiList,
  onMarkerClick,
  mapRef,
  myMarkerRef,
  onMapMoved,
  hideUI,
  mapMoved,
  onResetMarkers,
  selectedPoi
}) => {
  const mapDivRef = useRef(null); // Tmap div DOM 참조
  const markersRef = useRef({});  // 마커들을 pkey 기준으로 저장하는 객체
  const infoWindowRef = useRef(null);
  const [isMapMoved, setIsMapMoved] = useState(false);

  // mapRef가 없으면 내부에서 따로 만들어서 쓴다
  const localMapRef = useRef(null);
  const actualMapRef = mapRef || localMapRef;

  // 선택된 충전소를 제외한 마커 숨기기
  function clearMarkersExcept(markerToKeep) {
    Object.values(markersRef.current).forEach((marker) =>
      marker.setVisible(marker === markerToKeep)
    );
  }

  // 외부에서 마커 리셋 요청(onResetMarkers) 시 모든 마커 다시 보이게 설정
  useEffect(() => {
    if (onResetMarkers) {
      onResetMarkers(() => {
        Object.values(markersRef.current).forEach((marker) =>
          marker.setVisible(true)
        );
      });
    }
  }, [poiList, onResetMarkers]);

  // selectedPoi가 변경되면 해당 마커만 보이게 설정하고 클릭 처리
  useEffect(() => {
    if (!selectedPoi || !markersRef.current) return;

    const marker = markersRef.current[selectedPoi.pkey];
    if (marker) {
      clearMarkersExcept(marker);
      onMarkerClick(selectedPoi);
    }
  }, [selectedPoi]);

  // 외부에서 mapMoved 값이 바뀌면 내부 상태도 업데이트
  useEffect(() => {
    setIsMapMoved(mapMoved);
  }, [mapMoved]);

  // Tmap 지도 초기화 (최초 1회 실행)
  useEffect(() => {
    if (!window.Tmapv2 || !mapDivRef.current) return;

    // mapRef가 없거나, .current가 없는 경우도 방지
    if (actualMapRef.current) {
      actualMapRef.current.destroy && actualMapRef.current.destroy();
    }

    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(36.81023, 127.14644), // 천안 중심
      width: "100%",
      height: "100%",
      zoom: 14
    });

    actualMapRef.current = map;

    map.addListener("dragstart", () => {
      setIsMapMoved(true);
    });

    map.addListener("center_changed", () => {
      if (typeof onMapMoved === "function") {
        onMapMoved();
      }
    });
  // eslint-disable-next-line
  }, []);

  // poiList 변경 시 마커 전부 다시 그리기
  useEffect(() => {
    if (!window.Tmapv2 || !poiList.length || !actualMapRef.current) return;

    const map = actualMapRef.current;

    // 기존 마커 제거
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    if (infoWindowRef.current) infoWindowRef.current.setMap(null);

    // poiList 순회하면서 마커 생성
    poiList.forEach(poi => {
      const lat = parseFloat(poi.frontLat);
      const lon = parseFloat(poi.frontLon);
      if (!lat || !lon) return;

      // 대표 충전기 상태 확인 (여러 개일 경우 첫 번째 사용)
      const repStatus = Array.isArray(poi.evChargers?.evCharger)
        ? poi.evChargers.evCharger[0]?.status
        : poi.evChargers?.evCharger?.status;

      const marker = new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(lat, lon),
        map,
        icon: markerIconByStatus(repStatus),
        label: poi.name
      });

      // 마커 클릭 시: 외부에 선택 알리고 나머지 마커 숨김
      marker.addListener("click", () => {
        onMarkerClick && onMarkerClick(poi);
        clearMarkersExcept(marker); // 선택된 마커만 남김
      });

      // 마커를 pkey 기준으로 저장
      if (poi.pkey) {
        markersRef.current[poi.pkey] = marker;
      }
    });

    // 모든 마커 포함하는 지도 범위로 fitBounds
    const bounds = new window.Tmapv2.LatLngBounds();
    poiList.forEach(poi => {
      if (poi.frontLat && poi.frontLon) {
        bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
      }
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds);
  }, [poiList, onMarkerClick]);

  // UI 렌더링 (지도 + 중심 이동 표시 마커)
  return (
    <div className="mapContainer">
      <div ref={mapDivRef} />
      {!hideUI && isMapMoved && <div className="center-marker" />}
    </div>
  );
};

export default AccomTmap;

// 상태코드에 따라 마커 아이콘 색상 다르게 지정
function markerIconByStatus(status) {
  switch (status) {
    case "1":
    case "4":
    case "5":
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    case "3":
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    case "9":
      return "http://maps.google.com/mapfiles/ms/icons/grey-dot.png";
    default:
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  }
}
