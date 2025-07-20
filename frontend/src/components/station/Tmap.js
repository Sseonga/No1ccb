// import React, { useEffect, useRef } from "react";

// const Tmap = ({ tmapObjRef }) => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (!window.Tmapv2 || !mapRef.current || tmapObjRef.current) return;

//     // 1. 지도 초기화 (기본 중심: 서울시청)
//     const map = new window.Tmapv2.Map(mapRef.current, {
//       center: new window.Tmapv2.LatLng(36.81023, 127.14644),
//       width: "100%",
//       height: "100%",
//       zoom: 15,
//       zoomControl: false,
//     });

//     tmapObjRef.current = map;

//     // 2. 위치 정보 확인해서 지도 재설정
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           const userLatLng = new window.Tmapv2.LatLng(latitude, longitude);

//           map.setCenter(userLatLng); // 지도 중심 내 위치로 변경

//           // 내 위치 마커 표시
//           new window.Tmapv2.Marker({
//             position: userLatLng,
//             map: map,
//             title: "내 위치",
//             icon: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
//           });
//         },
//         (error) => {
//           console.warn("위치 정보 가져오기 실패:", error);
//         }
//       );
//     } else {
//       console.warn("기본 위치로 설정합니다.");
//     }
//   }, [tmapObjRef]);

//   return (
//     <div className="mapContainer">
//       <div ref={mapRef} className="mapDiv" />
//     </div>
//   );
// };

// export default Tmap;








import React, { useEffect, useRef, useState } from "react";

const Tmap = ({ poiList, onMarkerClick, mapRef, onMapMoved }) => {
  const mapDivRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const centerMarkerRef = useRef(null);
  const [isMapMoved, setIsMapMoved] = useState(false);

  useEffect(() => {
    // 1. 맵 생성
    if (!window.Tmapv2 || !mapDivRef.current) return;

    // 맵 초기화
    if (mapRef.current) {
      mapRef.current.destroy(); // 기존 맵 제거 (메모리 누수 방지)
    }

    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(36.81023, 127.14644),
      width: "100%",
      height: "100%",
      zoom: 14
    });

    mapRef.current = map;

    // 2. 지도 이동 감지
    map.addListener("dragstart", () => {
      setIsMapMoved(true); // 드래그 시작하면 마커 보이게
    });

    map.addListener("center_changed", () => {
      if (typeof onMapMoved === "function") {
        onMapMoved();
      }

      // // 센터마커 업데이트
      // const center = map.getCenter();
      // if (centerMarkerRef.current) {
      //   centerMarkerRef.current.setMap(null);
      // }

      // centerMarkerRef.current = new window.Tmapv2.Marker({
      //   position: center,
      //   map,
      //   icon: "https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png",
      //   zIndex: 999,
      // });
    });

  }, []);

  useEffect(() => {
    if (!window.Tmapv2 || !poiList.length || !mapRef.current) return;

    const map = mapRef.current;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) infoWindowRef.current.setMap(null);

    poiList.forEach(poi => {
      const lat = parseFloat(poi.frontLat);
      const lon = parseFloat(poi.frontLon);
      if (!lat || !lon) return;

      const repStatus = Array.isArray(poi.evChargers?.evCharger)
        ? poi.evChargers.evCharger[0]?.status
        : poi.evChargers?.evCharger?.status;

      const marker = new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(lat, lon),
        map,
        icon: markerIconByStatus(repStatus),
        label: poi.name
      });

      marker.addListener("click", () => {
        onMarkerClick(poi);
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);
        infoWindowRef.current = new window.Tmapv2.InfoWindow({
          position: marker.getPosition(),
          content: `<div style="padding:6px 10px;"><b>${poi.name}</b></div>`,
          type: 2,
          map
        });
      });

      markersRef.current.push(marker);
    });

    const bounds = new window.Tmapv2.LatLngBounds();
    poiList.forEach(poi => {
      if (poi.frontLat && poi.frontLon) {
        bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
      }
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds);
  }, [poiList]);

  // useEffect(() => {
  //   if (!window.Tmapv2 || !poiList.length || !mapRef.current) return;

  //   if (mapDivRef.current) mapDivRef.current.innerHTML = "";
  //   markersRef.current.forEach(marker => marker.setMap(null));
  //   if (infoWindowRef.current) infoWindowRef.current.setMap(null);

  //   const map = new window.Tmapv2.Map(mapDivRef.current, {
  //     center: new window.Tmapv2.LatLng(36.81023, 127.14644),
  //     width: "100%",
  //     height: "100%",
  //     zoom: 14
  //   });

  //   poiList.forEach(poi => {
  //     const lat = parseFloat(poi.frontLat);
  //     const lon = parseFloat(poi.frontLon);
  //     if (!lat || !lon) return;

  //     const repStatus = Array.isArray(poi.evChargers?.evCharger)
  //       ? poi.evChargers.evCharger[0]?.status
  //       : poi.evChargers?.evCharger?.status;

  //     const marker = new window.Tmapv2.Marker({
  //       position: new window.Tmapv2.LatLng(lat, lon),
  //       map,
  //       icon: markerIconByStatus(repStatus),
  //       label: poi.name
  //     });

  //     marker.addListener("click", () => {
  //       onMarkerClick(poi);
  //       if (infoWindowRef.current) infoWindowRef.current.setMap(null);
  //       infoWindowRef.current = new window.Tmapv2.InfoWindow({
  //         position: marker.getPosition(),
  //         content: `<div style="padding:6px 10px;"><b>${poi.name}</b></div>`,
  //         type: 2,
  //         map
  //       });
  //     });

  //     markersRef.current.push(marker);
  //   });

  //   let bounds = new window.Tmapv2.LatLngBounds();
  //   poiList.forEach(poi => {
  //     if (poi.frontLat && poi.frontLon) {
  //       bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
  //     }
  //   });
  //   if (!bounds.isEmpty()) map.fitBounds(bounds);
  // }, [poiList]);

  return (
    <div className="mapContainer">
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />

      {isMapMoved && <div className="center-marker" />}
    </div>
  );
};

export default Tmap;

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
