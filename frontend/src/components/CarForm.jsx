import React, { useState } from "react";
import api from "../services/api";

const CarForm = ({ onSuccess, initialData = {} }) => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    bodyType: "",
    color: "",
    engineVolume: "",
    engineType: "",
    power: "",
    fuelTankCapacity: "",
    cityFuelConsumption: "",
    highwayFuelConsumption: "",
    transmission: "",
    driveType: "",
    length: "",
    width: "",
    height: "",
    groundClearance: "",
    wheelbase: "",
    registrationNumber: "",
    vehicleCertificateNumber: "",
    drivingLicenseNumber: "",
    driverLicenseNumber: "",
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { ...formData };
      const numericFields = [
        'year', 'engineVolume', 'power', 'fuelTankCapacity',
        'cityFuelConsumption', 'highwayFuelConsumption', 'length',
        'width', 'height', 'groundClearance', 'wheelbase'
      ];
      numericFields.forEach(field => {
        if (data[field]) data[field] = parseFloat(data[field]);
      });


      let response;
      if (initialData.id) {
        response = await api.put(`/cars/${initialData.id}`, data);
      } else {
        response = await api.post("/cars", data);
      }
      onSuccess(response.data.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Не удалось сохранить автомобиль";
      alert(`Ошибка: ${errorMsg}`);
      console.error("CarForm error:", err);
    }
  };

  const renderInputField = (name, placeholder, type = "text", required = false, step) => (
      <div>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">{placeholder}</label>
          <input
              id={name}
              name={name}
              placeholder={placeholder}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              required={required}
              step={step}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
      </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        {initialData.id ? "Редактировать автомобиль" : "Добавить автомобиль"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Основная информация</h4>
          {renderInputField("make", "Марка", "text", true)}
          {renderInputField("model", "Модель", "text", true)}
          {renderInputField("year", "Год выпуска", "number", true)}
          {renderInputField("vin", "VIN (уникальный)", "text", true)}
        </div>

        <div className="col-span-1">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Внешний вид</h4>
          {renderInputField("bodyType", "Тип кузова")}
          {renderInputField("color", "Цвет")}
        </div>

        <div className="col-span-1">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Двигатель</h4>
          {renderInputField("engineVolume", "Объём двигателя (л)", "number", false, "0.1")}
          {renderInputField("engineType", "Тип двигателя")}
          {renderInputField("power", "Мощность (л.с.)", "number")}
        </div>

        <div className="col-span-1">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Топливная система</h4>
          {renderInputField("fuelTankCapacity", "Объём бака (л)", "number", false, "0.1")}
          {renderInputField("cityFuelConsumption", "Расход в городе (л/100 км)", "number", false, "0.1")}
          {renderInputField("highwayFuelConsumption", "Расход на трассе (л/100 км)", "number", false, "0.1")}
        </div>
        
        <div className="col-span-1">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Трансмиссия</h4>
            {renderInputField("transmission", "Коробка передач")}
            {renderInputField("driveType", "Привод")}
        </div>

        <div className="col-span-1">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Габариты</h4>
            {renderInputField("length", "Длина (м)", "number", false, "0.01")}
            {renderInputField("width", "Ширина (м)", "number", false, "0.01")}
            {renderInputField("height", "Высота (м)", "number", false, "0.01")}
            {renderInputField("groundClearance", "Дорожный просвет (мм)", "number")}
            {renderInputField("wheelbase", "База (мм)", "number")}
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
             <h4 className="text-lg font-medium text-gray-700 mb-3">Документы</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputField("registrationNumber", "Регистрационный номер")}
                {renderInputField("vehicleCertificateNumber", "Номер ПТС")}
                {renderInputField("drivingLicenseNumber", "Номер водительского удостоверения")}
                {renderInputField("driverLicenseNumber", "Номер талона ТО")}
            </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {initialData.id ? "Обновить автомобиль" : "Добавить автомобиль"}
      </button>
    </form>
  );
};

export default CarForm;
