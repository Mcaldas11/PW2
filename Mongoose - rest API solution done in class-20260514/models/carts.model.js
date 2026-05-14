export default (mongoose) => {
  const cartSchema = new mongoose.Schema({
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number, min: 1,
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer",
          },
        },
      },
    ],
    creator : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  }, { timestamps: true });

  const Cart = mongoose.model("Cart", cartSchema);
  return Cart;
};