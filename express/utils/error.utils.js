function createError({ status, description, errors }) {
    const error = new Error(description);
    error.status = status; error.errors = errors;
    return error;
}

// 400 - Validation error (errors may accumulate)
export function validationError(errors) {
    return createError({
        status: 400, description: "Validation failed",
        errors
    });
}

// 404 - Resource not found: e.g. "product": ["Product with ID 10 not found"]
export function notFoundError(resource, id) {
    return createError({
        status: 404, description: "Resource not found",
        errors: { [resource.toLowerCase()]: [`${resource} with ID ${id} not found`]}
    });
}