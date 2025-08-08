const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getMaintenanceRecords = async (req, res) => {
  const { carId } = req.query;
  const filter = { userId: req.user.id };
  if (carId) filter.carId = carId;

  const records = await prisma.maintenanceRecord.findMany({
    where: filter,
    orderBy: { date: "desc" },
  });

  res.json({ success: true, data: records });
};

exports.createMaintenanceRecord = async (req, res) => {
  try {
    const record = await prisma.maintenanceRecord.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateMaintenanceRecord = async (req, res) => {
  const record = await prisma.maintenanceRecord.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!record)
    return res.status(404).json({ success: false, error: "Запись не найдена" });

  const updated = await prisma.maintenanceRecord.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json({ success: true, data: updated });
};

exports.deleteMaintenanceRecord = async (req, res) => {
  const record = await prisma.maintenanceRecord.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!record)
    return res.status(404).json({ success: false, error: "Запись не найдена" });

  await prisma.maintenanceRecord.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: { id: record.id } });
};
