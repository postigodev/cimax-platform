import env from "../config/env";
import ApiError from "../utils/ApiError";

const roleRank = {
  viewer: 1,
  operator: 2,
  admin: 3,
};

const apiKeyToRole = new Map(
  Object.entries(env.API_KEYS)
    .filter(([, key]) => key)
    .map(([role, key]) => [key, role])
);

export const requireRole = (minimumRole) => (req, _res, next) => {
  const apiKey = req.get("x-api-key");

  if (!apiKey) {
    throw new ApiError(401, "API key requerida");
  }

  const role = apiKeyToRole.get(apiKey);

  if (!role || roleRank[role] < roleRank[minimumRole]) {
    throw new ApiError(403, "No tiene permisos para esta accion");
  }

  req.auth = { role };
  next();
};
