import axios from "axios";

const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

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
 * @returns {Promise<{ pathArr, fromPoi, toPoi, totalDistance, routePois }>}
 */
export async function searchRouteWithPois(from, to) {
  // 출발/도착 좌표 구하기
  async function getCoordByKeyword(keyword) {
    const poiUrl = "https://apis.openapi.sk.com/tmap/pois";
    const res = await axios.get(poiUrl, {
      params: {
        version: 1,
        searchKeyword: keyword,
        count: 1,
        resCoordType: "WGS84GEO",
        appKey: TMAP_APPKEY,
      }
    });
    const poi = res.data?.searchPoiInfo?.pois?.poi?.[0];
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
  const routeRes = await axios.post(routeUrl, routeReqBody, {
    headers: {
      "Content-Type": "application/json",
      "appKey": TMAP_APPKEY
    }
  });
  const routeData = routeRes.data;

  if (!routeData.features) throw new Error("경로 데이터 없음");

  const pathArr = [];
  let totalDistance = 0;
  routeData.features.filter(f => f.geometry.type === "LineString").forEach(feature => {
    feature.geometry.coordinates.forEach(coord => pathArr.push(coord));
    totalDistance += feature.properties.distance || 0;
  });

  if (pathArr.length === 0) throw new Error("경로 데이터 없음");

  // 중간 지점 계산 (10,30,50,70,90%)
  const ratios = [0.1, 0.3, 0.5, 0.7, 0.9];
  const idxs = ratios.map(r => Math.floor(pathArr.length * r));
  const midPoints = idxs.map((idx, i) => {
    const [lon, lat] = pathArr[idx];
    return { lon, lat, label: `${Math.round(ratios[i] * 100)}%` };
  });

  // 각 지점에서 충전소 검색
  const chargePromises = midPoints.map(async (pt) => {
    const url = "https://apis.openapi.sk.com/tmap/pois";
    const res = await axios.get(url, {
      params: {
        version: 1,
        searchKeyword: "전기차 충전소",
        centerLat: pt.lat,
        centerLon: pt.lon,
        radius: 1,
        count: 1,
        resCoordType: "WGS84GEO",
        reqCoordType: "WGS84GEO",
        appKey: TMAP_APPKEY,
      }
    });
    const poi = res.data?.searchPoiInfo?.pois?.poi?.[0];
    return poi ? { ...pt, poi } : null;
  });
  const chargeStations = (await Promise.all(chargePromises)).filter(Boolean);

  // 각 충전소 기준으로 주변 POI(충전소, 카페, 편의점, 음식점) 5개씩
  const routePois = [];
  for (const cs of chargeStations) {
    const { lat, lon } = cs;
    const around = {};
    for (let key of ["charge", "cafe", "store", "food"]) {
      const poiUrl = "https://apis.openapi.sk.com/tmap/pois";
      const poiRes = await axios.get(poiUrl, {
        params: {
          version: 1,
          searchKeyword: CATEGORY_CONFIG[key],
          centerLat: lat,
          centerLon: lon,
          radius: 1,
          count: 5,
          resCoordType: "WGS84GEO",
          reqCoordType: "WGS84GEO",
          appKey: TMAP_APPKEY,
        }
      });
      around[key] = poiRes.data?.searchPoiInfo?.pois?.poi ?? [];
    }
    routePois.push({ ...cs, around });
  }

  return {
    pathArr,
    fromPoi,
    toPoi,
    totalDistance,
    routePois
  };
}
