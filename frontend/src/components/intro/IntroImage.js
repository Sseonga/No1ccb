import React from 'react';

/**
 * IntroImage 컴포넌트
 * 애플리케이션의 인트로 화면에 표시되는 이미지를 렌더링하는 컴포넌트
 */
const IntroImage = () => {
  return (
    <div className="intro-image">
      {/* 인트로 이미지 표시 */}
      <img
        src="/intro.png" // public 폴더에 있는 intro.png 파일 경로
        alt="Echo spot Illustration" // 이미지 접근성을 위한 대체 텍스트
        className="intro-illustration" // CSS 스타일링을 위한 클래스명
        style={{
          width: '80%', // 이미지 고정 너비 500px
          height: 'auto', // 비율 유지를 위한 자동 높이 조정
          maxWidth: '100%', // 반응형 디자인: 컨테이너 너비를 초과하지 않도록 제한
          objectFit: 'contain', // 이미지 비율 유지하며 컨테이너에 맞춤
        }}
      />
    </div>
  );
};

export default IntroImage;
