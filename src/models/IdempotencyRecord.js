import { model, Schema } from "mongoose";

const IdempotencyRecordSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    bodyHash: {
      type: String,
      required: true,
    },
    statusCode: Number,
    responseBody: Schema.Types.Mixed,
    state: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

IdempotencyRecordSchema.index({ key: 1, method: 1, path: 1 }, { unique: true });
IdempotencyRecordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("IdempotencyRecord", IdempotencyRecordSchema);
