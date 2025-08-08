// frontend/src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="container">
        <h2>Добро пожаловать в Car CRM!</h2>
        <p>Управляйте своими автомобилями и техобслуживанием в одном месте.</p>
        <ul>
          <li>
            <Link to="/cars">🚗 Мои автомобили</Link>
          </li>
          <li>
            <Link to="/maintenance">🔧 История ТО</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
