import React, { useEffect, useState } from 'react';
import UserManageRow from './UserManageRow';
import DeleteSelectedUsersButton from './DeleteSelectedUsersButton';

/**
 * 사용자 관리 테이블 컴포넌트
 * 실제 DB에서 사용자 목록을 받아와 관리/삭제
 */
const UserManageTable = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 사용자 목록 API에서 받아오기
  useEffect(() => {
    setLoading(true);
    fetch('/api/user/list')
      .then(res => res.json())
      .then(data => {
        console.log('user list API 응답:', data);
        // 응답이 배열 또는 {users: []} 형태 모두 지원
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.users)) list = data.users;
        else list = [];
        setUserList(list);
        setLoading(false);
      })
      .catch(err => {
        setError('사용자 목록을 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

  // 선택/해제 핸들러
  const handleSelect = (userId, isChecked) => {
    setSelectedUserIds(
      isChecked
        ? [...selectedUserIds, userId]
        : selectedUserIds.filter(id => id !== userId)
    );
  };

  // 선택 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (!window.confirm('정말 선택한 사용자를 삭제하시겠습니까?')) return;
    try {
      await Promise.all(
        selectedUserIds.map(userId =>
          fetch(`/api/user/${userId}`, { method: 'DELETE' })
        )
      );
      setUserList(userList.filter(user => !selectedUserIds.includes(user.userId)));
      setSelectedUserIds([]);
      alert('삭제 완료!');
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };


  if (error) return <div>{error}</div>;

  return (
    <div className="user-manage-table">
      <h2>관리자페이지</h2>
      <div className="user-table-box">
        <div className="table-name">회원관리</div>
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
            {(Array.isArray(userList) ? userList : []).map((user, index) => (
              <UserManageRow
                key={user.userId}
                number={index + 1}
                user={user}
                isSelected={selectedUserIds.includes(user.userId)}
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
    </div>
  );
};

export default UserManageTable;
