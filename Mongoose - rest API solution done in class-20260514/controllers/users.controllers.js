import { get } from "mongoose";
import { User, Cart, Product } from "../models/db.config.js";

import * as errorUtils from "../utils/error.utils.js";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (missingFields.length > 0) {
      return next(errorUtils.missingFieldsValidationError(missingFields));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const errorMessage = `User with email ${email} already exists.`;
      return next(errorUtils.conflictError({ email: errorMessage }));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ description: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);

    if (error.name === "ValidationError") {
      next(errorUtils.mongooseValidationError(error.errors));
    } else {
      next(errorUtils.internalServerError());
    }
  }
};

export const login = async (req, res, next) => {
    
    try {
        const { email, password } = req.body;

        const missingFields = [];
        if (!email) missingFields.push("email");
        if (!password) missingFields.push("password");
        if (missingFields.length > 0) {
            return next(errorUtils.missingFieldsValidationError(missingFields));
        }


    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(errorUtils.unauthorizedError("Invalid email or password"));
    }

    const token = jwt.sign(
        {sub : user._id, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    res.json({acessToken: token});

    } catch (error) {
        next(errorUtils.genericError("Error logging in user"));
    }
};

export const createCart = async (req, res, next) => {
    try {
        const userId = req.user.sub;
        const user = await User.findById(userId);
        if (!user) {
            return next(errorUtils.notFoundError("User", userId));
        }

        const cart = await Cart.findOne({creator: userId});
        if (cart) {
            const errorMessage = `User with ID ${userId} already has a cart.`;
            return next(errorUtils.conflictError(errorMessage));
        }

        const newCart = await Cart.create({ creator: userId });

        delete newCart._doc.creator;
        delete newCart._doc.__v;
        delete newCart._doc.items;

        res.status(201).json(newCart);
    } catch (error) {
        next(errorUtils.genericError("Error creating cart"));
    }
};
