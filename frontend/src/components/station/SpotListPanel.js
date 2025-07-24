import React, { useState, useEffect } from "react";
import SpotDetailPanel from "./SpotDetailPanel";
import SpotListCard from "./SpotListCard";

const types = [
  {
    key: "cafe",
    keyword: "카페",
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  },
  {
    key: "store",
    keyword: "편의점",
    icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  },
  {
    key: "food",
    keyword: "음식점",
    icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  },
];

const SpotListPanel = ({
  selectedPoiName,
  center,
  onClose,
  onSpotsFetched,
  selectedSpotId,
  onSelectSpot,
}) => {
  const [spotsByType, setSpotsByType] = useState({});

  useEffect(() => {
    const fetchSpots = async () => {
      const fetched = {};

      for (const type of types) {
        let collected = [];
        let page = 1;

        while (collected.length < 6 && page <= 3) {
          const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(
            type.keyword
          )}&centerLat=${center.lat}&centerLon=${
            center.lon
          }&radius=1&count=10&page=${page}&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${
            process.env.REACT_APP_TMAP_APPKEY
          }`;

          try {
            const res = await fetch(url, {
              headers: {
                appKey: process.env.REACT_APP_TMAP_APPKEY,
              },
            });
            const json = await res.json();
            const pois = json?.searchPoiInfo?.pois?.poi ?? [];

            const filtered = pois.filter((poi) => !poi.name.includes("주차장"));
            collected = [...collected, ...filtered];
          } catch (err) {
            console.error(`${type.keyword} 불러오기 실패`, err);
            break;
          }

          page += 1;
        }

        fetched[type.key] = collected.slice(0, 6);
      }

      setSpotsByType(fetched);
      onSpotsFetched?.(Object.values(fetched).flat()); // ✅ 마커 등록
    };

    fetchSpots();
  }, [center]);

  return (
    <div className="spot-list-panel">
      <button className="back-button" onClick={onClose}>
        <span className="back-icon">←</span> 이전으로
      </button>

      <h3>{selectedPoiName} 주변</h3>

      {types.map((type) => (
        <div key={type.key} className="spot-category">
          <h4>{type.keyword}</h4>
          <ul>
            {spotsByType[type.key]?.map((poi) => (
              <SpotListCard
                key={poi.pkey}
                poi={poi}
                isOpen={selectedSpotId === poi.pkey}
                onClick={() => {
                  const willSelect = selectedSpotId !== poi.pkey;
                  if (willSelect) {
                    onSelectSpot?.(poi.pkey, poi.frontLat, poi.frontLon);
                  }
                }}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SpotListPanel;
