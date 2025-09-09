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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.carId || !formData.date || !formData.mileage || !formData.type) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    try {
      const data = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        mileage: parseInt(formData.mileage),
      };
      await api.post("/maintenance", data);
      alert("Запись ТО успешно добавлена!");
      setFormData({ carId: initialCarId || "", date: "", mileage: "", type: "", notes: "", partsAndSupplies: [], servicesPerformed: [] });
      onSuccess();
    } catch (err) {
      alert(`Ошибка: ${err.response?.data?.error || "Не удалось сохранить запись"}`);
    }
  };

  const renderSubForm = (title, items, item, setItem, addItem, removeItem) => (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h4 className="font-semibold text-lg mb-3">{title}</h4>
      <div className="flex gap-2 mb-3">
        <input
          className="input flex-grow"
          placeholder="Название"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
        />
        <input
          className="input w-28"
          placeholder="Цена (₽)"
          type="number"
          value={item.price}
          onChange={(e) => setItem({ ...item, price: e.target.value })}
        />
        <button type="button" onClick={addItem} className="btn-add">+</button>
      </div>
      <ul className="space-y-2">
        {items.map((p, i) => (
          <li key={i} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
            <span>{p.name} — {p.price || 0} ₽</span>
            <button type="button" onClick={() => removeItem(i)} className="btn-remove">×</button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Добавить запись о ТО</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select name="carId" value={formData.carId} onChange={handleChange} required className="input">
          <option value="">Выберите автомобиль</option>
          {cars?.map((car) => <option key={car.id} value={car.id}>{car.make} {car.model} ({car.year})</option>)}
        </select>
        <input name="date" type="datetime-local" value={formData.date} onChange={handleChange} required className="input" />
        <input name="mileage" placeholder="Пробег (км)" type="number" value={formData.mileage} onChange={handleChange} required className="input" />
        <input name="type" placeholder="Тип ТО" value={formData.type} onChange={handleChange} required className="input" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSubForm("Запчасти и материалы", formData.partsAndSupplies, part, setPart, 
          () => {
            if (!part.name.trim()) return;
            setFormData({ ...formData, partsAndSupplies: [...formData.partsAndSupplies, { name: part.name, price: parseFloat(part.price) || 0 }] });
            setPart({ name: "", price: "" });
          },
          (index) => setFormData({ ...formData, partsAndSupplies: formData.partsAndSupplies.filter((_, i) => i !== index) })
        )}

        {renderSubForm("Выполненные работы", formData.servicesPerformed, service, setService, 
          () => {
            if (!service.name.trim()) return;
            setFormData({ ...formData, servicesPerformed: [...formData.servicesPerformed, { name: service.name, price: parseFloat(service.price) || 0 }] });
            setService({ name: "", price: "" });
          },
          (index) => setFormData({ ...formData, servicesPerformed: formData.servicesPerformed.filter((_, i) => i !== index) })
        )}
      </div>

      <textarea name="notes" placeholder="Заметки (необязательно)" value={formData.notes} onChange={handleChange} className="input w-full min-h-[100px]" />

      <button type="submit" className="w-full btn-primary">Сохранить запись</button>
    </form>
  );
};

export default MaintenanceForm;
