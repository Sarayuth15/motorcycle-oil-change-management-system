# 🔧 OilTrack — Vehicle Oil Change Tracker
# ប្រព័ន្ធគ្រប់គ្រងការប្តូរប្រេងម៉ូតូ

A full-stack application to track vehicle oil change intervals. Users register their vehicle odometer reading, and the app automatically calculates the next service at **+2,500 km**, then sends an **email reminder** when it's due.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🚗 Vehicle Registration | Register any vehicle with a custom name (e.g. *Honda Scoopy*) |
| 📏 Auto Interval Calc | Adds 2,500 km to current odometer → next service |
| 📧 Email Reminders | Automatic HTML email when service is due |
| ✅ Service Acknowledgement | Mark oil change done, reset interval from new odometer |
| ✏️ Edit Vehicle | Update vehicle name at any time |
| 🔄 Odometer Updates | Keep your km reading current; triggers check on save |
| 📊 Dashboard Stats | Overview of all vehicles, due count, reminders sent |
| ⏰ Scheduled Check | Hourly background job catches any missed triggers |
| 📱 Mobile Responsive | Fully responsive Next.js UI |

---

## 🏗️ Tech Stack

### Backend
- **Java 21** — modern LTS
- **Spring Boot 3.2** — Web, Data JPA, Mail, Validation
- **Lombok** — boilerplate reduction
- **MySQL 8** — persistent storage
- **Spring Scheduler** — hourly service-due checks

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **Lucide React** icons

---

## 🚀 Quick Start

### Option A — Docker Compose (recommended)

```bash
# 1. Clone the repo
git clone <repo-url> && cd oil-tracker

# 2. Set your email credentials
cp .env.example .env
# Edit .env with your SMTP details

# 3. Start everything
docker-compose up --build

# App runs at:
#   Frontend  → http://localhost:3000
#   Backend   → http://localhost:8080
#   MySQL     → localhost:3306
```

### Option B — Local Development

#### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 20+
- MySQL 8 running locally

#### 1. Backend

```bash
cd backend

# Set environment variables or edit application.properties
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export MAIL_USERNAME=you@gmail.com
export MAIL_PASSWORD=your-app-password   # Gmail App Password

mvn spring-boot:run
# API available at http://localhost:8080
```

#### 2. Frontend

```bash
cd frontend

npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

npm run dev
# UI available at http://localhost:3000
```

---

## 📧 Email Setup (Gmail)

1. Go to your Google Account → **Security** → **2-Step Verification** → enable it
2. Go to **App Passwords** → create a new App Password for "Mail"
3. Use that 16-character password as `MAIL_PASSWORD`

```properties
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=you@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop   # your app password (no spaces)
```

For other providers (Outlook, SendGrid, Mailgun), update `MAIL_HOST` and `MAIL_PORT` accordingly.

---

## 📡 API Reference

### Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/vehicles` | Register a new vehicle |
| `GET` | `/vehicles` | List all vehicles |
| `GET` | `/vehicles/{id}` | Get vehicle by ID |
| `GET` | `/vehicles/by-email?email=` | Get vehicles by owner email |
| `PATCH` | `/vehicles/{id}/kilometers` | Update odometer reading |
| `PUT` | `/vehicles/{id}` | Update vehicle name/km |
| `POST` | `/vehicles/{id}/acknowledge-service` | Mark oil change done, reset interval |
| `DELETE` | `/vehicles/{id}` | Delete a vehicle |

### Example: Register Vehicle

```json
POST /api/vehicles
{
  "ownerName": "John Doe",
  "ownerEmail": "john@example.com",
  "vehicleName": "Honda Scoopy",
  "currentKilometers": 13500
}
```

Response:
```json
{
  "id": 1,
  "vehicleName": "Honda Scoopy",
  "currentKilometers": 13500,
  "nextServiceKilometers": 16000,
  "serviceIntervalKm": 2500,
  "kmUntilService": 2500,
  "isDueForService": false,
  "notificationStatus": "PENDING"
}
```

### Example: Update Odometer

```json
PATCH /api/vehicles/1/kilometers
{
  "currentKilometers": 16050
}
```
→ Triggers email notification automatically (km ≥ next service)

### Example: Acknowledge Service Done

```json
POST /api/vehicles/1/acknowledge-service
{
  "newCurrentKilometers": 16050
}
```
→ Resets next service to 16050 + 2500 = **18550 km**

---

## ⚙️ Configuration

| Property | Default | Description |
|---|---|---|
| `app.service-interval-km` | `2500` | KM added to current for next service |
| `app.notification-check-interval-ms` | `3600000` | How often to check for due vehicles (ms) |
| `app.cors.allowed-origins` | `http://localhost:3000` | Comma-separated allowed origins |
| `spring.jpa.hibernate.ddl-auto` | `update` | Use `validate` in production |

---

## 🗂️ Project Structure

```
oil-tracker/
├── backend/
│   ├── src/main/java/com/oiltracker/
│   │   ├── OilTrackerApplication.java
│   │   ├── controller/   VehicleController.java
│   │   ├── service/      VehicleService.java, EmailService.java
│   │   ├── repository/   VehicleRepository.java
│   │   ├── model/        Vehicle.java
│   │   ├── dto/          VehicleDto.java
│   │   └── config/       WebConfig.java, GlobalExceptionHandler.java
│   ├── src/main/resources/application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  ← Dashboard
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── components/
│   │       ├── VehicleCard.tsx
│   │       ├── AddVehicleModal.tsx
│   │       ├── UpdateKmModal.tsx
│   │       ├── AcknowledgeModal.tsx
│   │       └── EditVehicleModal.tsx
│   ├── lib/api.ts
│   ├── types/vehicle.ts
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

## 🔒 Production Checklist

- [ ] Change `spring.jpa.hibernate.ddl-auto` from `update` to `validate`
- [ ] Use environment variables for all secrets (never commit credentials)
- [ ] Add HTTPS via reverse proxy (nginx / Caddy)
- [ ] Set `CORS_ORIGINS` to your production frontend domain
- [ ] Configure a production MySQL instance with proper backups
- [ ] Consider rate limiting on the API endpoints

---

## 📄 License

MIT
