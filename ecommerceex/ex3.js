import express from "express";

// load environment variables from .env file
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;
const HOST = process.env.HOST 

app.use(express.json());

// import express router for products resource
import productsRoutes from './routes/products.routes.js';   

// app.use("/", (req, res) => {
//     res.json({message: "Welcome to the e-commerce API"});
// });

// apply express router for /products routes
app.use('/products', productsRoutes);

// global error handler middleware
app.use((err, req, res, next) => {

    console.error(err);
    res.status(err.status || 500).json({
        description: err.message || "Internal server error",
        ...(err.errors && { errors: err.errors })
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});