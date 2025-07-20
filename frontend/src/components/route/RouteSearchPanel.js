import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

// Tmap AppKey (API 호출에 사용)
const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

// 카테고리 버튼 정의 (충전소, 카페, 편의점, 음식점)
const CATEGORY_BTNS = [
  { key: "charge", label: "충전소" },
  { key: "cafe", label: "카페" },
  { key: "store", label: "편의점" },
  { key: "food", label: "음식점" }
];

// 충전소/POI 상세정보 컴포넌트
function PoiDetail({ poi }) {
  if (!poi) return null;
  const evChargers = poi.evChargers?.evCharger;
  const fullAddress =
    poi.newAddressList?.newAddress?.[0]?.fullAddress ||
    [poi.upperAddrName, poi.middleAddrName, poi.lowerAddrName, poi.detailAddrName].filter(Boolean).join(" ");
  return (
    <div style={{ margin: "20px 0 0 0", padding: "18px", background: "#f9fbfd", borderRadius: 10 }}>
      <h4 style={{ margin: 0, color: "#1a4668" }}>{poi.name}</h4>
      <div style={{ margin: "6px 0 12px 0", color: "#666" }}>
        <b>주소:</b> {fullAddress}
      </div>
      {poi.buildingName && <div><b>건물명:</b> {poi.buildingName}</div>}
      {poi.telNo && <div><b>전화번호:</b> {poi.telNo}</div>}
      <div>
        <b>업종:</b> {[poi.upperBizName, poi.middleBizName, poi.lowerBizName, poi.detailBizName].filter(Boolean).join(" ")}
      </div>
      {poi.desc && <div style={{ margin: "6px 0 10px 0", fontSize: 14, color: "#444" }}>
        <b>소개:</b> {poi.desc}
      </div>}
      <div style={{ margin: "8px 0" }}>
        <b>POI PKEY:</b> {poi.pkey}
        {poi.id && <span style={{ marginLeft: 12 }}><b>ID:</b> {poi.id}</span>}
        {poi.rpFlag && <span style={{ marginLeft: 12 }}><b>RP_FLAG:</b> {poi.rpFlag}</span>}
      </div>
      {evChargers && (
        <div style={{ marginTop: 16 }}>
          <b>⚡ 충전기 상세 ({Array.isArray(evChargers) ? evChargers.length : 1}대)</b>
          <table style={{ borderCollapse: "collapse", marginTop: 5, width: "100%" }}>
            <thead>
              <tr style={{ background: "#eaf2f8", fontSize: 13 }}>
                <th>업체명</th>
                <th>충전기ID</th>
                <th>타입</th>
                <th>급속</th>
                <th>상태</th>
                <th>출력</th>
                <th>마지막충전</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(evChargers) ? evChargers : [evChargers]).map((ch, i) => (
                <tr key={ch.chargerId || i} style={{ fontSize: 13 }}>
                  <td>{ch.operatorName}</td>
                  <td>{ch.chargerId}</td>
                  <td>{chargerTypeToKor(ch.type)}</td>
                  <td>{ch.isFast === "Y" ? "O" : "-"}</td>
                  <td style={{ color: chargerStatusColor(ch.status), fontWeight: 600 }}>
                    {chargerStatusToKor(ch.status)}
                  </td>
                  <td>{ch.powerType}</td>
                  <td>{formatDateTime(ch.chargingDateTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ====== 보조 함수(충전기 상태/타입 한글변환, 시간포맷 등) ======
function chargerStatusToKor(status) {
  const map = {
    "0": "알수없음",
    "1": "통신이상",
    "2": "충전대기",
    "3": "충전중",
    "4": "운영중지",
    "5": "점검중",
    "6": "예약중",
    "9": "상태미확인"
  };
  return map[status] || status;
}
function chargerStatusColor(status) {
  switch (status) {
    case "1":
    case "4":
    case "5":
      return "#e34040";
    case "3":
      return "#377ee6";
    case "9":
      return "#8e8e8e";
    case "2":
    case "6":
    case "0":
    default:
      return "#1ba72d";
  }
}
function chargerTypeToKor(type) {
  const map = {
    "01": "DC차데모",
    "02": "AC완속",
    "03": "DC차데모+AC3상",
    "04": "DC콤보",
    "05": "DC차데모+DC콤보",
    "06": "DC차데모+AC3상+DC콤보",
    "07": "AC급속3상"
  };
  return map[type] || type;
}
function formatDateTime(dt) {
  if (!dt) return "";
  return dt.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6");
}

// === 장소명으로 좌표(위경도) 가져오기 (axios)
async function getCoordByKeyword(keyword) {
  const poiUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(keyword)}&count=1&resCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
  const res = await axios.get(poiUrl);
  const poi = res.data?.searchPoiInfo?.pois?.poi?.[0];
  return poi ? { lat: parseFloat(poi.frontLat), lon: parseFloat(poi.frontLon), name: poi.name } : null;
}

function RouteSearchPanel() {
  const mapDivRef = useRef(null);
  const polylineRef = useRef(null);
  const poiMarkersRef = useRef({
    charge: [],
    cafe: [],
    store: [],
    food: [],
  });
  const infoWindowRef = useRef(null);

  const [from, setFrom] = useState("천안역");
  const [to, setTo] = useState("수원역");
  const [nearbyPois, setNearbyPois] = useState({ charge: [], cafe: [], store: [], food: [] });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [category, setCategory] = useState("charge");
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  function showOnlyCategoryMarkers(cat) {
    const map = mapDivRef.current?._tmap_map;
    Object.entries(poiMarkersRef.current).forEach(([k, arr]) => {
      arr.forEach(marker => {
        try {
          if (marker && marker.setMap) marker.setMap(k === cat ? map : null);
        } catch (err) {
          // 이미 지워진 오브젝트면 무시
          console.warn("마커 setMap(null) 오류 무시:", err);
        }
      });
    });
    if (infoWindowRef.current) {
      try {
        if (infoWindowRef.current.setMap) infoWindowRef.current.setMap(null);
      } catch (err) {
        console.warn("인포윈도우 setMap(null) 오류 무시:", err);
      }
    }
  }

  useEffect(() => {
    showOnlyCategoryMarkers(category);
    // eslint-disable-next-line
  }, [category]);

  const poiList = nearbyPois[category] || [];

  // === 길찾기/중간충전소/주변POI 검색 ===
  async function handleRouteSearch(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setNearbyPois({ charge: [], cafe: [], store: [], food: [] });
    setSelectedPoi(null);

    // 안전하게 클린업!
    Object.values(poiMarkersRef.current).forEach(markerArr => {
      markerArr.forEach(m => {
        try {
          if (m && m.setMap) m.setMap(null);
        } catch (err) {
          console.warn("마커 setMap(null) 오류 무시:", err);
        }
      });
    });
    Object.keys(poiMarkersRef.current).forEach(k => poiMarkersRef.current[k] = []);

    try {
      if (polylineRef.current && polylineRef.current.setMap) {
        polylineRef.current.setMap(null);
      }
    } catch (err) {
      console.warn("폴리라인 setMap(null) 오류 무시:", err);
    }
    try {
      if (infoWindowRef.current && infoWindowRef.current.setMap) {
        infoWindowRef.current.setMap(null);
      }
    } catch (err) {
      console.warn("인포윈도우 setMap(null) 오류 무시:", err);
    }

    try {
      // 출발/도착 좌표 변환 (axios)
      const fromPoi = await getCoordByKeyword(from);
      const toPoi = await getCoordByKeyword(to);
      if (!fromPoi || !toPoi) {
        setErrorMsg("경로 데이터를 찾을 수 없습니다. (출발지/도착지 좌표 변환 오류)");
        return;
      }

      // 경로좌표 배열 구하기 (axios)
      const routeUrl = "https://apis.openapi.sk.com/tmap/routes?version=1&format=json";
      const routeReqBody = {
        startX: String(fromPoi.lon),
        startY: String(fromPoi.lat),
        endX: String(toPoi.lon),
        endY: String(toPoi.lat),
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        searchOption: "0",
        trafficInfo: "N"
      };
      let pathArr = [];
      let routeRes;
      try {
        routeRes = await axios.post(routeUrl, routeReqBody, {
          headers: { "Content-Type": "application/json", "appKey": TMAP_APPKEY }
        });
      } catch (err) {
        throw new Error("경로 탐색 오류: " + (err.response?.data?.message || err.message));
      }
      const routeData = routeRes.data;
      if (!routeData.features) throw new Error("경로 데이터를 찾을 수 없습니다.");
      const lineArr = routeData.features.filter(f => f.geometry.type === "LineString");
      lineArr.forEach(feature => {
        feature.geometry.coordinates.forEach(coord => pathArr.push(coord));
      });
      if (pathArr.length === 0) throw new Error("경로 데이터 없음");

      // 경로 중간 지점
      const ratios = [0.1, 0.3, 0.5, 0.7, 0.9];
      const idxs = ratios.map(r => Math.floor(pathArr.length * r));
      const midPoints = idxs.map((idx, i) => {
        const [lon, lat] = pathArr[idx];
        return { lon, lat, label: `${Math.round(ratios[i]*100)}%` };
      });

      // 지도 세팅
      let map = mapDivRef.current._tmap_map;
      if (!mapDivRef.current._tmap_map) {
        map = new window.Tmapv2.Map(mapDivRef.current, {
          center: new window.Tmapv2.LatLng(midPoints[2].lat, midPoints[2].lon),
          width: "100%",
          height: "400px",
          zoom: 11
        });
        mapDivRef.current._tmap_map = map;
      } else {
        map.setCenter(new window.Tmapv2.LatLng(midPoints[2].lat, midPoints[2].lon));
      }
      // Polyline
      try {
        if (polylineRef.current && polylineRef.current.setMap) {
          polylineRef.current.setMap(null);
        }
      } catch (err) {
        console.warn("폴리라인 setMap(null) 오류 무시:", err);
      }
      const polylinePath = pathArr.map(coord => new window.Tmapv2.LatLng(coord[1], coord[0]));
      polylineRef.current = new window.Tmapv2.Polyline({
        path: polylinePath,
        strokeColor: "#377ee6",
        strokeWeight: 6,
        map
      });
      // 출발/도착 마커
      [
        { lat: fromPoi.lat, lon: fromPoi.lon, label: "출발", color: "green" },
        { lat: toPoi.lat, lon: toPoi.lon, label: "도착", color: "red" }
      ].forEach(loc => {
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(loc.lat, loc.lon),
          map,
          icon: `http://maps.google.com/mapfiles/ms/icons/${loc.color}-dot.png`,
          label: loc.label
        });
      });

      // 중간지점마다 충전소 검색 (axios)
      const chargePromises = midPoints.map(async (pt, i) => {
        const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent("전기차 충전소")}&centerLat=${pt.lat}&centerLon=${pt.lon}&radius=5&count=1&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
        const res = await axios.get(url);
        const poi = res.data?.searchPoiInfo?.pois?.poi?.[0];
        return poi ? { ...pt, poi } : null;
      });
      const chargeStations = (await Promise.all(chargePromises)).filter(Boolean);

      // 충전소 마커 표시
      chargeStations.forEach((cs, i) => {
        const marker = new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(cs.poi.frontLat, cs.poi.frontLon),
          map,
          icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          label: `${cs.poi.name} (${cs.label})`
        });
        marker.addListener("click", function () {
          setCategory("charge");
          setSelectedPoi(cs.poi);
          if (infoWindowRef.current) {
            try {
              if (infoWindowRef.current.setMap) infoWindowRef.current.setMap(null);
            } catch (err) {
              console.warn("인포윈도우 setMap(null) 오류 무시:", err);
            }
          }
          infoWindowRef.current = new window.Tmapv2.InfoWindow({
            position: marker.getPosition(),
            content: `<div style="padding:8px;"><b>${cs.poi.name}</b><br>${cs.poi.newAddressList?.newAddress?.[0]?.fullAddress ?? ""}</div>`,
            type: 2,
            map
          });
        });
        poiMarkersRef.current.charge.push(marker);
      });

      // 중앙 충전소 기준, 카테고리별 6개 검색 (axios)
      const center = chargeStations[2]?.poi || chargeStations[0]?.poi;
      const types = [
        { key: "cafe", keyword: "카페", icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
        { key: "store", keyword: "편의점", icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png" },
        { key: "food", keyword: "음식점", icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png" }
      ];
      const newNearbyPois = { charge: chargeStations.map(cs => cs.poi), cafe: [], store: [], food: [] };
      await Promise.all(types.map(async type => {
        if (!center) return;
        const poiUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(type.keyword)}&centerLat=${center.frontLat}&centerLon=${center.frontLon}&radius=1&count=6&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
        const poiRes = await axios.get(poiUrl);
        const pois = (poiRes.data?.searchPoiInfo?.pois?.poi ?? []).filter(poi => !(poi.name.includes("주차장")));
        newNearbyPois[type.key] = pois;
        pois.forEach((poi) => {
          const marker = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon),
            map: null, // 카테고리 전환 시만 지도에 표시
            icon: type.icon,
            label: poi.name
          });
          marker.addListener("click", function () {
            setCategory(type.key);
            setSelectedPoi(poi);
            if (infoWindowRef.current) {
              try {
                if (infoWindowRef.current.setMap) infoWindowRef.current.setMap(null);
              } catch (err) {
                console.warn("인포윈도우 setMap(null) 오류 무시:", err);
              }
            }
            infoWindowRef.current = new window.Tmapv2.InfoWindow({
              position: marker.getPosition(),
              content: `<div style="padding:8px;"><b>${poi.name}</b><br>${poi.newAddressList?.newAddress?.[0]?.fullAddress ?? ""}</div>`,
              type: 2,
              map: mapDivRef.current._tmap_map
            });
          });
          poiMarkersRef.current[type.key].push(marker);
        });
      }));
      setNearbyPois(newNearbyPois);

      showOnlyCategoryMarkers("charge");
      setCategory("charge");
      setSelectedPoi(chargeStations[0]?.poi || null);

      setRouteInfo({
        userId: 1, // 추후 로그인 연동
        recentTypeCd: "ROUTE",
        startAddress: from,
        startLat: fromPoi.lat,
        startLon: fromPoi.lon,
        endAddress: to,
        endLat: toPoi.lat,
        endLon: toPoi.lon,
        keyword: `${from}→${to}`,
      });
    } catch (err) {
      setErrorMsg("검색 중 오류 발생: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 최근검색 DB 저장
  async function handleSaveRecent() {
    if (!routeInfo) {
      alert("검색된 경로 정보가 없습니다!");
      return;
    }
    try {
      await axios.post("/api/recent2", routeInfo);
      alert("최근 검색이 저장되었습니다!");
    } catch (err) {
      alert("저장 중 오류 발생!");
      console.error(err);
    }
  }

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: 30 }}>
      <h1 style={{ textAlign: "center", fontWeight: 800, margin: 0 }}>
        천안 → 수원 길찾기 & 중간 충전소 주변 정보
      </h1>
      {/* 입력폼 */}
      <form onSubmit={handleRouteSearch} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          value={from}
          onChange={e => setFrom(e.target.value)}
          placeholder="출발지"
          style={{
            padding: "10px 13px",
            borderRadius: 8,
            border: "1px solid #bfc9d9",
            fontSize: 16,
            flex: 1
          }}
        />
        <span style={{ alignSelf: "center" }}>→</span>
        <input
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder="도착지"
          style={{
            padding: "10px 13px",
            borderRadius: 8,
            border: "1px solid #bfc9d9",
            fontSize: 16,
            flex: 1
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 26px",
            borderRadius: 8,
            border: "none",
            background: "#377ee6",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
        >길찾기</button>
      </form>

      {/* 최근 검색 DB저장 버튼 */}
      <button
        onClick={handleSaveRecent}
        style={{
          marginBottom: 15,
          padding: "8px 16px",
          background: "#1ba72d",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer"
        }}>
        최근 검색 저장
      </button>

      {/* 지도 영역 */}
      <div
        ref={mapDivRef}
        style={{
          width: "100%",
          height: 400,
          background: "#eee",
          borderRadius: 13,
          margin: "0 0 22px 0"
        }}
      />

      {loading && <div style={{ marginTop: 12 }}>불러오는 중...</div>}
      {errorMsg && <div style={{ color: "red", marginTop: 10 }}>{errorMsg}</div>}

      {/* 카테고리 버튼 */}
      <div style={{ display: "flex", gap: 9, marginBottom: 8 }}>
        {CATEGORY_BTNS.map(btn =>
          <button
            key={btn.key}
            type="button"
            onClick={() => {
              setCategory(btn.key);
              setSelectedPoi(poiList[0] || null);
            }}
            style={{
              flex: 1,
              padding: "11px 0",
              background: category === btn.key ? "#377ee6" : "#f3f6fb",
              color: category === btn.key ? "#fff" : "#222",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: category === btn.key ? "0 2px 8px #377ee640" : ""
            }}
          >{btn.label}</button>
        )}
      </div>

      {/* 카테고리별 POI 리스트 */}
      <div style={{
        marginBottom: 10,
        minHeight: 80,
        background: "#fff",
        border: "1px solid #e3e6ea",
        borderRadius: 10,
        padding: 9
      }}>
        {poiList.length === 0 ? (
          <div style={{ color: "#aaa", fontSize: 15 }}>검색 결과 없음</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {poiList.map((poi, i) => (
              <li
                key={poi.pkey || poi.id || i}
                style={{
                  marginBottom: 9,
                  padding: "8px 6px",
                  background: selectedPoi?.pkey === poi.pkey ? "#e9f2fe" : "",
                  borderRadius: 8,
                  cursor: "pointer"
                }}
                onClick={() => setSelectedPoi(poi)}
              >
                <b>{poi.name}</b>
                <span style={{ fontSize: 13, color: "#555", marginLeft: 9 }}>
                  {poi.newAddressList?.newAddress?.[0]?.fullAddress || poi.upperAddrName || ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* POI 상세정보 컴포넌트 */}
      {selectedPoi && <PoiDetail poi={selectedPoi} />}
    </div>
  );
}

export default RouteSearchPanel;
