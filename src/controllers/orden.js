import Orden from "../models/Orden";
import Toma from "../models/Toma";
import { v4 } from "uuid";
import ApiError from "../utils/ApiError";
import { getPagination, getPaginationMeta } from "../utils/pagination";
import { completeIdempotency } from "../middlewares/idempotency.middlewares";
import { enqueueOrderCreated } from "../queues/orderEvents.queue";
import {
  cacheHeaders,
  cacheKey,
  getCachedJson,
  invalidateCachePattern,
  requestCacheKey,
  setCachedJson,
} from "../cache/redisCache";

const styles = ["#00a000", "cyan", "#fff"];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const orderCachePattern = cacheKey("ordenes", "*");

const invalidateOrderCaches = async () => {
  await invalidateCachePattern(orderCachePattern);
};

const sendPaginatedOrdenes = async (req, res, filter, sort = { date: 1 }) => {
  const key = requestCacheKey("ordenes", req);
  const cached = await getCachedJson(key);

  if (cached) {
    res.set("X-Cache", cacheHeaders.hit);
    return res.json(cached);
  }

  const { page, limit, skip } = getPagination(req.query);
  const [ordenes, total] = await Promise.all([
    Orden.find(filter)
      .populate("doctor")
      .populate("toma")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Orden.countDocuments(filter),
  ]);

  const responseBody = {
    status: 200,
    ordenes_length: ordenes.length,
    total,
    pagination: getPaginationMeta({ total, page, limit }),
    ordenes,
  };

  await setCachedJson(key, responseBody);
  res.set("X-Cache", cacheHeaders.miss);
  return res.json(responseBody);
};

const dateFilter = (req) => ({
  date: { $gte: req.dateRange.start, $lt: req.dateRange.end },
});

const getOrdens = async (req, res) =>
  sendPaginatedOrdenes(req, res, dateFilter(req));

const getOrdenByToma = async (req, res) =>
  sendPaginatedOrdenes(req, res, {
    toma: req.params.toma,
    ...dateFilter(req),
  });

const getOrdenByDoctor = async (req, res) =>
  sendPaginatedOrdenes(req, res, {
    doctor: req.params.doctor,
    ...dateFilter(req),
  });

const getOrdenByDoctorAndToma = async (req, res) =>
  sendPaginatedOrdenes(req, res, {
    doctor: req.params.doctor,
    toma: req.params.toma,
    ...dateFilter(req),
  });

const getOrdenByColor = async (req, res) =>
  sendPaginatedOrdenes(req, res, {
    doctor_color: true,
    ...dateFilter(req),
  });

const getOrdenByBoleta = async (req, res) => {
  const { boleta } = req.params;
  const ordenes = await Orden.find({ boletaa: boleta })
    .populate("doctor")
    .populate("toma");

  if (ordenes.length <= 0) {
    throw new ApiError(404, "No se encontró una orden con esa boleta");
  }

  return res.json({ status: 200, ordenes_length: ordenes.length, ordenes });
};

const bulkDeleteOrdens = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length <= 0) {
    throw new ApiError(400, "No ha seleccionado ninguna orden");
  }

  const result = await Orden.deleteMany({ _id: { $in: ids } });
  await invalidateOrderCaches();

  return res.status(201).json({
    status: 201,
    message: "Órdenes eliminadas con éxito",
    deleted_count: result.deletedCount,
  });
};

const getOrdenByPaciente = async (req, res) => {
  const paciente = escapeRegex(req.params.paciente);

  return sendPaginatedOrdenes(req, res, {
    $or: [
      { nombres: { $regex: paciente, $options: "i" } },
      { apellidos: { $regex: paciente, $options: "i" } },
    ],
  });
};

const getOrdenByUSB = async (req, res) =>
  sendPaginatedOrdenes(req, res, {
    usb: true,
    ...dateFilter(req),
  });

const postOrden = async (req, res) => {
  const {
    nombres,
    apellidos,
    toma,
    doctor,
    monto,
    cd_quemado,
    edad,
    usb,
    enviado,
    tomo_impresa,
  } = req.body;

  let color = styles[2];

  for (const tomaId of toma) {
    const foundToma = await Toma.findById(tomaId);
    const tomaName = foundToma.nombre.toLowerCase();

    if (tomaName.includes("tomografia") || tomaName.includes("tomografía")) {
      color = styles[0];
      break;
    }

    if (tomaName.includes("analisis") || tomaName.includes("fotos")) {
      color = styles[1];
      break;
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
  const job = await enqueueOrderCreated(newOrden);
  await invalidateOrderCaches();
  const responseBody = { status: 201, orden: newOrden };
  if (job) {
    responseBody.job = { queue: "order-events", id: job.id };
  }
  await completeIdempotency(req, 201, responseBody);
  return res.status(201).json(responseBody);
};

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
    tomo_impresa,
  } = req.body;

  let { orden } = req;
  orden.nombres = nombres || orden.nombres;
  orden.apellidos = apellidos || orden.apellidos;
  orden.toma = Array.isArray(toma) && toma.length !== 0 ? toma : orden.toma;
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
  await invalidateOrderCaches();

  return res.status(201).json({ status: 201, orden });
};

const editOrderColor = async (req, res) => {
  const { orden } = req;
  const { color } = req.body;

  if (!color) {
    throw new ApiError(409, "No se ha seleccionado un color válido");
  }

  if (!styles.includes(color)) {
    throw new ApiError(409, "Ese color es inválido");
  }

  orden.color = color;
  await orden.save();
  await invalidateOrderCaches();

  return res.status(201).json({ status: 201, orden });
};

const editDoctorColor = async (req, res) => {
  const { orden } = req;
  orden.doctor_color = !orden.doctor_color;
  await orden.save();
  await invalidateOrderCaches();

  return res.status(201).json({ status: 201, orden });
};

const editCommentColor = async (req, res) => {
  const { orden } = req;
  orden.comment_color = !orden.comment_color;
  await orden.save();
  await invalidateOrderCaches();

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
