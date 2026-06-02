import { Queue } from "bullmq";
import env from "../config/env";
import { getRedisConnection } from "./redis";

let orderEventsQueue;

const getOrderEventsQueue = () => {
  if (!env.QUEUES.ENABLED) {
    return null;
  }

  if (!orderEventsQueue) {
    orderEventsQueue = new Queue("order-events", {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1_000,
        },
        removeOnComplete: {
          age: 24 * 60 * 60,
          count: 1_000,
        },
        removeOnFail: {
          age: 7 * 24 * 60 * 60,
          count: 1_000,
        },
      },
    });
  }

  return orderEventsQueue;
};

export const closeOrderEventsQueue = async () => {
  if (orderEventsQueue) {
    await orderEventsQueue.close();
    orderEventsQueue = undefined;
  }
};

export const enqueueOrderCreated = async (orden) => {
  const queue = getOrderEventsQueue();

  if (!queue) {
    return null;
  }

  return queue.add(
    "order.created",
    {
      orderId: String(orden._id),
      boleta: orden.boletaa,
      doctorId: String(orden.doctor),
      tomaIds: orden.toma.map((tomaId) => String(tomaId)),
      createdAt: new Date().toISOString(),
    },
    {
      jobId: `order-created-${orden._id}`,
    }
  );
};

export const getOrderEventsQueueHealth = async () => {
  const queue = getOrderEventsQueue();

  if (!queue) {
    return { enabled: false };
  }

  const [waiting, active, delayed, failed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getDelayedCount(),
    queue.getFailedCount(),
  ]);

  return {
    enabled: true,
    waiting,
    active,
    delayed,
    failed,
  };
};

export default getOrderEventsQueue;
