// frontend/src/pages/CarsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold mb-6">Мои автомобили</h2>

      <div className="mb-8">
        <CarForm
          onSuccess={() => {
            alert("Автомобиль добавлен!");
            loadCars();
          }}
        />
      </div>

      <div>
        {cars.length === 0 ? (
          <p className="text-center text-gray-500">Нет автомобилей. Добавьте первый.</p>
        ) : (
          <ul className="space-y-4">
            {cars.map((car) => (
              <li
                key={car.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <Link to={`/cars/${car.id}`} className="flex-grow">
                  <div className="font-bold text-xl text-blue-600 hover:underline">
                    {car.make} {car.model} ({car.year})
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>VIN: {car.vin}</span>
                    {car.color && <span className="ml-4">Цвет: {car.color}</span>}
                    {car.registrationNumber && (
                      <span className="ml-4">
                        Рег. номер: {car.registrationNumber}
                      </span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(car.id);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg ml-4"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CarsPage;
