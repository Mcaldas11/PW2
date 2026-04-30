import mongoose from "mongoose";

export default (mongoose) => {
  const ProductSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      price: {
        type: Number,
        required: true,
        validate: {
          validator: function (v) {
            return v > 0;
          },
          message: "Price must be a positive number.",
        },
      },
      stock: { type: Number, default: 0, min: 0 },
    },
    { timestamps: false },
  );

  const Product = mongoose.model("Product", ProductSchema);
  return Product;
};
