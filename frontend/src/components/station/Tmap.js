import React, { useEffect, useRef, useState } from "react";

const Tmap = ({
  poiList,
  onMarkerClick,
  mapRef,
  myMarkerRef,
  onMapMoved,
  hideUI,
  mapMoved,
  onResetMarkers,
  selectedPoi,
}) => {
  const mapDivRef = useRef(null);
  const markersRef = useRef({});
  const infoWindowRef = useRef(null);
  const myLocationMarkerRef = useRef(null);
  const [isMapMoved, setIsMapMoved] = useState(false);
  const [myPosition, setMyPosition] = useState(null);

  function clearMarkersExcept(markerToKeep) {
    Object.values(markersRef.current).forEach((marker) =>
      marker.setVisible(marker === markerToKeep)
    );
  }

  useEffect(() => {
    if (onResetMarkers) {
      onResetMarkers(() => {
        Object.values(markersRef.current).forEach((marker) =>
          marker.setVisible(true)
        );
      });
    }
  }, [poiList]);

  useEffect(() => {
    if (!selectedPoi || !markersRef.current) return;

    const marker = markersRef.current[selectedPoi.pkey];
    if (marker) {
      clearMarkersExcept(marker);
      onMarkerClick(selectedPoi);
    }
  }, [selectedPoi]);

  useEffect(() => {
    setIsMapMoved(mapMoved);
  }, [mapMoved]);

  useEffect(() => {
    if (!window.Tmapv2 || !mapDivRef.current) return;

    if (mapRef.current) {
      mapRef.current.destroy();
    }

    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(36.81023, 127.14644),
      width: "100%",
      height: "100%",
      zoom: 14,
    });

    mapRef.current = map;

    map.addListener("dragstart", () => {
      setIsMapMoved(true);
    });

    map.addListener("center_changed", () => {
      if (typeof onMapMoved === "function") {
        onMapMoved();
      }
    });
  }, []);

  useEffect(() => {
    if (!window.Tmapv2 || !mapRef.current) return;

    const map = mapRef.current;

    Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
    markersRef.current = {};

    if (infoWindowRef.current) infoWindowRef.current.setMap(null);

    poiList.forEach((poi) => {
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
        label: poi.name,
      });

      marker.addListener("click", () => {
        onMarkerClick(poi);
        clearMarkersExcept(marker);
      });

      if (poi.pkey) {
        markersRef.current[poi.pkey] = marker;
      }
    });

    const bounds = new window.Tmapv2.LatLngBounds();
    poiList.forEach((poi) => {
      if (poi.frontLat && poi.frontLon) {
        bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
      }
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds);
  }, [poiList]);

  // 내 위치 마커 업데이트
  useEffect(() => {
    if (!window.Tmapv2 || !mapRef.current || !myPosition) return;

    const map = mapRef.current;

    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
      myLocationMarkerRef.current = null;
    }

    const latlng = new window.Tmapv2.LatLng(myPosition.lat, myPosition.lng);
    const marker = new window.Tmapv2.Marker({
      position: latlng,
      map,
      icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    });

    myLocationMarkerRef.current = marker;
  }, [myPosition]);

  const moveToMyLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("현재 위치:", latitude, longitude);
        setMyPosition({ lat: latitude, lng: longitude });

        mapRef.current.setCenter(new window.Tmapv2.LatLng(latitude, longitude));
        mapRef.current.setZoom(16);
        setIsMapMoved(false);
      },
      () => {
        alert("내 위치를 가져올 수 없습니다.");
      }
    );
  };

  return (
    <div className="mapContainer" style={{ position: "relative", height: "100%" }}>
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />

      {!hideUI && isMapMoved && <div className="center-marker" />}

      {!hideUI && (
        <button
          onClick={moveToMyLocation}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#0077cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 14px",
            cursor: "pointer",
            zIndex: 1000,
          }}
          title="내 위치로 이동"
        >
          내 위치
        </button>
      )}
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
