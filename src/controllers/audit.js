import AuditEvent from "../models/AuditEvent";
import { getPagination, getPaginationMeta } from "../utils/pagination";

const getAuditEvents = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.entityType) {
    filter.entityType = req.query.entityType;
  }

  if (req.query.entityId) {
    filter.entityId = req.query.entityId;
  }

  const [events, total] = await Promise.all([
    AuditEvent.find(filter).sort({ occurredAt: -1 }).skip(skip).limit(limit),
    AuditEvent.countDocuments(filter),
  ]);

  return res.json({
    status: 200,
    events,
    total,
    pagination: getPaginationMeta({ total, page, limit }),
  });
};

export { getAuditEvents };
