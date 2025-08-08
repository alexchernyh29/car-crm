// frontend/src/pages/MaintenancePage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
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
    loadRecords(); // Обновляем список после добавления
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Техническое обслуживание</h2>

        {/* Форма добавления записи */}
        <MaintenanceForm cars={cars} onSuccess={handleSuccess} />

        {/* Список всех записей */}
        <h3>История ТО</h3>
        {records.length === 0 ? (
          <p>Записей о техническом обслуживании пока нет.</p>
        ) : (
          <ul style={styles.recordsList}>
            {records.map((record) => {
              const car = cars.find((c) => c.id === record.carId);
              const totalParts = record.partsAndSupplies.reduce(
                (sum, p) => sum + p.price,
                0
              );
              const totalServices = record.servicesPerformed.reduce(
                (sum, s) => sum + s.price,
                0
              );
              const totalCost = totalParts + totalServices;

              return (
                <li key={record.id} style={styles.recordItem}>
                  <div style={styles.recordHeader}>
                    <strong>
                      {car?.make} {car?.model}
                    </strong>{" "}
                    — {new Date(record.date).toLocaleDateString()}
                    <span style={styles.costBadge}>Сумма: {totalCost} ₽</span>
                  </div>
                  <p>
                    <strong>Пробег:</strong> {record.mileage} км
                  </p>
                  <p>
                    <strong>Тип:</strong> {record.type}
                  </p>
                  {record.notes && (
                    <p>
                      <em>{record.notes}</em>
                    </p>
                  )}

                  {record.partsAndSupplies.length > 0 && (
                    <div>
                      <strong>Запчасти:</strong>
                      <ul style={styles.subList}>
                        {record.partsAndSupplies.map((p, i) => (
                          <li key={i}>
                            {p.name} — {p.price} ₽
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {record.servicesPerformed.length > 0 && (
                    <div>
                      <strong>Услуги:</strong>
                      <ul style={styles.subList}>
                        {record.servicesPerformed.map((s, i) => (
                          <li key={i}>
                            {s.name} — {s.price} ₽
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

const styles = {
  recordsList: {
    listStyle: "none",
    padding: 0,
  },
  recordItem: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    marginBottom: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  recordHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  costBadge: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  subList: {
    listStyle: "disc",
    marginLeft: "20px",
    marginTop: "5px",
    fontSize: "14px",
  },
};

export default MaintenancePage;
