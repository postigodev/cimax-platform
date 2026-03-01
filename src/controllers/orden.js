import Orden from "../models/Orden";
import Toma from "../models/Toma";
import { v4 } from "uuid";

const styles = ["#00a000", "cyan", "#fff"];

const getOrdens = async (req, res) => {
  const { gte, lt } = req.params;
  const ordenes = await Orden.find({ date: { $gte: gte, $lt: lt } })
    .populate("doctor")
    .populate("toma")
    .sort({ date: 1 });
  if (!ordenes)
    return res.status(404).json({
      status: 404,
      message: "No se han encontrado órdenes dentro de ese rango de fechas",
    });
  return res.json({ status: 200, ordenes_length: ordenes.length, ordenes });
};

const getOrdenByToma = async (req, res) => {
  const { toma, gte, lt } = req.params;
  try {
    const ordenes = await Orden.find({ toma, date: { $gte: gte, $lt: lt } })
      .populate("doctor")
      .populate("toma")
      .sort({ date: 1 });
    if (ordenes.length <= 0)
      return res.status(404).json({
        status: 404,
        message: "No se han encontrado órdenes con esa toma",
      });
    return res.json({ status: 200, ordenes_length: ordenes.length, ordenes });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};

const getOrdenByDoctor = async (req, res) => {
  const { doctor, gte, lt } = req.params;
  try {
    const ordenes = await Orden.find({ doctor, date: { $gte: gte, $lt: lt } })
      .populate("doctor")
      .populate("toma")
      .sort({ date: 1 });
    if (ordenes.length <= 0)
      return res.status(404).json({
        status: 404,
        message: "No se han encontrado órdenes de ese doctor",
      });
    return res.json({ status: 200, ordenes_length: ordenes.length, ordenes });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};

const getOrdenByDoctorAndToma = async (req, res) => {
  const { doctor, toma, gte, lt } = req.params;
  try {
    let ordenes = await Orden.find({ doctor, date: { $gte: gte, $lt: lt } })
      .populate("toma")
      .populate("doctor");
    ordenes = ordenes.filter((o) =>
      o.toma.map((t) => String(t._id)).includes(toma)
    );
    if (ordenes.length <= 0)
      return res.status(404).json({
        status: 404,
        message: "No se han encontrado órdenes de ese doctor con esa toma",
      });
    return res.json({ status: 200, ordenes_length: ordenes.length, ordenes });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};

const getOrdenByColor = async (req, res) => {
  try {
    const { gte, lt } = req.params;
    const ordenes = await Orden.find({
      doctor_color: true,
      date: { $gte: gte, $lt: lt },
    })
      .populate("doctor")
      .populate("toma");
    if (ordenes.length <= 0)
      return res.status(404).json({
        status: 404,
        message:
          "No se han encontrado órdenes naranjas dentro de ese rango de fechas",
      });
    return res.json({ status: 200, ordenes });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};

const getOrdenByBoleta = async (req, res) => {
  const { boleta } = req.params;
  try {
    const ordenes = await Orden.find({ boletaa: boleta })
      .populate("doctor")
      .populate("toma");
    if (ordenes.length <= 0)
      return res.status(404).json({
        status: 404,
        message: "No se encontró una orden con esa boleta",
      });
    return res.json({ status: 200, ordenes_length: ordenes.length, ordenes });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};

const bulkDeleteOrdens = async (req, res) => {
  const { ids } = req.body;
  if (ids.length <= 0)
    return res
      .status(400)
      .json({ status: 400, message: "No ha seleccionado ninguna orden" });
  try {
    for (let i = 0; i < ids.length; i++) {
      const orden = await Orden.findByIdAndDelete(ids[i]);
      if (!orden) continue;
    }
    return res
      .status(201)
      .json({ status: 201, message: "Orden eliminada con éxito" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};

const getOrdenByPaciente = async (req, res) => {
  const { paciente } = req.params;
  try {
    let ordenes = await Orden.find().populate("doctor").populate("toma");
    ordenes = ordenes.filter(
      (o) =>
        o.nombres.toLowerCase().includes(paciente.toLowerCase()) ||
        o.apellidos.toLowerCase().includes(paciente.toLowerCase())
    );
    if (ordenes.length <= 0)
      return res.status(404).json({
        status: 404,
        message: "No se han encontrado órdenes de ese paciente",
      });
    return res.json({ status: 200, ordenes_length: ordenes.length, ordenes });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};

const getOrdenByUSB = async (req, res) => {
  const { gte, lt } = req.params;
  const ordenes = await Orden.find({
    usb: true,
    date: { $gte: gte, $lt: lt },
  })
    .populate("doctor")
    .populate("toma");
  if (ordenes.length <= 0)
    return res.status(404).json({
      status: 404,
      message: "No se ha encontrado órdenes con USB entre esas fechas",
    });
  return res.json({ status: 200, ordenes });
};

/* post */
const postOrden = async (req, res) => {
  let {
    nombres,
    apellidos,
    toma,
    doctor,
    monto,
    cd_quemado,
    edad,
    usb,
    enviado,
    tomo_impresa
  } = req.body;
  try {
    let color;
    
    for (let t of toma) {
      const foundToma = await Toma.findById(t);
      const getColor = (name) => foundToma.nombre.toLowerCase().includes(name);
      if (getColor("tomografia") || getColor("tomografía")) {
        color = styles[0];
        break;
      } else if (getColor("analisis") || getColor("fotos")) {
        color = styles[1];
        break;
      } else {
        color = styles[2];
      }
    }
    const newOrden = new Orden({
      nombres,
      apellidos,
      comentario: req.body.comentario || null,
      toma,
      doctor,
      boleta: v4(),
      boletaa: req.body.boleta || null,
      edad,
      color,
      cd_quemado,
      usb,
      monto,
      enviado,
      tomo_impresa,
      date: new Date(),
    });
    await newOrden.save();
    return res.status(201).json({ status: 201, orden: newOrden });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "Ocurrió un error inesperado" });
  }
};
/* put */
const editOrden = async (req, res) => {
  const {
    nombres,
    apellidos,
    toma,
    doctor,
    boleta,
    monto,
    edad,
    cd_quemado,
    comentario,
    usb,
    enviado,
    tomo_impresa
  } = req.body;

  try {
    let { orden } = req;
    orden.nombres = nombres || orden.nombres;
    orden.apellidos = apellidos || orden.apellidos;
    orden.toma = toma.length !== 0 ? toma : orden.toma;
    orden.doctor = doctor || orden.doctor;
    orden.boletaa = boleta || orden.boletaa;
    orden.cd_quemado = cd_quemado;
    orden.usb = usb;
    orden.tomo_impresa = tomo_impresa;
    orden.comentario = comentario || orden.comentario;
    orden.monto = monto || orden.monto;
    orden.edad = edad || orden.edad;
    orden.enviado = enviado;
    orden = await orden.save();
    orden = await orden.populate("toma doctor");
    return res.status(201).json({ status: 201, orden });
  } catch (e) {
    return res
      .status(500)
      .json({ status: 500, message: "Ocurrió un error inesperado" });
  }
};

const editOrderColor = async (req, res) => {
  const { orden } = req;
  const { color } = req.body;

  if (!color)
    return res
      .status(409)
      .json({ status: 409, message: "No se ha seleccionado un color válido" });
  if (!styles.includes(color))
    return res
      .status(409)
      .json({ status: 409, message: "Ese color es inválido" });
  orden.color = color;
  await orden.save();
  return res.status(201).json({ status: 201, orden });
};

const editDoctorColor = async (req, res) => {
  const { orden } = req;
  orden.doctor_color = !orden.doctor_color;
  await orden.save();
  return res.status(201).json({ status: 201, orden });
};

const editCommentColor = async (req, res) => {
  const { orden } = req;
  orden.comment_color = !orden.comment_color;
  await orden.save();
  return res.status(201).json({ status: 201, orden });
};

export {
  getOrdenByDoctor,
  getOrdens,
  postOrden,
  getOrdenByToma,
  getOrdenByPaciente,
  getOrdenByBoleta,
  getOrdenByUSB,
  bulkDeleteOrdens,
  editOrden,
  editOrderColor,
  editDoctorColor,
  editCommentColor,
  getOrdenByDoctorAndToma,
  getOrdenByColor,
};
