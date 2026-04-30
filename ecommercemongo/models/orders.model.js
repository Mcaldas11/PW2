// orders items  [{id, nome, priceatepurchase, quantidade}]
// totalprice
//created at

export default (mongoose) => {
  const OrderSchema = new mongoose.Schema(
    {
      items: [
        {
          productId: mongoose.Schema.Types.ObjectId,
          name: String,
          priceAtPurchase: Number,
          quantity: Number,
        },
      ],
      totalPrice: Number,
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    },
  );

  const Order = mongoose.model("Order", OrderSchema);
  return Order;
};
