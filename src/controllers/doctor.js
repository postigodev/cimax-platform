import Doctor from "../models/Doctor";
import Toma from "../models/Toma";

const getTomas = async (req, res) => {
  const tomas = await Toma.find().sort({ n: 1 });
  return res.json({ status: 200, tomas });
};

const getDoctors = async (req, res) => {
  const doctores = await Doctor.find().sort({ nombres: 1, apellidos: 1 });
  return res.json({ status: 200, doctores });
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
