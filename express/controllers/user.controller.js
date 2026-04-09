import users from '../models/users.model.js';
import { notFoundError, validationError } from '../utils/error.utils.js';

export const createUser = (req, res) => {
    const {email, password} = req.body;

    if(users.findIndex(u => u.email == email) != -1){
        throw validationError({email: ['Email already in use']})
    }

    const nextId = users.length > 0 ? Math.max(...users.map(p => p.id)) + 1: 1;
    const newUser = {id:nextId, email, password}
    users.push(newUser)
    res.status(201).json(newUser)
}

export const authUser = (req, res) => {

}

export const getUserOrders = (req, res) => {

}

export const login = (req, res) => {
    
}