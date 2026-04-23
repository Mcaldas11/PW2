export default (sequelize, DataTypes) => sequelize.define("cart_item", {
    quantity: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: {
            isInt: { msg: "Quantity must be an integer" },
            min: { args: 1, msg: "Quantity must be at least 1" }
        }
    }
}, {
    timestamps: false
});