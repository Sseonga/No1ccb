// RouteTmap.jsx
import React, { useEffect, useRef } from "react";

function RouteTmap({ pathCoords, fromPoi, toPoi, poiList, selectedCharger }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const mapDivId = "map_div";

  useEffect(() => {
    if (!window.Tmapv2) return;
    const container = document.getElementById(mapDivId);
    if (!mapRef.current && container) {
      mapRef.current = new window.Tmapv2.Map(mapDivId, {
        center: new window.Tmapv2.LatLng(37.5665, 126.9780),
        zoom: 11,
        width: "100%",
        height: "100%",
        zoomControl: false

      });
      // resize로 화면 강제 업데이트
      window.dispatchEvent(new Event("resize"));
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!window.Tmapv2 || !map) return;
    // 이전 마커/폴리라인 제거
    markersRef.current.forEach(m => m?.setMap && m.setMap(null));
    polylinesRef.current.forEach(p => p?.setMap && p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    // 마커 생성 함수
    function addMarker(lat, lon, iconUrl) {
      if (!map) return null;
      try {
        return new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(Number(lat), Number(lon)),
          icon: iconUrl,
          iconSize: new window.Tmapv2.Size(24, 38),
          map,
        });
      } catch (e) {
        return null;
      }
    }

    // 출발/도착지 마커
    if (fromPoi && fromPoi.lat && fromPoi.lon) {
      const m = addMarker(fromPoi.lat, fromPoi.lon, "http://maps.google.com/mapfiles/ms/icons/green-dot.png");
      if (m) markersRef.current.push(m);
    }
    if (toPoi && toPoi.lat && toPoi.lon) {
      const m = addMarker(toPoi.lat, toPoi.lon, "http://maps.google.com/mapfiles/ms/icons/red-dot.png");
      if (m) markersRef.current.push(m);
    }
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
  <path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
  <path fill-rule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clip-rule="evenodd" />
</svg>

    // POI 마커
    if (poiList && poiList.length > 0) {
      poiList.forEach(poi => {
        if (poi.frontLat && poi.frontLon) {
          let iconUrl;
          // 선택된 충전소일 때 아이콘만 다르게!
          if (selectedCharger && (
                poi.pkey === selectedCharger.pkey || 
                poi.id === selectedCharger.id || 
                poi.name === selectedCharger.name // fallback
              )) {
            iconUrl = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; // 선택 시 노란색
          } else {
            // 상태별 색상 (예시)
            switch (poi.status) {
              case "1": case "4": case "5":
                iconUrl = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"; break;
              case "3":
                iconUrl = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"; break;
              case "9":
                iconUrl = "http://maps.google.com/mapfiles/ms/icons/grey-dot.png"; break;
              default:
                iconUrl = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            }
          }
          const m = addMarker(poi.frontLat, poi.frontLon, iconUrl);
          if (m) markersRef.current.push(m);
        }
      });
    }

    // 경로 폴리라인
    if (pathCoords && pathCoords.length > 1) {
      try {
        const latlngs = pathCoords.map(c => new window.Tmapv2.LatLng(Number(c[1]), Number(c[0])));
        const polyline = new window.Tmapv2.Polyline({
          path: latlngs,
          strokeColor: "#377ee6",
          strokeWeight: 5,
          map,
        });
        polylinesRef.current.push(polyline);
      } catch (e) {}
    }

    // 지도 bounds
    try {
      const bounds = new window.Tmapv2.LatLngBounds();
      if (fromPoi && fromPoi.lat && fromPoi.lon) bounds.extend(new window.Tmapv2.LatLng(Number(fromPoi.lat), Number(fromPoi.lon)));
      if (toPoi && toPoi.lat && toPoi.lon) bounds.extend(new window.Tmapv2.LatLng(Number(toPoi.lat), Number(toPoi.lon)));
      if (poiList && poiList.length > 0) {
        poiList.forEach(poi => {
          if (poi.frontLat && poi.frontLon) {
            bounds.extend(new window.Tmapv2.LatLng(Number(poi.frontLat), Number(poi.frontLon)));
          }
        });
      }
      if (!bounds.isEmpty()) map.fitBounds(bounds);
    } catch (e) {}
  }, [pathCoords, fromPoi, toPoi, poiList, selectedCharger]);

  return <div id={mapDivId} style={{ width: "100%", height: "100%" }} />;
}

export default RouteTmap;
