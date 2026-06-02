import { Router } from "express";
import { getAuditEvents } from "../controllers/audit";
import { requireRole } from "../middlewares/auth.middlewares";
import { asyncHandler } from "../middlewares/error.middlewares";

const router = Router();

router.get("/events", requireRole("admin"), asyncHandler(getAuditEvents));

module.exports = router;
