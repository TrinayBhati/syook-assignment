# Encrypted Timeseries Data Streaming System

This project implements a secure, real-time data streaming pipeline capable of handling high-frequency encrypted messages, validating their integrity, and visualizing them instantly.

---

## 🏗 Architecture Overview

The system is composed of three decoupled microservices, designed for scalability and separation of concerns:

### 1. Emitter Service (The Source)
- **Role:** Simulates IoT devices or secure data producers.
- **Function:** Generates a stream of random JSON data objects.
- **Security:**
    - Calculates a SHA-256 hash (HMAC) of the message content for integrity.
    - Encrypts the entire payload using **AES-256-CTR**.
- **Transport:** Streams encrypted data over a raw **TCP** socket to the Listener.

### 2. Listener Service (The Hub)
- **Role:** Central processing unit and storage manager.
- **Function:**
    - Listens for incoming TCP streams.
    - **Decrypts** messages using a shared secret key.
    - **Validates** data integrity by re-calculating the SHA-256 hash.
    - **Stores** valid data in **MongoDB** using a **Time-Series** collection (bucketing data by minute for efficiency).
    - **Broadcasts** real-time updates to the frontend via **Socket.IO**.

### 3. Frontend Service (The Dashboard)
- **Role:** Visualization layer.
- **Tech Stack:** React + Vite.
- **Function:** Connects to the Listener via WebSockets to display live data, validation success rates, and error logs.

---

## 🧠 Design Philosophy

### Why this architecture?
1.  **Security First:** Data is encrypted *before* it leaves the Emitter. Even if the TCP stream is intercepted, the payload is unreadable.
2.  **Data Integrity:** The hashing mechanism ensures that no bit was flipped or tampered with during transit.
3.  **Efficiency:**
    - **TCP** is used for the high-volume data ingestion channel (Emitter -> Listener) for low overhead.
    - **WebSockets** are used for the frontend to ensure instant UI updates without polling.
    - **MongoDB Time-Series** collections are used to handle high write loads and automatic querying by time ranges.
4.  **Decoupling:** Any service can be scaled independently. We can have 100 Emitters pointing to 1 Listener, or scale Listeners behind a load balancer.

### What we explicitly avoided
- **HTTP for Ingestion:** We chose TCP over HTTP for the Emitter-Listener link to reduce protocol overhead for the high-frequency stream.
- **Polling:** The frontend never asks for data; it waits for events. This reduces server load.
- **Unnecessary Complexity:** We kept the deployment simple (Node.js + standard libraries) to ensure easy maintenance.

---

## 🚀 Quick Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Atlas)

### 1. Clone & Install
```bash
git clone https://github.com/TrinayBhati/syook-assignment.git
cd syook-assignment/encrypted-timeseries

# Install dependencies for all services
cd emitter-service && npm install
cd ../listener-service && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
Create `.env` files in each service directory (use the provided `.env.example` as a template). Ensure `ENCRYPTION_KEY` matches in Emitter and Listener.

### 3. Run
Open 3 terminal windows:

**Terminal 1 (Listener):**
```bash
cd listener-service
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

**Terminal 3 (Emitter):**
```bash
cd emitter-service
npm start
```

---