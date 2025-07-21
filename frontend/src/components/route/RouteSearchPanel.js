import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

// Tmap AppKey (실제 프로젝트에서 환경변수 처리 권장)
const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

// 카테고리 버튼 목록
const CATEGORY_BTNS = [
  { key: "charge", label: "충전소" },
  { key: "cafe", label: "카페" },
  { key: "store", label: "편의점" },
  { key: "food", label: "음식점" }
];

// 충전소/POI 상세 컴포넌트
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

// ======= 보조 함수 =======
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
// ========================

// =============== TopFilterListArea2 컴포넌트 ===============
function RouteSearchPanel() {
  // 지도/마커 등 참조
  const mapDivRef = useRef(null);
  const polylineRef = useRef(null);
  const poiMarkersRef = useRef({
    charge: [],
    cafe: [],
    store: [],
    food: [],
  });
  const infoWindowRef = useRef(null);

  // 상태값 관리
  const [from, setFrom] = useState("천안역");
  const [to, setTo] = useState("수원역");
  const [nearbyPois, setNearbyPois] = useState({ charge: [], cafe: [], store: [], food: [] });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [category, setCategory] = useState("charge");
  const [selectedPoi, setSelectedPoi] = useState(null);

  // [1] 로그인 정보(userId) localStorage에서 자동으로 읽기
  const userId = sessionStorage.getItem("userId");

  // 장소명→좌표 변환 함수
  async function getCoordByKeyword(keyword) {
    const poiUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(keyword)}&count=1&resCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
    const res = await fetch(poiUrl);
    const data = await res.json();
    const poi = data?.searchPoiInfo?.pois?.poi?.[0];
    return poi ? { lat: parseFloat(poi.frontLat), lon: parseFloat(poi.frontLon), name: poi.name } : null;
  }

  // ========== [핵심] 길찾기 시 자동 저장 ==========
  async function handleRouteSearch(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setNearbyPois({ charge: [], cafe: [], store: [], food: [] });
    setSelectedPoi(null);

    // 기존 마커/폴리라인/인포윈도우 초기화
    Object.values(poiMarkersRef.current).forEach(markerArr => markerArr.forEach(m => m.setMap(null)));
    Object.keys(poiMarkersRef.current).forEach(k => poiMarkersRef.current[k] = []);
    if (polylineRef.current) polylineRef.current.setMap(null);
    if (infoWindowRef.current) infoWindowRef.current.setMap(null);

    // 출발/도착 좌표 구하기
    const fromPoi = await getCoordByKeyword(from);
    const toPoi = await getCoordByKeyword(to);
    if (!fromPoi || !toPoi) {
      setErrorMsg("경로 데이터를 찾을 수 없습니다. (출발지/도착지 좌표 변환 오류)");
      setLoading(false);
      return;
    }

    // 1. 경로 구하기 (좌표배열)
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
    try {
      const routeRes = await fetch(routeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "appKey": TMAP_APPKEY
        },
        body: JSON.stringify(routeReqBody)
      });
      const routeData = await routeRes.json();
      if (!routeData.features) throw new Error("경로 데이터를 찾을 수 없습니다.");
      const lineArr = routeData.features.filter(f => f.geometry.type === "LineString");
      lineArr.forEach(feature => {
        feature.geometry.coordinates.forEach(coord => pathArr.push(coord));
      });
      if (pathArr.length === 0) throw new Error("경로 데이터 없음");
    } catch (err) {
      setErrorMsg("경로 탐색 오류: " + err.message);
      setLoading(false);
      return;
    }

    // 2. 10%/30%/50%/70%/90% 위치 구하기
    const ratios = [0.1, 0.3, 0.5, 0.7, 0.9];
    const idxs = ratios.map(r => Math.floor(pathArr.length * r));
    const midPoints = idxs.map((idx, i) => {
      const [lon, lat] = pathArr[idx];
      return { lon, lat, label: `${Math.round(ratios[i]*100)}%` };
    });

    // 3. 지도 생성/이동
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

    // 4. Polyline
    if (polylineRef.current) polylineRef.current.setMap(null);
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

    // 5. 각 구간 충전소 1개씩 검색
    const chargePromises = midPoints.map(async (pt, i) => {
      const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent("전기차 충전소")}&centerLat=${pt.lat}&centerLon=${pt.lon}&radius=5&count=1&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
      const res = await fetch(url);
      const data = await res.json();
      const poi = data?.searchPoiInfo?.pois?.poi?.[0];
      return poi ? { ...pt, poi } : null;
    });
    const chargeStations = (await Promise.all(chargePromises)).filter(Boolean);

    // 6. 충전소 마커/리스트 세팅
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
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);
        infoWindowRef.current = new window.Tmapv2.InfoWindow({
          position: marker.getPosition(),
          content: `<div style="padding:8px;"><b>${cs.poi.name}</b><br>${cs.poi.newAddressList?.newAddress?.[0]?.fullAddress ?? ""}</div>`,
          type: 2,
          map
        });
      });
      poiMarkersRef.current.charge.push(marker);
    });

    // 7. 각 카테고리별 POI(카페/편의점/음식점) 6개씩 - 중간(50%) 충전소 기준!
    const center = chargeStations[2]?.poi || chargeStations[0]?.poi; // 50% 충전소 없으면 첫번째
    const types = [
      { key: "cafe", keyword: "카페", icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
      { key: "store", keyword: "편의점", icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png" },
      { key: "food", keyword: "음식점", icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png" }
    ];
    const newNearbyPois = { charge: chargeStations.map(cs => cs.poi), cafe: [], store: [], food: [] };
    await Promise.all(types.map(async type => {
      if (!center) return;
      const poiUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(type.keyword)}&centerLat=${center.frontLat}&centerLon=${center.frontLon}&radius=1&count=6&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
      const poiRes = await fetch(poiUrl);
      const poiData = await poiRes.json();
      const pois = (poiData?.searchPoiInfo?.pois?.poi ?? []).filter(poi => !(poi.name.includes("주차장")));
      newNearbyPois[type.key] = pois;

      pois.forEach((poi) => {
        const marker = new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon),
          map: null,
          icon: type.icon,
          label: poi.name
        });
        marker.addListener("click", function () {
          setCategory(type.key);
          setSelectedPoi(poi);
          if (infoWindowRef.current) infoWindowRef.current.setMap(null);
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

    setLoading(false);
    showOnlyCategoryMarkers("charge");
    setCategory("charge");
    setSelectedPoi(chargeStations[0]?.poi || null);

    const userEmail = sessionStorage.getItem("email");


    // =============== [자동 저장] ===============
    if (userEmail) {
      try {
        await axios.post("/api/recent", {
          userId: userId,
          recentTypeCd: "ROUTE",
          startAddress: from,
          startLat: fromPoi.lat,
          startLon: fromPoi.lon,
          endAddress: to,
          endLat: toPoi.lat,
          endLon: toPoi.lon,
          keyword: `${from}→${to}`,
        });
        // 성공 안내 메시지는 필요시 추가
        // alert("최근 검색이 저장되었습니다!");
      } catch (err) {
        alert("자동 저장 중 오류 발생!");
        console.error(err);
      }
    } else {
      alert("로그인 후 이용해주세요!");
    }
  }

  // 카테고리별 마커 표시/숨김 처리
  function showOnlyCategoryMarkers(cat) {
    const map = mapDivRef.current?._tmap_map;
    Object.entries(poiMarkersRef.current).forEach(([k, arr]) => {
      arr.forEach(marker => marker.setMap(k === cat ? map : null));
    });
    if (infoWindowRef.current) infoWindowRef.current.setMap(null);
  }

  // 카테고리 바뀔 때마다 마커 표시/숨김
  useEffect(() => {
    showOnlyCategoryMarkers(category);
    // eslint-disable-next-line
  }, [category]);

  const poiList = nearbyPois[category] || [];

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: 30 }}>
      <h1 style={{ textAlign: "center", fontWeight: 800, margin: 0 }}>
        천안 → 수원 길찾기 & 중간 충전소 주변 정보
      </h1>
      {/* 입력 폼 */}
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
        >
          길찾기
        </button>
      </form>
      {/* 지도 */}
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
              setSelectedPoi((nearbyPois[btn.key] || [])[0] || null);
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
      {/* POI 리스트 */}
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
      {/* POI 상세 정보 */}
      {selectedPoi && <PoiDetail poi={selectedPoi} />}
    </div>
  );
}

export default RouteSearchPanel;
