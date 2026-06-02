import { model, Schema } from "mongoose";

const AuditEventSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    actor: {
      type: String,
      default: "system",
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
    occurredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

AuditEventSchema.index({ occurredAt: -1 });
AuditEventSchema.index({ type: 1, occurredAt: -1 });
AuditEventSchema.index({ entityType: 1, entityId: 1, occurredAt: -1 });

export default model("AuditEvent", AuditEventSchema);
