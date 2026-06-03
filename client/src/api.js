import axios from "axios";
import { CONFIG } from "./config";
import { getStoredSession } from "./auth";

export const api = axios.create({
  baseURL: CONFIG.DOMAIN,
});

export const applyApiSession = (session = getStoredSession()) => {
  if (session?.apiKey) {
    axios.defaults.headers.common["x-api-key"] = session.apiKey;
    api.defaults.headers.common["x-api-key"] = session.apiKey;
  } else {
    delete axios.defaults.headers.common["x-api-key"];
    delete api.defaults.headers.common["x-api-key"];
  }
};

api.interceptors.request.use((config) => {
  const session = getStoredSession();

  if (session?.apiKey) {
    config.headers["x-api-key"] = session.apiKey;
  }

  return config;
});

export const apiRoot = CONFIG.DOMAIN.replace(/\/v1\/?$/, "");

export const fetchMetrics = async () => {
  const response = await fetch(`${apiRoot}/metrics`);
  return response.text();
};

export const fetchHealth = async () => {
  const response = await fetch(`${apiRoot}/health`);
  return response.json();
};
