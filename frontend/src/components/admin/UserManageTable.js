import React, { useState } from 'react';
import UserManageRow from './UserManageRow';
import DeleteSelectedUsersButton from './DeleteSelectedUsersButton';

/**
 * 사용자 관리 테이블 컴포넌트
 * 관리자가 사용자 목록을 확인하고 선택적으로 삭제할 수 있는 테이블
 */

// 테스트용 사용자 데이터 (실제로는 API에서 가져올 데이터)
const mockUserList = [
  { id: 1, email: 'user1@example.com' },
  { id: 2, email: 'user2@example.com' },
  { id: 3, email: 'user3@example.com' },
  { id: 4, email: 'user4@example.com' },
];

const UserManageTable = () => {
  // 선택된 사용자들의 ID를 저장하는 상태
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  /**
   * 사용자 선택/해제 처리 함수
   * @param {number} userId - 선택/해제할 사용자 ID
   * @param {boolean} isChecked - 체크박스 선택 상태
   */
  const handleSelect = (userId, isChecked) => {
    setSelectedUserIds(
      isChecked
        ? [...selectedUserIds, userId] // 선택: 배열에 추가
        : selectedUserIds.filter((id) => id !== userId) // 해제: 배열에서 제거
    );
  };

  /**
   * 선택된 사용자들 삭제 처리 함수
   * 현재는 알림창으로 표시, 실제로는 API 호출
   */
  const handleDeleteSelected = () => {
    alert(`선택된 회원 삭제: ${selectedUserIds.join(', ')}`);
  };

  return (
    <div className="user-manage-table">


      {/* 관리자 페이지 제목 */}
      <h2>관리자페이지</h2>

      <div className="user-table-box">
        <div className="table-name">
            회원리뷰
        </div>
        <table className="user-table">
          <thead>
            <tr className="user-table-header">
              <th className="user-table-cell user-table-number">번호</th>
              <th className="user-table-cell user-table-email">이메일</th>
              <th className="user-table-cell user-table-password">비밀번호</th>
              <th className="user-table-cell user-table-select"></th>
            </tr>
          </thead>
          <tbody>
            {mockUserList.map((user, index) => (
              <UserManageRow
                key={user.id}
                number={index + 1}
                user={user}
                isSelected={selectedUserIds.includes(user.id)}
                onSelect={handleSelect}
              />
            ))}
          </tbody>
        </table>
            <div className="button-area">
                <DeleteSelectedUsersButton
                onDelete={handleDeleteSelected}
                disabled={selectedUserIds.length === 0}
              />
            </div>
      </div>

      {/* 선택된 사용자 삭제 버튼 */}

    </div>
  );
};

export default UserManageTable;
