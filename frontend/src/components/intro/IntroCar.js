import React from "react";
import "./Intro.css"; // 필요 시 스타일 분리
import IntroImage from './IntroImage'; // 오타 수정: IntroIamge → IntroImage
import IntroFeatureList from './IntroFeatureList';

const IntroCar = () => {
  return (
    <div className="introPanel">
         <div className="intro-title">
           <h2>저희 에코스팟은?</h2>
          </div>

        <div className="introArea">

              <div className="echo-spot">
                echo spot
              </div>



              {/* 인트로 이미지 컴포넌트 - 서비스 시각적 표현 */}
              <IntroImage />

              {/* 인트로 기능 목록 컴포넌트 - 서비스 주요 기능들 나열 */}
              <IntroFeatureList />
            </div>

        </div>
  );
};

export default IntroCar;
