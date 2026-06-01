import ApiError from "../utils/ApiError";

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const notFound = (req, res, next) =>
  next(new ApiError(404, "Ruta no encontrada"));

const errorHandler = (error, req, res, next) => {
  const status = error.name === "CastError" ? 400 : error.status || 500;
  const message =
    error.name === "CastError"
      ? "Identificador inválido"
      : status === 500
        ? "Ocurrió un error inesperado"
        : error.message;

  if (status === 500) {
    console.error(error);
  }

  return res.status(status).json({
    status,
    message,
    ...(error.details ? { details: error.details } : {}),
  });
};

export { asyncHandler, errorHandler, notFound };
