const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Подключение к БД
prisma
  .$connect()
  .then(() => {
    console.log("✅ Подключено к PostgreSQL");
  })
  .catch((err) => {
    console.error("❌ Ошибка подключения к PostgreSQL:", err.message);
  });

// Маршруты
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cars", require("./routes/carRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));

// Главный маршрут
app.get("/", (req, res) => {
  res.json({ message: "Car CRM API работает!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
