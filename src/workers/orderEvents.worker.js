import { Worker } from "bullmq";
import { closeRedisConnection, getRedisConnection } from "../queues/redis";

const worker = new Worker(
  "order-events",
  async (job) => {
    if (job.name !== "order.created") {
      throw new Error(`Unsupported job: ${job.name}`);
    }

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
};

process.on("SIGINT", () => shutdown().then(() => process.exit(0)));
process.on("SIGTERM", () => shutdown().then(() => process.exit(0)));

console.log("[order-events] worker started");
