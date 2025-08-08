// frontend/src/pages/CarsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import CarForm from "../components/CarForm";
import api from "../services/api";

const CarsPage = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data.data);
    } catch (err) {
      alert(
        "Ошибка загрузки автомобилей: " +
          (err.response?.data?.error || "Неизвестная ошибка")
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить автомобиль? Это действие нельзя отменить."))
      return;
    try {
      await api.delete(`/cars/${id}`);
      setCars(cars.filter((car) => car.id !== id));
      alert("Автомобиль удалён");
    } catch (err) {
      alert(
        "Ошибка удаления: " +
          (err.response?.data?.error || "Не удалось удалить")
      );
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Мои автомобили</h2>

        {/* Форма добавления автомобиля */}
        <CarForm
          onSuccess={() => {
            alert("Автомобиль добавлен!");
            loadCars();
          }}
        />

        {/* Список автомобилей */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cars.length === 0 ? (
            <p>Нет автомобилей. Добавьте первый.</p>
          ) : (
            cars.map((car) => (
              <li
                key={car.id}
                style={{
                  position: "relative",
                  padding: "15px",
                  margin: "10px 0",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Link
                  to={`/cars/${car.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#1a73e8",
                    display: "block",
                  }}
                >
                  <strong>
                    {car.make} {car.model}
                  </strong>{" "}
                  ({car.year})
                  <br />
                  <small>VIN: {car.vin}</small>
                  {car.color && <span> • Цвет: {car.color}</span>}
                  {car.registrationNumber && (
                    <span> • Рег. номер: {car.registrationNumber}</span>
                  )}
                </Link>

                {/* Кнопка удаления */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Не вызываем переход
                    handleDelete(car.id);
                  }}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Удалить
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default CarsPage;
