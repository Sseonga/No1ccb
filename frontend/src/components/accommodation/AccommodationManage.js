import React, { useEffect, useState } from 'react';

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
    <div style={{
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2>숙소 관리</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th>
              <input
                type="checkbox"
                checked={selectedIds.length === accommodations.length && accommodations.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th>번호</th>
            <th>숙소 이름</th>
            <th>주소</th>
            <th>체크인</th>
            <th>체크아웃</th>
            {/* 필요한 컬럼 추가 가능 */}
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
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(acc.accomId)}
                    onChange={() => toggleSelect(acc.accomId)}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                <td>{acc.accomName}</td>
                <td>{acc.accomAddress}</td>
                <td style={{ textAlign: 'center' }}>{acc.accomCheckin}</td>
                <td style={{ textAlign: 'center' }}>{acc.accomCheckout}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        onClick={handleDeleteSelected}
        style={{
          marginTop: '20px',
          backgroundColor: 'red',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        삭제
      </button>
    </div>
  );
};

export default AccommodationManage;
