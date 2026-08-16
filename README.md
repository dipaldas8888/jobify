# ⚡ Jobify — Full-Stack Job Board & Hiring Platform

A modern, full-stack recruitment platform built with **Next.js 14 (App Router)**, **TypeScript**, **Node.js**, **Express**, **MongoDB**, and **Redux Toolkit**. 

Jobify provides a seamless experience for **Candidate Job Seekers**, **Verified Recruiters**, and **Platform Administrators**.

---

## 🌟 Key Features

### 👤 Candidate Portal
- **Advanced Job Search & Filters**: Search opportunities by keywords, location, job type (Full-time, Remote, Contract, Internship), experience level, and salary.
- **Direct Job Applications**: Apply directly with auto-prefilled personal info, cover letter, and binary resume file upload (`PDF`, `DOC`, `DOCX`).
- **Saved Jobs Bookmarking**: Save jobs to your personal account with 1-click bookmarking and manage them from `/saved-jobs`.
- **My Profile Management**: Update personal info, bio, phone, skills tags, and upload/view/download your stored resume file.

### 🏢 Recruiter Portal
- **Job Posting Management**: Create, edit, pause, close, and delete job postings with real-time database synchronization.
- **Applications Review**: Inspect incoming candidate applications, view candidate profile details, and **view/download original resumes** directly in the browser.
- **Candidate Discovery**: Search candidate talent pools and contact qualified applicants directly via email.
- **Company Profile Setup**: Customize company branding, logo URL, industry sector, headquarters, perks & benefits, website, and social links.

### ⚡ Admin Portal
- **User Administration**: View registered users, manage user roles (Candidate, Recruiter, Admin), and ban/unban accounts.
- **Job Moderation**: Approve pending job postings before they appear live on the public site.
- **Platform Analytics**: Monitor overall site activity, user registrations, job postings, and application volumes.

### 🔐 Security & Auth Engine
- **JWT Authentication & Cross-Tab Sync**: Secure token storage in `localStorage` with real-time cross-tab auth state synchronization.
- **OTP Verification & 2FA**: Email OTP verification upon signup.
- **Forgot Password Flow**: 2-step password reset flow using 6-digit email OTPs.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Redux Toolkit, Vanilla CSS |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ORM |
| **File Storage** | Express Static Uploads (Multer for candidate PDF/DOC resumes) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Email Service** | Nodemailer with OTP engine for verification and password reset |

---

## 📁 Repository Structure

```text
Jobify/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & nodemailer transport
│   │   ├── controllers/     # Auth, Job, User, & Admin business logic
│   │   ├── middlewares/     # Auth guard, Role authorization, Multer upload
│   │   ├── models/          # User, Job, Application, Notification, Metadata schemas
│   │   ├── routes/          # Express API route declarations
│   │   └── server.js        # Main Express server entry point
│   ├── uploads/
│   │   └── resumes/         # Uploaded candidate PDF/DOC resume files
│   ├── .env.example         # Environment template
│   └── package.json
│
├── frontend/
│   ├── app/                 # Next.js 14 App Router Pages
│   │   ├── auth/            # Login, Register, Verify OTP, Forgot/Reset Password
│   │   ├── dashboard/       # Recruiter & Admin Portal dashboards
│   │   ├── jobs/            # Find Jobs, Job Details, Apply Job Page
│   │   ├── profile/         # Candidate My Profile Page
│   │   ├── saved-jobs/      # Candidate Saved Jobs Page
│   │   ├── companies/       # Public Company Directory
│   │   └── layout.tsx       # Root layout with Navbar & Footer
│   ├── components/          # Reusable UI components & navigation bars
│   ├── lib/
│   │   ├── api/             # Categorized API client modules (authApi, jobsApi, etc.)
│   │   └── redux/           # Redux Toolkit store & auth slices
│   ├── data/                # Mock data fallbacks & category datasets
│   ├── public/              # Static assets & brand icons
│   └── package.json
│
└── README.md
```

---

## 🔌 Categorized API Client (`frontend/lib/api/`)

The frontend API architecture is split into modular services for clean maintainability:

- **`client.ts`**: Core `apiRequest` HTTP client handling fetch options and JWT Bearer headers.
- **`authApi.ts`**: Handles registration, login, email verification, 2FA, forgot password, reset password, and user profile endpoints.
- **`jobsApi.ts`**: Handles job searching, job creation, editing job details, job deletion, job application submission, and application status updates.
- **`dashboardApi.ts`**: Handles recruiter dashboard metrics, candidate dashboard, and company profile GET/PUT operations.
- **`adminApi.ts`**: Handles admin user bans, job approvals, reports, and platform analytics.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/jobify
   JWT_SECRET=your_jwt_secret_key_here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_app_password
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 🧪 Verification & Type Checking

To verify TypeScript code compilation across the frontend:

```bash
cd frontend
npx tsc --noEmit
```

---

## 📄 License

This project is open-source and available under the **MIT License**.
