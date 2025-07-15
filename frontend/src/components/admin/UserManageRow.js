import React from 'react';

/**
 * 사용자 관리 테이블의 개별 행 컴포넌트
 * 사용자 정보를 표시하고 선택 기능을 제공
 *
 * @param {number} number - 행 번호
 * @param {Object} user - 사용자 정보 객체
 * @param {boolean} isSelected - 선택 상태
 * @param {Function} onSelect - 선택 처리 함수
 */
const UserManageRow = ({ number, user, isSelected, onSelect }) => {
  /**
   * 체크박스 변경 처리 함수
   * @param {Event} e - 체크박스 변경 이벤트
   */
  const handleCheckboxChange = (e) => {
    onSelect(user.id, e.target.checked);
  };

  return (
    <div className="user-table-row">
      {/* 사용자 번호 */}
      <div className="user-table-cell user-table-number">{number}</div>

      {/* 사용자 이메일 */}
      <div className="user-table-cell user-table-email">{user.email}</div>

      {/* 비밀번호 (보안상 마스킹 처리) */}
      <div className="user-table-cell user-table-password">********</div>

      {/* 선택 체크박스 */}
      <div className="user-table-cell user-table-select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`사용자 ${user.email} 선택`} // 접근성을 위한 라벨
        />
      </div>
    </div>
  );
};

export default UserManageRow;
