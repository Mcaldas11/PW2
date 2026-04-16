// using ES modules sytax, export a function that defines the products model using sequelize
// products: id(integer, primary key, auto increment), name(string), price(float), stock(integer)

export default (sequelize, DataTypes) =>  sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate : {
      isFloat: true,
      isPositive(value) {
        if (value <= 0) {
          throw new Error('Price must be greater than 0');
        }
      }
    }
  },
  stock: {
    type: DataTypes.INTEGER, defaultValue: 0,
    validate : {
      isInt: true,
      min: 0
    }
  }
},{
  timestamps: false
});
