// use Sequelize to define the Product model, with validations:
// fields: name (string, not null), price (decimal, not null, validate > 0), stock (integer, default 0, validate >= 0)
// use ES module syntax
// export function that takes a sequelize and DataTypes instance and defines the model, then returns it

export default (sequelize, DataTypes) => sequelize.define("product", {
  name: { type: DataTypes.STRING, allowNull: false},
  price: {
    type: DataTypes.FLOAT, allowNull: false,
    validate: {
      isFloat: true, // validate it is a number
      isPositive(value) { // can not be zero, use custom validator
        if (value <= 0)
          throw new Error("Price must be a positive number");
      }
    }
  },
  stock: {
    type: DataTypes.INTEGER, defaultValue: 0,
    validate: { isInt: true, min: 0 }
  }
}, {
  timestamps: false // remove createdAt and updatedAt fields
});
