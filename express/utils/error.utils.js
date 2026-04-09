function createError({ status, description, errors }) {
  const error = new Error(description);
  error.status = status;
  if (errors) error.errors = errors;
  return error;
}

export function validationError(errors) {
  return createError({ status: 400, description: 'Validation failed', errors });
}

export function notFoundError(resource, id) {
  return createError({
    status: 404,
    description: 'Resource not found',
    errors: { [resource.toLowerCase()]: [`${resource} with ID ${id} not found`] }
  });
}

export default createError;
