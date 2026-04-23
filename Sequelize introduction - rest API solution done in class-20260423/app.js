import express from "express";
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.use(express.json());

// import express router for products resource
import productsRoutes from './routes/products.routes.js';

// apply express router for /products routes
app.use('/products', productsRoutes);

// handle 404 error for unknown routes
app.use((req, res, next) => {
    const error = new Error(`Route ${req.method} ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    // capture express.json() body parsing errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        err.message = "Invalid JSON payload";
        err.status = 400;
    }

    res.status(err.status || 500).json({
        description: err.message || "Internal server error",
        // if errors, include it in the response
        ...(err.errors && { errors: err.errors })
    });
});


app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});