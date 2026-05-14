import jwt from "jsonwebtoken";
import * as errorUtils from "../utils/error.utils.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(
        errorUtils.unauthorizedError("Authorization header is missing"),
      );
    }
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(errorUtils.unauthorizedError("Invalid authorization format"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(errorUtils.unauthorizedError("Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(errorUtils.unauthorizedError("Token has expired"));
    } else {
      next(
        errorUtils.genericError("An error occurred while verifying the token"),
      );
    }
  }
};
