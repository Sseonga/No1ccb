// import React from "react";
// import "./station.css";

// const FilterPanel = ({ filters, onChange }) => {
//   const handleCheckbox = (category, value) => {
//     const updated = {
//       ...filters,
//       [category]: filters[category].includes(value)
//         ? filters[category].filter((v) => v !== value)
//         : [...filters[category], value],
//     };
//     onChange(updated);
//   };

//   return (
//     <div className="filter-panel">
//       <div className="filter-group">
//         <div className="filter-title">🔌 충전방법</div>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => handleCheckbox("type", "급속")}
//             checked={filters.type.includes("급속")}
//           />{" "}
//           급속 충전
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => handleCheckbox("type", "완속")}
//             checked={filters.type.includes("완속")}
//           />{" "}
//           완속 충전
//         </label>
//       </div>

//       <div className="filter-group">
//         <div className="filter-title">🅿️ 주차장</div>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => handleCheckbox("parking", "무료")}
//             checked={filters.parking.includes("무료")}
//           />{" "}
//           무료
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => handleCheckbox("parking", "유료")}
//             checked={filters.parking.includes("유료")}
//           />{" "}
//           유료
//         </label>
//       </div>

//       <div className="filter-group">
//         <div className="filter-title">🏷 브랜드</div>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => handleCheckbox("brand", "소프트베리")}
//             checked={filters.brand.includes("소프트베리")}
//           />{" "}
//           소프트 베리
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => handleCheckbox("brand", "E-PIT")}
//             checked={filters.brand.includes("E-PIT")}
//           />{" "}
//           E-PIT
//         </label>
//       </div>
//     </div>
//   );
// };

// export default FilterPanel;

// components/FilterPanel.js
// components/FilterPanel.js
import React, { useMemo } from "react";
import "./station.css";

const FilterPanel = ({ filters, onChange, poiList, chargerTypeMap, operatorMap }) => {
  // 충전기 타입 목록 추출 (01~07 등)
  const availableChargerTypes = useMemo(() => {
    const types = new Set();
    poiList.forEach((poi) => {
      (poi.evChargers?.evCharger ?? []).forEach((c) => {
        if (c.type) types.add(c.type);
      });
    });
    return Array.from(types);
  }, [poiList]);

  // 운영사(operatorId) 추출
  const availableOperators = useMemo(() => {
    const ops = new Set();
    poiList.forEach((poi) => {
      (poi.evChargers?.evCharger ?? []).forEach((c) => {
        if (c.operatorId) ops.add(c.operatorId);
      });
    });
    return Array.from(ops);
  }, [poiList]);

  const handleCheckbox = (category, value) => {
    const updated = {
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((v) => v !== value)
        : [...filters[category], value],
    };
    onChange(updated);
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <div className="filter-title">🔌 충전 타입</div>
        {availableChargerTypes.map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              onChange={() => handleCheckbox("type", type)}
              checked={filters.type.includes(type)}
            />{" "}
            {chargerTypeMap[`CHARGER_TYPE_${type}`] || type}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <div className="filter-title">🅿️ 주차장</div>
        <label>
          <input
            type="checkbox"
            onChange={() => handleCheckbox("parking", "무료")}
            checked={filters.parking.includes("무료")}
          />{" "}
          무료
        </label>
      </div>

      <div className="filter-group">
        <div className="filter-title">운영기관</div>
        {availableOperators.map((operatorId) => (
          <label key={operatorId}>
            <input
              type="checkbox"
              onChange={() => handleCheckbox("operator", operatorId)}
              checked={filters.operator.includes(operatorId)}
            />{" "}
            {operatorMap[operatorId] || operatorId}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;

