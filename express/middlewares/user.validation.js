import { validationError } from "../utils/error.utils.js";

export const validateUserData = (req, res, next) => {
    const {email, password} = req.body;

    if(!email) {
        validationError({email: ['Email is a required field']})
    }
    if(!password || password.length <= 10){
        validationError({password: ['Password is a required field and must be 10+ characthers']})
    }
    next()
}