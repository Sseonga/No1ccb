import React, { useEffect, useRef } from "react";

function RouteTmap({
  fromPoi,
  toPoi,
  pathArr = [],
  routePois = [],
  selectedChargePoi,
  onSelectChargePoi
}) {
  const mapRef = useRef(null);
  const markerMapRef = useRef({}); // {pkey: marker}
  const baseMarkerKeysRef = useRef([]);
  const polylineRef = useRef(null);

  // 1. 지도 초기화(최초 1회)
  useEffect(() => {
    if (!window.Tmapv2) return;
    if (!mapRef.current) {
      mapRef.current = new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(36.81023, 127.14644),
        width: "100%",
        height: "100%",
        zoom: 13,
      });
    }
  }, []);

  // 2. POI/경로가 바뀔 때만 마커와 라인 변경
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 출발/도착 마커 새로 그리기
    baseMarkerKeysRef.current.forEach((k) => {
      if (markerMapRef.current[k]) {
        markerMapRef.current[k].setMap(null);
        delete markerMapRef.current[k];
      }
    });
    baseMarkerKeysRef.current = [];

    // 출발지
    if (fromPoi) {
      const key = "from";
      const latLng = new window.Tmapv2.LatLng(fromPoi.lat, fromPoi.lon);
      const marker = new window.Tmapv2.Marker({
        position: latLng,
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        title: "출발지: " + fromPoi.name,
      });
      markerMapRef.current[key] = marker;
      baseMarkerKeysRef.current.push(key);
    }
    // 도착지
    if (toPoi) {
      const key = "to";
      const latLng = new window.Tmapv2.LatLng(toPoi.lat, toPoi.lon);
      const marker = new window.Tmapv2.Marker({
        position: latLng,
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        title: "도착지: " + toPoi.name,
      });
      markerMapRef.current[key] = marker;
      baseMarkerKeysRef.current.push(key);
    }

    // 🔥 기존에 없는 pkey만 새로 만들고, 없는 것만 삭제
    const currentKeys = routePois.map((cs) => String(cs.poi.pkey));
    Object.entries(markerMapRef.current).forEach(([k, marker]) => {
      if (k === "from" || k === "to") return;
      if (!currentKeys.includes(k)) {
        marker.setMap(null);
        delete markerMapRef.current[k];
      }
    });

    routePois.forEach((cs) => {
      const poi = cs.poi;
      const key = String(poi.pkey);
      if (!poi.frontLat || !poi.frontLon) return;
      if (!markerMapRef.current[key]) {
        const latLng = new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon);
        const marker = new window.Tmapv2.Marker({
          position: latLng,
          map,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          title: poi.name,
        });
        marker.addListener("click", () => {
          if (onSelectChargePoi) onSelectChargePoi(poi);
        });
        markerMapRef.current[key] = marker;
      }
    });

    // 폴리라인
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (pathArr && pathArr.length > 0) {
      const tmapPathCoords = pathArr.map(([lon, lat]) => new window.Tmapv2.LatLng(lat, lon));
      polylineRef.current = new window.Tmapv2.Polyline({
        map,
        path: tmapPathCoords,
        strokeColor: "#3366FF",
        strokeWeight: 6,
        strokeOpacity: 0.7,
      });

      // 지도 영역 fitBounds
      const bounds = new window.Tmapv2.LatLngBounds();
      tmapPathCoords.forEach((latlng) => bounds.extend(latlng));
      if (fromPoi) bounds.extend(new window.Tmapv2.LatLng(fromPoi.lat, fromPoi.lon));
      if (toPoi) bounds.extend(new window.Tmapv2.LatLng(toPoi.lat, toPoi.lon));
      routePois.forEach((cs) => {
        const poi = cs.poi;
        if (poi.frontLat && poi.frontLon)
          bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds);
    }
  }, [fromPoi, toPoi, pathArr, routePois, onSelectChargePoi]);

  // 3. selectedChargePoi만 바뀔 때 마커 색상만 교체 (사라지지 않음)
  useEffect(() => {
    Object.entries(markerMapRef.current).forEach(([k, marker]) => {
      if (k === "from" || k === "to") return;
      if (
        selectedChargePoi &&
        String(selectedChargePoi.pkey) === String(k)
      ) {
        marker.setIcon("http://maps.google.com/mapfiles/ms/icons/cyan-dot.png"); // 선택
      } else {
        marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png"); // 일반
      }
    });
  }, [selectedChargePoi]);

  return (
    <div id="map_div" style={{ width: "100%", height: "100vh", position: "relative" }} />
  );
}

export default RouteTmap;
