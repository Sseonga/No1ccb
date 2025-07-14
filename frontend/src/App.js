// import logo from './logo.svg';
// import './App.css';
// import { useEffect, useState } from 'react';
// import axios from "axios";

// function App() {
//   const [message, setMessage] = useState([]);

//   useEffect(() => {
//     axios.get("/api/hello")
//       .then((response) => {
//         setMessage(response.data);
//         console.log(response.data);
//       });
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//         <ul>
//           {message.map((text, index) => <li key={`${index}-${text}`}>{text}</li>)}
//         </ul>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useRef, useState } from "react";
import { BrowserRouter, useLocation, Route, Routes } from "react-router-dom";
import Tmap from "./components/station/Tmap";
import "./App.css";
import "./components/common/common.css";
import Sidebar from "./components/common/Sidebar";
import MyLocationButton from "./components/common/MyLocationButton";
import FilterPanel from "./components/station/Filterpanel";
import RouteSearchPanel from "./components/route/RouteSearchPanel";
import IntroCar from "./components/intro/IntroCar";
import LoginPanel from "./components/user/LoginPanel";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AppContent = () => {
  const [filters, setFilters] = useState({
    type: [],
    parking: [],
    brand: [],
  });

  const tmapObjRef = useRef(null);
  const myMarkerRef = useRef(null);

  const location = useLocation(); // 현재 경로 확인

  // 숨길 경로들
  const hideOn = ["/info", "/user", "/user/*"];

  return (
    <div className="container">
      <Sidebar />
      <Tmap tmapObjRef={tmapObjRef} />

      {/* info, login 페이지 아닐 때만 표시 */}
      {!hideOn.includes(location.pathname) && (
        <>
          <MyLocationButton tmapObjRef={tmapObjRef} myMarkerRef={myMarkerRef} />
          <FilterPanel filters={filters} onChange={setFilters} />
        </>
      )}

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/route" element={<RouteSearchPanel />} />
        <Route path="/hotel" element={<div>충전숙소 패널</div>} />
        <Route path="/rank" element={<div>랭킹 패널</div>} />
        <Route path="/info" element={<IntroCar />} />
        <Route path="/user/*" element={<LoginPanel />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
