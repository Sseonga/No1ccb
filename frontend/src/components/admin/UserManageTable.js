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
        {/* 테이블 헤더 */}
        <div className="user-table-header">
          <div className="user-table-cell user-table-number">번호</div>
          <div className="user-table-cell user-table-number">이메일</div>
          <div className="user-table-cell user-table-number">비밀번호</div>
          <div className="user-table-cell user-table-select"></div>
        </div>

        {/* 사용자 목록 렌더링 */}
        {mockUserList.map((user, index) => (
          <UserManageRow
            key={user.id}
            number={index + 1} // 순서 번호 (1부터 시작)
            user={user}
            isSelected={selectedUserIds.includes(user.id)} // 선택 상태 확인
            onSelect={handleSelect} // 선택 처리 함수 전달
          />
        ))}
      </div>

      {/* 선택된 사용자 삭제 버튼 */}
      <DeleteSelectedUsersButton
        onDelete={handleDeleteSelected}
        disabled={selectedUserIds.length === 0} // 선택된 사용자가 없으면 비활성화
      />
    </div>
  );
};

export default UserManageTable;
