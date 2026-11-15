# 🧺 laundryloop — Hostel Laundry Management System
### *Laundry Day Roulette: An INT335 Design Thinking Academic Prototype*
**Institution:** Lovely Professional University (LPU), Phagwara, Punjab  
**Course:** INT335 Design Thinking  

---

## 🌟 Executive Summary

In university hostel environments, laundry services frequently face three core issues:
1. **Uncertain Turnaround:** Students do not know when their clothes will be ready.
2. **Missing or Mixed-Up Clothes:** Items are misplaced, handed to the wrong student, or difficult to trace.
3. **Unclear Communication:** No transparent order tracking, delay alerts, or complaint escalation mechanism.

**laundryloop** eliminates the *"Laundry Day Roulette"* through an intuitive, mobile-first web prototype featuring transparent 6-stage turnaround tracking, secure **4-digit PIN collection verification**, automated delay schedule revisions, and a structured **Hostel Warden grievance redressal system**.

---

## 🚀 Key Features by User Role

### 🎓 1. Student Portal (`Aarav Sharma — BH-3, Room 312-B`)
- **Active Order Dashboard:** Live hero card displaying active order (`LD-1001`), total items, collection counter, and current status.
- **Visual Turnaround Progress Tracker:**
  $$\text{Received} \longrightarrow \text{Sorting} \longrightarrow \text{Washing} \longrightarrow \text{Drying} \longrightarrow \text{Ready for Pickup} \longrightarrow \text{Collected}$$
- **4-Digit Secure Collection PIN:** Confidential PIN generated upon submission. Required at the counter to verify handover and eliminate mixed-up or wrongly claimed bags.
- **Submit Laundry Form:** Interactive item counters (Shirts, Trousers, T-Shirts, Undergarments, Bedding, Others), care tag presets (*"Separate dark colors"*, *"Gentle spin"*), and estimated turnaround date.
- **Live Order Tracker:** Detailed step-by-step timeline with operator timestamps and amber warning notices for delayed batches (*e.g., boiler maintenance in LD-1003*).
- **My Orders:** Searchable and filterable history tabs (*All, In Progress, Ready for Pickup, Delayed, Completed*).
- **Report an Issue:** Structured complaint form with ticket generation (`CMP-XXXX`), category tags (*Missing clothes, Damaged clothes, Excessive delay*), and real-time warden notes.

### 🧺 2. Laundry Staff Desk (`Ramesh Kumar — Central Laundry`)
- **Operational Metrics:** 4 real-time KPI cards (*Total Active, Awaiting Wash, Ready for Pickup, Delayed Batches*).
- **Batch Stage Advancement:** Ability to update orders across the 6 wash cycle stages.
- **Schedule Delay Management:** Record delay reasons (*e.g., boiler line maintenance, high humidity drying elongation*) and publish revised expected collection dates directly to student trackers.
- **PIN Verification Counter Tool:** Handover verification modal where staff enters the student's 4-digit PIN before marking clothes as `Collected`.

### 🛡️ 3. Hostel Warden Redressal (`Dr. Sanjeev Gupta — Chief Warden`)
- **Grievance Oversight:** Central dispute resolution dashboard.
- **Ticket Investigation:** Review problem descriptions, requested resolutions, and related order details without exposing sensitive student personal data.
- **Status Workflow:** Transition complaints from `Submitted` $\rightarrow$ `Under Review` $\rightarrow$ `Resolved`.
- **Official Warden Action Notes:** Record camera review logs, sorting bin inspections, or approved compensation notes visible to the student.

---

## 🧪 INT335 "Try the Prototype" Guided Usability Tasks

An interactive evaluation guide is integrated directly into the header and sidebar to test the prototype during classroom presentations:

