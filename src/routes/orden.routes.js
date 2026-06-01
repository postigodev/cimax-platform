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
  [asyncHandler(checkParams), asyncHandler(checkTomaAndDoctor)],
  asyncHandler(postOrden)
);
router.put("/edit-orden/:id", [asyncHandler(ordenExist)], asyncHandler(editOrden));
router.put(
  "/edit-color/:id",
  [asyncHandler(ordenExist)],
  asyncHandler(editOrderColor)
);
router.put(
  "/edit-doctor-color/:id",
  [asyncHandler(ordenExist)],
  asyncHandler(editDoctorColor)
);
router.put(
  "/edit-comment-color/:id",
  [asyncHandler(ordenExist)],
  asyncHandler(editCommentColor)
);
router.delete("/delete-orden", [asyncHandler(checkPwd)], asyncHandler(bulkDeleteOrdens));
module.exports = router;
