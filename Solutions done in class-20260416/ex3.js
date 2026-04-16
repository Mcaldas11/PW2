import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'

app.use(express.json());

// import express router for products resource
import productsRoutes from './routes/products.routes.js';   

// apply express router for /products routes
app.use('/products', productsRoutes);


app.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});