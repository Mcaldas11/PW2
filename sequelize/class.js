import { Sequelize, DataTypes } from "sequelize";

// load environment variables from .env file
import "dotenv/config";

// good practice: use environment variables for sensitive information
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

// test the database connection
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1);
}

// define model Product
const Product = sequelize.define("product", {
  // mandatory fields name and price(positive)
  // stock must be an integer with default value 0 and value must be positive
  name: {
    type: DataTypes.STRING,
    allowNull: false
    
  },
  price: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
    validate: {
      isFloat: true,
      isPositive(value) {
        if (value <= 0) {
          throw new Error("Price must be a positive number");
        }
    }
  }},
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0
    }
  }
});

await sequelize.sync();   

//adicionar produto
try {
  const newProduct = await Product.create({
    name: "Example Product",
    price: 19.99,
    stock: 100
  });
  console.log("New product created:", newProduct.toJSON());
} catch (error) {
  console.error("Error creating product:", error);
}

// ler todos os produtos
try {
  const products = await Product.findAll();
    console.log("All products:", products.map(p => p.toJSON()));
} catch (error) {
  console.error("Error fetching products:", error);
}

// ler produto por id e apagar
try {
  const product = await Product.findByPk(1);
  if (product) {
    console.log("Product found:", product.toJSON());
    await product.destroy();
    console.log("Product deleted.");
  } else {
    console.log("Product not found.");
  }
} catch (error) {
  console.error("Error fetching or deleting product:", error);
}   

// update products with price < 20

try {
  const [updatedCount] = await Product.update(
    { price: 25.00 },
    { where: { price: { [Sequelize.Op.lt]: 20 } } }
  );
  console.log(`${updatedCount} products updated.`);
} catch (error) {
  console.error("Error updating products:", error);
} 