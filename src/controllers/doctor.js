import Doctor from "../models/Doctor";
import Toma from "../models/Toma";
import {
  cacheHeaders,
  cacheKey,
  getCachedJson,
  invalidateCachePattern,
  setCachedJson,
} from "../cache/redisCache";

const doctorCachePattern = cacheKey("doctores", "*");
const orderCachePattern = cacheKey("ordenes", "*");

const invalidateDoctorCaches = async () => {
  await Promise.all([
    invalidateCachePattern(doctorCachePattern),
    invalidateCachePattern(orderCachePattern),
  ]);
};

const getTomas = async (req, res) => {
  const key = cacheKey("doctores", "tomas");
  const cached = await getCachedJson(key);

  if (cached) {
    res.set("X-Cache", cacheHeaders.hit);
    return res.json(cached);
  }

  const tomas = await Toma.find().sort({ n: 1 });
  const responseBody = { status: 200, tomas };
  await setCachedJson(key, responseBody);
  res.set("X-Cache", cacheHeaders.miss);
  return res.json(responseBody);
};

const getDoctors = async (req, res) => {
  const key = cacheKey("doctores", "all");
  const cached = await getCachedJson(key);

  if (cached) {
    res.set("X-Cache", cacheHeaders.hit);
    return res.json(cached);
  }

  const doctores = await Doctor.find().sort({ nombres: 1, apellidos: 1 });
  const responseBody = { status: 200, doctores };
  await setCachedJson(key, responseBody);
  res.set("X-Cache", cacheHeaders.miss);
  return res.json(responseBody);
};

const createDoctor = async (req, res) => {
  const { nombres, apellidos, convenio, descuento, monto_descuento } = req.body;
  try {
    const newDoctor = new Doctor({
      nombres,
      apellidos,
      convenio,
      descuento,
      monto_descuento,
    });
    await newDoctor.save();
    await invalidateDoctorCaches();
    return res.status(201).json({ status: 201, doctor: newDoctor });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 201, message: "Ocurrió un error inesperado" });
  }
};

const editDoctor = async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, convenio, descuento, monto_descuento } = req.body;
  try {
    const doctor = await Doctor.findById(id);
    if (!doctor)
      return res
        .status(404)
        .json({ status: 404, message: "Ese doctor no existe" });

    doctor.nombres = nombres || doctor.nombres;
    doctor.apellidos = apellidos || doctor.apellidos;
    doctor.convenio = convenio;
    doctor.descuento = descuento;
    doctor.monto_descuento = descuento ? monto_descuento : null;

    await doctor.save();
    await invalidateDoctorCaches();
    return res.status(201).json({ status: 201, doctor });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 500, message: "Ocurrió un error inesperado" });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    await Doctor.findByIdAndDelete(id);
    await invalidateDoctorCaches();
    return res
      .status(201)
      .json({ status: 201, message: "Doctor eliminado correctamente" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 500, message: "Ocurrió un error inesperado" });
  }
};

export { createDoctor, editDoctor, getDoctors, getTomas, deleteDoctor };
