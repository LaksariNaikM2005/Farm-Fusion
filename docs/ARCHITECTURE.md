# 🏗️ Farm Fusion 2.0 System Architecture

## Overview
Farm Fusion 2.0 is designed as a distributed, decoupled agricultural decision-support ecosystem connecting three primary user personas: **Farmers**, **Students**, and **Certified Agricultural Experts**.

```mermaid
graph TD
    Client["Frontend: React 19 + Vite 8 + Redux Toolkit"]
    Gateway["Node.js + Express API Gateway (:5000)"]
    Mongo[("MongoDB Data Store")]
    AIService["FastAPI Python Microservice (:8000)"]
    YOLO["YOLOv8 Plant Disease Classifier"]
    RAG["Agronomy RAG Knowledge Base Engine"]
    APMC["APMC & OpenWeather Data Feeds"]

    Client -->|REST & JWT| Gateway
    Client -->|Socket.IO Signals & WebRTC| Gateway
    Gateway -->|Mongoose ORM| Mongo
    Gateway -->|HTTP Internal Multi-part| AIService
    Gateway -->|RAG Ingestion & Vector Search| RAG
    AIService -->|Inference Engine| YOLO
    Gateway -->|External Sync| APMC
```

## Core Subsystems
1. **AI Farmer Profile & Soil Passport**: Stores soil chemistry (N, P, K, pH), micro-climate, water sources, livestock count, and financial parameters.
2. **Crop Intelligence Engine**: Evaluates agronomic suitability using decision-tree weighting, paired with an economic crop profit and break-even calculator.
3. **Grounded RAG Farmer Copilot**: Multi-turn conversational assistant injecting farm context into ICAR/KVK-verified agricultural literature.
4. **8-Stage Farm Lifecycle Navigator**: Step-by-step guidance across `PLAN` → `PREPARE` → `PLANT` → `GROW` → `MONITOR` → `HARVEST` → `SELL` → `ANALYZE`.
5. **Computer Vision Disease Scanner**: YOLOv8 visual classifier mapped with dual-stage organic and chemical management protocols.
6. **Farmer ↔ Student ↔ Expert Tripartite Hub**: Crowdsourced field problem resolution where students propose academic analyses and certified scientists provide official validation.
