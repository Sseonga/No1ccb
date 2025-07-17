// components/ReviewLinkButton.js
import React from "react";

const ReviewLinkButton = ({ poiId }) => {
  const goToReviewPage = () => {
    window.location.href = `/review/${poiId}`; // 라우터 연동 시 수정
  };

  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={goToReviewPage} style={{ padding: "6px 12px", borderRadius: 6 }}>
        리뷰 보기
      </button>
    </div>
  );
};

export default ReviewLinkButton;
