# PlacementPro — Student Placement Preparation & Tracking Portal

> **Final-Year B.Tech Computer Science & Engineering (CSE) Capstone Project**  
> A full-stack MERN portal empowering engineering students to manage technical profiles, practice DSA, prepare company-specific recruitment rounds, track job applications, and simulate mock interviews with MongoDB-backed analytics.

---

## 📌 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features & Modules](#key-features--modules)
3. [Technology Stack](#technology-stack)
4. [System Architecture & Data Flow](#system-architecture--data-flow)
5. [Folder Structure](#folder-structure)
6. [Installation & First-Time Setup](#installation--first-time-setup)
7. [MongoDB Compass Connection Guide](#mongodb-compass-connection-guide)
8. [REST API Endpoints Reference](#rest-api-endpoints-reference)
9. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 1. Project Overview

Campus recruitment preparation is often fragmented across multiple disparate websites: problem trackers, spreadsheet application trackers, company-specific discussion forums, and unstructured interview notes. 

**PlacementPro** solves this by unifying every critical facet of campus placement readiness into a single, intuitive, and responsive dashboard:
- **Academic & Skill Profile:** Showcase CGPA, skills, target companies, and resume links.
- **DSA Question Bank & Progress Tracker:** 8 core topics, difficulty categorization, LeetCode/GFG links, solution notes, and instant status toggling.
- **Company-Specific Preparation Guides:** Recruitment patterns and checklists for top recruiters (**TCS**, **Infosys**, **Accenture**, **Wipro**, **Cognizant**, **Capgemini**).
- **Placement Application Management:** Track job applications from *Wishlist* and *Applied* to *Online Assessment*, *Interview*, *Offer*, or *Rejected*.
- **Interactive Mock Interview Simulator:** 7 technical/behavioral domains with 25+ question bank, timer-free practice, and explainable rule-based scoring.
- **Real-Time Analytics:** Real MongoDB aggregation pipelines calculating difficulty ratios, weekly hours, and composite readiness scores.

---

## 2. Key Features & Modules

| Module | Description | MongoDB Collection |
| :--- | :--- | :--- |
| **Dashboard** | High-level metrics, Recharts weekly study activity, DSA topic distribution, application funnel, upcoming interview schedule. | Aggregates all collections |
| **My Profile** | Academic credentials, badges, profile completion bar, resume URL, editable via modal. | `students` |
| **DSA Practice** | 22+ seeded questions across 8 categories with live search, filters, CRUD operations, personal notes drawer. | `dsaquestions` |
| **Company Prep** | Recruitment round breakdown and interactive topic checklists for TCS, Infosys, Accenture, Wipro, Cognizant, Capgemini. | `companypreparations` |
| **Applications** | Placement job tracker with package, location, deadlines, recruiter notes, and interview dates. | `applications` |
| **Mock Interviews** | Interactive question-by-question simulator with MCQ & subjective responses, confidence rating, and feedback. | `mockquestions`, `mockinterviews` |
| **Analytics** | Solved percentages, difficulty breakdown, company preparation progress, and attempt performance curves. | `studyactivities`, aggregations |
| **Settings** | MongoDB Compass connection instructions, live connection status ping, and idempotent demo data reset. | System configuration |

---

## 3. Technology Stack

- **Frontend:**
  - **Framework:** React.js (v18) built with Vite
  - **Styling:** Modular Vanilla CSS design system (Navy sidebar, crisp white card elevation, Plus Jakarta Sans typography)
  - **Icons:** Lucide React
  - **Charts & Visualization:** Recharts (BarChart, PieChart, LineChart)
- **Backend:**
  - **Runtime:** Node.js (v18+)
  - **Web Framework:** Express.js (v4)
  - **Object Data Modeling (ODM):** Mongoose (v8)
  - **Logging & CORS:** Morgan, CORS
- **Database:**
  - **Database Engine:** MongoDB (Local Community Server on port 27017 or MongoDB Atlas Cloud)
  - **Database GUI:** MongoDB Compass
- **Language:** JavaScript throughout (ES6+ ECMAScript modules in frontend, CommonJS in backend). No TypeScript or complex cloud dependencies.

---

## 4. System Architecture & Data Flow

```
+-------------------------------------------------------------+
|                     React Frontend (Vite)                  |
|                 http://localhost:5173                       |
|   (Dashboard, Profile, DSA, Companies, Apps, Mock, Stats)   |
+-------------------------------------------------------------+
                              |
                     REST API Calls (JSON)
                      via fetch() proxy
                              v
+-------------------------------------------------------------+
|                    Express.js Backend                       |
|                 http://localhost:5000                       |
|   (Controllers, Validation, Error Handling, Middlewares)    |
+-------------------------------------------------------------+
                              |
                    Mongoose ODM (Schemas)
                              v
+-------------------------------------------------------------+
|                    MongoDB Database                         |
|             mongodb://127.0.0.1:27017/placementpro          |
|  (students, dsaquestions, applications, companies, mocks)   |
+-------------------------------------------------------------+
                              ^
                              |
                   TCP Connection Inspection
+-------------------------------------------------------------+
|                    MongoDB Compass GUI                      |
|            Visual document browser & query runner           |
+-------------------------------------------------------------+
```

---

## 5. Folder Structure

```
Placement Pro/
├── README.md                 # Project guide and Compass instructions
├── PROJECT_REPORT.md         # Academic B.Tech project report
├── VIVA_QUESTIONS.md         # 25+ Viva questions and answers
├── PRESENTATION_GUIDE.md     # 5-7 minute presentation script & live demo sequence
├── .gitignore                # Ignored node_modules, .env, build output
├── backend/
│   ├── .env                  # Port, MongoDB URI, CORS origins
│   ├── .env.example          # Sample environment template
│   ├── package.json          # Express, Mongoose, CORS, Morgan dependencies
│   ├── server.js             # Express app entry point
│   ├── config/
│   │   └── db.js             # MongoDB connection and status reporter
│   ├── models/
│   │   ├── Student.js        # Student profile schema
│   │   ├── DsaQuestion.js    # DSA question and topic schema
│   │   ├── Application.js    # Placement job application schema
│   │   ├── CompanyPreparation.js # Company syllabus and checklist schema
│   │   ├── MockQuestion.js   # 25+ question bank schema
│   │   ├── MockInterview.js  # Saved interview attempt session schema
│   │   └── StudyActivity.js  # Daily activity logs schema
│   ├── controllers/          # Business logic and aggregations
│   ├── routes/               # Express REST route mappings
│   ├── middleware/
│   │   └── errorHandler.js   # Centralized error handler
│   └── scripts/
│       ├── seed.js           # CLI standalone idempotent seed runner
│       ├── seedData.js       # Curated academic demo dataset
│       └── seedService.js    # Upsert seeding & safe reset service
└── frontend/
    ├── package.json          # React, Vite, Lucide-React, Recharts
    ├── vite.config.js        # Vite config with /api proxy to port 5000
    ├── index.html            # Main HTML with Google Fonts
    └── src/
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # Main routing and navigation container
        ├── styles/
        │   └── index.css     # Complete professional CSS design system
        ├── services/
        │   └── api.js        # Centralized REST API client
        ├── components/       # Reusable UI components (Sidebar, Navbar, Modal, etc.)
        └── pages/            # 8 dedicated application views
```

---

## 6. Installation & First-Time Setup

### Prerequisites
- **Node.js** (v18 or newer)
- **MongoDB Server** installed and running locally on port `27017` (or a MongoDB Atlas connection string)
- **MongoDB Compass** installed

### Step 1: Clone or Open Project Folder
Open your terminal or PowerShell in the project directory:
```bash
cd "c:\Users\kumar\OneDrive\Desktop\Placement Pro"
```

### Step 2: Install Backend Dependencies & Seed MongoDB
```bash
cd backend
npm.cmd install
npm.cmd run seed
```
> Running `npm.cmd run seed` executes an **idempotent seeder** that populates:
> - 1 complete demo student profile (Rahul Sharma, B.Tech CSE, 8.65 CGPA)
> - 22 recognizable DSA questions with company tags
> - 6 top company profiles with recruitment checklists (TCS, Infosys, Accenture, Wipro, Cognizant, Capgemini)
> - 6 placement applications across various statuses
> - 24 mock interview questions across DSA, JS, React, Node, MongoDB, HR, Aptitude
> - Sample study activity logs

### Step 3: Start the Backend Server
```bash
npm.cmd start
```
The backend API server will listen on `http://localhost:5000`. You should see:
```
✅ MongoDB Connected Successfully!
📁 Host: 127.0.0.1
🗄️ Database Name: placementpro
🔌 Compass URL: mongodb://127.0.0.1:27017/placementpro
🚀 PlacementPro API Server running on http://localhost:5000
```

### Step 4: Start the Frontend Application
Open a second PowerShell window:
```bash
cd "c:\Users\kumar\OneDrive\Desktop\Placement Pro\frontend"
npm.cmd install
npm.cmd run dev
```
Open your browser to `http://localhost:5173`. You will see the live PlacementPro dashboard.

---

## 7. MongoDB Compass Connection Guide

During a viva or project presentation, faculty members frequently ask: *"Show me the database where this data is actually stored."* Follow these steps to demonstrate:

### Understanding Compass vs. MongoDB
- **MongoDB Server (`mongod`):** The background database service storing BSON documents on disk.
- **MongoDB Compass:** The official visual desktop GUI client used to browse databases, run queries, and inspect collections.

### Step-by-Step Connection Procedure
1. Launch **MongoDB Compass** from your Start menu or Desktop.
2. In the **New Connection** tab, locate the **URI** connection bar.
3. Paste the local connection string:
   ```
   mongodb://127.0.0.1:27017/placementpro
   ```
   *(If using MongoDB Atlas, paste your `mongodb+srv://...` URI instead).*
4. Click the green **Connect** button.
5. In the left navigation tree, select the **placementpro** database.
6. You will see 6 collections:
   - `students`: Contains Rahul Sharma's profile and technical badges.
   - `dsaquestions`: Contains all 22 DSA problems with difficulty levels and solve states.
   - `applications`: Contains company job applications and salary packages.
   - `companypreparations`: Contains recruitment rounds and topic checklists.
   - `mockquestions`: Contains the 24+ question bank.
   - `mockinterviews`: Contains completed mock interview evaluation attempts.
   - `studyactivities`: Contains daily activity logs.

### Live Demonstration for Viva
1. In the web portal, open the **Applications** page.
2. Click **Add Application**, enter a company (e.g. *Microsoft*, role *Software Engineer*), and click **Save to MongoDB**.
3. In MongoDB Compass, click into the `applications` collection and click the **Refresh** button (or press `Ctrl + R`).
4. Point out the newly inserted BSON document with its unique `_id` and timestamps!

---

## 8. REST API Endpoints Reference

### Health & System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server uptime, status, and MongoDB host/port info |
| `GET` | `/api/seed/status` | Returns document count for all 6 collections |
| `POST` | `/api/seed/load` | Idempotently seeds or refreshes default dataset |
| `POST` | `/api/seed/reset` | Cleans and resets collections to initial demo state |

### Student Profile
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students/demo` | Retrieves the primary demo student profile |
| `PUT` | `/api/students/:id` | Updates profile fields, skills array, and target companies |

### DSA Module
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dsa` | Queries questions with `?search=&topic=&difficulty=&status=` |
| `POST` | `/api/dsa` | Adds a new DSA question |
| `PUT` | `/api/dsa/:id` | Updates question details or marks status as Solved |
| `DELETE` | `/api/dsa/:id` | Removes question from MongoDB |
| `GET` | `/api/dsa/stats/topics` | Returns topic-wise aggregation breakdown |

### Company Preparation
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/companies` | Lists all company guides with progress percentages |
| `GET` | `/api/companies/:id` | Retrieves single company profile by ID or slug |
| `PATCH` | `/api/companies/:id/toggle-item` | Toggles checklist item in MongoDB and recalculates % |
| `PUT` | `/api/companies/:id` | Updates student notes for target company |

### Applications Tracker
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/applications` | Lists applications with status filters and sorting |
| `POST` | `/api/applications` | Creates new placement application |
| `PUT` | `/api/applications/:id` | Updates application status, interview date, or notes |
| `DELETE` | `/api/applications/:id` | Deletes application record from MongoDB |

### Mock Interviews
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/mock-interviews/questions` | Retrieves questions for selected category |
| `POST` | `/api/mock-interviews/evaluate` | Runs rule-based evaluator and saves session |
| `GET` | `/api/mock-interviews` | Retrieves past interview attempts and average scores |

### Analytics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/dashboard` | Aggregated KPI stats, weekly study hours, and funnels |
| `GET` | `/api/analytics/preparation` | Detailed difficulty breakdown and mock score curves |

---

## 9. Troubleshooting & FAQs

### Q1: The top navbar displays "MongoDB Offline"
- **Solution:** Verify that your MongoDB service is running. In Windows PowerShell:
  ```powershell
  Get-Service MongoDB
  ```
  If stopped, run:
  ```powershell
  net start MongoDB
  ```

### Q2: PowerShell shows `npm : File ... npm.ps1 cannot be loaded`
- **Solution:** On systems with PowerShell script execution restrictions, always run `npm.cmd` and `npx.cmd` instead of `npm`.

### Q3: How do I change the MongoDB database name?
- Modify `MONGODB_URI` in `backend/.env`:
  ```
  MONGODB_URI=mongodb://127.0.0.1:27017/my_new_db
  ```
  Restart the backend server.
