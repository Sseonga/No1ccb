import React, { useState, useEffect } from "react";
import SpotDetailPanel from "./SpotDetailPanel";

const types = [
  { key: "cafe", keyword: "카페", icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
  { key: "store", keyword: "편의점", icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png" },
  { key: "food", keyword: "음식점", icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png" }
];

const SpotListPanel = ({ center, onClose }) => {
  const [spotsByType, setSpotsByType] = useState({});
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    const fetchSpots = async () => {
      const fetched = {};
      for (const type of types) {
        const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(
          type.keyword
        )}&centerLat=${center.lat}&centerLon=${center.lon}&radius=1&count=6&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${process.env.REACT_APP_TMAP_APPKEY}`;
        try {
          const res = await fetch(url, {
            headers: {
              appKey: process.env.REACT_APP_TMAP_APPKEY
            }
          });
          const json = await res.json();
          fetched[type.key] = json.searchPoiInfo?.pois?.poi || [];
        } catch (err) {
          console.error(`${type.keyword} 불러오기 실패`, err);
        }
      }
      setSpotsByType(fetched);
    };

    fetchSpots();
  }, [center]);

  return (
    <div className="spot-list-panel">
      <button className="close-btn" onClick={onClose}>닫기</button>

      {types.map(type => (
        <div key={type.key} className="spot-category">
          <h4>{type.keyword}</h4>
          <ul>
            {spotsByType[type.key]?.map(poi => (
              <li key={poi.id} onClick={() => setSelectedSpot(poi)}>
                {poi.name} ({poi.roadName || poi.upperAddrName})
              </li>
            ))}
          </ul>
        </div>
      ))}

      {selectedSpot && (
        <SpotDetailPanel poi={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
};

export default SpotListPanel;
