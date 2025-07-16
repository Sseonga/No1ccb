// components/mypage/MyReview.js
import React, { useEffect, useState } from "react";

const MyReview = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // TODO: API 요청으로 내 리뷰 가져오기
    // 현재는 예시 데이터
    const dummyReviews = [
      {
        id: 1,
        place: "서울 충전소 A",
        rating: 4,
        comment: "깨끗하고 사용하기 편해요!",
        date: "2025-07-10",
      },
      {
        id: 2,
        place: "대전 숙소 B",
        rating: 5,
        comment: "숙소도 좋고 충전도 빠르게 됐어요.",
        date: "2025-06-28",
      },
    ];
    setReviews(dummyReviews);
  }, []);

  return (
    <div>
      <h3>내 평점/댓글</h3>
      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: "1rem" }}>
              <strong>{review.place}</strong> ({review.date})
              <br />
              평점: {"⭐".repeat(review.rating)}
              <br />
              <span>{review.comment}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReview;
