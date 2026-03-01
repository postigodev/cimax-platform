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

import { Router } from "express";

const router = Router();

router.get("/get-all/:gte/:lt", [checkGte], getOrdens);
router.get("/get-by-doctor/:doctor/:gte/:lt", [checkGte], getOrdenByDoctor);
router.get("/get-by-toma/:toma/:gte/:lt", [checkGte], getOrdenByToma);
router.get(
  "/get-by-doctor-toma/:doctor/:toma/:gte/:lt",
  [checkGte],
  getOrdenByDoctorAndToma
);
router.get("/get-by-color/:gte/:lt", [checkGte], getOrdenByColor);
router.get("/get-by-paciente/:paciente", getOrdenByPaciente);
router.get("/get-by-boleta/:boleta", getOrdenByBoleta);
router.get("/get-by-usb/:gte/:lt", [checkGte], getOrdenByUSB);
router.post("/create-orden", [checkParams, checkTomaAndDoctor], postOrden);
router.put("/edit-orden/:id", [ordenExist], editOrden);
router.put("/edit-color/:id", [ordenExist], editOrderColor);
router.put("/edit-doctor-color/:id", [ordenExist], editDoctorColor);
router.put("/edit-comment-color/:id", [ordenExist], editCommentColor);
router.delete("/delete-orden", [checkPwd], bulkDeleteOrdens);
module.exports = router;
