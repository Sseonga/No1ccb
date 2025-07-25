import React, { useEffect, useRef } from "react";

function RouteTmap({ pathCoords, fromPoi, toPoi, poiList, selectedCharger, onMarkerClick }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const mapDivId = "map_div"; // id 충돌 방지

  // 최초 1회 map 생성만 따로 분리
  useEffect(() => {
    if (!window.Tmapv2) {
      console.warn("Tmapv2 API가 아직 로드되지 않았습니다.");
      return;
    }
    if (!mapRef.current && document.getElementById(mapDivId)) {
      mapRef.current = new window.Tmapv2.Map(mapDivId, {
        center: new window.Tmapv2.LatLng(37.5665, 126.9780),
        width: "100%",
        height: "100%",
        zoom: 11,
        zoomControl: true,
        scrollwheel: true,
      });
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!window.Tmapv2 || !map) return;

    markersRef.current.forEach(m => m?.setMap && m.setMap(null));
    polylinesRef.current.forEach(p => p?.setMap && p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    function addMarker(lat, lon, iconUrl, poiObj) {
      if (!map) return null;
      try {
        const marker = new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(Number(lat), Number(lon)),
          icon: iconUrl,
          iconSize: new window.Tmapv2.Size(24, 38),
          map,
        });
        if (onMarkerClick && typeof onMarkerClick === "function" && poiObj) {
          marker.addListener("click", () => onMarkerClick(poiObj));
        }
        return marker;
      } catch (e) {
        console.error("Marker 생성 오류:", e, lat, lon, iconUrl);
        return null;
      }
    }

    // 출발지/도착지 마커
    if (fromPoi && fromPoi.lat && fromPoi.lon) {
      const m = addMarker(fromPoi.lat, fromPoi.lon, "http://maps.google.com/mapfiles/ms/icons/green-dot.png", null);
      if (m) markersRef.current.push(m);
    }
    if (toPoi && toPoi.lat && toPoi.lon) {
      const m = addMarker(toPoi.lat, toPoi.lon, "http://maps.google.com/mapfiles/ms/icons/red-dot.png", null);
      if (m) markersRef.current.push(m);
    }

    // POI(충전소, 카페 등) 마커 모두 표시, 클릭 이벤트 연결
    if (poiList && poiList.length > 0) {
      poiList.forEach(poi => {
        if (poi.frontLat && poi.frontLon) {
          let iconUrl;
          if (poi.status !== undefined) { // 충전소 POI
            if (selectedCharger && selectedCharger.pkey === poi.pkey) {
              iconUrl = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            } else {
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
          } else {
            // 카페/편의점/음식점 POI
            iconUrl = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
          }
          const m = addMarker(poi.frontLat, poi.frontLon, iconUrl, poi);
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
      } catch (e) {
        console.error("폴리라인 생성 오류:", e);
      }
    }

    // 지도 영역 자동 확대
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
    } catch (e) {
      console.error("Bounds 오류:", e);
    }
  }, [pathCoords, fromPoi, toPoi, poiList, selectedCharger, onMarkerClick]);

  return <div id={mapDivId} style={{ width: "100%", height: "100%" }} />;
}

export default RouteTmap;
