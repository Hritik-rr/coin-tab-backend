# Coin Tab Backend

This is the backend for the Coin Tab assignment, built with **NestJS (TypeScript)**, using **TypeORM** for PostgreSQL, and **Firebase Auth** for authentication.  
It follows a modular structure with clear separation of concerns: `auth`, `user`, and `firebase` domains.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
  - [1. Clone & Install](#1-clone--install)
  - [2. Environment Variables](#2-environment-variables)
  - [3. PostgreSQL with Docker](#3-postgresql-with-docker)
  - [4. Firebase Auth Setup](#4-firebase-auth-setup)
  - [5. Run the Backend](#5-run-the-backend)
- [API Endpoints](#api-endpoints)
- [Special Note: mockLogin Function](#special-note-mocklogin-function)
- [Links](#links)

---

## Features

- User registration and login via Firebase Auth
- Secure JWT-based authentication
- Repository pattern with TypeORM for scalable DB access
- Dockerized PostgreSQL for easy local development

---

## Tech Stack

- **NestJS** (TypeScript)
- **TypeORM**
- **PostgreSQL** (via Docker)
- **Firebase Auth**
- **Docker Compose** (for DB)

---

## Folder Structure
```
src/
├── auth/ # Auth logic (controllers, services, guards, decorators)
├── firebase/ # Firebase integration
├── user/ # User entity, DTOs, user logic
├── main.ts # App entrypoint
└── app.module.ts # Root module
```

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone <this-repo-url>
cd coin-tab-backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following content:

```env
TYPE=service_account
FIREBASE_PROJECT_ID=your-firebase-project-id
PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR-PRIVATE-KEY-HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project-id.iam.gserviceaccount.com
CLIENT_ID=your-client-id
AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email@your-project-id.iam.gserviceaccount.com
UNIVERSAL_DOMAIN=googleapis.com
FIREBASE_WEB_API_KEY=your-firebase-web-api-key
```

> **Tip:**  
> - Get these values from your [Firebase Project Settings](https://console.firebase.google.com/).
> - The `FIREBASE_PRIVATE_KEY` must be properly escaped (as shown above).

### 3. PostgreSQL with Docker

This project uses Docker to run a local PostgreSQL instance.  
**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Start the DB:**

```bash
docker-compose up -d
```

This will spin up a PostgreSQL container as defined in `docker-compose.yml`.

**If you want to set up your own Docker PostgreSQL image:**

- [Official PostgreSQL Docker Image Docs](https://hub.docker.com/_/postgres)
- Example command:
  ```bash
  docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
  ```

### 4. Firebase Auth Setup

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project (or use an existing one)
- Enable **Email/Password** authentication in the **Authentication** section
- Generate a **service account** key (for backend) and a **Web API Key** (for frontend/backend communication)
- Add these credentials to your `.env` file as shown above

**Firebase Docs:**  
- [Add Firebase to your app](https://firebase.google.com/docs/web/setup)
- [Service accounts](https://firebase.google.com/docs/admin/setup#initialize-sdk)

### 5. Run the Backend

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint   | Description         |
|--------|------------|---------------------|
| POST   | /signup    | Register a new user |
| POST   | /signin    | Login user          |

- Both endpoints expect email and password in the request body.
- Auth is handled via Firebase; tokens are validated on the backend.

---

## Special Note: `mockLogin` Function

Located in `src/auth/auth.service.ts`, the `mockLogin` function simulates the Firebase login process for development/testing.  
It uses the Firebase REST API to sign in with email and password, returning a Firebase ID token and refresh token.

**How it works:**
- Receives `{ email, password }`
- Calls Firebase's `signInWithPassword` endpoint using your `FIREBASE_WEB_API_KEY`
- Returns `{ idToken, refreshToken, expiresIn }` if successful

**Purpose:**  
This is useful for local development or testing flows without a full frontend Firebase integration.

---

## Links

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth)
- [Docker PostgreSQL](https://hub.docker.com/_/postgres)

---

## Frontend

See the [frontend repo](https://github.com/Hritik-rr/coin-tab-frontend) for setup and usage instructions.

---
## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
