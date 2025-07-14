import React from 'react';

/**
 * 선택된 사용자들을 삭제하는 버튼 컴포넌트
 *
 * @param {Function} onDelete - 삭제 처리 함수
 * @param {boolean} disabled - 버튼 비활성화 상태
 */
const DeleteSelectedUsersButton = ({ onDelete, disabled }) => {
  /**
   * 삭제 버튼 클릭 처리 함수
   * 확인 대화상자를 통해 사용자 확인 후 삭제 실행
   */
  const handleClick = () => {
    if (window.confirm('선택된 사용자들을 삭제하시겠습니까?')) {
      onDelete();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`delete-button ${disabled ? 'disabled' : ''}`}
      aria-label="선택된 사용자 삭제" // 접근성을 위한 라벨
    >
      선택된 사용자 삭제
    </button>
  );
};

export default DeleteSelectedUsersButton;
