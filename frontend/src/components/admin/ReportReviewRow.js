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
    <tr>
      {/* 순서 번호 */}
      <td>{no}</td>

      {/* 신고된 리뷰 제목 */}
      <td>{report.title}</td>

      {/* 신고 사유 */}
      <td>{report.reason}</td>

      {/* 신고 횟수 */}
      <td>{report.count}</td>

      {/* 선택 체크박스 */}
      <td>
        <ReportSelectCheckBox
          checked={checked}
          onChange={(e) => onSelect(report.id, e.target.checked)} // 체크박스 변경 시 선택 처리
        />
      </td>
    </tr>
  );
};

export default ReportReviewRow;
