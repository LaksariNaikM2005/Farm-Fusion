import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers.disease import router as disease_router
from routers.crop import router as crop_router
from services.disease_service import run_disease_inference

app = FastAPI(
    title="Farm Fusion 2.0 AI Intelligence Microservice",
    description="Computer Vision Disease Detection, ML Crop Suitability & Agronomy RAG APIs",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular Routers
app.include_router(disease_router)
app.include_router(crop_router)

@app.get("/")
async def root():
    return {
        "service": "Farm Fusion 2.0 AI Intelligence Microservice",
        "status": "Online",
        "models": ["YOLOv8-PlantClassifier", "Agronomy-Decision-Tree", "RAG-Grounding-Engine"]
    }

# Legacy Compatibility Endpoint
@app.post("/predict/disease")
async def predict_disease_legacy(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        return run_disease_inference(contents)
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
