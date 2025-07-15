import React, { useEffect, useRef } from "react";

const Tmap = ({ tmapObjRef }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.Tmapv2 || !mapRef.current || tmapObjRef.current) return;

    // 1. 지도 초기화 (기본 중심: 서울시청)
    const map = new window.Tmapv2.Map(mapRef.current, {
      center: new window.Tmapv2.LatLng(36.81023, 127.14644),
      width: "100%",
      height: "100%",
      zoom: 15,
      zoomControl: false,
    });

    tmapObjRef.current = map;

    // 2. 위치 정보 확인해서 지도 재설정
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng = new window.Tmapv2.LatLng(latitude, longitude);

          map.setCenter(userLatLng); // 지도 중심 내 위치로 변경

          // 내 위치 마커 표시
          new window.Tmapv2.Marker({
            position: userLatLng,
            map: map,
            title: "내 위치",
            icon: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
          });
        },
        (error) => {
          console.warn("위치 정보 가져오기 실패:", error);
        }
      );
    } else {
      console.warn("기본 위치로 설정합니다.");
    }
  }, [tmapObjRef]);

  return (
    <div className="mapContainer">
      <div ref={mapRef} className="mapDiv" />
    </div>
  );
};

export default Tmap;
