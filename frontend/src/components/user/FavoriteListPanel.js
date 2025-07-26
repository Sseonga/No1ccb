import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteItemCard from "./FavoriteItemCard";
import FavoriteStarButton from "./FavoriteStarButton";
import "./mypage.css";

const FavoriteListPanel = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // 실제 로그인된 사용자 ID 사용
  const userId = sessionStorage.getItem("userId");

  const fetchFavorites = () => {
    if (!userId) return;
    
    axios
      .get(`/api/favor?userId=${parseInt(userId)}`)
      .then((response) => {
        // API 응답 데이터 처리
        
        // 중복 데이터 제거 (같은 targetName이면 FAVOR_04를 우선)
        const uniqueData = response.data.reduce((acc, current) => {
          const existing = acc.find(item => item.targetName === current.targetName);
          if (existing) {
            // 같은 이름이 있으면 FAVOR_04(숙소)를 우선
            if (current.favorTypeCd === 'FAVOR_04' && existing.favorTypeCd !== 'FAVOR_04') {
              const index = acc.indexOf(existing);
              acc[index] = current;
            }
          } else {
            acc.push(current);
          }
          return acc;
        }, []);
        
        // 백엔드에서 받은 데이터를 프론트에서 쓰는 형태로 변환
        const mapped = uniqueData.map((item) => {
          let category = "";
          if (item.favorTypeCd === "FAVOR_01") category = "내 경로";
          else if (item.favorTypeCd === "FAVOR_02") category = "내 충전소";
          else if (item.favorTypeCd === "FAVOR_03") category = "내 장소";
          else if (item.favorTypeCd === "FAVOR_04") category = "내 숙소";
          else category = "기타";

          return {
            id: item.favorId,
            targetId: item.targetId,
            favorTypeCd: item.favorTypeCd,
            title: item.targetName || `ID: ${item.targetId}`,
            description: item.targetAddress || "",
            category,
            isFavorite: true,
          };
                  });
        setFavoriteItems(mapped);
      })
      .catch((error) => {
        console.error("즐겨찾기 목록 불러오기 실패:", error);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId, refreshKey]);

  // 페이지가 포커스될 때와 즐겨찾기 업데이트 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
    };

    const handleFavoriteUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('favoriteUpdated', handleFavoriteUpdate);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('favoriteUpdated', handleFavoriteUpdate);
    };
  }, []);

  const handleToggleFavorite = async (itemId) => {
    const targetItem = favoriteItems.find(item => item.id === itemId);
    if (!targetItem) return;

    if (!window.confirm(`"${targetItem.title}"을(를) 즐겨찾기에서 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // 즐겨찾기는 항상 삭제 (마이페이지에서는 삭제만 가능)
      const operatorId = targetItem.favorTypeCd === 'FAVOR_04' ? 'ACCOM_01' : 'STATION_01';
      
      console.log("즐겨찾기 삭제 요청:", {
        userId: parseInt(userId),
        stationId: parseInt(targetItem.targetId),
        operatorId: operatorId,
        favorTypeCd: targetItem.favorTypeCd
      });
      
      const response = await fetch("/api/favor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          stationId: parseInt(targetItem.targetId),
          operatorId: operatorId
        }),
      });

      if (response.ok) {
        // 성공시 해당 아이템을 목록에서 제거
        setFavoriteItems(prevItems => 
          prevItems.filter(item => item.id !== itemId)
        );
        
        // 마이페이지 새로고침을 위한 이벤트 발생
        window.dispatchEvent(new Event('favoriteUpdated'));
        
        alert("즐겨찾기에서 삭제되었습니다.");
      } else {
        alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("즐겨찾기 삭제 실패:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const groupedItems = favoriteItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="favorite-list-panel">
      <div className="panel-header">
        <h3>즐겨찾기</h3>
      </div>

      <div className="favorite-content">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="item-list">
              {items.map((item) => (
                <FavoriteItemCard
                  key={item.id}
                  item={item}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {favoriteItems.length === 0 && (
        <div className="empty-state">
          <p>아직 즐겨찾기에 추가한 항목이 없습니다.</p>
          <p style={{fontSize: '14px', marginTop: '8px', opacity: '0.7'}}>
            충전소나 숙소에서 ⭐ 버튼을 눌러 즐겨찾기에 추가해보세요!
          </p>
        </div>
      )}
    </div>
  );
};
export default FavoriteListPanel;
