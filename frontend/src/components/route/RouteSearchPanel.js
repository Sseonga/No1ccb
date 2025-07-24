import React from "react";

function RouteSearchPanel({
  from,
  to,
  setFrom,
  setTo,
  onSearch,
  loading,
  errorMsg,
  categoryBtns = []
}) {
  return (
    <form
      onSubmit={onSearch}
      style={{ padding: 28, background: "#f6f7fb" }}
      autoComplete="off"
    >
      <input
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="출발지"
        style={{
          width: "100%",
          marginBottom: 9,
          padding: 11,
          borderRadius: 6,
          border: "1px solid #c7d0e1",
          fontSize: 16
        }}
      />
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="도착지"
        style={{
          width: "100%",
          marginBottom: 12,
          padding: 11,
          borderRadius: 6,
          border: "1px solid #c7d0e1",
          fontSize: 16
        }}
      />
      <button
        type="submit"
        style={{
          width: "100%",
          background: "#377ee6",
          color: "#fff",
          fontWeight: 700,
          border: 0,
          borderRadius: 6,
          padding: "12px 0",
          fontSize: 16,
          marginBottom: 10,
          cursor: "pointer"
        }}
        disabled={loading}
      >
        {loading ? "검색 중..." : "경로 + POI 검색"}
      </button>
      {errorMsg && <div style={{ color: "red", margin: "10px 0" }}>{errorMsg}</div>}

      <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
        {categoryBtns.map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => alert(`"${btn.label}" 카테고리는 아직 구현 안됨`)}
            style={{
              flex: 1,
              padding: "9px 0",
              background: "#e3e8f0",
              color: "#234",
              fontWeight: 700,
              border: 0,
              borderRadius: 7,
              cursor: "pointer"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </form>
  );
}

export default RouteSearchPanel;
