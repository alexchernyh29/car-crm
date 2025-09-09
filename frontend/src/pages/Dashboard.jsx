// frontend/src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-4xl font-bold mb-4">Добро пожаловать в Car CRM!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Управляйте своими автомобилями и техобслуживанием в одном месте.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/cars"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
          >
            🚗 Мои автомобили
          </Link>
          <Link
            to="/maintenance"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
          >
            🔧 История ТО
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
