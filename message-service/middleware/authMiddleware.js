const asyncHandler = require("express-async-handler");
const { verifyTokenAndGetUser } = require("../config/verifyToken");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  req.user = await verifyTokenAndGetUser(token);
  next();
});

module.exports = { protect };
