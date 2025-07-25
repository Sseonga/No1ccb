import React from "react";

function RouteSearchPanel({
  from, to, setFrom, setTo, onSearch, loading,
  routeOption, setRouteOption, trafficOption, setTrafficOption
}) {
  return (
    <form
      className="route-search-form"
      onSubmit={e => { e.preventDefault(); onSearch(); }}
      style={{ marginBottom: 10 }}
    >
      <input
        placeholder="출발지 입력"
        value={from}
        onChange={e => setFrom(e.target.value)}
        disabled={loading}
        style={{ marginBottom: 8, width: "100%", padding: 8, fontSize: 16 }}
      />
      <input
        placeholder="도착지 입력"
        value={to}
        onChange={e => setTo(e.target.value)}
        disabled={loading}
        style={{ marginBottom: 8, width: "100%", padding: 8, fontSize: 16 }}
      />
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <select
          value={routeOption}
          onChange={e => setRouteOption(e.target.value)}
          disabled={loading}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        >
          <option value="0">교통최적+추천</option>
          <option value="1">교통최적+무료우선</option>
          <option value="2">교통최적+최소시간</option>
          <option value="3">교통최적+초보</option>
          <option value="4">교통최적+고속도로우선</option>
          <option value="10">최단거리+유/무료</option>
          <option value="12">이륜차도로우선</option>
          <option value="19">교통최적+어린이보호구역 회피</option>
        </select>
        {/* name="trafficOption" 추가 (CSS로 선택해서 숨기기 위함) */}
        <select
          name="trafficOption"
          value={trafficOption}
          onChange={e => setTrafficOption(e.target.value)}
          disabled={loading}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        >
          <option value="N">교통정보 표출 안함</option>
          <option value="Y">교통정보 표출 함</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || !from || !to}
        style={{
          width: "100%",
          background: "#377ee6",
          color: "#fff",
          fontWeight: 700,
          padding: "12px 0",
          border: "none",
          borderRadius: 7,
          fontSize: 17,
          cursor: "pointer"
        }}
      >
        {loading ? "검색 중..." : "경로 + POI 검색"}
      </button>
    </form>
  );
}

export default RouteSearchPanel;
