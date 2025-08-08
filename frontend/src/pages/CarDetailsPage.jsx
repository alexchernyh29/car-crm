import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";
import MaintenanceForm from "../components/MaintenanceForm";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("general"); // Текущая вкладка

  useEffect(() => {
    loadCar();
    loadRecords();
  }, []);

  const loadCar = async () => {
    try {
      const res = await api.get(`/cars/${id}`);
      setCar(res.data.data);
    } catch (err) {
      alert(
        "Ошибка загрузки автомобиля: " +
          (err.response?.data?.error || "Не найден")
      );
      navigate("/cars");
    }
  };

  const loadRecords = async () => {
    try {
      const res = await api.get(`/maintenance?carId=${id}`);
      setRecords(res.data.data);
    } catch (err) {
      console.error("Ошибка загрузки истории ТО");
    }
  };

  if (!car) return <div>Загрузка...</div>;

  return (
    <>
      <Header />
      <div className="container">
        <h2>
          {car.make} {car.model} ({car.year})
        </h2>
        <p>
          <strong>VIN:</strong> {car.vin}
        </p>

        {/* Вкладки */}
        <div style={styles.tabs}>
          <button
            className={activeTab === "general" ? "active" : ""}
            onClick={() => setActiveTab("general")}
            style={activeTab === "general" ? styles.tabActive : styles.tab}
          >
            Общее
          </button>
          <button
            className={activeTab === "maintenance" ? "active" : ""}
            onClick={() => setActiveTab("maintenance")}
            style={activeTab === "maintenance" ? styles.tabActive : styles.tab}
          >
            ТО
          </button>
          <button
            className={activeTab === "dimensions" ? "active" : ""}
            onClick={() => setActiveTab("dimensions")}
            style={activeTab === "dimensions" ? styles.tabActive : styles.tab}
          >
            Габариты
          </button>
          <button
            className={activeTab === "documents" ? "active" : ""}
            onClick={() => setActiveTab("documents")}
            style={activeTab === "documents" ? styles.tabActive : styles.tab}
          >
            Документы
          </button>
        </div>

        <div style={styles.tabContent}>
          {/* Вкладка: Общее */}
          {activeTab === "general" && (
            <div>
              {car.color && (
                <p>
                  <strong>Цвет:</strong> {car.color}
                </p>
              )}
              {car.engineVolume && (
                <p>
                  <strong>Объём двигателя:</strong> {car.engineVolume} л
                </p>
              )}
              {car.engineType && (
                <p>
                  <strong>Тип двигателя:</strong> {car.engineType}
                </p>
              )}
              {car.power && (
                <p>
                  <strong>Мощность:</strong> {car.power} л.с.
                </p>
              )}
              {car.transmission && (
                <p>
                  <strong>Коробка передач:</strong> {car.transmission}
                </p>
              )}
              {car.driveType && (
                <p>
                  <strong>Привод:</strong> {car.driveType}
                </p>
              )}
            </div>
          )}

          {/* Вкладка: ТО */}
          {activeTab === "maintenance" && (
            <div>
              <MaintenanceForm carId={car.id} onSuccess={loadRecords} />

              <h3>История ТО</h3>
              <ul>
                {records.length === 0 ? (
                  <p>Записей о ТО пока нет</p>
                ) : (
                  records.map((rec) => (
                    <li key={rec.id} style={styles.recordItem}>
                      <strong>{new Date(rec.date).toLocaleDateString()}</strong>
                      <br />
                      <small>
                        Тип: {rec.type}, пробег: {rec.mileage} км
                      </small>
                      {rec.notes && (
                        <p style={{ marginTop: "5px" }}>
                          <em>{rec.notes}</em>
                        </p>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {/* Вкладка: Габариты */}
          {activeTab === "dimensions" && (
            <div>
              {car.length && (
                <p>
                  <strong>Длина:</strong> {car.length} м
                </p>
              )}
              {car.width && (
                <p>
                  <strong>Ширина:</strong> {car.width} м
                </p>
              )}
              {car.height && (
                <p>
                  <strong>Высота:</strong> {car.height} м
                </p>
              )}
              {car.wheelbase && (
                <p>
                  <strong>База:</strong> {car.wheelbase} мм
                </p>
              )}
              {car.groundClearance && (
                <p>
                  <strong>Дорожный просвет:</strong> {car.groundClearance} мм
                </p>
              )}
              {car.fuelTankCapacity && (
                <p>
                  <strong>Объём бака:</strong> {car.fuelTankCapacity} л
                </p>
              )}
              {car.cityFuelConsumption && (
                <p>
                  <strong>Расход в городе:</strong> {car.cityFuelConsumption}{" "}
                  л/100 км
                </p>
              )}
              {car.highwayFuelConsumption && (
                <p>
                  <strong>Расход на трассе:</strong>{" "}
                  {car.highwayFuelConsumption} л/100 км
                </p>
              )}
            </div>
          )}

          {/* Вкладка: Документы */}
          {activeTab === "documents" && (
            <div>
              {car.registrationNumber && (
                <p>
                  <strong>Регистрационный номер:</strong>{" "}
                  {car.registrationNumber}
                </p>
              )}
              {car.vehicleCertificateNumber && (
                <p>
                  <strong>Номер ПТС:</strong> {car.vehicleCertificateNumber}
                </p>
              )}
              {car.drivingLicenseNumber && (
                <p>
                  <strong>Номер водительского удостоверения:</strong>{" "}
                  {car.drivingLicenseNumber}
                </p>
              )}
              {car.driverLicenseNumber && (
                <p>
                  <strong>Номер талона ТО:</strong> {car.driverLicenseNumber}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Стили для вкладок
const styles = {
  tabs: {
    display: "flex",
    gap: "2px",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
  },
  tab: {
    padding: "10px 20px",
    background: "#f8f9fa",
    border: "1px solid #ddd",
    borderBottom: "none",
    borderRadius: "6px 6px 0 0",
    cursor: "pointer",
    fontWeight: "500",
    color: "#495057",
  },
  tabActive: {
    padding: "10px 20px",
    background: "#fff",
    border: "1px solid #ddd",
    borderBottom: "none",
    borderRadius: "6px 6px 0 0",
    cursor: "pointer",
    fontWeight: "600",
    color: "#007bff",
    borderTop: "3px solid #007bff",
  },
  tabContent: {
    padding: "20px 0",
  },
  recordItem: {
    padding: "12px",
    border: "1px solid #eee",
    borderRadius: "6px",
    marginBottom: "8px",
    backgroundColor: "#f9f9f9",
  },
};

export default CarDetailsPage;
