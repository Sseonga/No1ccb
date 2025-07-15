import React from 'react';

/**
 * 선택된 신고를 삭제하는 버튼 컴포넌트
 * 관리자가 여러 신고를 선택하여 일괄 삭제할 수 있는 기능 제공
 *
 * @param {Function} onDelete - 삭제 처리 함수
 * @param {boolean} disabled - 버튼 비활성화 상태 (선택된 신고가 없을 때)
 */
const DeleteSelectedReportsButton = ({ onDelete, disabled }) => {
  return (
    <button
      className="delete-selected-reports-button"
      onClick={onDelete} // 클릭 시 삭제 함수 실행
      disabled={disabled} // 선택된 신고가 없으면 비활성화
      aria-label="선택된 신고 삭제" // 접근성을 위한 라벨
    >
      삭제
    </button>
  );
};

export default DeleteSelectedReportsButton;
