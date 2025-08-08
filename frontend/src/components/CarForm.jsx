import React, { useState } from "react";
import api from "../services/api";

const CarForm = ({ onSuccess, initialData = {} }) => {
  const [formData, setFormData] = useState({
    // Основные поля
    make: "",
    model: "",
    year: "",
    vin: "",

    // Внешность и тип
    bodyType: "",
    color: "",

    // Двигатель
    engineVolume: "",
    engineType: "",
    power: "",

    // Топливная система
    fuelTankCapacity: "",
    cityFuelConsumption: "",
    highwayFuelConsumption: "",

    // Трансмиссия
    transmission: "",
    driveType: "",

    // Габариты
    length: "",
    width: "",
    height: "",
    groundClearance: "",
    wheelbase: "",

    // Документы
    registrationNumber: "",
    vehicleCertificateNumber: "",
    drivingLicenseNumber: "",
    driverLicenseNumber: "",

    // Обновляем значения, если переданы
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Подготовка данных с правильными типами
      const data = { ...formData };

      // Преобразуем числовые поля
      if (data.year) data.year = parseInt(data.year);
      if (data.engineVolume) data.engineVolume = parseFloat(data.engineVolume);
      if (data.power) data.power = parseInt(data.power);
      if (data.fuelTankCapacity)
        data.fuelTankCapacity = parseFloat(data.fuelTankCapacity);
      if (data.cityFuelConsumption)
        data.cityFuelConsumption = parseFloat(data.cityFuelConsumption);
      if (data.highwayFuelConsumption)
        data.highwayFuelConsumption = parseFloat(data.highwayFuelConsumption);
      if (data.length) data.length = parseFloat(data.length);
      if (data.width) data.width = parseFloat(data.width);
      if (data.height) data.height = parseFloat(data.height);
      if (data.groundClearance)
        data.groundClearance = parseFloat(data.groundClearance);
      if (data.wheelbase) data.wheelbase = parseFloat(data.wheelbase);

      let response;
      if (initialData.id) {
        // Редактирование
        response = await api.put(`/cars/${initialData.id}`, data);
        alert("Автомобиль успешно обновлён!");
      } else {
        // Создание
        response = await api.post("/cars", data);
        alert("Автомобиль успешно добавлен!");
      }

      // Вызываем callback (например, обновление списка)
      onSuccess(response.data.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Не удалось сохранить автомобиль";
      alert(`Ошибка: ${errorMsg}`);
      console.error("CarForm error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>
        {initialData.id ? "Редактировать автомобиль" : "Добавить автомобиль"}
      </h3>

      <div style={styles.grid}>
        {/* Основные данные */}
        <input
          name="make"
          placeholder="Марка"
          value={formData.make}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="model"
          placeholder="Модель"
          value={formData.model}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="year"
          placeholder="Год выпуска"
          type="number"
          value={formData.year}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="vin"
          placeholder="VIN (уникальный)"
          value={formData.vin}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="bodyType"
          placeholder="Тип кузова (седан, хэтчбек и т.д.)"
          value={formData.bodyType}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="color"
          placeholder="Цвет"
          value={formData.color}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Двигатель */}
        <input
          name="engineVolume"
          placeholder="Объём двигателя (л)"
          type="number"
          step="0.1"
          value={formData.engineVolume}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="engineType"
          placeholder="Тип двигателя (бензин, дизель, электрика)"
          value={formData.engineType}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="power"
          placeholder="Мощность (л.с.)"
          type="number"
          value={formData.power}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Топливная система */}
        <input
          name="fuelTankCapacity"
          placeholder="Объём бака (л)"
          type="number"
          step="0.1"
          value={formData.fuelTankCapacity}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="cityFuelConsumption"
          placeholder="Расход в городе (л/100 км)"
          type="number"
          step="0.1"
          value={formData.cityFuelConsumption}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="highwayFuelConsumption"
          placeholder="Расход на трассе (л/100 км)"
          type="number"
          step="0.1"
          value={formData.highwayFuelConsumption}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Трансмиссия */}
        <input
          name="transmission"
          placeholder="Коробка передач (автомат, МКПП)"
          value={formData.transmission}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="driveType"
          placeholder="Привод (передний, задний, полный)"
          value={formData.driveType}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Габариты */}
        <input
          name="length"
          placeholder="Длина (м)"
          type="number"
          step="0.01"
          value={formData.length}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="width"
          placeholder="Ширина (м)"
          type="number"
          step="0.01"
          value={formData.width}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="height"
          placeholder="Высота (м)"
          type="number"
          step="0.01"
          value={formData.height}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="groundClearance"
          placeholder="Дорожный просвет (мм)"
          type="number"
          value={formData.groundClearance}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="wheelbase"
          placeholder="База (мм)"
          type="number"
          value={formData.wheelbase}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Документы */}
        <input
          name="registrationNumber"
          placeholder="Регистрационный номер"
          value={formData.registrationNumber}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="vehicleCertificateNumber"
          placeholder="Номер ПТС"
          value={formData.vehicleCertificateNumber}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="drivingLicenseNumber"
          placeholder="Номер водительского удостоверения"
          value={formData.drivingLicenseNumber}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="driverLicenseNumber"
          placeholder="Номер талона ТО"
          value={formData.driverLicenseNumber}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <button type="submit" style={styles.button}>
        {initialData.id ? "Обновить автомобиль" : "Добавить автомобиль"}
      </button>
    </form>
  );
};

// Стили
const styles = {
  form: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default CarForm;
