// src/utils/searchRouteWithPois.js

const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

// 카테고리별 키워드
const CATEGORY_CONFIG = {
  charge: "전기차 충전소",
  cafe: "카페",
  store: "편의점",
  food: "음식점"
};

/**
 * 출발/도착명 → 경로 → 경로 중간지점 충전소/POI 검색
 * @param {string} from - 출발지명(예: 천안역)
 * @param {string} to - 도착지명(예: 수원역)
 * @returns {Promise<{ pathArr, fromPoi, toPoi, poisByCat }>}
 */
export async function searchRouteWithPois(from, to) {
  // 출발/도착 좌표 구하기
  async function getCoordByKeyword(keyword) {
    const poiUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(keyword)}&count=1&resCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
    const res = await fetch(poiUrl);
    const data = await res.json();
    const poi = data?.searchPoiInfo?.pois?.poi?.[0];
    return poi
      ? { lat: parseFloat(poi.frontLat), lon: parseFloat(poi.frontLon), ...poi }
      : null;
  }

  const fromPoi = await getCoordByKeyword(from);
  const toPoi = await getCoordByKeyword(to);

  if (!fromPoi || !toPoi) throw new Error("출발/도착지 검색 실패");

  // 경로 탐색
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
  const routeRes = await fetch(routeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "appKey": TMAP_APPKEY
    },
    body: JSON.stringify(routeReqBody)
  });
  const routeData = await routeRes.json();
  const pathArr = [];
  if (!routeData.features) throw new Error("경로 데이터 없음");
  routeData.features.filter(f => f.geometry.type === "LineString").forEach(feature => {
    feature.geometry.coordinates.forEach(coord => pathArr.push(coord));
  });
  if (pathArr.length === 0) throw new Error("경로 데이터 없음");

  // 중간 지점 계산 (10,30,50,70,90%)
  const ratios = [0.1, 0.3, 0.5, 0.7, 0.9];
  const idxs = ratios.map(r => Math.floor(pathArr.length * r));
  const midPoints = idxs.map((idx, i) => {
    const [lon, lat] = pathArr[idx];
    return { lon, lat, label: `${Math.round(ratios[i]*100)}%` };
  });

  // 각 지점에서 충전소 검색
  const chargePromises = midPoints.map(async (pt) => {
    const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent("전기차 충전소")}&centerLat=${pt.lat}&centerLon=${pt.lon}&radius=5&count=1&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const poi = data?.searchPoiInfo?.pois?.poi?.[0];
    return poi ? { ...pt, poi } : null;
  });
  const chargeStations = (await Promise.all(chargePromises)).filter(Boolean);

  // 50% 충전소 기준 카페/편의점/음식점
  const center = chargeStations[2]?.poi || chargeStations[0]?.poi;
  const poisByCat = { charge: chargeStations.map(cs => cs.poi), cafe: [], store: [], food: [] };
  for (let key of ["cafe", "store", "food"]) {
    if (!center) continue;
    const poiUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(CATEGORY_CONFIG[key])}&centerLat=${center.frontLat}&centerLon=${center.frontLon}&radius=1&count=6&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
    const poiRes = await fetch(poiUrl);
    const poiData = await poiRes.json();
    poisByCat[key] = (poiData?.searchPoiInfo?.pois?.poi ?? []).filter(poi => !(poi.name.includes("주차장")));
  }

  return {
    pathArr,
    fromPoi,
    toPoi,
    poisByCat
  };
}
