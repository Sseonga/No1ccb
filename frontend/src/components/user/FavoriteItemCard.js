import React from "react";
import FavoriteStarButton from "./FavoriteStarButton";

const FavoriteItemCard = ({ item, onToggleFavorite }) => {
  const { id, title, description, isFavorite, category } = item;

  const handleCardClick = (e) => {
    // 별 버튼 클릭 시에는 카드 클릭 이벤트 무시
    if (e.target.closest('.star-button')) {
      return;
    }
    
    // 카테고리에 따라 다른 페이지로 이동
    if (category === '내 충전소') {
      window.location.href = '/station';
    } else if (category === '내 숙소') {
      window.location.href = '/hotel';
    }
  };

  return (
    <div className="favorite-item-card" onClick={handleCardClick}>
      <div className="item-content">
        <div className="item-info">
          <h3 className="item-title">{title}</h3>
          <p className="item-description">{description}</p>
          <span className="item-category">{category}</span>
        </div>
      </div>

      <div className="item-actions">
        <FavoriteStarButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          itemId={id}
        />
      </div>
    </div>
  );
};
export default FavoriteItemCard;
