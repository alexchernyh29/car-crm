// frontend/src/pages/MaintenancePage.jsx
import React, { useState, useEffect } from "react";
import MaintenanceForm from "../components/MaintenanceForm";
import api from "../services/api";

const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    loadCars();
    loadRecords();
  }, []);

  const loadCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data.data);
    } catch (err) {
      console.error("Ошибка загрузки автомобилей:", err);
    }
  };

  const loadRecords = async () => {
    try {
      const res = await api.get("/maintenance");
      setRecords(res.data.data);
    } catch (err) {
      console.error("Ошибка загрузки истории ТО:", err);
    }
  };

  const handleSuccess = () => {
    loadRecords();
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Техническое обслуживание</h2>
        <MaintenanceForm cars={cars} onSuccess={handleSuccess} />
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">История ТО</h3>
        {records.length === 0 ? (
          <p className="text-center text-gray-500">Записей о техническом обслуживании пока нет.</p>
        ) : (
          <ul className="space-y-6">
            {records.map((record) => {
              const car = cars.find((c) => c.id === record.carId);
              const totalParts = record.partsAndSupplies.reduce((sum, p) => sum + p.price, 0);
              const totalServices = record.servicesPerformed.reduce((sum, s) => sum + s.price, 0);
              const totalCost = totalParts + totalServices;

              return (
                <li key={record.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-gray-800">
                      {car?.make} {car?.model} — <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                    </h4>
                    <span className="bg-blue-500 text-white font-bold py-1 px-3 rounded-full text-sm">
                      Сумма: {totalCost} ₽
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <p><strong>Пробег:</strong> {record.mileage} км</p>
                      <p><strong>Тип:</strong> {record.type}</p>
                  </div>
                  {record.notes && (
                    <p className="mt-4 text-gray-600 italic">{record.notes}</p>
                  )}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {record.partsAndSupplies.length > 0 && (
                        <div>
                          <h5 className="font-semibold mb-2">Запчасти и материалы:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {record.partsAndSupplies.map((p, i) => (
                              <li key={i}>{p.name} — {p.price} ₽</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.servicesPerformed.length > 0 && (
                        <div>
                          <h5 className="font-semibold mb-2">Выполненные работы:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {record.servicesPerformed.map((s, i) => (
                              <li key={i}>{s.name} — {s.price} ₽</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
