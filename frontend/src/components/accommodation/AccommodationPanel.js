import React, { useEffect, useState } from "react";
import AccomMap from "./AccomMap"; // 기존 Tmap 컴포넌트 재사용!
import "./Accommodation.css";
import AccommodationDetail from "./AccommodationDetail";

const AccommodationPanel = () => {
  const [accommodationList, setAccommodationList] = useState([]);
  const [selected, setSelected] = useState(null);

  // Tmap에 넘길 poiList로 변환 (lat/lon, name 필수)
    const poiList = accommodationList.map(item => ({
      ...item,
      pkey: item.accomId,
      name: item.accomName,
      frontLat: item.accomLat,
      frontLon: item.accomLon,
      mainImageUrl: item.accomImgMain1,    // ← VO에 맞게
      homepageUrl: item.accomUrl,           // ← VO에 맞게
      accomCheckin: item.accomCheckin,
      accomCheckout: item.accomCheckout
    }));

  // 숙소 데이터 불러오기
  useEffect(() => {
    fetch("/api/accommodation")
      .then(res => res.json())
      .then(data => setAccommodationList(data))
      .catch(e => {
        alert("숙소 데이터를 불러오지 못했습니다.");
        setAccommodationList([]);
      });
  }, []);

  useEffect(() => {
            console.log("AccommodationPanel poiList:", poiList);
          }, [poiList]);
  // 선택된 숙소 정보
  const selectedPoi = selected !== null ? poiList[selected] : null;

    return (
      <div style={{ display: "flex", height: "100vh" }}>
        {/* 패널: 리스트 or 상세 */}
        <div className="hotel-panel" style={{
          width: 340,
          borderRight: "1px solid #eee",
          background: "#fff",
          overflowY: "auto",
          position: "relative"
        }}>
          {selected === null ? (
            // 리스트만 (기존 코드 그대로)
            <>
              <div className="hotel-panel-title" style={{
                fontWeight: "bold", padding: 16, borderBottom: "1px solid #ddd"
              }}>전기차 충전소 숙소 목록</div>
              {poiList.map((item, idx) => (
                <div
                  key={item.pkey}
                  onClick={() => setSelected(item)}
                  className="hotel-list"
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #f3f3f3",
                    padding: 12,
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{item.accomAddress}</div>
                </div>
              ))}
            </>
          ) : (
            // 상세 컴포넌트만
            <AccommodationDetail
              accommodation={selected}
              onBack={() => setSelected(null)}
            />
          )}
        </div>
        {/* 지도 */}
        <div style={{ flex: 1, height: "100vh" }}>
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
