export default (mongoose) => {
  const CartSchema = new mongoose.Schema(
    {
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1,
            validate: {
              validator: Number.isInteger,
              message: "Quantity must be an integer.",
            },
          },
        },
      ],
    },
    { timestamps: true },
  );

  const Cart = mongoose.model("Cart", CartSchema);
  return Cart;
};
