# Site Safety App

A modern, role-based safety management web application tailored for construction, logistics, and industrial sites. This application allows site workers (Labourers) to fill out digital safety checklists while providing Managers and System Admins with full oversight, review capabilities, and credential management.

## Features

- **Role-Based Access Control (RBAC):**
  - **Super Admin (`ADMIN001`):** Master access to all submissions, users, and credentials across all companies.
  - **Admin:** Can view and manage forms, users, and credentials *strictly for their own company*.
  - **Manager:** Can review and remark on forms submitted by Labourers *within their own company*.
  - **Labourer:** Can submit new safety checklists and view their own submission history.

- **Multi-Language Support:**
  - Fully bilingual (English and Arabic).
  - RTL (Right-to-Left) dynamic switching for Arabic users.
  - Form text and questions are automatically translated without losing data integrity.

- **Dynamic Forms & Media:**
  - Standardized Site Safety, Eyewash, and Forklift checklists.
  - Interactive checklists that allow for Base64 image/file attachments and additional comments.
  - Managers can append contextual remarks (e.g., "Needs Rectification" or "Identification/Note") to submitted forms.

- **Modern & Premium Design:**
  - Stunning glassmorphism UI with a sleek White, Black, and Blue color palette.
  - Micro-animations, hover effects, and a fully responsive layout.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Vanilla CSS (CSS Modules & Global tokens)
- **Authentication:** NextAuth.js (Credentials Provider)
- **Database:** MongoDB (via Mongoose)
- **Icons:** Lucide React

## Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to view the app.

## Deployment

This app is optimized for deployment on **Vercel**. 
1. Import the GitHub repository into your Vercel dashboard.
2. Add the `MONGODB_URI` and `NEXTAUTH_SECRET` environment variables.
3. Deploy!
