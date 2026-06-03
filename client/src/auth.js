const STORAGE_KEY = "cimax.session";

export const roles = {
  viewer: {
    label: "Viewer",
    description: "Lectura, health, metrics y listados.",
    localKey: "local-viewer-key",
  },
  operator: {
    label: "Operator",
    description: "Crea y edita ordenes. Usa idempotency keys.",
    localKey: "local-operator-key",
  },
  admin: {
    label: "Admin",
    description: "Acceso completo, audit log y operaciones sensibles.",
    localKey: "local-admin-key",
  },
};

export const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch (_error) {
    return null;
  }
};

export const storeSession = (session) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
};
