// use MONGOOSE to define the Product model, with validations:
// fields: name (string, not null), price (decimal, not null, validate > 0), stock (integer, default 0, validate >= 0)
// use ES module syntax
// export function that defines the model, then exports it

export default (mongoose) => {
  const productSchema = new mongoose.Schema({
    name: { type: String, required: true},
    price: {
      type: Number, required: true,
      validate: {
        validator: function (value) { return value > 0; },
        message: "Price must be greater than 0",
      },
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
  }, { timestamps: false });

  const Product = mongoose.model("Product", productSchema);
  return Product;
};

