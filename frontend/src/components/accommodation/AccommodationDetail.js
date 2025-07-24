import React from "react";

const AccommodationDetail = ({ accommodation, onBack }) => {
  if (!accommodation) return null;

  return (
    <div style={{ padding: 24, position: "relative", height: "100%" }}>
      <button
        onClick={onBack}
        style={{
          position: "absolute", left: 16, top: 16, fontSize: 18,
          background: "none", border: "none", cursor: "pointer"
        }}
      >← 뒤로</button>

      {/* 숙소 이름 */}
      <h2 style={{ margin: "48px 0 12px 0" }}>{accommodation.accomName}</h2>

      {/* 숙소 주소 */}
      <div style={{ color: "#888", marginBottom: 10 }}>
        {accommodation.accomAddress}
        {accommodation.accomAddressD ? ` (${accommodation.accomAddressD})` : ""}
      </div>

      {/* 대표 이미지 */}
      {accommodation.accomImgMain1 && (
        <img
          src={accommodation.accomImgMain1}
          alt={accommodation.accomName}
          style={{ width: "100%", borderRadius: 12, margin: "20px 0" }}
        />
      )}

      {/* 숙소 설명 */}
      {accommodation.accomDesc && (
        <div style={{ margin: "18px 0", color: "#444" }}>{accommodation.accomDesc}</div>
      )}

      {/* 홈페이지 */}
      {accommodation.accomUrl && (
        <div style={{ margin: "12px 0" }}>
          <a
            href={accommodation.accomUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2196f3", textDecoration: "underline" }}
          >
            홈페이지 바로가기
          </a>
        </div>
      )}
    </div>
  );
};

export default AccommodationDetail;
