export default (mongoose) => {
  const orderSchema = new mongoose.Schema({
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        priceAtPurchase: Number,
        quantity: Number
      },
    ],
    totalPrice: Number
  }, {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  });

  const Order = mongoose.model("Order", orderSchema);
  return Order;
};