# 📡 Farm Fusion 2.0 REST API Reference

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication (`/auth`)
* `POST /auth/register` — Register a new `farmer`, `student`, `expert`, or `admin`.
* `POST /auth/login` — Authenticate and receive JWT token.
* `GET /auth/me` — Retrieve active user session.
* `PUT /auth/update-profile` — Update basic profile information.

## 2. Farmer Intelligence (`/farmer-profile`, `/farms`, `/lifecycle`)
* `GET /farmer-profile/me` — Retrieve soil passport, NPK, and farm setup.
* `PUT /farmer-profile/me` — Update farm details and machinery.
* `GET /farms` — List registered land parcels and plots.
* `GET /lifecycle` — Retrieve active crop lifecycle cycles.
* `POST /lifecycle` — Initiate a new 8-stage crop cycle.
* `PUT /lifecycle/:id/stage` — Advance crop cycle to the next agronomic stage.

## 3. Crop ML & Economics (`/crops`)
* `POST /crops/recommend` — Run ML crop suitability algorithm against soil NPK and pH.
* `POST /crops/profit-estimate` — Calculate total costs, revenue, net margin, and break-even points.

## 4. Personalized Government Schemes (`/schemes`)
* `GET /schemes` — List all active welfare schemes.
* `POST /schemes/match` — Compute personalized match percentage and checklist against farmer profile.

## 5. Disease Detection (`/disease`)
* `POST /disease/detect` — Multi-part image upload; proxies YOLOv8 vision and enriches with ICAR treatments.

## 6. AI Copilot & RAG (`/ai`)
* `POST /ai/copilot` — Multi-turn conversational query grounded with ICAR knowledge base.
* `GET /ai/conversations` — Retrieve past chat sessions.

## 7. Veterinary & Livestock (`/veterinary`)
* `GET /veterinary/animals` — List registered farm animals.
* `POST /veterinary/records` — Log vaccination or deworming event.
* `POST /veterinary/ai-symptom-check` — Run preliminary IVRI symptom safety triage.

## 8. Academic Student Mode (`/student`, `/cases`)
* `GET /student/dashboard` — Progress summary and enrolled modules.
* `GET /student/courses` — ICAR curriculum lessons and key takeaways.
* `GET /student/quizzes` — MCQ assessments.
* `POST /student/quizzes/:id/submit` — Submit answers and receive immediate score with explanations.
* `GET /cases` — List farmer field problems.
* `POST /cases/:id/analyze` — Student submits diagnostic proposal.
* `POST /cases/:id/validate` — Certified agronomist/veterinarian validates proposal.
