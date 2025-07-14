import React from 'react';
import IntroImage from './IntroImage'; // 오타 수정: IntroIamge → IntroImage
import IntroFeatureList from './IntroFeatureList';

/**
 * IntroPanel 컴포넌트
 * 서비스 소개 화면을 구성하는 메인 패널 컴포넌트
 * 제목, 이미지, 기능 목록을 포함하여 전체 인트로 화면을 렌더링
 */
const IntroPanel = () => {
  return (
    <div className="intro-panel">
      {/* 서비스 소개 섹션의 메인 제목 */}
      <h2>서비스 소개</h2>

      {/* 인트로 이미지 컴포넌트 - 서비스 시각적 표현 */}
      <IntroImage />

      {/* 인트로 기능 목록 컴포넌트 - 서비스 주요 기능들 나열 */}
      <IntroFeatureList />
    </div>
  );
};

export default IntroPanel;
