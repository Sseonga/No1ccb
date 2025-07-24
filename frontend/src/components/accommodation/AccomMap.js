import React, { useEffect, useRef } from "react";

// 숙소 지도: poiList(숙소 리스트) 기반 마커 표시
const AccomMap = ({
  poiList,
  selectedPoi,
  onMarkerClick,
  onResetMarkers,
  hideUI
}) => {
  const mapDivRef = useRef(null);
  const markersRef = useRef({});
  const mapRef = useRef(null);

  // 선택된 마커만 남기고 모두 숨김
  function clearMarkersExcept(markerToKeep) {
    Object.values(markersRef.current).forEach(
      (marker) => marker.setVisible(marker === markerToKeep)
    );
  }

  // 외부에서 마커 리셋 요청시: 모든 마커 다시 보이게 설정
  useEffect(() => {
    if (onResetMarkers) {
      onResetMarkers(() => {
        Object.values(markersRef.current).forEach((marker) => marker.setVisible(true));
      });
    }
  }, [poiList, onResetMarkers]);

  // 지도 최초 1회 생성
  useEffect(() => {
    if (!window.Tmapv2 || !mapDivRef.current) return;

    if (mapRef.current) mapRef.current.destroy();

    mapRef.current = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(36.81023, 127.14644),
      width: "100%",
      height: "100%",
      zoom: 13
    });
  }, []);

  // poiList, selectedPoi 바뀔 때마다 마커 다시 그림
  useEffect(() => {
    if (!window.Tmapv2 || !mapRef.current) return;

    const map = mapRef.current;
    // 기존 마커 제거
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    // 새 마커 추가
    poiList.forEach((poi) => {
      const lat = parseFloat(poi.frontLat);
      const lon = parseFloat(poi.frontLon);
      if (!lat || !lon) return;

      const marker = new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(lat, lon),
        map,
        icon: accomMarkerIcon(),
        label: poi.name
      });

      marker.addListener("click", () => {
        onMarkerClick && onMarkerClick(poi);
        clearMarkersExcept(marker);
      });

      if (poi.pkey) markersRef.current[poi.pkey] = marker;
    });

    // ★ 선택된 마커만 보이게 처리!
    if (selectedPoi && markersRef.current[selectedPoi.pkey]) {
      clearMarkersExcept(markersRef.current[selectedPoi.pkey]);
    }

    // fitBounds로 모든 마커 범위 맞추기
    const bounds = new window.Tmapv2.LatLngBounds();
    poiList.forEach(poi => {
      if (poi.frontLat && poi.frontLon) {
        bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
      }
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds);

  }, [poiList, onMarkerClick, selectedPoi]);

  return (
    <div className="mapContainer">
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
      {/* 필요시 UI 추가 */}
    </div>
  );
};

export default AccomMap;

// 숙소 마커용 아이콘 (Tmap은 png, svg 등 가능. 예시: 파란 핀)
function accomMarkerIcon() {
  return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
}
