const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res
        .status(403)
        .json({ message: "Token format is Bearer <token>" });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    req.tokenIssuedAt = decoded.iat * 1000;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Failed to authenticate token", error: error.message });
  }
};
