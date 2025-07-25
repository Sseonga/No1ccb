import React, { useEffect, useState } from 'react';
import '../admin/admin.css';

const AccommodationManage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // 숙소 리스트 불러오기
  const fetchAccommodations = async () => {
    try {
      const res = await fetch('/api/accommodation');
      const data = await res.json();
      setAccommodations(data);
    } catch (error) {
      console.error('숙소 리스트 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  // 체크박스 선택/해제 처리
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedIds.length === accommodations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(accommodations.map((a) => a.accomId));
    }
  };

  // 글자 자르기 함수 (10글자 제한)
  const truncateText = (text, maxLength = 10) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // 선택된 숙소 삭제
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 숙소를 선택하세요.');
      return;
    }
    if (!window.confirm(`선택한 ${selectedIds.length}개의 숙소를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/accommodation/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (!result.success) {
          alert(`숙소 ID ${id} 삭제 실패`);
        }
      }
      alert('선택한 숙소가 삭제되었습니다.');
      setSelectedIds([]);
      fetchAccommodations(); // 삭제 후 리스트 갱신
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2
        style={{
          width: '60%',
          margin: '2% auto 5% auto',
          paddingBottom: '4%',
          textAlign: 'center',
          borderBottom: 'solid 1px  #d3d3d3',
        }}
      >
        관리자페이지
      </h2>

      <div className="hotelcare">
        <div className="table-name">숙소관리</div>

        <table className="report-table">
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th>번호</th>
              <th>숙소 이름</th>
              <th>주소</th>
              <th>체크인</th>
              <th>체크아웃</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            {accommodations.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  숙소 정보가 없습니다.
                </td>
              </tr>
            ) : (
              accommodations.map((acc, idx) => (
                <tr key={acc.accomId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                  <td>{truncateText(acc.accomName)}</td>
                  <td>{truncateText(acc.accomAddress)}</td>
                  <td style={{ textAlign: 'center' }}>{acc.accomCheckin}</td>
                  <td style={{ textAlign: 'center' }}>{acc.accomCheckout}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(acc.accomId)}
                      onChange={() => toggleSelect(acc.accomId)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

            <div className="button-area">
                <button
                  onClick={handleDeleteSelected}
                style={{
                      border: 'none',

                    }}
                >
                  삭제
                </button>
            </div>
      </div>
    </div>
  );
};

export default AccommodationManage;
