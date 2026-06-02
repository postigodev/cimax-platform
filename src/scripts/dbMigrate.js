import mongoose from "mongoose";
import env from "../config/env";

mongoose.set("strictQuery", false);

const migrations = [
  {
    id: "202606010001_core_indexes",
    description: "Create core read-path indexes for orders, doctors, and procedures.",
    up: async (db) => {
      await db.collection("ordens").createIndex({ date: 1 });
      await db.collection("ordens").createIndex({ doctor: 1, date: 1 });
      await db.collection("ordens").createIndex({ toma: 1, date: 1 });
      await db.collection("ordens").createIndex({ boletaa: 1 });
      await db.collection("ordens").createIndex({ doctor_color: 1, date: 1 });
      await db.collection("ordens").createIndex({ usb: 1, date: 1 });
      await db.collection("ordens").createIndex({ nombres: "text", apellidos: "text" });
      await db.collection("tomas").createIndex({ n: 1 }, { unique: true });
      await db.collection("doctors").createIndex({ apellidos: 1, nombres: 1 });
    },
  },
  {
    id: "202606010002_idempotency_records",
    description: "Create idempotency record indexes and TTL cleanup.",
    up: async (db) => {
      await db
        .collection("idempotencyrecords")
        .createIndex({ key: 1, method: 1, path: 1 }, { unique: true });
      await db
        .collection("idempotencyrecords")
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    },
  },
];

const acquireLock = async (db) => {
  const locks = db.collection("migration_locks");
  const staleBefore = new Date(Date.now() - 15 * 60 * 1000);

  await locks.deleteMany({ _id: "db-migrate", lockedAt: { $lt: staleBefore } });
  await locks.insertOne({ _id: "db-migrate", lockedAt: new Date() });
};

const releaseLock = async (db) => {
  await db.collection("migration_locks").deleteOne({ _id: "db-migrate" });
};

const run = async () => {
  await mongoose.connect(env.MONGO_URI);
  const db = mongoose.connection.db;
  const applied = db.collection("schema_migrations");

  try {
    await acquireLock(db);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Another migration run is already in progress");
    }

    throw error;
  }

  try {
    await applied.createIndex({ id: 1 }, { unique: true });

    for (const migration of migrations) {
      const existing = await applied.findOne({ id: migration.id });

      if (existing) {
        console.log(`Skipping ${migration.id}: already applied`);
        continue;
      }

      console.log(`Applying ${migration.id}: ${migration.description}`);
      const startedAt = new Date();
      await migration.up(db);
      await applied.insertOne({
        id: migration.id,
        description: migration.description,
        startedAt,
        appliedAt: new Date(),
      });
      console.log(`Applied ${migration.id}`);
    }

    console.log("Database migrations complete");
  } finally {
    await releaseLock(db);
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  run().catch(async (error) => {
    console.error("Database migration failed", error);
    await mongoose.disconnect();
    process.exit(1);
  });
}

export { migrations, run };
