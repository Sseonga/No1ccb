import React, { useEffect, useState } from "react";
import Tmap from "../station/Tmap"; // 기존 Tmap 컴포넌트 재사용!
import "./Accommodation.css";


const AccommodationPanel = () => {
  const [accommodationList, setAccommodationList] = useState([]);
  const [selected, setSelected] = useState(null);

  // Tmap에 넘길 poiList로 변환 (lat/lon, name 필수)
  const poiList = accommodationList.map(item => ({
    ...item,
    pkey: item.accomId,                // 고유키
    name: item.accomName,              // 마커 라벨/표시
    frontLat: item.accomLat,           // 위도
    frontLon: item.accomLon            // 경도
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

  // 선택된 숙소 정보
  const selectedPoi = selected !== null ? poiList[selected] : null;

  return (
    <div >

        <div style={{ display: "flex", height: "100vh" }}>
          {/* 숙소 리스트 */}
          <div className="hotel-panel" style={{ width: 340, borderRight: "1px solid #eee", background: "#fff", overflowY: "auto" }}>
            <div className="hotel-panel-title" style={{ fontWeight: "bold", padding: 16, borderBottom: "1px solid #ddd" }}>전기차 충전소 숙소 목록</div>
            {poiList.map((item, idx) => (
              <div
                key={item.pkey}
                onClick={() => setSelected(idx)}
                className="hotel-list"
                style={{
                  cursor: "pointer",
                  background: selected === idx ? "#e6f4ff" : "#fff",
                  borderBottom: "1px solid #f3f3f3",
                  padding: 12,
                }}
              >
                <div style={{ fontWeight: "bold" }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#666" }}>{item.accomAddress}</div>
              </div>
            ))}
          </div>
          {/* 지도 */}
          <div style={{ flex: 1, height: "100vh" }}>
            <Tmap
              poiList={poiList}
              selectedPoi={selectedPoi}
              onMarkerClick={(poi) => {
                // 리스트에서 선택된 것과 마커 클릭 시 동기화
                const idx = poiList.findIndex(p => p.pkey === poi.pkey);
                if (idx !== -1) setSelected(idx);
              }}
              // 나머지 props는 필요시 추가 (hideUI, mapRef 등)
            />
          </div>
        </div>
    </div>
  );
};

export default AccommodationPanel;
