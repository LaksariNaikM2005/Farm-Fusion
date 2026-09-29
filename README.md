# 🌾 Farm Fusion 2.0: AI-Powered Personalized Agricultural Decision-Support Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-yellow.svg)](https://github.com/ultralytics/ultralytics)

> **Farm Fusion 2.0** is an AI-powered personalized agricultural decision-support ecosystem connecting farmers, students, certified experts, verified knowledge bases, markets, schemes, and intelligent farm lifecycle management.

---

## 🌟 Central Transformation: 1.0 vs 2.0

| Capability | Farm Fusion 1.0 | Farm Fusion 2.0 Ecosystem |
|---|---|---|
| **Farmer Identity** | Basic name & location string | **AI Farmer Profile & Soil Passport** (NPK, pH, water, livestock, machinery) |
| **Advisory & Chat** | Generic chatbot | **Grounded RAG Copilot** citing ICAR, KVK & Agri University manuals |
| **Plant Disease** | Standalone YOLO classification | **Dual-Stage Diagnostic Engine** (Vision + Organic/Chemical Control + Expert Escalation) |
| **Government Schemes** | Flat catalog list | **Personalized Eligibility Matcher** (% match score, land/state/crop checklist) |
| **Crop Planning** | None | **ML Crop Recommendation Engine** + **Interactive Profit/Margin Calculator** |
| **Lifecycle** | None | **8-Stage Farm Lifecycle Engine** (Plan → Prepare → Plant → Grow → Monitor → Harvest → Sell → Analyze) |
| **Accounting & ROI** | None | **Farm Expense Tracker** + **Visual Recharts ROI & Cost/Acre Analytics** |
| **Sustainability** | None | **Eco-Index Score (0-100)** across water, soil, biological diversity & input management |
| **Operations** | Products e-commerce only | **Equipment Rental Hub** (Tractors, Drones, Harvesters with Operators) |
| **Livestock** | None | **Veterinary Module** (Animal registry, vaccination scheduler, safety symptom triage) |
| **Education** | None | **Tripartite Ecosystem & Student Mode** (ICAR Courses, JRF/SRF MCQ Arena, Case Studies) |
| **Accessibility** | English only | **Multilingual Regional UI & Voice Engine** (English, ಕನ್ನಡ, हिंदी) |

---

## 🏗️ Architecture

```
                                FARM FUSION 2.0
                                       |
                +----------------------+----------------------+
                |                      |                      |
             FARMERS                STUDENTS               EXPERTS
                |                      |                      |
                +----------------------+----------------------+
                                       |
                                APPLICATION API
                          Node.js + Express + MongoDB
                                       |
                +----------------------+----------------------+
                |                                             |
          AI/ML SERVICE                                  RAG SERVICE
         FastAPI / Python                           Knowledge Repository
                |                                             |
      YOLOv8 + ML Decision Tree                    ICAR / KVK / IVRI Docs
                |                                             |
                +----------------------+----------------------+
                                       |
                               FARM INTELLIGENCE
                                       |
             +-------------------------+-------------------------+
             |                         |                         |
          Crop ML                  Disease AI                Market AI
             |                         |                         |
             +-------------------------+-------------------------+
                                       |
                               AI FARMER COPILOT
                                       |
                               EXPERT VALIDATION
```

---

## 🚀 Quick Start

### 1. Backend Server (Node.js & MongoDB)
```bash
cd backend
npm install
npm run dev
```
* Runs on `http://localhost:5000` (automatically attaches MongoDB In-Memory Server if local Mongo instance is not running).

### 2. AI Intelligence Microservice (Python & FastAPI)
```bash
cd ai-service
# Activate virtual environment
..\.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
* Runs on `http://localhost:8000` (YOLOv8 disease classifier & crop decision trees).

### 3. Frontend Web Application (React & Vite)
```bash
cd frontend
npm install
npm run dev
```
* Runs on `http://localhost:5173`.

---

## 📱 Default User Credentials for Demonstration

| Role | Email | Password | Primary Feature Access |
|---|---|---|---|
| **Farmer** | `farmer@demo.com` | `password123` | Farm Lifecycle, Copilot, Crop AI, Disease Scan, Schemes, Expenses |
| **Student** | `student@demo.com` | `password123` | ICAR Courseware, MCQ Quiz Arena, Case Study Diagnostic Proposals |
| **Expert** | `expert@demo.com` | `password123` | Scientific Validation, Farmer Case Certification, Video Consultations |
| **Admin** | `admin@demo.com` | `password123` | Analytics, User Moderation, Product & Scheme Approvals |

---

## 📖 Comprehensive Documentation

* [Architecture & System Flow](docs/ARCHITECTURE.md)
* [REST API Reference](docs/API.md)
* [AI & Computer Vision Architecture](docs/AI_ARCHITECTURE.md)
* [5-10 Min Master Demonstration Walkthrough](docs/DEMO_GUIDE.md)

---

## ⚖️ Safety & Accuracy Disclaimer
* **Agricultural Recommendations**: Model estimates based on ICAR agronomy standards. Actual outcomes vary by micro-climate and field conditions.
* **Veterinary Safety**: AI animal symptom triage is for preliminary first-aid guidance only and never replaces a certified veterinary doctor.
* **Disease Detection**: YOLOv8 results are potential detections; confirm with plant pathology experts before applying systemic chemical controls.
