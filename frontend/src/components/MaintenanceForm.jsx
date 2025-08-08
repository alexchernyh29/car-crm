// frontend/src/components/MaintenanceForm.jsx
import React, { useState } from "react";
import api from "../services/api";

const MaintenanceForm = ({ carId: initialCarId, cars, onSuccess }) => {
  const [formData, setFormData] = useState({
    carId: initialCarId || "",
    date: "",
    mileage: "",
    type: "",
    notes: "",
    partsAndSupplies: [],
    servicesPerformed: [],
  });

  const [part, setPart] = useState({ name: "", price: "" });
  const [service, setService] = useState({ name: "", price: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addPart = () => {
    if (!part.name.trim()) return;
    const price = parseFloat(part.price) || 0;
    setFormData({
      ...formData,
      partsAndSupplies: [
        ...formData.partsAndSupplies,
        { name: part.name, price },
      ],
    });
    setPart({ name: "", price: "" });
  };

  const removePart = (index) => {
    setFormData({
      ...formData,
      partsAndSupplies: formData.partsAndSupplies.filter((_, i) => i !== index),
    });
  };

  const addService = () => {
    if (!service.name.trim()) return;
    const price = parseFloat(service.price) || 0;
    setFormData({
      ...formData,
      servicesPerformed: [
        ...formData.servicesPerformed,
        { name: service.name, price },
      ],
    });
    setService({ name: "", price: "" });
  };

  const removeService = (index) => {
    setFormData({
      ...formData,
      servicesPerformed: formData.servicesPerformed.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.mileage ||
      !formData.type ||
      !formData.carId
    ) {
      alert(
        "Пожалуйста, заполните все обязательные поля: дата, пробег, тип ТО и автомобиль"
      );
      return;
    }

    try {
      const data = {
        carId: formData.carId,
        date: new Date(formData.date).toISOString(),
        mileage: parseInt(formData.mileage),
        type: formData.type,
        notes: formData.notes,
        partsAndSupplies: formData.partsAndSupplies,
        servicesPerformed: formData.servicesPerformed,
      };

      await api.post("/maintenance", data);
      alert("✅ Запись ТО успешно добавлена!");

      // Сброс формы
      setFormData({
        carId: initialCarId || "",
        date: "",
        mileage: "",
        type: "",
        notes: "",
        partsAndSupplies: [],
        servicesPerformed: [],
      });
      onSuccess();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Не удалось сохранить запись";
      alert(`Ошибка: ${errorMsg}`);
      console.error("MaintenanceForm error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Добавить запись ТО</h3>

      <div style={styles.row}>
        <select
          name="carId"
          value={formData.carId}
          onChange={handleChange}
          required
          style={styles.select}
        >
          <option value="">Выберите автомобиль</option>
          {cars?.map((car) => (
            <option key={car.id} value={car.id}>
              {car.make} {car.model} ({car.year})
            </option>
          ))}
        </select>

        <input
          name="date"
          placeholder="Дата"
          type="datetime-local"
          value={formData.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="mileage"
          placeholder="Пробег (км)"
          type="number"
          value={formData.mileage}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="type"
          placeholder="Тип ТО (например: ТО-1)"
          value={formData.type}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      {/* Запчасти */}
      <div style={styles.section}>
        <h4>Запчасти</h4>
        <div style={styles.row}>
          <input
            placeholder="Название"
            value={part.name}
            onChange={(e) => setPart({ ...part, name: e.target.value })}
            style={styles.smallInput}
          />
          <input
            placeholder="Цена (₽)"
            type="number"
            value={part.price}
            onChange={(e) => setPart({ ...part, price: e.target.value })}
            style={styles.smallInput}
          />
          <button type="button" onClick={addPart} style={styles.addButton}>
            +
          </button>
        </div>
        <ul style={styles.list}>
          {formData.partsAndSupplies.map((p, i) => (
            <li key={i} style={styles.listItem}>
              {p.name} — {p.price} ₽
              <button
                type="button"
                onClick={() => removePart(i)}
                style={styles.removeButton}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Услуги */}
      <div style={styles.section}>
        <h4>Выполненные работы</h4>
        <div style={styles.row}>
          <input
            placeholder="Название услуги"
            value={service.name}
            onChange={(e) => setService({ ...service, name: e.target.value })}
            style={styles.smallInput}
          />
          <input
            placeholder="Стоимость (₽)"
            type="number"
            value={service.price}
            onChange={(e) => setService({ ...service, price: e.target.value })}
            style={styles.smallInput}
          />
          <button type="button" onClick={addService} style={styles.addButton}>
            +
          </button>
        </div>
        <ul style={styles.list}>
          {formData.servicesPerformed.map((s, i) => (
            <li key={i} style={styles.listItem}>
              {s.name} — {s.price} ₽
              <button
                type="button"
                onClick={() => removeService(i)}
                style={styles.removeButton}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Заметки */}
      <textarea
        name="notes"
        placeholder="Заметки (необязательно)"
        value={formData.notes}
        onChange={handleChange}
        style={styles.textarea}
      />

      <button type="submit" style={styles.submitButton}>
        Сохранить запись ТО
      </button>
    </form>
  );
};

const styles = {
  form: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
    marginBottom: "30px",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
  },
  select: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
    minWidth: "200px",
  },
  smallInput: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
  },
  addButton: {
    width: "40px",
    height: "40px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  section: {
    marginBottom: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    marginBottom: "6px",
    fontSize: "14px",
  },
  removeButton: {
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "14px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
    minHeight: "80px",
    marginBottom: "15px",
    resize: "vertical",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default MaintenanceForm;
