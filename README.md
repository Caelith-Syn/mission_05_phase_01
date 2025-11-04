# mission_05_phase_01

A small Node + Express + MongoDB backend prototype focused on simplifying how auction items can be searched and viewed. This project stores auction items in MongoDB and exposes a **search API** that supports keyword matching and optional price filtering. This work forms **Phase 1** of Mission 5, and will later be integrated into a front-end application in Phase 2.

## Tech Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- dotenv for environment configuration
- nodemon for development

## Requirements

- Node.js v16+ recommended
- MongoDB running locally (no Atlas for this mission)

## Setup

### 1. Install dependencies

```
npm install
```

### 2. Create `.env`

```
MONGODB_URI=mongodb://127.0.0.1:27017/trademe
PORT=3000
```

### 3. Seed sample data

```
node scripts/seed.js --delete   # Clear existing data (optional)
node scripts/seed.js --import   # Load sample items
node scripts/seed.js --status   # Verify items loaded
```

### 4. Run the server

```
npm run dev
```

### 5. Health Check

```
GET http://localhost:3000/health
```

Expected Response:

```
{ "status": "ok", "db": "connected" }
```

---

## API

### Search Items

```
GET /api/items?search=<keyword>[&min=<number>&max=<number>]
```

| Parameter | Required | Description                              |
| --------- | -------- | ---------------------------------------- |
| `search`  | Yes      | Matches against item title + description |
| `min`     | No       | Minimum start price                      |
| `max`     | No       | Maximum start price                      |

#### Examples

```
GET /api/items?search=laptop
GET /api/items?search=monitor&min=150&max=300
GET /api/items?search=ps5&max=600
```

**Behavior:**

- If `search` is missing or empty → returns `[]`
- Invalid numbers in `min`/`max` → returns `400` with error details
- Results are sorted by MongoDB relevance score

---

## Project Structure

```
mission_05_phase_01/
│ server.js
│ .env / .env.example
│
├── config/db.js
├── models/itemModel.js
├── controllers/itemController.js
├── routes/itemRoutes.js
├── data/seedData.json
└── scripts/seed.js
```

---

## Phase 1 Summary

This backend demonstrates:

- Data modeling using Mongoose
- Search and filtering logic tailored to user needs
- Relevance-based text search in MongoDB
- Incremental development and seed dataset iteration
