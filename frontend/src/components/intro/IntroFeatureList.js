import React from 'react';

// 서비스의 주요 기능들을 배열로 정의
// 전기차 충전소 관련 서비스의 핵심 기능들을 문자열로 저장
const features = [
  '실시간 충전소 위치 및 상태 확인',
  '현재 위치 기반 주변 충전소 및 카페 정보 제공',
  '충전소 및 카페에 대한 사용자 리뷰 및 평점 제공',
  '충전소부터 목적지까지 경로 안내',
];

// 서비스 소개 페이지의 주요 기능 목록을 렌더링하는 React 컴포넌트
const IntroFeatureList = () => {
  return (
    <div className="feature-list">
      {/* 기능 목록의 제목 */}
      <h3>서비스 주요 기능</h3>
      
      {/* 기능들을 순서 없는 목록(ul)으로 렌더링 */}
      <ul>
        {/* features 배열의 각 항목을 순회하며 li 요소로 변환 */}
        {features.map((feature, index) => (
          // 각 기능을 리스트 아이템으로 렌더링
          // key prop으로 배열 인덱스를 사용하여 React의 리스트 렌더링 최적화
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

// 다른 파일에서 import할 수 있도록 컴포넌트를 기본 내보내기
export default IntroFeatureList;