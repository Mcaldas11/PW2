export const validateProduct = (req, res, next) => {
    const { name, price, stock } = req.body;

    if (!name || !price) {
        const error = new Error('Name and price are required');
        error.status = 400;
        throw error;
    }

    if (typeof price !== 'number' || price <= 0) {
        const error = new Error('Price must be a positive number');
        error.status = 400;
        throw error;
    }

    if (stock && (!Number.isInteger(stock) || stock <= 0)) {
        const error = new Error('Stock must be a positive integer');
        error.status = 400;
        throw error;
    }

    next();
};