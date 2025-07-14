import React from 'react';
import ReportSelectCheckBox from './ReportSelectCheckbox';

/**
 * 신고된 리뷰 관리 테이블의 개별 행 컴포넌트
 * 개별 신고 정보를 표시하고 선택 기능을 제공
 *
 * @param {number} no - 행 번호
 * @param {Object} report - 신고 정보 객체 (id, title, reason, count 포함)
 * @param {boolean} checked - 선택 상태
 * @param {Function} onSelect - 선택 처리 함수
 */
const ReportReviewRow = ({ no, report, checked, onSelect }) => {
  return (
    <div className="table-row">
      {/* 순서 번호 */}
      <div className="cell-no">{no}</div>

      {/* 신고된 리뷰 제목 */}
      <div className="cell title">{report.title}</div>

      {/* 신고 사유 */}
      <div className="cell reason">{report.reason}</div>

      {/* 신고 횟수 */}
      <div className="cell count">{report.count}</div>

      {/* 선택 체크박스 */}
      <div className="cell check">
        <ReportSelectCheckBox
          checked={checked}
          onChange={(e) => onSelect(report.id, e.target.checked)} // 체크박스 변경 시 선택 처리
        />
      </div>
    </div>
  );
};

export default ReportReviewRow;
