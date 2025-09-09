// frontend/src/pages/CarDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import CarForm from "../components/CarForm";
import MaintenanceForm from "../components/MaintenanceForm";

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCarDetails();
    loadMaintenanceHistory();
  }, [id]);

  const loadCarDetails = async () => {
    try {
      const res = await api.get(`/cars/${id}`);
      setCar(res.data.data);
    } catch (err) {
      alert("Ошибка загрузки данных автомобиля");
    }
  };

  const loadMaintenanceHistory = async () => {
    try {
      const res = await api.get(`/cars/${id}/maintenance`);
      setMaintenanceRecords(res.data.data);
    } catch (err) {
      alert("Ошибка загрузки истории ТО");
    }
  };

  if (!car) return <div className="container mx-auto mt-10 p-4">Загрузка...</div>;

  // Функция для отображения данных
  const renderDetail = (label, value) => (
    value && (
      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
      </div>
    )
  );

  return (
    <div className="container mx-auto mt-10 p-4">
      {isEditing ? (
        <CarForm 
          initialData={car} 
          onSuccess={(updatedCar) => {
            setCar(updatedCar);
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
                <h3 className="text-2xl leading-6 font-bold text-gray-900">
                {car.make} {car.model} ({car.year})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Детальная информация об автомобиле.</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="btn-secondary">Редактировать</button>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {renderDetail("VIN", car.vin)}
              {renderDetail("Регистрационный номер", car.registrationNumber)}
              {renderDetail("Тип кузова", car.bodyType)}
              {renderDetail("Цвет", car.color)}
              {renderDetail("Тип двигателя", car.engineType)}
              {renderDetail("Объем двигателя", car.engineVolume && `${car.engineVolume} л`)}
              {renderDetail("Мощность", car.power && `${car.power} л.с.`)}
              {renderDetail("Трансмиссия", car.transmission)}
              {renderDetail("Привод", car.driveType)}
            </dl>
          </div>
        </div>
      )}

      <div className="mb-8">
        <MaintenanceForm 
          carId={id} 
          cars={[car]} 
          onSuccess={loadMaintenanceHistory} 
        />
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">История обслуживания</h3>
        {maintenanceRecords.length > 0 ? (
             <ul className="space-y-4">
                {maintenanceRecords.map(record => (
                    <li key={record.id} className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-center">
                            <p className="font-bold">{new Date(record.date).toLocaleDateString()} - {record.type}</p>
                            <span className="text-sm font-medium">Пробег: {record.mileage} км</span>
                        </div>
                        {record.notes && <p className="text-gray-600 mt-2">{record.notes}</p>}
                    </li>
                ))}
            </ul>
        ) : (
          <p>Для этого автомобиля еще нет записей о ТО.</p>
        )}
      </div>

    </div>
  );
};

export default CarDetailPage;
