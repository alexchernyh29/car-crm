const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Требуется авторизация" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, error: "Неверный или просроченный токен" });
  }
};

module.exports = auth;
