// components/StationDetailPanel.js
import React, { useEffect, useState } from "react";
import ChargerList from "./ChargerList";
import StationReportPopup from "./StationReportPopup";
import SpotListPanel from "./SpotListPanel";
import { checkLoginWithConfirm } from "../../util/auth";
import ReportSummaryList from "./ReportSummaryList";
import ParkingInfoPanel from "./ParkingInfoPanel";

const isLogined = sessionStorage.getItem("userId");

const StationDetailPanel = ({ poi, onShowSpots, onBack }) => {
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 임시 상태
  const [showReportPopup, setShowReportPopup] = useState(false); // 팝업 상태
  const [showSpotList, setShowSpotList] = useState(false); // 주변 편의시설 찾기 상태
  const [isReported, setIsReported] = useState(false); // 중복신고방지용 체크
  const [reportStats, setReportStats] = useState({ total: 0, byType: {} }); // 충전소 신고내역 grouping
  const [showReportDetail, setShowReportDetail] = useState(false); // 신고내역 타입별 grouping 확인
  const [showParkingInfo, setShowParkingInfo] = useState(false);


  const userId = sessionStorage.getItem("userId");

  const fetchFavoriteStatus = async () => {
    if (!userId || !poi?.pkey) return;

    try {
      const res = await fetch(
        `/api/favor/exist?userId=${userId}&stationId=${poi.pkey}`
      );
      const data = await res.json();
      setIsFavorited(data.favorited); // 백엔드에서 true/false로 응답
    } catch (err) {
      console.error("즐겨찾기 여부 조회 실패:", err);
    }
  };

    useEffect(() => {
      if (!poi.pkey) return;

      fetch(`/api/report/stats?stationId=${poi.pkey}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("신고 통계 조회 실패");
          }
          return res.json();
        })
        .then((data) => {
          setReportStats(data);
        })
        .catch((err) => {
          console.error("신고 통계 fetch 에러:", err);
        });
    }, [poi]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [poi?.pkey, userId]);

  // 즐겨찾기 업데이트 이벤트 감지
  useEffect(() => {
    const handleFavoriteUpdate = () => {
      fetchFavoriteStatus();
    };

    window.addEventListener('favoriteUpdated', handleFavoriteUpdate);
    
    return () => {
      window.removeEventListener('favoriteUpdated', handleFavoriteUpdate);
    };
  }, [poi?.pkey, userId]);

  const handleToggleFavorite = async () => {
    if (!checkLoginWithConfirm()) return;

    try {
      const userId = sessionStorage.getItem("userId");
      const response = await fetch("/api/favor", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          stationId: poi.pkey,
          poiInfo: poi,
          operatorId: poi.evChargers?.evCharger?.[0]?.operatorId,
          fullAddressRoad: poi.newAddressList?.newAddress?.[0]?.fullAddressRoad,
        }),
      });

      if (response.ok) {
        setIsFavorited((prev) => !prev);
        
        // 마이페이지 새로고침을 위한 이벤트 발생
        window.dispatchEvent(new Event('favoriteUpdated'));
      } else {
        alert("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId || !poi.pkey) return;

    fetch(`/api/report/check?userId=${userId}&stationId=${poi.pkey}`)
      .then(res => res.json())
      .then(data => {
        setIsReported(data.reported); // true or false
      })
      .catch(err => console.error("신고 확인 실패", err));
  }, []);

  const handleReport = () => {
    if (!checkLoginWithConfirm()) return;

    setShowReportPopup(true);
  };

  return (
    <div className="station-detail-panel">
      {/* 즐겨찾기 & 신고 버튼 */}
      <div className="station-detail-top">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">
            <i className="fa-solid fa-arrow-left" style={{ fontSize: 12 }}></i>
          </span>{" "}
          목록으로
        </button>
        <div>
          <button
            onClick={handleToggleFavorite}
            className={`favorite-btn ${isFavorited ? "active" : ""}`}
          >
            {isFavorited ? "★ 즐겨찾기" : "☆ 즐겨찾기"}
          </button>
          <span> </span>
          <button onClick={handleReport} className="report-btn" disabled={isReported}>
            🚩 {isReported ? "신고완료" : "신고하기"}
          </button>
        </div>
      </div>

      {reportStats.total > 0 && (
        <div className="report-summary">
          🚩 이 충전소에는 총 {reportStats.total}건의 신고 이력이 있습니다.
          <button onClick={() => setShowReportDetail(!showReportDetail)}>
            {showReportDetail ? "내역 접기" : "내역 확인"}
          </button>
        </div>
      )}

      {showReportDetail && (
        <ReportSummaryList stats={reportStats.byType} />
      )}


      <div>
        <b>충전소명:</b> {poi.name || "-"}
      </div>
      <div>
        <b>전화번호:</b> {poi.telNo || "-"}
      </div>
      <div>
        <b>업종:</b>{" "}
        {[poi.upperBizName, poi.middleBizName].filter(Boolean).join(" ")}
      </div>
      <div>
        <b>주소:</b> {poi.newAddress || poi.roadName || "-"}
      </div>
      <div>
        <b>주차장:</b> {poi.parkingId ? "연계됨" : "정보 없음"}
        {poi.parkingId && (
          <button onClick={() => setShowParkingInfo(!showParkingInfo)} className="parking-toggle-btn">
            {showParkingInfo ? "숨기기" : "정보 보기"}
          </button>
        )}
      </div>

      {showParkingInfo && poi.parkingId && (
        <ParkingInfoPanel parkingId={poi.parkingId} />
      )}

      <ChargerList evChargers={poi.evChargers?.evCharger} />

      {showReportPopup && (
        <StationReportPopup
          stationId={poi.pkey}
          onClose={() => setShowReportPopup(false)}
          reportComplete={() => setIsReported(true)}
        />
      )}

      <button onClick={onShowSpots} className="spot-search-btn">
        주변 편의시설 찾기
      </button>

      {showSpotList && (
        <SpotListPanel
          center={{ lat: poi.frontLat, lon: poi.frontLon }}
          onClose={() => setShowSpotList(false)}
        />
      )}
    </div>
  );
};

export default StationDetailPanel;
