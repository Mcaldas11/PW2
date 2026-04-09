import express from 'express';
import productsRoutes from './routes/products.routes.js';

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/products', productsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Central error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const payload = { message: err.message || 'Internal Server Error' };
  if (err.errors) payload.errors = err.errors;
  res.status(status).json(payload);
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}/`);
});
