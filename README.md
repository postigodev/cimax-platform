🔒 **Sanitized Public Snapshot**

This repository is a sanitized public version of a paid internal tool built for a healthcare services provider.  
All proprietary data, operational records, and secrets have been removed.

# CIMAX – Internal Order & Doctor Management Platform

> Sanitized public version of a paid internal tool built for a small healthcare-related business.
> All proprietary data, branding, and secrets have been removed.

## Overview

CIMAX is a production-grade MERN application built to support internal operational workflows for a healthcare services provider.

The platform centralizes order tracking, doctor management, and procedure classification into a single relational system backed by MongoDB. It was designed to replace manual tracking processes and provide structured filtering across time ranges, personnel, and procedure types.

The system was developed over ~3 months as a contracted full-stack engagement and deployed for internal operational use.

---

## Tech Stack

### Backend

* Node.js
* Express
* MongoDB + Mongoose
* SWC (server transpilation)
* UUID
* Helmet
* Morgan
* CORS

### Frontend

* React
* React Router
* SCSS
* Axios (via config abstraction)

---

## Architecture

The project follows a modular backend structure:

```
src/
  controllers/
  models/
  routes/
  middlewares/
  lib/
```
The backend follows a layered structure separating routing, business logic, and validation concerns. Controllers encapsulate domain operations while middleware enforces request integrity and business constraints before reaching persistence logic.
### Core Domain Models

* **Doctor**
* **Orden** (Order)
* **Toma** (Procedure / Imaging type)

Relations:

* An `Orden` references:

  * a `Doctor`
  * one or multiple `Toma` entries
* Dynamic population via Mongoose `.populate()`

---

## Key Features

### 1. Order Lifecycle Management

* Create orders
* Edit order metadata
* Bulk delete
* Color-coding system for workflow visualization
* Auto-generated UUID identifiers
* Manual override for billing IDs

Each order stores:

* Patient name
* Age
* Doctor reference
* Procedures ("tomas")
* Billing flags (USB / CD / printed)
* Delivery status
* Timestamped creation date

---

### 2. Multi-Criteria Filtering System

One of the core challenges in this project was designing a flexible filtering system across multiple axes:

#### Filtering by:

* Date range (`gte` / `lt`)
* Doctor
* Procedure (Toma)
* Doctor + Procedure combination
* Patient name (case-insensitive search)
* Billing number
* Workflow color flags
* USB delivery flag

Example pattern:

```js
Orden.find({
  doctor,
  date: { $gte: gte, $lt: lt }
})
.populate("doctor")
.populate("toma")
.sort({ date: 1 });
```

For compound relationships (Doctor + Toma), a hybrid approach was used:

* Query primary relation in Mongo
* Apply secondary in-memory filtering when necessary

While aggregation pipelines could have been used for deeper relational filtering, this implementation prioritized clarity and maintainability given the operational data size and internal usage context.

This system allowed dynamic UI-driven filtering in the React client.

---

### 3. Validation & Middleware Layer

Custom middleware layer handles:

* Date validation
* ObjectId validation
* Business-rule checks
* Duplicate billing prevention
* Secure delete access via password gate (env-based)

Example:

* Validation for existing boleta
* Validation for doctor/toma consistency
* Request parameter enforcement

---

### 4. Color-Based Workflow Logic

Orders are automatically categorized using rule-based classification:

* Tomography → green
* Analysis/photos → cyan
* Default → white

Workflow color flags can also be manually toggled:

* Doctor highlight
* Comment highlight

This allowed operational prioritization inside the UI.

---

### 5. Frontend UI Organization

React page-based structure:

```
pages/
  doctors/
  ordenes/
  postOrden/
  createDoctor/
  navbar/
```

Features include:

* Editable forms
* Inline editing
* Conditional components
* Date pickers
* Popover-based color selection
* Order row visualization
* Modular container components

---

### Filtering Design Approach

The filtering system combines:

- MongoDB query operators ($gte / $lt)
- Relational population via Mongoose
- Conditional query branching
- Hybrid in-memory refinement when compound relationship filtering was required

This design enabled flexible UI-driven filtering without requiring complex aggregation pipelines, while maintaining readability and maintainability in the controller layer.

---

## Design Decisions

- Used UUIDs for order identifiers to avoid predictable incremental IDs.
- Implemented middleware-based validation to isolate business rules from controllers.
- Leveraged color-based workflow states instead of additional database state fields to simplify operational visualization.
- Prioritized readability and modularization over premature optimization.

---

## Environment Variables

Create a `.env` file based on:

```
MONGO_URI=
PSW=
PORT=
```

`PSW` is used for restricted delete operations.

---

## Running the Project

### Install dependencies

Backend:

```
pnpm install
```

Frontend:

```
cd client
pnpm install
```

---

### Development Mode

Backend build watcher:

```
pnpm run build:server
```

Run backend:

```
pnpm run dev
```

Run frontend:

```
pnpm run start:client
```

---

## Notes on This Public Version

* All sensitive environment variables were removed
* Proprietary business logic and real production data were stripped
* Some UI strings remain in Spanish (original production language)
* Code reflects original development timeline and may include refactoring opportunities

---

## Engineering Ownership & Scope

- End-to-end ownership of backend API design
- MongoDB relational modeling (multi-reference population)
- Middleware-based request validation architecture
- Multi-criteria filtering system implementation
- Full-stack React integration
- Direct alignment between technical implementation and operational workflow needs

The system was developed as a paid contract engagement and used in a real operational setting.