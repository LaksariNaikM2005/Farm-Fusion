from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.crop_service import calculate_crop_recommendation

router = APIRouter(prefix="/crop", tags=["Crop Intelligence"])

class CropRecommendRequest(BaseModel):
    nitrogen: float = 140.0
    phosphorus: float = 45.0
    potassium: float = 180.0
    ph: float = 6.5
    rainfall: float = 850.0
    temperature: float = 26.0
    soil_type: Optional[str] = "Red"

@router.post("/recommend")
async def recommend_crop(payload: CropRecommendRequest):
    results = calculate_crop_recommendation(
        n=payload.nitrogen,
        p=payload.phosphorus,
        k=payload.potassium,
        ph=payload.ph,
        rainfall=payload.rainfall,
        temp=payload.temperature,
        soil_type=payload.soil_type or "Red"
    )
    return {
        "success": True,
        "recommendations": results,
        "model": "FarmFusion-CropDecisionTree-v2.0"
    }
