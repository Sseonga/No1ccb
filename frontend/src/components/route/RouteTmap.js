import React, { useEffect, useRef } from "react";

const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

const categoryIcons = {
  charge: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  cafe: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  store: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  food: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
};

function RouteTmap({ pathCoords, fromPoi, toPoi, nearbyPois, category, selectedPoi, onSelectPoi }) {
  const mapDivRef = useRef(null);
  const mapObjRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef({});

  // 지도/경로/마커 렌더링
  useEffect(() => {
    if (!window.Tmapv2 || !mapDivRef.current) return;
    // 지도 초기화
    let map = mapObjRef.current;
    if (!map) {
      map = new window.Tmapv2.Map(mapDivRef.current, {
        center: new window.Tmapv2.LatLng(36.81023, 127.14644), // 천안
        width: "100%",
        height: "100%",
        zoom: 12
      });
      mapObjRef.current = map;
    }

    // 기존 마커/폴리라인 제거
    Object.values(markersRef.current).forEach(arr => arr.forEach(m => m.setMap(null)));
    markersRef.current = {};

    if (polylineRef.current) polylineRef.current.setMap(null);

    // 경로 Polyline
    if (Array.isArray(pathCoords) && pathCoords.length > 1) {
      const polylinePath = pathCoords.map(([lon, lat]) => new window.Tmapv2.LatLng(lat, lon));
      polylineRef.current = new window.Tmapv2.Polyline({
        path: polylinePath,
        strokeColor: "#377ee6",
        strokeWeight: 6,
        map
      });
      // 지도의 중심과 범위 조정
      const bounds = new window.Tmapv2.LatLngBounds();
      polylinePath.forEach(pt => bounds.extend(pt));
      if (!bounds.isEmpty()) map.fitBounds(bounds);
    }

    // 출발/도착 마커
    if (fromPoi) {
      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(fromPoi.lat, fromPoi.lon),
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        label: "출발"
      });
    }
    if (toPoi) {
      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(toPoi.lat, toPoi.lon),
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        label: "도착"
      });
    }

    // 카테고리별 POI 마커 (충전소/카페/편의점/음식점)
    Object.entries(nearbyPois).forEach(([cat, pois]) => {
      markersRef.current[cat] = pois.map((poi, i) => {
        if (!poi.frontLat || !poi.frontLon) return null;
        const marker = new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon),
          map: cat === category ? map : null,
          icon: categoryIcons[cat] || "",
          label: poi.name
        });
        marker.addListener("click", () => onSelectPoi?.(poi));
        return marker;
      }).filter(Boolean);
    });
  }, [pathCoords, fromPoi, toPoi, nearbyPois, category, selectedPoi]);

  return <div ref={mapDivRef} style={{ flex: 1, height: "100vh" }} />;
}

export default RouteTmap;
