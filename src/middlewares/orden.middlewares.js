import Doctor from "../models/Doctor";
import Toma from "../models/Toma";
import Orden from "../models/Orden";
import { Types } from "mongoose";
import { config } from "dotenv";
config();
const checkGte = (req, res, next) => {
  const { gte, lt } = req.params;
  if (!Date.parse(gte) || !Date.parse(lt))
    return res.status(400).json({
      status: 400,
      message: "El rango de fechas ingresado no es válido",
    });
  return next();
};

const checkParams = async (req, res, next) => {
  let { nombres, apellidos, toma, doctor, monto, edad } = req.body;
  if (!nombres || !apellidos || !toma || !doctor || !monto || !edad)
    return res
      .status(400)
      .json({ status: 400, message: "Olvidó ingresar algunos parámetros" });
  if (!Types.ObjectId.isValid(doctor))
    return res
      .status(400)
      .json({ status: 400, message: "El doctor introducido es inválido" });

  if (toma.length <= 0)
    return res
      .status(409)
      .json({ status: 409, message: "No especificó una toma válida" });

  if (req.body.boleta || req.body.boleta !== "") {
    const boletaExists = await Orden.findOne({ boletaa: req.body.boleta });
    if (boletaExists)
      return res.status(409).json({
        status: 409,
        message: "Ya existe una orden con ese número de boleta",
      });
  }

  return next();
};

const ordenExist = async (req, res, next) => {
  const { id } = req.params;
  const orden = await Orden.findById(id);
  if (!orden)
    return res
      .status(404)
      .json({ status: 404, message: "Esa orden no existe" });
  req.orden = await orden.populate("toma doctor");
  return next();
};

const checkTomaAndDoctor = async (req, res, next) => {
  const { doctor, toma } = req.body;

  const foundDoctor = await Doctor.findById(doctor);
  if (!foundDoctor)
    return res
      .status(404)
      .json({ status: 404, message: "El doctor introducido no es válido" });

  for (let i = 0; i < toma.length; i++) {
    if (!Types.ObjectId.isValid(toma))
      return res
        .status(400)
        .json({ status: 400, message: "La toma introducida es inválida" });
    const foundToma = await Toma.findById(toma);
    if (!foundToma)
      return res
        .status(404)
        .json({ status: 404, message: "La toma introducida no es válida" });
  }
  req.doctor = foundDoctor._id;
  return next();
};

const checkPwd = (req, res, next) => {
  const { password } = req.body;
  if (!password)
    return res
      .status(401)
      .json({ status: 401, message: "Ingrese la contaseña" });
  if (password !== process.env.PSW)
    return res
      .status(401)
      .json({ status: 401, message: "Contraseña incorrecta" });
  return next();
};

export {
  checkGte,
  checkPwd,
  checkTomaAndDoctor,
  checkParams,
  ordenExist
};
