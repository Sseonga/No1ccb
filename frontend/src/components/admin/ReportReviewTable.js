import React, { useState } from 'react';
import ReportReviewRow from './ReportReviewRow';
import DeleteSelectedReportsButton from './DeleteSelectedReportsButton';
import './admin.css';

/**
 * 신고된 리뷰 관리 테이블 컴포넌트
 * 관리자가 신고된 리뷰들을 확인하고 선택적으로 삭제할 수 있는 테이블
 */

// 테스트용 신고 데이터 (실제로는 API에서 가져올 데이터)
const mockReports = [
  { id: 1, title: '리뷰 제목1', reason: '욕설 및 비하 표현', count: 3 },
  { id: 2, title: '리뷰 제목2', reason: '도배', count: 5 },
  { id: 3, title: '리뷰 제목3', reason: '광고', count: 2 },
  { id: 4, title: '리뷰 제목4', reason: '허위 정보', count: 1 },


];

const ReportReviewTable = () => {
  // 선택된 신고들의 ID를 저장하는 상태
  const [selected, setSelected] = useState([]);

  /**
   * 신고 선택/해제 처리 함수
   * @param {number} id - 선택/해제할 신고 ID
   * @param {boolean} checked - 체크박스 선택 상태
   */
  const handleSelect = (id, checked) => {
    setSelected(checked ? [...selected, id] : selected.filter((i) => i !== id));
  };

  /**
   * 선택된 신고들 삭제 처리 함수
   * 현재는 알림창으로 표시, 실제로는 삭제 API 호출
   */
  const handleDelete = () => {
    alert(`선택된 신고 삭제: ${selected.join(', ')}`);
    // 실제로는 삭제 API를 호출해야 함
  };

  return (
    <div className="report-review-table">
      {/* 관리자 페이지 제목 */}
      <h2>관리자페이지</h2>

      {/* 테이블 박스 */}
      <div className="table-box">
        <div className="table-name">
            신고리뷰
        </div>
        <table className="report-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>신고사유</th>
              <th>신고횟수</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            {/* 신고 목록 렌더링 */}
            {mockReports.map((report, idx) => (
              <ReportReviewRow
                key={report.id}
                no={idx + 1} // 순서 번호 (1부터 시작)
                report={report}
                checked={selected.includes(report.id)} // 선택 상태 확인
                onSelect={handleSelect} // 선택 처리 함수 전달
              />
            ))}
          </tbody>
        </table>
        <div className="button-area">
            {/* 선택된 신고 삭제 버튼 */}
                  <DeleteSelectedReportsButton
                    onDelete={handleDelete}
                    disabled={selected.length === 0} // 선택된 신고가 없으면 비활성화
                  />
        </div>
      </div>


    </div>
  );
};

export default ReportReviewTable;
