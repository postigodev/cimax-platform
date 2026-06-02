const assert = require("node:assert/strict");
const test = require("node:test");

process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cimax-test";

const { migrations } = require("../dist/scripts/dbMigrate.js");

test("database migrations have unique ordered IDs", () => {
  const ids = migrations.map((migration) => migration.id);
  const uniqueIds = new Set(ids);
  const sortedIds = [...ids].sort();

  assert.equal(uniqueIds.size, ids.length);
  assert.deepEqual(ids, sortedIds);
});

test("database migrations define descriptions and up functions", () => {
  for (const migration of migrations) {
    assert.match(migration.id, /^\d{12}_[a-z0-9_]+$/);
    assert.equal(typeof migration.description, "string");
    assert.ok(migration.description.length > 0);
    assert.equal(typeof migration.up, "function");
  }
});
