from fastapi import APIRouter, File, UploadFile, HTTPException
from services.disease_service import run_disease_inference

router = APIRouter(prefix="/disease", tags=["Disease Detection"])

@router.post("/predict")
async def predict_disease_route(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (JPEG/PNG)")
    
    try:
        contents = await file.read()
        result = run_disease_inference(contents)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}
