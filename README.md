# Medicare-Smart-Healthcare-Management-Platform
# 🏥 MediCare+ - Healthcare Solutions Platform

![MediCare+ Banner](./frontend/src/assets/BannerImg.png)

> A comprehensive full-stack healthcare platform for seamless doctor-patient connections with appointment booking, service management, and integrated payments.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-udaykumar09072006-blue?logo=github)](https://github.com/udaykumar09072006)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Uday_Kumar-0A66C2?logo=linkedin)](https://www.linkedin.com/in/uday-kumar-08934628b/)

---

## ✨ Features

- **Patient Portal** — Browse doctors & services, book appointments, manage bookings
- **Doctor Dashboard** — Manage profiles, schedules, and appointment tracking
- **Admin Panel** — Service & doctor management, analytics, appointment oversight
- **Payment Integration** — Stripe integration with cash/online options
- **Secure Authentication** — Clerk OAuth & JWT verification
- **Image Management** — Cloudinary CDN with local file storage fallback
- **Responsive Design** — Optimized for all devices

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Clerk Auth |
| **Admin** | React + Vite (Separate SPA), Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Stripe API |
| **Storage** | Cloudinary CDN, Multer for uploads |
| **Deployment** | MongoDB Atlas, Vercel/Railway/Render ready |

---

## 📂 Project Structure

```
MEDICARE/
├── frontend/              # Patient portal (React + Vite)
├── admin/                 # Admin dashboard (React + Vite)
├── backend/              # REST API (Node.js + Express)
│   ├── controllers/      # Business logic
│   ├── models/          # Mongoose schemas (Doctor, Appointment, Service)
│   ├── routes/          # API endpoints
│   ├── middlewares/     # Auth & file upload
│   ├── scripts/         # Database seeding
│   └── public/uploads/  # Image storage
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+, npm v8+
- MongoDB Atlas account
- Clerk authentication account
- Stripe payment account
- Cloudinary account (optional)

### Installation

**1. Clone & Setup Backend**
```bash
git clone https://github.com/udaykumar09072006/MEDICARE.git
cd MEDICARE/backend

npm install

# Create .env file with your API keys
cat > .env << EOF
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicare
CLERK_SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
EOF

# Seed initial data
node ./scripts/seedServices.js

# Start server
npm run dev  # Runs on http://localhost:4000
```

**2. Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env.local
cat > .env.local << EOF
VITE_CLERK_PUBLISHABLE_KEY=your_public_key
VITE_API_BASE=http://localhost:4000
EOF

npm run dev  # Runs on http://localhost:5173
```

**3. Setup Admin Dashboard**
```bash
cd ../admin
npm install

# Create .env.local (same as frontend)
cat > .env.local << EOF
VITE_CLERK_PUBLISHABLE_KEY=your_public_key
VITE_API_BASE=http://localhost:4000
EOF

npm run dev  # Runs on http://localhost:5174
```

---

## 🔐 Environment Variables Guide

### Getting API Keys

| Service | Steps |
|---------|-------|
| **Clerk** | Visit clerk.com → Create app → Copy Secret & Publishable keys |
| **Stripe** | Visit stripe.com → Dashboard → API keys (use `sk_test_*`) |
| **MongoDB** | Visit atlas.mongodb.com → Create cluster → Copy connection string |
| **Cloudinary** | Visit cloudinary.com → Dashboard → Copy credentials |

---

## 💻 Usage

| Application | URL | Purpose |
|-------------|-----|---------|
| Patient Portal | `http://localhost:5173` | Browse & book appointments |
| Admin Dashboard | `http://localhost:5174` | Manage services & doctors |
| Backend API | `http://localhost:4000/api` | REST endpoints |

### Key Workflows

1. **Patient Booking** — Browse doctors → Select slot → Fill details → Pay → Confirm
2. **Doctor Dashboard** — View appointments → Manage schedule → Track metrics
3. **Admin Panel** — Add/edit services → Manage doctors → View analytics

---

## 📡 API Endpoints

Base URL: `http://localhost:4000/api`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/doctors` | GET | Public | List all doctors |
| `/doctors/:id` | GET | Public | Doctor profile |
| `/appointments` | POST | Patient | Create appointment |
| `/services` | GET | Public | List services |
| `/services` | POST | Admin | Create service |
| `/service-appointments` | POST | Patient | Book service |

---

## 🗄 Database Schema

**Doctor**
```javascript
{ name, email, password, specialization, fee, experience, schedule: Map<date, times>, ... }
```

**Service**
```javascript
{ name, price, about, slots: Map<date, times>, imageUrl, instructions, ... }
```

**Appointment**
```javascript
{ doctorId, patientName, mobile, date, time, fees, payment, status, ... }
```

**ServiceAppointment**
```javascript
{ serviceId, patientName, mobile, date, time, fee, payment, status, ... }
```

---

## 🧪 Testing

```bash
# Backend testing
curl -X GET http://localhost:4000/api/doctors

# Frontend: Visit http://localhost:5173
# - Browse doctors/services
# - Complete booking flow
# - View appointments

# Admin: Visit http://localhost:5174
# - Add/edit services
# - Manage doctors
```

---

## 🚀 Deployment

**Build for Production**
```bash
# Frontend
cd frontend && npm run build

# Admin
cd ../admin && npm run build

# Backend stays as Node process
```

**Deploy To**
- **Frontend/Admin**: Vercel, Netlify, or GitHub Pages (static files)
- **Backend**: Vercel, Railway, Render, or Heroku (Node.js)
- **Database**: MongoDB Atlas (production cluster)

**Production Checklist**
- [ ] Update environment variables to production values
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domains
- [ ] Set up database backups
- [ ] Enable error logging (Sentry/LogRocket)
- [ ] Test payment with Stripe live keys

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Error** | Verify connection string, whitelist IP in MongoDB Atlas |
| **Clerk Auth Failed** | Check secret key, verify redirect URIs, clear cookies |
| **Stripe Error** | Use correct test key (`sk_test_*`), verify account |
| **CORS Error** | Add frontend URL to backend CORS config |
| **Image Upload Failed** | Check Cloudinary credentials, file permissions |
| **Port Already in Use** | `lsof -ti:4000 \| xargs kill -9` or change PORT in .env |

---

## 🔒 Security Best Practices

- Never commit `.env` files to version control
- Use strong passwords for MongoDB & admin accounts
- Enable Clerk MFA for production accounts
- Verify Stripe webhook signatures
- Implement rate limiting on API endpoints
- Validate all user inputs server-side
- Use HTTPS in production

---

## 📚 Resources

- [Clerk Docs](https://clerk.com/docs) — Authentication setup
- [Stripe API](https://stripe.com/docs/api) — Payment integration
- [MongoDB Docs](https://docs.mongodb.com/) — Database queries
- [React Docs](https://react.dev/) — Frontend framework
- [Express Guide](https://expressjs.com/) — Backend framework

---

## ❓ FAQ

**Q: Can I use local MongoDB?**  
A: Yes, use `mongodb://localhost:27017/medicare` in `.env`

**Q: How to add more doctors?**  
A: Use admin dashboard or create similar seed scripts

**Q: Is this HIPAA compliant?**  
A: No, requires encryption & compliance measures for production healthcare use

**Q: Can doctors edit appointments?**  
A: Current version is read-only. Feature planned for v2.

**Q: How are time slots stored?**  
A: As Map objects in MongoDB: `{ "2026-06-21": ["10:00 AM", "03:30 PM"] }`

**Q: Is there a mobile app?**  
A: React Native version planned for roadmap

---

## 📈 Project Stats

| Metric | Count |
|--------|-------|
| Components | 20+ |
| API Endpoints | 15+ |
| Database Collections | 4 |
| Tech Stack Items | 15+ |
| Code Lines | 5000+ |

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Video consultation
- [ ] Telemedicine integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Prescription management
- [ ] AI symptom checker
- [ ] Insurance integration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Licensed under the MIT License - see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Uday Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

<div align="center">

## 👨‍💻 Author

**Uday Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-udaykumar09072006-black?logo=github)](https://github.com/udaykumar09072006)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Uday_Kumar-blue?logo=linkedin)](https://www.linkedin.com/in/uday-kumar-08934628b/)
[![Email](https://img.shields.io/badge/Email-Contact_via_GitHub-red?logo=gmail)](https://github.com/udaykumar09072006)

### ⭐ If you find this project useful, please consider giving it a star!

[![Star](https://img.shields.io/github/stars/udaykumar09072006/MEDICARE?style=social)](https://github.com/udaykumar09072006/MEDICARE)
[![Fork](https://img.shields.io/github/forks/udaykumar09072006/MEDICARE?style=social)](https://github.com/udaykumar09072006/MEDICARE/fork)

---

Made with ❤️ | Last Updated: June 2026 | Status: Active Development

</div>
