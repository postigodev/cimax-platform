import { Worker } from "bullmq";
import mongoose from "mongoose";
import env from "../config/env";
import AuditEvent from "../models/AuditEvent";
import { closeRedisConnection, getRedisConnection } from "../queues/redis";

mongoose.set("strictQuery", false);

const worker = new Worker(
  "order-events",
  async (job) => {
    if (job.name !== "order.created") {
      throw new Error(`Unsupported job: ${job.name}`);
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(env.MONGO_URI);
    }

    await AuditEvent.create({
      type: "order.created",
      actor: "system",
      entityType: "order",
      entityId: job.data.orderId,
      source: "order-events-worker",
      payload: {
        jobId: job.id,
        boleta: job.data.boleta,
        doctorId: job.data.doctorId,
        tomaIds: job.data.tomaIds,
        createdAt: job.data.createdAt,
      },
      occurredAt: new Date(job.data.createdAt),
    });

    console.log("[order-events] order.created", {
      jobId: job.id,
      orderId: job.data.orderId,
      boleta: job.data.boleta,
    });

    return {
      processedAt: new Date().toISOString(),
    };
  },
  {
    connection: getRedisConnection(),
    concurrency: Number(process.env.ORDER_EVENTS_WORKER_CONCURRENCY || 5),
  }
);

worker.on("completed", (job) => {
  console.log("[order-events] completed", job.id);
});

worker.on("failed", (job, error) => {
  console.error("[order-events] failed", job?.id, error);
});

const shutdown = async () => {
  await worker.close();
  await closeRedisConnection();
  await mongoose.disconnect();
};

process.on("SIGINT", () => shutdown().then(() => process.exit(0)));
process.on("SIGTERM", () => shutdown().then(() => process.exit(0)));

console.log("[order-events] worker started");
