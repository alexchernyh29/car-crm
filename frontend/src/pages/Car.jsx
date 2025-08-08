import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CarForm from "../components/CarForm";
import api from "../services/api";

const Cars = () => {
  const [cars, setCars] = useState([]);

  const loadCars = async () => {
    const res = await api.get("/cars");
    setCars(res.data.data);
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <h2>Мои автомобили</h2>
        <CarForm onSuccess={loadCars} />
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              <strong>
                {car.make} {car.model}
              </strong>{" "}
              ({car.year}), VIN: {car.vin}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Cars;
