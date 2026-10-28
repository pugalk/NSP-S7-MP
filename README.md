# National Scholarship Renewal & Eligibility Re-Verification Portal (EligiFind)

Re-creation of the **[National Scholarship Renewal & Eligibility Re-Verification Portal](https://eligifind-scholarship.lovable.app/)**, architected and split into dedicated **`frontend/`** and **`backend/`** folders.

---

## 🏛️ Project Overview

The portal solves the challenge of opaque rejections and fragmented application procedures across national and state scholarship schemes. It provides:
1. **82 Active Demonstration Schemes**: Across 13 categories (Central Govt, State Govt, Merit-Based, Need-Based, Minority, Women / Girls, Disability, Sports, Research, Higher Education, Institutional, Private / Corporate) and 11 Indian States.
2. **Flipkart-Style Mega Portal Architecture**:
   - **Central Mega Search Bar with Instant Autocomplete**: Real-time dropdown suggestions with scheme names, provider departments, and grant amounts.
   - **Top Category Navigation Strip**: Horizontal icon bar with quick category filtering and active counters.
   - **Dynamic Hero Banner Carousel**: Auto-rotating promotional campaigns (National Admission Window, PFMS DBT Guarantee, TOM AI Matching, Renewal Urgent Alert).
   - **Side-by-Side Scheme Comparison Matrix (`/compare`)**: Compare up to 4 schemes side-by-side across grant amounts, min marks, CGPA, attendance, income ceilings, and document checklists with a persistent floating bottom dock.
   - **Shortlisted Saved Wishlist (`/wishlist`)**: Save schemes with 1-click bookmarks and cumulative funding potential counter.
   - **Faceted Catalog Filters & Grid/List View**: Price range slider, cut-off % slider, category radio facets, and instant layout switching.
3. **Transparent Multi-Tier Rule Engine**: Evaluates student percentage, CGPA, attendance, annual income ceiling, domicile, and community with exact criteria breakdown.
4. **Dedicated Renewal Re-Verification Desk**: Existing scholarship beneficiaries can re-verify current year marks, attendance, and income without re-entering their entire profile.
5. **End-to-End Application Pipeline (Flipkart "My Orders" format)**: Multi-step application wizard with DBT bank details, certificate uploads, and a 5-stage live status tracker:
   `Submitted` ➔ `Document Verification` ➔ `Under Verification` ➔ `Provider Review` ➔ `Approved`.
6. **Staff & Officer Verification Desk**: Administrative portal for reviewing applications, screening certificates, and taking decisions with audit remarks.
7. **Scheme Provider / Organizer Desk**: Dedicated portal for scholarship foundations and CSR trusts to manage budgets, monitor disbursals, and sanction applications.
8. **AI Assistant "TOM"**: Conversational scholarship & renewal eligibility advisor with profile-based scheme recommendations and natural language explanations.
9. **Offline-First Progressive Web App (PWA)**: Full Service Worker (`sw.js`) caching across all 82 schemes for low-bandwidth rural pockets, Web App Manifest (`manifest.webmanifest`), and installability on desktop/mobile.
10. **Interactive Future Scope & Viva Defense Sandbox**: Live interactive architectural simulators on `/future-scope` for India's Digital Public Infrastructure (DigiLocker/APAAR, AI OCR Tamper Detection, PFMS DBT, Blockchain Dual-Claim Prevention, Predictive ML Retention, Bhashini Voice AI, UIDAI Face-RD Biometrics).

---

## 📁 Project Structure

```
NSP S7 MP/
├── backend/
│   ├── data/
│   │   ├── scholarships.json         # All 82 scholarships database
│   │   ├── constants.json            # Categories, states, courses, communities
│   │   ├── users.json                # Persisted student accounts & profiles
│   │   ├── applications.json         # Applications with stage history
│   │   └── documents.json            # Uploaded document records
│   ├── routes/
│   │   ├── scholarships.js           # Filtering, search, single scheme
│   │   ├── eligibility.js           # Multi-rule evaluation engine
│   │   ├── auth.js                  # Student register, login, profile
│   │   ├── applications.js          # Submissions & status progression
│   │   ├── documents.js             # File upload and certificate status
│   │   └── admin.js                 # Officer login & statistics
│   ├── uploads/                     # Storage for uploaded certificates
│   ├── package.json
│   └── server.js                    # Express API server
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg              # Government scholarship crest icon
│   │   ├── icon-maskable.svg        # Maskable high-res PWA icon
│   │   ├── manifest.webmanifest     # Progressive Web App manifest
│   │   └── sw.js                    # Service Worker with offline caching
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Portal header with notification drawer & PWA controls
│   │   │   ├── Footer.jsx           # Portal footer
│   │   │   ├── OfflineBanner.jsx    # Real-time offline mode & sync notification bar
│   │   │   ├── PWAInstallBanner.jsx # Native app installation prompt
│   │   │   ├── TomAIAssistant.jsx   # TOM conversational AI scholarship advisor
│   │   │   ├── ModuleSandbox.jsx    # Interactive architectural viva sandbox
│   │   │   ├── ScholarshipCard.jsx  # Scheme cards with deadline countdowns
│   │   │   ├── EligibilityRuleModal.jsx # Detailed rule breakdown modal
│   │   │   ├── DocumentUploader.jsx # Certificate upload component
│   │   │   └── StatusBadge.jsx      # Pipeline stage pills
│   │   ├── context/
│   │   │   ├── PortalContext.jsx    # Central state provider (localStorage persisted)
│   │   │   └── PWAContext.jsx       # Service worker lifecycle, install prompt & offline sync
│   │   ├── data/
│   │   │   └── scholarships.js      # Preloaded 82 schemes & categories
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Hero, 13 categories, 6-step flow, deadlines, FAQs
│   │   │   ├── ScholarshipsPage.jsx # Search, filter by category/state/status
│   │   │   ├── ScholarshipDetailPage.jsx # Criteria matrix, benefits, documents
│   │   │   ├── EligibilityPage.jsx  # Live rule engine evaluation
│   │   │   ├── StudentDashboardPage.jsx # 5-stage tracker & document desk
│   │   │   ├── ApplyScholarshipPage.jsx # Multi-step application wizard
│   │   │   ├── RenewalPage.jsx      # Scholarship renewal re-verification
│   │   │   ├── StudentLoginPage.jsx # Quick demo student login
│   │   │   ├── StudentRegisterPage.jsx # Student registration
│   │   │   ├── AdminLoginPage.jsx   # Officer desk login
│   │   │   ├── AdminDashboardPage.jsx # Application review & decisions
│   │   │   ├── AboutPage.jsx        # Mission & transparency
│   │   │   └── ContactPage.jsx      # Helpdesk & grievance submission
│   │   ├── App.jsx                  # React Router configuration
│   │   ├── index.css                # Global design system & tokens
│   │   └── main.jsx                 # Vite application entry
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                     # Monorepo management scripts
└── README.md
```

---

## 🚀 How to Run the Project

### Option A: Quick Single-Command Start (Backend + Frontend)
Run in the root directory:
```bash
npm run dev
```
This automatically starts both the Express backend API (`http://localhost:5000`) and the Vite React frontend (`http://localhost:3000`) with live proxy and hot-reloading!

---

### Option B: Run in Separate Terminals

#### 1. Install Dependencies
```bash
npm run install:all
```
*(Or install each separately: `cd backend && npm install`, then `cd ../frontend && npm install`)*

#### 2. Start the Backend API Server
In one terminal:
```bash
cd backend
npm run dev
```
The API server starts at: **`http://localhost:5000`**

#### 3. Start the Frontend Development Server
In a second terminal:
```bash
cd frontend
npm run dev
```
The application opens at: **`http://localhost:3000`**

---

## 🔑 Demo Credentials

### Student Account:
- **Email:** `student@nsp.gov.in`
- **Password:** `student123`
*(Or click the one-click "Auto-fill Demo Student Credentials" button on the login screen)*

### Verification Officer / Admin Account:
- **Email:** `admin@nsp.gov.in`
- **Password:** `admin`
*(Or click the one-click "Auto-fill Demo Officer Credentials" button on the officer login screen)*

---

## 🔗 Original Project Reference
- Lovable Portal: https://eligifind-scholarship.lovable.app/
- Lovable Project ID: `lovp_4s89xnz4nh9xkaf7ngm3trv8dg`
#   N S P - S 7 - M P  
 