const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const getPagination = (query) => {
  const page = toPositiveInt(query.page, 1);
  const requestedLimit = toPositiveInt(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMeta = ({ total, page, limit }) => ({
  total,
  page,
  limit,
  pages: Math.max(Math.ceil(total / limit), 1),
});

export { getPagination, getPaginationMeta };
