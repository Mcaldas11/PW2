export default (sequelize, DataTypes) => sequelize.define("cart_item", {
    // even thought quantity is validated in the controller, 
    // we should also validate it at the model level 
    // to ensure data integrity
    quantity: {
        type: DataTypes.INTEGER,
        validate: { isInt: true, min: 1 }
    }
}, {
  timestamps: false // remove createdAt and updatedAt fields
});
