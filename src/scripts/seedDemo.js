import mongoose from "mongoose";
import "../db";
import Doctor from "../models/Doctor";
import Orden from "../models/Orden";
import Toma from "../models/Toma";

const tomas = [
  { nombre: "TOMOGRAFIA 1 MAXILAR USB", n: 9001 },
  { nombre: "TOMOGRAFIA BIMAXILAR USB", n: 9002 },
  { nombre: "ANALISIS FOTOGRAFICO", n: 9003 },
  { nombre: "FOTOS INTRAORALES", n: 9004 },
  { nombre: "MODELOS DIGITALES", n: 9005 },
];

const doctors = [
  {
    nombres: "Andrea",
    apellidos: "Demo",
    convenio: true,
    descuento: false,
  },
  {
    nombres: "Mateo",
    apellidos: "Demo",
    convenio: false,
    descuento: true,
    monto_descuento: 15,
  },
  {
    nombres: "Lucia",
    apellidos: "Demo",
    convenio: true,
    descuento: true,
    monto_descuento: 20,
  },
];

const daysAgo = (days) => {
  const date = new Date();
  date.setHours(10, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
};

const seed = async () => {
  await Orden.deleteMany({ boletaa: /^DEMO-/ });
  await Doctor.deleteMany({ apellidos: "Demo" });
  await Toma.deleteMany({ n: { $gte: 9000 } });

  const createdTomas = await Toma.insertMany(tomas);
  const createdDoctors = await Doctor.insertMany(doctors);

  const [tomografia, bimaxilar, analisis, fotos, modelos] = createdTomas;
  const [andrea, mateo, lucia] = createdDoctors;

  const orders = [
    {
      nombres: "Camila",
      apellidos: "Rivera",
      edad: 31,
      doctor: andrea._id,
      toma: [tomografia],
      boletaa: "DEMO-1001",
      boleta: "DEMO-UUID-1001",
      monto: 80,
      usb: true,
      cd_quemado: true,
      enviado: false,
      tomo_impresa: false,
      comentario: "Demo: entrega por USB",
      color: "#00a000",
      doctor_color: true,
      date: daysAgo(0),
    },
    {
      nombres: "Javier",
      apellidos: "Morales",
      edad: 44,
      doctor: mateo._id,
      toma: [bimaxilar, analisis],
      boletaa: "DEMO-1002",
      boleta: "DEMO-UUID-1002",
      monto: 125,
      usb: false,
      cd_quemado: true,
      enviado: true,
      tomo_impresa: true,
      comentario: "Demo: caso enviado",
      color: "cyan",
      comment_color: true,
      date: daysAgo(1),
    },
    {
      nombres: "Sofia",
      apellidos: "Castillo",
      edad: 27,
      doctor: lucia._id,
      toma: [fotos],
      boletaa: "DEMO-1003",
      boleta: "DEMO-UUID-1003",
      monto: 45,
      usb: false,
      cd_quemado: false,
      enviado: false,
      tomo_impresa: false,
      comentario: "Demo: fotos de control",
      color: "cyan",
      date: daysAgo(3),
    },
    {
      nombres: "Diego",
      apellidos: "Paredes",
      edad: 52,
      doctor: andrea._id,
      toma: [modelos],
      boletaa: "DEMO-1004",
      boleta: "DEMO-UUID-1004",
      monto: 60,
      usb: true,
      cd_quemado: false,
      enviado: true,
      tomo_impresa: false,
      comentario: "Demo: modelos digitales",
      color: "#fff",
      date: daysAgo(7),
    },
  ];

  await Orden.insertMany(orders);

  console.log(
    `Seeded ${createdDoctors.length} doctors, ${createdTomas.length} tomas, ${orders.length} orders.`
  );
};

seed()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error("Demo seed failed", error);
    await mongoose.disconnect();
    process.exit(1);
  });
