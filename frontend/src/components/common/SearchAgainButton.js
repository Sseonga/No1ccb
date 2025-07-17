import React from "react";
import "./common.css";

const SearchAgainButton = ({ onClick }) => {
  return (
    <button className="search-again-button" onClick={onClick}>
      이 위치에서 재검색
    </button>
  );
};

export default SearchAgainButton;
