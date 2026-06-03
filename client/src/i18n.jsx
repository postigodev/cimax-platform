import React, { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "cimax.language";

const dictionaries = {
  en: {
    common: {
      appName: "CIMAX",
      console: "Operations Console",
      save: "Save",
      saving: "Saving...",
      savedOrder: "Order saved successfully",
      savedDoctor: "Doctor saved successfully",
      yes: "Yes",
      no: "No",
      none: "None",
      signOut: "Sign out",
      activeSession: "Active session",
      language: "Language",
    },
    nav: {
      dashboard: "Dashboard",
      createOrder: "Create order",
      orders: "Orders",
      doctors: "Doctors",
      createDoctor: "Create doctor",
      metrics: "Metrics",
      audit: "Audit",
    },
    login: {
      badge: "Backend robustness demo",
      title: "Enter with a role and inspect the full operations system.",
      description:
        "This layer uses backend API keys to demonstrate RBAC, metrics, audit logs, Redis cache, BullMQ workers and idempotency without exposing secrets in the repo.",
      cardTitle: "Demo login",
      cardDescription:
        "Use a real Railway key in production or the local defaults during development.",
      name: "Name",
      apiKey: "API key",
      enter: "Enter",
      roles: {
        viewer: "Read access, health, metrics and lists.",
        operator: "Creates and edits orders. Uses idempotency keys.",
        admin: "Full access, audit log and sensitive operations.",
      },
    },
    dashboard: {
      eyebrow: "Operations",
      description:
        "Compact view of the live backend state: API, Redis cache, BullMQ, Mongo and active permissions.",
      apiHealth: "API health",
      queueFailed: "Queue failed",
      uptime: "Uptime",
      backendSignals: "Backend signals",
      visibleRobustness: "Visible robustness",
      requestsMetric: "Requests metric",
      fromMetrics: "from /metrics",
      cache: "cache",
      waitingActive: "waiting {waiting}, active {active}",
      service: "service: {service}",
    },
    order: {
      eyebrow: "Intake",
      title: "Create order",
      description:
        "A compact intake form wired to RBAC and idempotent order creation.",
      patient: "Patient",
      fulfillment: "Fulfillment",
      names: "First names",
      surnames: "Last names",
      age: "Age",
      ticket: "Ticket",
      comment: "Comment",
      amount: "Amount",
      studyTypes: "Study types",
      doctor: "Doctor",
      selectDoctor: "Select doctor",
      selectStudy: "Select one or more study types",
      cdBurned: "CD burned",
      sent: "Sent",
      printedScan: "Printed scan",
      noStudies: "No study types loaded",
      noDoctors: "No doctors loaded",
      idempotency: "Idempotency-Key is attached on submit",
      tableTitle: "Orders table",
      tableDescription:
        "Operational order ledger with filters, bulk actions and row status markers.",
      filters: "Filters",
      filterBy: "Filter by",
      applyFilter: "Filter",
      startDate: "Start date",
      endDate: "End date",
      patientSearch: "Patient name",
      ticketSearch: "Ticket",
      doctorAndStudy: "Doctor / study",
      color: "Color",
      date: "Date",
      selected: "{count} selected",
      edit: "Edit order",
      editDescription: "Update order intake, delivery flags and billing details.",
      update: "Update order",
      edited: "Order updated successfully",
      bulkDelete: "Delete selected",
      bulkDeleteTitle: "Delete selected orders",
      bulkDeleteDescription:
        "Enter the admin deletion password to remove the selected orders.",
      password: "Password",
      deleted: "Orders deleted",
      rowMarker: "Row marker",
      markerDescription: "Choose what should be visually highlighted.",
      markerBlue: "Blue",
      markerGreen: "Green",
      markerNone: "None",
      markerComment: "Comment",
      markerDoctor: "Doctor",
      paidAtClinic: "Paid at clinic",
    },
    doctor: {
      eyebrow: "Directory",
      title: "Create doctor",
      description:
        "Adds a doctor profile with agreement and discount rules used by order intake.",
      identity: "Identity",
      businessRules: "Business rules",
      firstNames: "First names",
      lastNames: "Last names",
      agreement: "Agreement",
      discount: "Discount",
      discountAmount: "Discount amount",
      tableTitle: "Doctor table",
      tableDescription:
        "Directory records used by intake, discounts and agreement rules.",
      edit: "Edit doctor",
      editDescription: "Update the doctor profile and pricing rules.",
      delete: "Delete doctor",
      deleteDescription:
        "This action is irreversible and removes the doctor from the directory.",
      deleteQuestion: "Delete {doctor}?",
      actions: "Actions",
      cancel: "Cancel",
      update: "Update",
      deleted: "Doctor deleted",
      edited: "Doctor updated successfully",
    },
    metrics: {
      eyebrow: "Observability",
      title: "Metrics",
      description: "Direct read from the backend Prometheus-style endpoint.",
      series: "Series",
      metric: "Metric",
      labels: "Labels",
      value: "Value",
    },
    audit: {
      eyebrow: "Admin",
      title: "Audit log",
      description: "Durable events written by the BullMQ worker. Admin-only.",
      recent: "Recent events",
      type: "Type",
      entity: "Entity",
      source: "Source",
      occurred: "Occurred",
    },
  },
  es: {
    common: {
      appName: "CIMAX",
      console: "Consola de operaciones",
      save: "Guardar",
      saving: "Guardando...",
      savedOrder: "Orden guardada con éxito",
      savedDoctor: "Doctor guardado con éxito",
      yes: "Sí",
      no: "No",
      none: "Ninguno",
      signOut: "Salir",
      activeSession: "Sesión activa",
      language: "Idioma",
    },
    nav: {
      dashboard: "Dashboard",
      createOrder: "Crear orden",
      orders: "Órdenes",
      doctors: "Doctores",
      createDoctor: "Crear doctor",
      metrics: "Metrics",
      audit: "Audit",
    },
    login: {
      badge: "Demo de robustez backend",
      title: "Entra con un rol y mira el sistema operativo completo.",
      description:
        "Esta capa usa API keys del backend para demostrar RBAC, metrics, audit log, cache Redis, workers BullMQ e idempotency sin exponer secretos en el repo.",
      cardTitle: "Login demo",
      cardDescription:
        "Usa una key real de Railway en producción o las defaults locales durante desarrollo.",
      name: "Nombre",
      apiKey: "API key",
      enter: "Entrar",
      roles: {
        viewer: "Lectura, health, metrics y listados.",
        operator: "Crea y edita órdenes. Usa idempotency keys.",
        admin: "Acceso completo, audit log y operaciones sensibles.",
      },
    },
    dashboard: {
      eyebrow: "Operaciones",
      description:
        "Vista compacta del estado real del backend: API, Redis cache, BullMQ, Mongo y permisos activos.",
      apiHealth: "API health",
      queueFailed: "Queue failed",
      uptime: "Uptime",
      backendSignals: "Backend signals",
      visibleRobustness: "Robustez visible",
      requestsMetric: "Requests metric",
      fromMetrics: "from /metrics",
      cache: "cache",
      waitingActive: "waiting {waiting}, active {active}",
      service: "service: {service}",
    },
    order: {
      eyebrow: "Admisión",
      title: "Crear orden",
      description:
        "Formulario compacto conectado a RBAC y creación idempotente de órdenes.",
      patient: "Paciente",
      fulfillment: "Entrega",
      names: "Nombres",
      surnames: "Apellidos",
      age: "Edad",
      ticket: "Boleta",
      comment: "Comentario",
      amount: "Monto",
      studyTypes: "Tipos de toma",
      doctor: "Doctor",
      selectDoctor: "Selecciona doctor",
      selectStudy: "Selecciona una o más tomas",
      cdBurned: "CD quemado",
      sent: "Enviado",
      printedScan: "Tomo impresa",
      noStudies: "No hay tomas cargadas",
      noDoctors: "No hay doctores cargados",
      idempotency: "Idempotency-Key se adjunta al guardar",
      tableTitle: "Tabla de órdenes",
      tableDescription:
        "Libro operativo de órdenes con filtros, acciones masivas y marcadores por fila.",
      filters: "Filtros",
      filterBy: "Filtrar por",
      applyFilter: "Filtrar",
      startDate: "Fecha inicio",
      endDate: "Fecha fin",
      patientSearch: "Nombre del paciente",
      ticketSearch: "Boleta",
      doctorAndStudy: "Doctor / toma",
      color: "Color",
      date: "Fecha",
      selected: "{count} seleccionadas",
      edit: "Editar orden",
      editDescription: "Actualiza admisión, flags de entrega y datos de cobro.",
      update: "Editar orden",
      edited: "Orden editada con éxito",
      bulkDelete: "Eliminar seleccionadas",
      bulkDeleteTitle: "Eliminar órdenes seleccionadas",
      bulkDeleteDescription:
        "Ingresa la contraseña admin de borrado para eliminar las órdenes seleccionadas.",
      password: "Contraseña",
      deleted: "Órdenes eliminadas",
      rowMarker: "Marcador de fila",
      markerDescription: "Elige qué parte debe resaltarse visualmente.",
      markerBlue: "Azul",
      markerGreen: "Verde",
      markerNone: "Ninguno",
      markerComment: "Comentario",
      markerDoctor: "Doctor",
      paidAtClinic: "Canceló en clínica",
    },
    doctor: {
      eyebrow: "Directorio",
      title: "Crear doctor",
      description:
        "Agrega un perfil médico con reglas de convenio y descuento usadas en la admisión.",
      identity: "Identidad",
      businessRules: "Reglas comerciales",
      firstNames: "Nombres",
      lastNames: "Apellidos",
      agreement: "Convenio",
      discount: "Descuento",
      discountAmount: "Monto descuento",
      tableTitle: "Tabla de doctores",
      tableDescription:
        "Registros usados por admisión, descuentos y reglas de convenio.",
      edit: "Editar doctor",
      editDescription: "Actualiza el perfil médico y sus reglas de precio.",
      delete: "Eliminar doctor",
      deleteDescription:
        "Esta acción es irreversible y elimina el doctor del directorio.",
      deleteQuestion: "¿Eliminar {doctor}?",
      actions: "Acciones",
      cancel: "Cancelar",
      update: "Editar",
      deleted: "Doctor eliminado",
      edited: "Doctor editado con éxito",
    },
    metrics: {
      eyebrow: "Observability",
      title: "Metrics",
      description: "Lectura directa del endpoint Prometheus-style del backend.",
      series: "Series",
      metric: "Metric",
      labels: "Labels",
      value: "Value",
    },
    audit: {
      eyebrow: "Admin",
      title: "Audit log",
      description: "Eventos durables escritos por el worker BullMQ. Admin-only.",
      recent: "Eventos recientes",
      type: "Type",
      entity: "Entity",
      source: "Source",
      occurred: "Occurred",
    },
  },
};

const I18nContext = createContext(null);

const getNestedValue = (source, path) =>
  path.split(".").reduce((current, part) => current?.[part], source);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "en",
  );

  const value = useMemo(() => {
    const changeLanguage = (nextLanguage) => {
      localStorage.setItem(STORAGE_KEY, nextLanguage);
      setLanguage(nextLanguage);
    };

    const t = (key, replacements = {}) => {
      const template =
        getNestedValue(dictionaries[language], key) ||
        getNestedValue(dictionaries.en, key) ||
        key;

      return Object.entries(replacements).reduce(
        (text, [name, replacement]) =>
          text.replace(`{${name}}`, String(replacement)),
        template,
      );
    };

    return { language, setLanguage: changeLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
};