| # | Task | Role | Key Verification |
|---|------|------|------------------|
| **1** | Submit a new laundry batch | Student | Generates unique Order ID and 4-digit security PIN |
| **2** | Track active order | Student | Step-by-step progress timeline with operator timestamps |
| **3** | Inspect delayed order (`LD-1003`) | Student | Highlights delay reason and revised expected pickup date |
| **4** | Report a missing-clothes issue | Student | Issues official grievance ticket (`CMP-803`) routed to Warden |
| **5** | Advance stage & verify handover | Staff | Use PIN tool to simulate student counter pickup verification |
| **6** | Review & resolve student complaint | Warden | Update complaint to `Resolved` with official warden action note |

---

## 🛠️ Technology Stack

- **Core Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS (Modern campus color palette: Deep Navy `#0f172a`, Sky Blue `#0284c7`, Mint Green `#10b981`, Amber `#d97706`)
- **Typography:** *Plus Jakarta Sans* (Headings) & *Inter* (Body) via Google Fonts
- **Icons:** `lucide-react`
- **Persistence:** Local Storage persistence (`localStorage`) with a one-click **"Reset Demo Data"** action.
- **Build Tool:** Vite 8

---

## 📂 Project Directory Structure

```
laundryloop/
├── index.html                   # Entry HTML with meta tags & Google Fonts
├── package.json                 # Project configuration & scripts
├── tsconfig.json                # TypeScript project references
├── tsconfig.app.json            # React application compiler options
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root component & role-based view router
│   ├── index.css                # Global styles, Tailwind directives & utilities
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Order, Complaint, Timeline)
│   ├── data/
│   │   └── initialData.ts       # Demo records (LD-1001, LD-1002, LD-1003, CMP-801)
│   ├── context/
│   │   └── LaundryContext.tsx   # Global state, persistence & action handlers
│   └── components/
│       ├── common/
│       │   ├── Badge.tsx         # Reusable status pills with icons & colors
│       │   ├── DemoBanner.tsx    # INT335 project context & reset demo button
│       │   ├── RoleSwitcher.tsx  # Student / Staff / Warden switcher
│       │   ├── StatusTimeline.tsx# Responsive horizontal & vertical stepper
│       │   └── ToastContainer.tsx# Real-time alert notifications
│       ├── layout/
│       │   ├── Navbar.tsx        # Header with role switcher, notifications, menu
│       │   ├── Sidebar.tsx       # Role-aware navigation & profile card
│       │   └── Footer.tsx        # LPU design thinking context & disclaimers
│       ├── prototype/
│       │   └── PrototypeGuideModal.tsx # 6-task INT335 evaluation checklist
│       ├── student/
│       │   ├── StudentDashboard.tsx   # Active order hero, timeline, quick actions
│       │   ├── SubmitLaundry.tsx      # Multi-item form, care tags, PIN modal
│       │   ├── TrackOrder.tsx         # Comprehensive timeline, PIN toggle/copy
│       │   ├── MyOrders.tsx           # Order history with filter tabs & search
│       │   └── ReportProblem.tsx      # Grievance filing & complaint tracker
│       ├── staff/
│       │   ├── StaffDashboard.tsx     # 4 KPI cards, order table, stage updater
│       │   └── PinVerificationModal.tsx# Counter pickup PIN verification tool
│       └── warden/
│           └── WardenOverview.tsx     # Grievances board & resolution recorder
```

---

## 💻 Setup and Run Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher (v24.x tested)
- **npm:** v9.0.0 or higher (v11.x tested)

### 1. Clone or Open Project Directory
```bash
cd e:\laundryloop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
**`http://localhost:5173/`**

### 4. Build for Production (Optional)
```bash
npm run build
```

---

## 📋 Academic Disclaimer

This project is an academic Design Thinking prototype designed for **INT335 Design Thinking** at **Lovely Professional University (LPU)**. It operates fully client-side with demo data stored in browser `localStorage`. Real external SMS gateways or university intranet logins are omitted by design to facilitate rapid usability testing and iterative feedback with hostellers and laundry staff.
