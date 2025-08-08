const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCars = async (req, res) => {
  const cars = await prisma.car.findMany({ where: { userId: req.user.id } });
  res.json({ success: true, data: cars });
};

exports.getCarById = async (req, res) => {
  const car = await prisma.car.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!car)
    return res
      .status(404)
      .json({ success: false, error: "Автомобиль не найден" });
  res.json({ success: true, data: car });
};

exports.createCar = async (req, res) => {
  try {
    const car = await prisma.car.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({ success: false, error: "VIN уже используется" });
    } else {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

exports.updateCar = async (req, res) => {
  const car = await prisma.car.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!car)
    return res
      .status(404)
      .json({ success: false, error: "Автомобиль не найден" });

  const updatedCar = await prisma.car.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json({ success: true, data: updatedCar });
};

exports.deleteCar = async (req, res) => {
  const car = await prisma.car.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!car)
    return res
      .status(404)
      .json({ success: false, error: "Автомобиль не найден" });

  await prisma.car.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: { id: car.id } });
};
