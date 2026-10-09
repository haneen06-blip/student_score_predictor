# ApexScore | Student Academic Performance Predictive Analytics Platform

An empirical academic forecasting platform and student score attribution engine built with **Next.js 14** (App Router, Tailwind CSS, TypeScript) and **FastAPI** (scikit-learn, joblib).

The platform transforms student demographic, behavioral, and academic engagement data into final exam score projections, itemized factor attributions, trajectory simulations, and cohort-level benchmarks.

---

## Key Features

- **Empirical Score Forecaster**: Multivariate standardized linear regression modeling based on a verified cohort of 6,607 students ($R^2 = 0.74$, $\text{MAE} = 1.62$, $\text{RMSE} = 2.04$).
- **Itemized Factor Attribution**: Exact points decomposition showing which variables pulled the score up ($+$ points) or acted as a drag ($-$ points).
- **Interactive Trajectory Simulator ("What-If" Analysis)**: Instant recalculation as students or advisors adjust attendance rates, weekly study hours, or tutoring sessions.
- **Cohort Benchmarking**: Visual comparisons against empirical statistical norms (cohort mean attendance: 80.0%, average study: 20.0 hrs/wk, baseline score: 67.2 pts).
- **Batch Cohort Processing**: Process classroom datasets, evaluate pass rates, inspect score distributions, and download CSV templates.
- **Exportable Academic Report**: Print or export official PDF-ready academic assessment summaries.
- **Zero AI Icons / Academic Framing**: Purely academic and statistical visualization (no sparkle, bot, or brain iconography).
- **Dual-Engine Architecture**: Operates with a live FastAPI backend while supporting instant zero-latency client/serverless execution.

---

## Project Structure

```
student_score_web/
├── backend/                        # FastAPI Python Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application, CORS, endpoints
│   │   ├── schemas.py              # Pydantic models for validation
│   │   ├── model_service.py        # Model inference & factor attribution
│   │   └── student_score_model.pkl # Trained Scikit-Learn Pipeline artifact
│   ├── api/
│   │   └── index.py                # Vercel Python serverless entry point
│   ├── requirements.txt            # Python dependencies
│   ├── test_api.py                 # API test suite
│   ├── vercel.json                 # Vercel configuration for Python runtime
│   └── run.py                      # Uvicorn launcher script
│
├── frontend/                       # Next.js 14 App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with navigation & typography
│   │   │   ├── page.tsx            # Main executive dashboard
│   │   │   ├── globals.css         # Tailwind & glassmorphism styling
│   │   │   ├── batch/page.tsx      # Cohort batch processing & table
│   │   │   ├── analytics/page.tsx  # Model architecture & empirical weights
│   │   │   └── api/predict/route.ts# Next.js serverless route for Vercel
│   │   ├── components/             # Modular dashboard components
│   │   │   ├── Navbar.tsx
│   │   │   ├── ScoreGauge.tsx
│   │   │   ├── PredictionForm.tsx
│   │   │   ├── FeatureImpactChart.tsx
│   │   │   ├── WhatIfSimulator.tsx
│   │   │   ├── BenchmarkComparison.tsx
│   │   │   ├── RecommendationsCard.tsx
│   │   │   └── ReportExportModal.tsx
│   │   ├── lib/                    # API client, fallbacks, and constants
│   │   │   ├── api.ts
│   │   │   ├── modelFallback.ts
│   │   │   └── constants.ts
│   │   └── types/index.ts          # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
│
├── vercel.json                     # Root monorepo configuration for Vercel
└── README.md                       # Documentation
```

---

## Local Setup & Development

### 1. Backend (FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run tests
python test_api.py

# Launch development server
python run.py
# Or with uvicorn directly:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- API Base URL: `http://localhost:8000`
- Interactive Swagger Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

### 2. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

- Web Dashboard: `http://localhost:3000`

---

## Deploying to Vercel

### Method 1: Deploying the Next.js Frontend (Recommended)
1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New Project**.
3. Select this repository and set **Root Directory** to `student_score_web/frontend`.
4. (Optional) Set the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your hosted FastAPI URL (e.g. on Render, Railway, or Fly.io).
   - If not set, the frontend automatically utilizes the high-precision Next.js serverless route at `/api/predict`.
5. Click **Deploy**.

### Method 2: Monorepo Deployment
A root `vercel.json` is provided in `student_score_web/` which configures build commands and output directories for unified repository deployment.

---

## Model Specifications & Features

The model utilizes 13 behavioral, academic, and environmental variables:

| Rank | Feature | Standardized Weight ($\beta$) | Description |
|:---:|:---|:---:|:---|
| 1 | `Attendance` | $+2.2840$ | Percentage of lectures attended ($0-100\%$) |
| 2 | `Hours_Studied` | $+1.7356$ | Weekly dedicated study hours ($1-44$) |
| 3 | `Access_to_Resources` | $+0.7307$ | Educational materials access (Low / Med / High) |
| 4 | `Previous_Scores` | $+0.6770$ | Baseline prior exam score |
| 5 | `Parental_Involvement` | $+0.6761$ | Level of home academic reinforcement |
| 6 | `Tutoring_Sessions` | $+0.5869$ | Monthly supplemental tutoring sessions ($0-8$) |
| 7 | `Peer_Influence` | $+0.3912$ | Peer study circle orientation |
| 8 | `Parental_Education_Level`| $+0.3800$ | Highest parental educational attainment |
| 9 | `Motivation_Level` | $+0.3681$ | Self-reported student drive |
| 10 | `Distance_from_Home` | $-0.3197$ | Daily commute burden (Near / Moderate / Far) |
| 11 | `Teacher_Quality` | $+0.3078$ | Instruction quality assessment |
| 12 | `Extracurricular_Activities` | $+0.2821$ | Participation in extracurriculars (No / Yes) |
| 13 | `Internet_Access` | $+0.2488$ | Home high-speed connectivity (No / Yes) |

---

## API Reference

### Single Student Score Prediction
```http
POST /api/predict
Content-Type: application/json

{
  "Attendance": 88.0,
  "Hours_Studied": 24.0,
  "Previous_Scores": 82.0,
  "Access_to_Resources": "High",
  "Parental_Involvement": "Medium",
  "Tutoring_Sessions": 2,
  "Parental_Education_Level": "College",
  "Peer_Influence": "Positive",
  "Distance_from_Home": "Near",
  "Motivation_Level": "High",
  "Teacher_Quality": "High",
  "Extracurricular_Activities": "Yes",
  "Internet_Access": "Yes",
  "student_id": "STU-001"
}
```

### What-If Trajectory Simulation
```http
POST /api/simulate
Content-Type: application/json

{
  "base_student": { ... },
  "changes": {
    "Hours_Studied": 30.0,
    "Attendance": 95.0
  }
}
```

### Batch Cohort Prediction
```http
POST /api/predict/batch
Content-Type: application/json

{
  "students": [ ... ]
}
```
