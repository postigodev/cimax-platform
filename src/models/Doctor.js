import { Schema, model, Types } from "mongoose";

const DoctorSchema = new Schema({
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  convenio: {
    type: Boolean,
    default: false,
  },
  descuento: {
    type: Boolean,
    default: false,
  },
  monto_descuento: Number,
});

export default model("Doctor", DoctorSchema);
