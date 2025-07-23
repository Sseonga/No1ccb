import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChargePayCalc.css";

const CHARGE_TYPES = [
  { label: "완속 충전기", value: "완속", desc: "3~7kW", time: "4~5시간" },
  { label: "급속 충전기", value: "급속", desc: "50~200kW", time: "30~60분" },
  { label: "초급속 충전기", value: "초급속", desc: "300~350kW", time: "약 20분" },
];

function ChargePayCalc() {
  // 상태들
  const [brands, setBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [chargeType, setChargeType] = useState("완속");
  const [capacity, setCapacity] = useState("");
  const [remain, setRemain] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [isMember, setIsMember] = useState(true);
  const [results, setResults] = useState([]);

  // 브랜드 데이터 불러오기
  useEffect(() => {
    axios.get("/calc/pay")
      .then(res => {
        setBrands(res.data);
        if (res.data.length > 0) setSelectedBrand(res.data[0].brand);
      })
      .catch(() => setBrands([]));
  }, []);

  // 브랜드 검색 필터
  const filteredBrands = brands.filter(b =>
    b.brand.replace(/\s/g, '').toLowerCase().includes(brandSearch.replace(/\s/g, '').toLowerCase())
  );

  // 추천 충전량 계산
  const recommendedCharge = (() => {
    const cap = parseFloat(capacity);
    const rem = parseFloat(remain);
    if (isNaN(cap) || isNaN(rem) || rem >= 100) return "";
    return Math.round(cap * (1 - rem / 100));
  })();

  // 추천 충전량 입력 자동 반영
  useEffect(() => {
    if (recommendedCharge) setChargeAmount(recommendedCharge);
  }, [recommendedCharge]);

  // form 입력 완료 조건
  const infoReady = capacity && remain && !isNaN(recommendedCharge);

  // 계산 결과 추가
  const handleCalc = (e) => {
    e.preventDefault();
    const brandObj = brands.find(b => b.brand === selectedBrand);
    if (!brandObj) return;

    const amount = parseFloat(chargeAmount);
    if (isNaN(amount) || amount <= 0) return;

    const price = isMember ? brandObj.memberPrice : brandObj.nonmemberPrice;
    const total = Math.round(amount * price).toLocaleString();

    setResults([
      ...results,
      {
        brand: selectedBrand,
        type: chargeType,
        amount: amount + "kWh",
        member: isMember ? "회원" : "비회원",
        time: CHARGE_TYPES.find(t => t.value === chargeType)?.time || "-",
        total: total + "원",
      },
    ]);
  };

  return (



        <div className="chargepay-wrap">
            <div className="chargepay-area">
              <h2>충전 요금 계산기</h2>
              <div className={`vehicle-box${infoReady ? "" : " dimmed"}`}>
                <div className="input-header">
                  <span role="img" aria-label="car">🚗</span> 차량 정보 입력
                </div>
                <div className="vehicle-inputs">
                  <div>
                    <label>배터리 용량(kWh)</label>
                    <input
                      className="calcinput"
                      type="number"
                      value={capacity}
                      onChange={e => setCapacity(e.target.value)}
                      min="1"
                      max="300"
                      placeholder="예) 100"
                    />
                  </div>
                  <div>
                    <label>남은 전력량(%)</label>
                    <input
                      className="calcinput"
                      type="number"
                      value={remain}
                      onChange={e => setRemain(e.target.value)}
                      min="0"
                      max="99"
                      placeholder="예) 20"
                    />
                  </div>
                </div>
                <div className="recommend-charge">
                  <span>🟦 추천 충전량:&nbsp;</span>
                  <b>{infoReady ? recommendedCharge + " kWh" : "-- kWh"}</b>
                </div>
              </div>

              <form onSubmit={handleCalc}>
                <div className="field-group">
                  <label>기관명 선택</label>
                  <div className="brand-search-select-wrap">
                    <input
                      type="text"
                      className="brand-search"
                      placeholder="기관명 검색"
                      value={brandSearch}
                      onChange={e => setBrandSearch(e.target.value)}
                    />
                    <select
                      className="brand-select"
                      value={selectedBrand}
                      onChange={e => setSelectedBrand(e.target.value)}
                    >
                      {filteredBrands.map((b) => (
                        <option key={b.brand} value={b.brand}>
                          {b.brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="charge-types">
                  {CHARGE_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t.value}
                      className={`type-btn${chargeType === t.value ? " active" : ""}`}
                      onClick={() => setChargeType(t.value)}
                    >
                      <div className="label">{t.label}</div>
                      <div className="desc">{t.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="field-group">
                  <label>충전량 (kWh)</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={chargeAmount}
                    onChange={e => setChargeAmount(e.target.value)}
                    required
                    className="charge-amount-input"
                  />
                </div>
                <div className="field-group member-radio-wrap">
                  <label>회원구분</label>
                  <label>
                    <input
                      type="radio"
                      checked={isMember}
                      onChange={() => setIsMember(true)}
                    /> 회원
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={!isMember}
                      onChange={() => setIsMember(false)}
                    /> 비회원
                  </label>
                </div>
                <button
                  type="submit"
                  className="calc-btn"
                  disabled={!infoReady}
                >
                  계산 결과 추가
                </button>
              </form>
              {results.length > 0 && (
                <div className="result-box">
                  <table>
                    <thead>
                      <tr>
                        <th>브랜드</th>
                        <th>방식</th>
                        <th>충전량</th>
                        <th>회원</th>
                        <th>예상시간</th>
                        <th>금액(원)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={i}>
                          <td>{r.brand}</td>
                          <td>{r.type}</td>
                          <td>{r.amount}</td>
                          <td>{r.member}</td>
                          <td>{r.time}</td>
                          <td style={{ color: "#1976d2", fontWeight: 600 }}>{r.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
        </div>

  );
}

export default ChargePayCalc;
