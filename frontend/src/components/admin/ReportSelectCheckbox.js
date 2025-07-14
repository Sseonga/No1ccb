import React from 'react';

/**
 * 신고 선택용 체크박스 컴포넌트
 * 신고 목록에서 개별 신고를 선택/해제할 수 있는 체크박스
 *
 * @param {boolean} checked - 체크박스 선택 상태
 * @param {Function} onChange - 체크박스 상태 변경 처리 함수
 */
const ReportSelectCheckBox = ({ checked, onChange }) => {
  return (
    <input
      type="checkbox"
      checked={checked} // 체크박스 선택 상태
      onChange={onChange} // 체크박스 변경 시 호출되는 함수
      aria-label="신고 선택" // 접근성을 위한 라벨
    />
  );
};

export default ReportSelectCheckBox;
