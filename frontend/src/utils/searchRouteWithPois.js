import axios from "axios";
const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";
const CATEGORY_CONFIG = {
  charge: "전기차 충전소",
  cafe: "카페",
  store: "편의점",
  food: "음식점"
};

// 기존 경로+중간POI 검색
export async function searchRouteWithPois(from, to, options = {}) {
  const { routeOption = "0", trafficOption = "N" } = options;

  // 출발/도착 POI
  async function getCoordByKeyword(keyword) {
    const poiUrl = "https://apis.openapi.sk.com/tmap/pois";
    const res = await axios.get(poiUrl, {
      params: {
        version: 1,
        searchKeyword: keyword,
        count: 1,
        resCoordType: "WGS84GEO",
        appKey: TMAP_APPKEY
      }
    });
    const poi = res.data?.searchPoiInfo?.pois?.poi?.[0];
    return poi && poi.frontLat && poi.frontLon
      ? { ...poi, lat: parseFloat(poi.frontLat), lon: parseFloat(poi.frontLon) }
      : null;
  }

  const fromPoi = await getCoordByKeyword(from);
  const toPoi = await getCoordByKeyword(to);
  if (!fromPoi || !toPoi) throw new Error("출발지/도착지 검색 실패");

  // 경로 탐색
  const routeRes = await axios.post(
    "https://apis.openapi.sk.com/tmap/routes?version=1&format=json",
    {
      startX: String(fromPoi.lon),
      startY: String(fromPoi.lat),
      endX: String(toPoi.lon),
      endY: String(toPoi.lat),
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      searchOption: routeOption,
      trafficInfo: trafficOption
    },
    { headers: { "Content-Type": "application/json", appKey: TMAP_APPKEY } }
  );

  const routeData = routeRes.data;
  if (!routeData.features) throw new Error("경로 데이터 없음");

  const pathArr = [];
  let totalDistance = 0;
  routeData.features
    .filter(f => f.geometry.type === "LineString")
    .forEach(feature => {
      feature.geometry.coordinates.forEach(coord => pathArr.push(coord));
      totalDistance += feature.properties.distance || 0;
    });

  // 중간지점 5개 충전소만 검색 (간단화)
  const ratios = [0.1, 0.3, 0.5, 0.7, 0.9];
  const midPoints = ratios.map(r => {
    const idx = Math.floor(pathArr.length * r);
    const [lon, lat] = pathArr[idx] || [null, null];
    return { lon, lat };
  }).filter(pt => pt.lon && pt.lat);

  const chargeStations = (
    await Promise.all(
      midPoints.map(async pt => {
        const url = "https://apis.openapi.sk.com/tmap/pois";
        const res = await axios.get(url, {
          params: {
            version: 1,
            searchKeyword: CATEGORY_CONFIG.charge,
            centerLat: pt.lat,
            centerLon: pt.lon,
            radius: 2,
            count: 1,
            resCoordType: "WGS84GEO",
            appKey: TMAP_APPKEY
          }
        });
        return res.data?.searchPoiInfo?.pois?.poi?.[0] || null;
      })
    )
  ).filter(Boolean);

  // 50% 기준 POI (이전과 동일)
  const center = chargeStations[2] || chargeStations[0];
  let poiByCat = { charge: chargeStations, cafe: [], store: [], food: [] };

  if (center && center.frontLat && center.frontLon) {
    for (let key of ["cafe", "store", "food"]) {
      const url = "https://apis.openapi.sk.com/tmap/pois";
      const res = await axios.get(url, {
        params: {
          version: 1,
          searchKeyword: CATEGORY_CONFIG[key],
          centerLat: center.frontLat,
          centerLon: center.frontLon,
          radius: 1,
          count: 6,
          resCoordType: "WGS84GEO",
          appKey: TMAP_APPKEY
        }
      });
      poiByCat[key] = res.data?.searchPoiInfo?.pois?.poi ?? [];
    }
  }
  return { pathArr, fromPoi, toPoi, totalDistance, chargeStations, poiByCat };
}

// 신규: "선택 충전소 기준 반경 300m POI"
export async function searchNearbyPoisByCharger(chargerPoi) {
  if (!chargerPoi?.frontLat || !chargerPoi?.frontLon) return { cafe: [], store: [], food: [] };
  let result = {};
  for (let key of ["cafe", "store", "food"]) {
    const url = "https://apis.openapi.sk.com/tmap/pois";
    const res = await axios.get(url, {
      params: {
        version: 1,
        searchKeyword: CATEGORY_CONFIG[key],
        centerLat: chargerPoi.frontLat,
        centerLon: chargerPoi.frontLon,
        radius: 0.3, // 300m
        count: 5,
        resCoordType: "WGS84GEO",
        appKey: TMAP_APPKEY
      }
    });
    result[key] = res.data?.searchPoiInfo?.pois?.poi ?? [];
  }
  return result;
}
