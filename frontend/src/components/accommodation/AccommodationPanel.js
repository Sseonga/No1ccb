import React, { useEffect, useState } from "react";
import AccomMap from "./AccomMap";
import "./Accommodation.css";
import AccommodationDetail from "./AccommodationDetail";

const AccommodationPanel = () => {
  const [accommodationList, setAccommodationList] = useState([]);
  const [selected, setSelected] = useState(null);

  // Tmap에 넘길 poiList
  const poiList = accommodationList.map((item) => ({
    ...item,
    pkey: item.accomId,
    name: item.accomName,
    frontLat: item.accomLat,
    frontLon: item.accomLon,
    mainImageUrl: item.accomImgMain1,
    homepageUrl: item.accomUrl,
    accomCheckin: item.accomCheckin,
    accomCheckout: item.accomCheckout,
  }));

  useEffect(() => {
    fetch("/api/accommodation")
      .then((res) => res.json())
      .then((data) => setAccommodationList(data))
      .catch(() => {
        alert("숙소 데이터를 불러오지 못했습니다.");
        setAccommodationList([]);
      });
  }, []);

  const selectedPoi = selected !== null ? poiList[selected] : null;

  return (
    <div className="accom-container">
      {/* 패널 */}
      <div className="hotel-panel">
        {selected === null ? (
          <>
            <div className="hotel-panel-title"><h3>전기차 충전소 숙소 목록</h3></div>
            {poiList.map((item) => (
              <div
                key={item.pkey}
                onClick={() => setSelected(item)}
                className="hotel-list"
              >
                <div className="hotel-name">{item.name}</div>
                <div className="hotel-address">{item.accomAddress}</div>
              </div>
            ))}
          </>
        ) : (
          <AccommodationDetail
            accommodation={selected}
            onBack={() => setSelected(null)}
          />
        )}
      </div>
      {/* 지도 */}
      <div className="map-area">
        <AccomMap
          poiList={poiList}
          selectedPoi={selected}
          onMarkerClick={(poi) => setSelected(poi)}
        />
      </div>
    </div>
  );
};

export default AccommodationPanel;
