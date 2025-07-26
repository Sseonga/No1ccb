// components/StationReportPopup.js
import React, { useEffect, useState } from "react";
import "./station.css"; // 스타일 import

const StationReportPopup = ({ stationId, onClose, reportComplete }) => {
  const [reportType, setReportType] = useState("");
  const [comment, setComment] = useState("");
  const [reportOptions, setReportOptions] = useState([]);

  useEffect(() => {
    fetch("/api/code/report")
      .then(res => res.json())
      .then(data => setReportOptions(data))
      .catch(err => console.error("신고유형 로딩 실패", err));
  }, []);

  const handleReportSubmit = async () => {
    if (!reportType) return alert("신고 유형을 선택해주세요");
    try {
      const userId = sessionStorage.getItem("userId");
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          stationId: stationId,
          reportTypeCd: reportType,
          reportComment: comment,
        }),
      });

      if (res.ok) {
        alert("신고가 접수되었습니다.");
        reportComplete();
        onClose();
      } else {
        alert("신고 처리 중 오류 발생");
      }
    } catch (err) {
      console.error("신고 오류:", err);
      alert("서버 오류");
    }
  };

  return (
    <div className="report-overlay">
      <div className="report-popup">
        <h3>충전소 신고</h3>

        <div className="report-field">
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
          >
            <option>신고 유형 선택</option>
            {reportOptions.map(opt => (
              <option key={opt.codeDetailId} value={opt.codeDetailId}>
                {opt.codeDetailName}
              </option>
            ))}
          </select>
        </div>

        <div className="report-field">
          <textarea
            placeholder="추가 설명(선택)"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <div className="report-button-group">
          <button className="report-submit-btn" onClick={handleReportSubmit}>
            신고하기
          </button>
          <button className="report-cancel-btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationReportPopup;
