# ília - Code Challenge NodeJS

That's my final solution for the ília code challenge, i gave my best to develop a robust, production-ready financial transaction system built with NestJS, featuring dual microservices architecture with gRPC communication.

---

## 🏗️ Architecture

This project consists of two microservices:

- **`user-service`**: HTTP REST API + gRPC server managing user data
- **`wallet-service`**: HTTP REST API consuming user-service via gRPC for user and auth operations

Each service has its own dedicated PostgreSQL database.

```
┌─────────────────┐      gRPC       ┌─────────────────┐
│  Wallet Service │ ◄──────────────► │  User Service   │
│   (HTTP/REST)   │                  │ (HTTP + gRPC)   │
└────────┬────────┘                  └────────┬────────┘
         │                                    │
         ▼                                    ▼
   ┌──────────┐                        ┌──────────┐
   │ Wallet   │                        │  User    │
   │ Database │                        │ Database │
   └──────────┘                        └──────────┘
```

---

## 🚀 Features

### 🔐 Authentication
JWT-based authentication using Passport, designed for extensibility and production scalability.

### 💳 Transaction System
Ledger-style transaction model with `CREDIT` and `DEBIT` operations.

### 🛡️ Financial Safety Mechanisms

The transaction API implements critical safeguards for financial systems:

| Feature | Description |
|---------|-------------|
| **Idempotency** | Prevents duplicate transactions on retries using request fingerprinting |
| **Concurrency Control** | Row-level locks prevent race conditions |
| **Automatic Retry** | Handles temporary failures with exponential backoff (up to 3 attempts) |
| **Double Spending Prevention** | Balance validation before processing debits |
| **Transaction Isolation** | SERIALIZABLE level for maximum consistency |
| **Complete Audit Trail** | Logs all attempts, including failures |

#### Request Fingerprinting
The system detects duplicates based on a fingerprint (`user_id + type + amount + time window`). If a similar transaction was created within the last 30 seconds, it returns the existing transaction instead of creating a duplicate.

#### Balance Validation
For `DEBIT` transactions, the system validates sufficient balance before processing, using row-level locks to prevent double spending.

---

## 🔄 Transaction State Machine

```
PENDING ──────┐
     │        │
     ▼        ▼
COMPLETED  FAILED ──> ROLLED_BACK
```

- **`PENDING`**: Transaction being processed
- **`COMPLETED`**: Successfully completed
- **`FAILED`**: Failed after all retries
- **`ROLLED_BACK`**: Manually reverted transaction

---

## 🔒 Locking Strategy

**Pessimistic Locking** was chosen over Optimistic Locking.

**Rationale**: 
- Strong consistency guarantees
- Zero conflicts
- Zero unnecessary retries
- In a banking ledger system, errors are not acceptable

---

## 🔁 Retry Mechanism

Automatic retry with exponential backoff handles PostgreSQL serialization failures. When two concurrent transactions read the same data, PostgreSQL detects the conflict and throws a `serialization_failure (40001)`. The retry mechanism catches this, re-reads the updated balance, and safely rejects invalid operations.

The safety comes from the combination of: **`SERIALIZABLE` isolation + automatic retry**

---

## 🧪 Code Quality

### Linting & Formatting
NestJS comes with built-in lint and format commands. **Husky** is configured with **lint-staged** to automatically run linting on every commit.

---

## 📦 gRPC Configuration

Proto files are located outside the microservices directories (monorepo structure). In an ideal production scenario, these would be in a separate repository or use a federation solution.

---

## 🚢 Deployment

Both services include a `Dockerfile.prod` to facilitate deployment pipelines on any cloud-based architecture (AWS, GCP, Azure, etc.).

---

## 📊 Observability

**Terminus Health Check** is implemented for service health monitoring.

**Production Recommendations**:
- Integration with **Datadog** or **Sentry** for comprehensive monitoring
- Distributed tracing
- Log aggregation

---

## 🔐 Security (Production Considerations)

While not implemented in this version due to time constraints, production deployments should include:

- **Rate Limiting**: Prevent abuse and DDoS attacks
- **CORS Configuration**: Proper cross-origin resource sharing policies
- **API Key Management**: Secure key rotation
- **Request Validation**: Input sanitization and validation

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Setup

### Docker Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ilia-nodejs-challenge
   ```

2. **Configure environment variables**
   
   Run this command inside each service
   
   ```bash
   cp .env.example .env
   ```

   Then create two secrets for `ILIACHALLENGE` and `ILIACHALLENGE_INTERNAL`

   I generally use:

   ```bash
   node -e "console.log(require('crypto').randomBytes(255).toString('base64'));"
   ```

3. **Run Docker Compose**
   ```bash
   docker compose up -d --build
   ```

4. **Open on your URL**
   ```
   http://localhost:3001/api
   http://localhost:3002/api
   ```

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ilia-nodejs-challenge
   ```

2. **Install dependencies**
   ```bash
   cd user-service && yarn install
   cd ../wallet-service && yarn install
   ```

3. **Configure environment variables**
   
   Run this command inside each service
   
   ```bash
   cp .env.example .env
   ```

   Then create two secrets for `ILIACHALLENGE` and `ILIACHALLENGE_INTERNAL`

   I generally use:

   ```bash
   node -e "console.log(require('crypto').randomBytes(255).toString('base64'));"
   ```

4. **Start PostgreSQL databases**
   ```bash
   # Start both databases
   docker-compose up -d postgres-user postgres-wallet
   ```

5. **Start the services**
 
   ```bash
   # Terminal 1 - User Service
   cd user-service
   yarn start:dev
   
   # Terminal 2 - Wallet Service
   cd wallet-service
   yarn start:dev
   ```

---

## 📝 API Documentation

Once the services are running:

- **Wallet Service Swagger**: `http://localhost:3001/api`
- **User Service Swagger**: `http://localhost:3002/api`
- **Health Checks**: 
  - Wallet: `http://localhost:3001/health`
  - User: `http://localhost:3002/health`

---

## 🎯 Production Checklist

- [ ] Configure proper database connection pooling
- [ ] Set up monitoring (Datadog/Sentry)
- [ ] Implement rate limiting
- [ ] Configure CORS policies
- [ ] Set up log aggregation
- [ ] Enable SSL/TLS
- [ ] Configure secrets management
- [ ] Set up CI/CD pipelines
- [ ] Implement database backups
- [ ] Configure auto-scaling


---

**Built with ❤️ using NestJS, gRPC, and PostgreSQL**