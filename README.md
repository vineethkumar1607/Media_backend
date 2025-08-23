# 🎬 Media Backend API

A secure backend service for **admin-managed media streaming**, built with **Node.js, Express, MongoDB (Atlas), and JWT**.  
This backend allows **admin users** to sign up, log in, create media assets, and generate **time-limited streaming URLs** for public consumption.  
The system enforces **security best practices** like password hashing, HttpOnly cookies, short-lived JWTs, and request rate limiting.  

---

## 📂 Project Structure

```
media-backend/
├─ package.json
├─ .env 
├─ README.md
└─ src/
   ├─ server.js            # starts server after DB connection
   ├─ app.js               # express app wiring
   ├─ config/
   │  └─ db.js             # Atlas connection
   ├─ logger/
   │  └─ index.js          # pino logger
   ├─ middleware/
   │  ├─ auth.js           # JWT guard + role check
   │  ├─ error.js          # 404 + centralized error handler
   │  └─ rateLimit.js      # limiter for public stream endpoint
   ├─ models/
   │  ├─ AdminUser.js      # admin-only user model
   │  ├─ MediaAsset.js     # media metadata
   │  └─ MediaViewLog.js   # view log for analytics
   ├─ controllers/
   │  ├─ authController.js
   │  ├─ mediaController.js
   │  └─ streamController.js
   ├─ routes/
   │  ├─ auth.routes.js
   │  ├─ media.routes.js
   │  └─ stream.routes.js
   ├─ validators/
   │  ├─ auth.validators.js
   │  └─ media.validators.js
   └─ utils/
      ├─ jwt.js
      └─ password.js
```

---

## ⚙️ Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/media-backend.git
cd media-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=4000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster-url/db

# JWT secrets
JWT_SECRET=supersecret_admin_token
JWT_EXPIRES_IN=1d
STREAM_TOKEN_SECRET=supersecret_stream_token
STREAM_TOKEN_EXPIRES_IN_MIN=10

# Cookie
COOKIE_NAME=access_token
COOKIE_EXPIRES_DAYS=1

# Base URL
BASE_URL=http://localhost:4000
```

### 4. Start Server
```bash
npm run dev
```

---

## 🔑 Features Implemented

### ✅ Admin Authentication
- **Signup** with email + password
- Password stored as **bcrypt hash**
- Generates a **JWT** containing `{sub, email, role}`
- Sets JWT in a **secure HttpOnly cookie**
- Supports **login & logout** routes

### ✅ Media Management (Admin-only)
- Create media asset (`title`, `type`, `file_url`)
- Generate **10-minute signed stream URL** for media
- Signed using a **separate stream token secret** for defense in depth

### ✅ Secure Streaming (Public)
- Public `/api/stream?token=...` endpoint
- Validates stream token
- Logs viewer IP + media_id into `MediaViewLog`
- Redirects user to actual `file_url`
- Protected by **rate limiting** (60 requests/minute)

### ✅ Logging & Monitoring
- Uses **pino logger**
- Pretty logs in dev, JSON logs in prod
- Centralized error handler with proper HTTP status codes

---

## 🛠️ API Endpoints

### 🔐 Auth
| Method | Endpoint           | Access | Description |
|--------|-------------------|--------|-------------|
| POST   | `/api/auth/signup` | Public | Register new admin |
| POST   | `/api/auth/login`  | Public | Log in admin, set JWT cookie |
| POST   | `/api/auth/logout` | Private | Clears JWT cookie |



### 🎬 Media
| Method | Endpoint                      | Access  | Description |
|--------|-------------------------------|---------|-------------|
| POST   | `/api/media`                  | Admin   | Create new media asset |
| GET    | `/api/media/:id/stream-url`   | Admin   | Generate 10-min streaming URL |



### 📡 Streaming
| Method | Endpoint      | Access | Description |
|--------|--------------|--------|-------------|
| GET    | `/api/stream` | Public | Validates token, logs view, redirects |

**Example Request**
```
GET /api/stream?token=abc.def.ghi
```

- If valid → redirects (`302`) to `file_url`
- If expired → `401 Unauthorized`
- If invalid → `400/401 error`

---

## 🔒 Security Measures
- **Password hashing** → bcrypt with 12 salt rounds
- **JWT tokens** → separate secrets for auth & streaming
- **HttpOnly cookies** → prevent XSS token theft
- **Rate limiting** → throttles abuse on `/api/stream`
- **CORS with credentials** → safe cookie sharing
- **Helmet** → sets secure HTTP headers
- **Central error handling** → consistent JSON errors

---

## 📊 Database Models

### 👤 AdminUser
```js
{
  email: String,
  hashed_password: String,
  created_at: Date
}
```

### 🎬 MediaAsset
```js
{
  title: String,
  type: "video" | "audio",
  file_url: String,
  created_at: Date
}
```

### 📈 MediaViewLog
```js
{
  media_id: ObjectId (ref: MediaAsset),
  viewed_by_ip: String,
  timestamp: Date
}


## 🚀 Next Steps
- Add **refresh tokens** for long-lived sessions
- Implement **role-based access control** (e.g., super-admin)
- Use **cloud storage pre-signed URLs** instead of static `file_url`
- Add **unit tests & integration tests**



## ✅ Summary
This project demonstrates a **secure, production-ready backend** for admin-managed media streaming.  
It showcases:
- Strong authentication practices (hashed passwords, JWT, HttpOnly cookies)  
- Short-lived signed streaming tokens for secure public access  
- Centralized logging, error handling, and request validation  
- Rate-limited public endpoints to mitigate abuse  

