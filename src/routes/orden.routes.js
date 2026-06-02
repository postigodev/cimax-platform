import {
  getOrdenByDoctor,
  getOrdenByToma,
  getOrdens,
  postOrden,
  getOrdenByBoleta,
  getOrdenByPaciente,
  getOrdenByUSB,
  bulkDeleteOrdens,
  editOrden,
  editOrderColor,
  editDoctorColor,
  editCommentColor,
  getOrdenByDoctorAndToma,
  getOrdenByColor,
} from "../controllers/orden";
import {
  checkGte,
  checkPwd,
  checkParams,
  checkTomaAndDoctor,
  ordenExist,
} from "../middlewares/orden.middlewares";
import { requireRole } from "../middlewares/auth.middlewares";
import { asyncHandler } from "../middlewares/error.middlewares";

import { Router } from "express";

const router = Router();

router.get("/get-all/:gte/:lt", [checkGte], asyncHandler(getOrdens));
router.get(
  "/get-by-doctor/:doctor/:gte/:lt",
  [checkGte],
  asyncHandler(getOrdenByDoctor)
);
router.get(
  "/get-by-toma/:toma/:gte/:lt",
  [checkGte],
  asyncHandler(getOrdenByToma)
);
router.get(
  "/get-by-doctor-toma/:doctor/:toma/:gte/:lt",
  [checkGte],
  asyncHandler(getOrdenByDoctorAndToma)
);
router.get("/get-by-color/:gte/:lt", [checkGte], asyncHandler(getOrdenByColor));
router.get("/get-by-paciente/:paciente", asyncHandler(getOrdenByPaciente));
router.get("/get-by-boleta/:boleta", asyncHandler(getOrdenByBoleta));
router.get("/get-by-usb/:gte/:lt", [checkGte], asyncHandler(getOrdenByUSB));
router.post(
  "/create-orden",
  [requireRole("operator"), asyncHandler(checkParams), asyncHandler(checkTomaAndDoctor)],
  asyncHandler(postOrden)
);
router.put(
  "/edit-orden/:id",
  [requireRole("operator"), asyncHandler(ordenExist)],
  asyncHandler(editOrden)
);
router.put(
  "/edit-color/:id",
  [requireRole("operator"), asyncHandler(ordenExist)],
  asyncHandler(editOrderColor)
);
router.put(
  "/edit-doctor-color/:id",
  [requireRole("operator"), asyncHandler(ordenExist)],
  asyncHandler(editDoctorColor)
);
router.put(
  "/edit-comment-color/:id",
  [requireRole("operator"), asyncHandler(ordenExist)],
  asyncHandler(editCommentColor)
);
router.delete(
  "/delete-orden",
  [requireRole("admin"), asyncHandler(checkPwd)],
  asyncHandler(bulkDeleteOrdens)
);
module.exports = router;
