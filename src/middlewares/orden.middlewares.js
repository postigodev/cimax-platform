import Doctor from "../models/Doctor";
import Toma from "../models/Toma";
import Orden from "../models/Orden";
import { Types } from "mongoose";
import ApiError from "../utils/ApiError";
import env from "../config/env";

const checkGte = (req, res, next) => {
  const { gte, lt } = req.params;
  const start = new Date(gte);
  const end = new Date(lt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new ApiError(400, "El rango de fechas ingresado no es válido");
  }

  if (start >= end) {
    throw new ApiError(400, "La fecha inicial debe ser menor que la final");
  }

  req.dateRange = { start, end };
  return next();
};

const checkParams = async (req, res, next) => {
  const { nombres, apellidos, toma, doctor, monto, edad } = req.body;

  if (!nombres || !apellidos || !toma || !doctor || !monto || !edad) {
    throw new ApiError(400, "Olvidó ingresar algunos parámetros");
  }

  if (!Types.ObjectId.isValid(doctor)) {
    throw new ApiError(400, "El doctor introducido es inválido");
  }

  if (!Array.isArray(toma) || toma.length <= 0) {
    throw new ApiError(409, "No especificó una toma válida");
  }

  if (req.body.boleta) {
    const boletaExists = await Orden.findOne({ boletaa: req.body.boleta });
    if (boletaExists) {
      throw new ApiError(
        409,
        "Ya existe una orden con ese número de boleta"
      );
    }
  }

  return next();
};

const ordenExist = async (req, res, next) => {
  const { id } = req.params;
  const orden = await Orden.findById(id);

  if (!orden) {
    throw new ApiError(404, "Esa orden no existe");
  }

  req.orden = await orden.populate("toma doctor");
  return next();
};

const checkTomaAndDoctor = async (req, res, next) => {
  const { doctor, toma } = req.body;

  const foundDoctor = await Doctor.findById(doctor);
  if (!foundDoctor) {
    throw new ApiError(404, "El doctor introducido no es válido");
  }

  for (const tomaId of toma) {
    if (!Types.ObjectId.isValid(tomaId)) {
      throw new ApiError(400, "La toma introducida es inválida");
    }

    const foundToma = await Toma.findById(tomaId);
    if (!foundToma) {
      throw new ApiError(404, "La toma introducida no es válida");
    }
  }

  req.doctor = foundDoctor._id;
  return next();
};

const checkPwd = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(401, "Ingrese la contraseña");
  }

  if (!env.PSW || password !== env.PSW) {
    throw new ApiError(401, "Contraseña incorrecta");
  }

  return next();
};

export { checkGte, checkPwd, checkTomaAndDoctor, checkParams, ordenExist };
