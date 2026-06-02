const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const openapi = JSON.parse(
  fs.readFileSync(path.join(root, "docs", "api", "openapi.json"), "utf8")
);

const toOpenApiPath = (routePath) => routePath.replace(/:([^/]+)/g, "{$1}");

const getApiMounts = () => {
  const source = fs.readFileSync(path.join(root, "src", "routes", "api.js"), "utf8");
  const mountRegex = /router\.use\(["']([^"']+)["'],\s*require\(["']\.\/([^"']+)["']\)\)/g;
  const mounts = [];
  let match;

  while ((match = mountRegex.exec(source))) {
    mounts.push({ prefix: match[1], file: `${match[2]}.js` });
  }

  return mounts;
};

const getImplementedRoutes = () => {
  const routes = [
    { method: "get", path: "/health" },
    { method: "get", path: "/metrics" },
  ];

  for (const mount of getApiMounts()) {
    const source = fs.readFileSync(
      path.join(root, "src", "routes", mount.file),
      "utf8"
    );
    const routeRegex = /router\.(get|post|put|delete)\(\s*["']([^"']+)["']/g;
    let match;

    while ((match = routeRegex.exec(source))) {
      routes.push({
        method: match[1],
        path: toOpenApiPath(`/v1${mount.prefix}${match[2]}`),
      });
    }
  }

  return routes.sort((a, b) => `${a.method} ${a.path}`.localeCompare(`${b.method} ${b.path}`));
};

test("OpenAPI document has required top-level structure", () => {
  assert.equal(openapi.openapi, "3.0.3");
  assert.ok(openapi.info.title);
  assert.ok(openapi.paths);
  assert.ok(openapi.components.schemas.Error);
});

test("implemented routes are documented in OpenAPI", () => {
  const implementedRoutes = getImplementedRoutes();
  const missing = implementedRoutes.filter(
    (route) => !openapi.paths[route.path]?.[route.method]
  );

  assert.deepEqual(missing, []);
});

test("OpenAPI does not document stale routes", () => {
  const implemented = new Set(
    getImplementedRoutes().map((route) => `${route.method.toUpperCase()} ${route.path}`)
  );
  const documented = [];

  for (const [routePath, pathItem] of Object.entries(openapi.paths)) {
    for (const method of ["get", "post", "put", "delete"]) {
      if (pathItem[method]) {
        documented.push(`${method.toUpperCase()} ${routePath}`);
      }
    }
  }

  const stale = documented.filter((route) => !implemented.has(route));

  assert.deepEqual(stale, []);
});

test("path parameters match their OpenAPI path templates", () => {
  const mismatches = [];

  for (const [routePath, pathItem] of Object.entries(openapi.paths)) {
    const requiredNames = [...routePath.matchAll(/\{([^}]+)\}/g)].map(
      (match) => match[1]
    );

    for (const method of ["get", "post", "put", "delete"]) {
      const operation = pathItem[method];
      if (!operation) continue;

      const parameterNames = (operation.parameters || [])
        .map((parameter) => {
          if (!parameter.$ref) return parameter.name;
          const refName = parameter.$ref.split("/").at(-1);
          return openapi.components.parameters[refName]?.name;
        })
        .filter(Boolean);

      for (const name of requiredNames) {
        if (!parameterNames.includes(name)) {
          mismatches.push(`${method.toUpperCase()} ${routePath} missing ${name}`);
        }
      }
    }
  }

  assert.deepEqual(mismatches, []);
});
