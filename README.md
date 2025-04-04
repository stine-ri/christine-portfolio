Christine Nyambwari - Portfolio Project Documentation
📌 Overview
This document provides a comprehensive guide to the frontend and backend architecture of Christine Nyambwari's portfolio website, including:

Frontend: Built with HTML, CSS, and JavaScript (React-like structure)
Backend: Hono.js (lightweight Node.js framework)
Database: PostgreSQL (hosted on Neon)
ORM: Drizzle ORM (for type-safe database operations)
Contact Form: Nodemailer (Gmail SMTP)

🌐 Frontend Structure
1. Key Features
✅ Responsive Design (Mobile, Tablet, Desktop)
✅ Interactive UI (Animations, Smooth Scrolling, Form Validation)
✅ Dynamic Sections (Projects, Testimonials, Contact Form)
✅ Optimized Performance (Lazy Loading, Minified Assets)

2. Technologies Used
Tech	Purpose
HTML5	Structure
CSS3	Styling (Flexbox, Grid, Animations)
JavaScript	DOM Manipulation, Form Handling
Font Awesome	Icons
Google Fonts (Poppins)	Typography


3. Key Components
Hero Section (Animated intro)
About Me (Bio, Skills)
Services (Fullstack, Frontend, Backend, etc.)
Projects (Filterable grid)
Contact Form (Sends data to backend)

⚙️ Backend Architecture (Hono.js + Drizzle ORM + Neon PostgreSQL)
1. Tech Stack
Tech	Purpose
Hono.js	Fast, lightweight backend framework
Drizzle ORM	Type-safe SQL queries
PostgreSQL (Neon)	Serverless DB hosting
Nodemailer	Sends emails via Gmail SMTP
2. Backend Setup
📂 File Structure
Copy
backend/
├── src/
│   ├── drizzle/
        |__db.ts            #connecting to database
│   │   ├── schema.ts       # Drizzle ORM schema
│   │   └── migrate.ts        # migrates file to db
│   ├── lib/
│   │   └── mailer.ts       # Nodemailer config
│   ├── index.ts            # Hono.js server
│   └── test-contact.ts     # Test script
├── .env                    # Environment variables
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
SMTP_PASSWORD="your-app-password"  # 16-digit Gmail App Password
SMTP_FROM="Your Portfolio <your.email@gmail.com>"
CONTACT_RECIPIENT="recipient@example.com"

3. Database (PostgreSQL + Drizzle ORM)
📜 Schema Definition (drizzle/schema.ts)


import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

🔌 DB Connection (drizzle/db.ts)
import "dotenv/config";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';


const databaseUrl = process.env.Database_URL as string;
if (!databaseUrl) throw new Error("DATABASE_URL is not set");

const sql = neon(databaseUrl);

export const db: NeonHttpDatabase<typeof schema> = drizzle(sql, { schema, logger: true });
export default db;


⚙🛠🔀 DB Connection (drizzle/migrate.ts)
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "./db";

async function migration() {
  try {
    console.log("======Migration Started ======");
    await migrate(db, {
      migrationsFolder: __dirname + "/migrations"
    });
    console.log("======Migration Ended======");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed with error: ", error);
    process.exit(1);
  }
}

migration().catch((e) => {
  console.error("Unexpected error during migration:", e);
  process.exit(1);
});


4. Email Service (Nodemailer)
📧 Mailer Configuration (lib/mailer.ts)

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  
  // Gmail often requires these additional settings
  tls: {
    rejectUnauthorized: false
  }
});
console.log('SMTP Config:', {
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASSWORD ? '***' : 'MISSING' // Masked logging
});

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_RECIPIENT,
    replyTo: `${data.name} <${data.email}>`,  // Added replyTo field here
    subject: `New Portfolio Message: ${data.subject}`,
    text: `
      New contact form submission:
      
      Name: ${data.name}
      Email: ${data.email}
      Subject: ${data.subject}
      
      Message:
      ${data.message}
    `,
    html: `
      <h1>New Portfolio Contact</h1>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>You can reply directly to ${data.email}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

5. Hono.js API Endpoint
🛠️ Backend Server (index.ts)
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { db } from './drizzle/db';
import { contacts } from './drizzle/schema';
import { sendContactEmail } from './lib/mailer';
import {cors} from 'hono/cors'
const app = new Hono();


//middleware
app.use('/api/*', cors());  
app.post('/api/contact', async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // Store in database
    const [contact] = await db.insert(contacts).values({
      name,
      email,
      subject,
      message,
    }).returning();

    // Send email
    await sendContactEmail({ name, email, subject, message });

    return c.json({ success: true, contact });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

const port = 8000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});


🚀 Deployment Guide
1. Frontend (Vercel)
Push to GitHub → Connect to Vercel

Ensure script.js points to the correct backend URL

2. Backend (Render)
Set environment variables

Deploy via GitHub

3. Database (Neon PostgreSQL)
Create a Neon account
Create a new PostgreSQL database
Copy the connection URL → Add to .env

🔍 Testing
1. Test Contact Form

// Jest mock (for future unit tests)
if (process.env.NODE_ENV === 'test') {
  jest.mock('nodemailer', () => ({
    createTransport: () => ({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'mocked' })
    })
  }));
}

2. Check Database

SELECT * FROM contacts;


📌 Summary
✅ Frontend: Static HTML/CSS/JS with dynamic contact form
✅ Backend: Hono.js API + Drizzle ORM + PostgreSQL (Neon)
✅ Email: Nodemailer (Gmail SMTP)
✅ Deployment: Vercel (Frontend) + Render (Backend)

🔗 Useful Links
Hono.js Docs



