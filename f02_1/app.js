import express from 'express';

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/users', (req, res, next) => {
    console.log('Accessing users route');
    next();
});

app.get('/test', (req, res, next) => {
    console.log('First middleware for /test');
    next();
}, (req, res, next) => {
    console.log('Second middleware for /test');
    next();
});

// 1-e and 1-g
const checkQuery = (req, res, next) => {
    if (!req.query.psswd) {
        const err = new Error('No credentials');
        err.status = 400;
        return next(err);
    }
    next();
}

const isAdmin = (req, res, next) => {
    if (req.query.psswd !== 'super_secure_pass') {
        const err = new Error('Access denied');
        err.status = 403;
        return next(err);
    }
    next();
}

app.get('/admin', checkQuery, isAdmin, (req, res) => {
    res.send('Welcome, admin!');
});

app.get('/', (req, res) => {
    res.send('Welcome to my Express server!');
});

app.get('/users', (req, res) => {
    res.send('Get all users');
});

app.post('/users', (req, res) => {
    res.send('Create a new user!');
});

app.get('/test', (req, res) => {
    res.send('Test middleware chain!');
});

// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
});

app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}/`);
});