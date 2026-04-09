import express from 'express';
// Routes
import productsRoutes from './routes/products.routes.js';
import usersRoutes from './routes/users.routes.js'
import overviewRoutes from './routes/overview.routes.js'

const app = express();
const host = process.env.HOST || '127.0.0.1' ;
const port = process.env.PORT || 8080;

app.use(express.json());
// Routing
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/', overviewRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const payload = { message: err.message || 'Internal Server Error' };
  if (err.errors) payload.errors = err.errors;
  res.status(status).json(payload);
});

app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}/`);
});