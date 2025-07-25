import React from 'react';

/**
 * 사용자 관리 테이블의 개별 행 컴포넌트
 * @param {number} number - 행 번호
 * @param {Object} user - 사용자 정보 객체
 * @param {boolean} isSelected - 선택 상태
 * @param {Function} onSelect - 선택 처리 함수
 */
const UserManageRow = ({ number, user, isSelected, onSelect }) => {
  const handleCheckboxChange = (e) => {
    onSelect(user.userId, e.target.checked);
  };

  return (
    <tr className="user-table-row">
      <td className="user-table-cell user-table-number">{number}</td>
      <td className="user-table-cell user-table-email">{user.userEmail}</td>
      <td className="user-table-cell user-table-password">********</td>
      <td className="user-table-cell user-table-select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
      </td>
    </tr>
  );
};

export default UserManageRow;
