import { model, Schema, Types } from "mongoose";

const OrdenSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  edad: Number,
  comentario: String,
  toma: [
    {
      type: Types.ObjectId,
      ref: "Toma",
    },
  ],
  doctor: {
    type: Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  boletaa: String,
  cd_quemado: {
    type: Boolean,
    default: true,
  },
  usb: {
    type: Boolean,
    default: false,
  },
  enviado: {
    type: Boolean,
    default: false,
  },
  tomo_impresa: {
    type: Boolean,
    default: false
  },
  monto: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    default: "#fff",
  },
  doctor_color: {
    type: Boolean,
    default: false,
  },
  comment_color: {
    type: Boolean,
    default: false,
  },
  boleta: String
});

export default model("Orden", OrdenSchema);
