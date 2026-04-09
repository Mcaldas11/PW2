import users from './users.model.js';

let carts = users.map(u => {u.id, u.cart})

export default carts