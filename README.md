
# Christine Nyambwari - Portfolio Project Documentation  

## 🌐 Overview  
A comprehensive guide to the frontend and backend architecture of Christine Nyambwari's portfolio website.  

### Key Components  
- **Frontend**: HTML, CSS, JavaScript (React-like structure)  
- **Backend**: Hono.js (Node.js framework)  
- **Database**: PostgreSQL (hosted on Neon)  
- **ORM**: Drizzle ORM (type-safe queries)  
- **Email**: Nodemailer (Gmail SMTP for contact form)  



## 🖥️ Frontend Structure  

### 1. Key Features  
✅ Responsive Design (Mobile, Tablet, Desktop)  
✅ Interactive UI (Animations, Smooth Scrolling, Form Validation)  
✅ Dynamic Sections (Projects, Testimonials, Contact Form)  
✅ Optimized Performance (Lazy Loading, Minified Assets)  

### 2. Technologies Used  
| **Tech**       | **Purpose**                          |
|----------------|--------------------------------------|
| HTML5          | Structure                            |
| CSS3           | Styling (Flexbox, Grid, Animations)  |
| JavaScript     | DOM Manipulation, Form Handling      |
| Font Awesome   | Icons                                |
| Google Fonts   | Typography (Poppins)                 |

### 3. Key Components  
- **Hero Section** (Animated intro)  
- **About Me** (Bio, Skills)  
- **Services** (Fullstack, Frontend, Backend)  
- **Projects** (Filterable grid)  
- **Contact Form** (Sends data to backend at `https://cjh-backend-portfolio.onrender.com/api/contact`)  



## ⚙️ Backend Architecture  
Built with **Hono.js + Drizzle ORM + Neon PostgreSQL**.  

### 1. Tech Stack  
| **Tech**          | **Purpose**                          |
|-------------------|--------------------------------------|
| Hono.js           | Lightweight backend framework        |
| Drizzle ORM       | Type-safe SQL queries               |
| PostgreSQL (Neon) | Serverless database hosting         |
| Nodemailer        | Email sending via Gmail SMTP        |

### 2. Backend Setup  

#### 📂 File Structure  
```plaintext
backend/
├── src/
│   ├── drizzle/
│   │   ├── db.ts          # Database connection
│   │   ├── schema.ts      # Drizzle ORM schema
│   │   └── migrate.ts     # Database migrations
│   ├── lib/
│   │   └── mailer.ts      # Nodemailer config
│   ├── index.ts           # Hono.js server
│   └── test-contact.ts    # Test script
├── .env                   # Environment variables
└── package.json

🔑 Environment Variables (.env)
env
# Database (Neon PostgreSQL)
DATABASE_URL="postgres://user:pass@neon-host/project"

# Nodemailer (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your.email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Your Portfolio <your.email@gmail.com>"
CONTACT_RECIPIENT="recipient@example.com"


3. Database (PostgreSQL + Drizzle ORM)
📜 Schema Definition (drizzle/schema.ts)
typescript
import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

4. Email Service (Nodemailer)
📧 Mailer Configuration (lib/mailer.ts)
typescript
Copy
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: { rejectUnauthorized: false }
});

5. Hono.js API Endpoint
🛠️ Backend Server (index.ts)
typescript
Copy
app.post('/api/contact', async (c) => {
  const { name, email, subject, message } = await c.req.json();
  // ... (validation and processing)
});


🚀 Deployment Guide
1. Frontend (Vercel)
Ensure script.js points to:
javascript
const BACKEND_URL = "https://cjh-backend-portfolio.onrender.com/api/contact";

2. Backend (Render)
Set environment variables matching .env

Deploy via GitHub

3. Database (Neon PostgreSQL)
Create database at Neon.tech

Update DATABASE_URL in .env

🔍 Testing
sql
SELECT * FROM contacts;  -- Verify submissions

📌 Summary
✅ Frontend: Static HTML/CSS/JS with dynamic contact form
✅ Backend: Hono.js API + Drizzle ORM + PostgreSQL (Neon)
✅ Live API: https://cjh-backend-portfolio.onrender.com/api/contact

🔗 Live Demo: christine-portfolio-red.vercel.app
