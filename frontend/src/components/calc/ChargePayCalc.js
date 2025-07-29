import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChargePayCalc.css";

const CHARGE_TYPES = [
  { label: "완속 충전기", value: "완속", desc: "3~7kW", time: "4~5시간" },
  { label: "급속 충전기", value: "급속", desc: "50~200kW", time: "30~60분" },
  { label: "초급속 충전기", value: "초급속", desc: "300~350kW", time: "약 20분" },
];

function ChargePayCalc() {
  const [brands, setBrands] = useState([]);
  const [payData, setPayData] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [chargeType, setChargeType] = useState("완속");
  const [capacity, setCapacity] = useState("");
  const [remain, setRemain] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [isMember, setIsMember] = useState(true);
  const [results, setResults] = useState([]);

  // 브랜드/요금 데이터 가져오기
  useEffect(() => {
    axios.get("/api/calc/brands")
      .then(res => {
        setBrands(res.data);
        if (res.data.length > 0) setSelectedBrand(res.data[0]);
        // ⭐ brands 콘솔
        console.log("[brands] /api/calc/brands 응답:", res.data);
      })
      .catch(() => setBrands([]));

    axios.get("/api/calc/pay")
      .then(res => {
        setPayData(res.data);
        // ⭐ payData 콘솔
        console.log("[payData] /api/calc/pay 응답:", res.data);
      })
      .catch(() => setPayData([]));
  }, []);

  // 🔥 brands 배열에서 검색/중복제거 (최종적으로 select에 표시되는 브랜드)
  const filteredBrands = Array.from(
    new Set(
      brands.filter(b =>
        b.replace(/\s/g, "").toLowerCase().includes(brandSearch.replace(/\s/g, "").toLowerCase())
      )
    )
  );

  // ⭐ select 옵션 배열도 콘솔 확인!
  useEffect(() => {
    console.log("[filteredBrands] (중복제거+검색결과):", filteredBrands);
  }, [brands, brandSearch]);

  // 추천 충전량
  const recommendedCharge = (() => {
    const cap = parseFloat(capacity);
    const rem = parseFloat(remain);
    if (isNaN(cap) || isNaN(rem) || rem >= 100) return "";
    return Math.round(cap * (1 - rem / 100));
  })();

  useEffect(() => {
    if (recommendedCharge) setChargeAmount(recommendedCharge);
  }, [recommendedCharge]);

  const infoReady = capacity && remain && !isNaN(recommendedCharge);

  const handleCalc = (e) => {
    e.preventDefault();
    const priceInfo = payData.find(
      p => p.brand === selectedBrand && p.type === chargeType
    );
    if (!priceInfo) {
      alert("선택한 브랜드의 해당 충전 방식 요금정보가 없습니다.");
      return;
    }

    const amount = parseFloat(chargeAmount);
    if (isNaN(amount) || amount <= 0) return;

    const price = isMember ? priceInfo.memberPrice : priceInfo.nonmemberPrice;
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
            <div className="set">
              <label>배터리 용량(kWh)</label>
              <input
                className="calcinput"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                max="300"
                placeholder="예) 100"
              />
            </div>
            <div className="set">
              <label>남은 전력량(%)</label>
              <input
                className="calcinput"
                type="number"
                value={remain}
                onChange={(e) => setRemain(e.target.value)}
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
                onChange={(e) => setBrandSearch(e.target.value)}
              />
              <select
                className="brand-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {filteredBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
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
              onChange={(e) => setChargeAmount(e.target.value)}
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
              />{" "}
              회원
            </label>
            <label>
              <input
                type="radio"
                checked={!isMember}
                onChange={() => setIsMember(false)}
              />{" "}
              비회원
            </label>
          </div>
          <button type="submit" className="calc-btn" disabled={!infoReady}>
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
                    <td style={{ color: "#1976d2", fontWeight: 600 }}>
                      {r.total}
                    </td>
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
