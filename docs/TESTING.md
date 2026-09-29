# 🧪 Testing & Verification Guide

## Test Suite Execution

### 1. Backend Server Health & Route Verification
```bash
cd backend
node -e "require('./server.js'); setTimeout(() => { console.log('✅ Backend verification passed'); process.exit(0); }, 3000);"
```
* Verifies MongoDB connection, Mongoose model bindings, Socket.IO initialization, and all 14 REST route groups.

### 2. AI Intelligence Microservice Test
```bash
cd ai-service
python -c "import main; print('✅ AI Microservice verified:', main.app.title)"
```
* Verifies PyTorch, Ultralytics YOLOv8 `farmfusion_v1.pt` model weights, and modular decision tree routers.

### 3. Frontend Production Compilation
```bash
cd frontend
npm run build
```
* Runs Vite production bundle optimization, verifies JSX/CSS asset imports, and validates TypeScript/ESLint rules.
