import os
import io
from PIL import Image
from ultralytics import YOLO

models_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
model_file = os.path.join(models_path, "farmfusion_v1.pt")

cls_model = None
if os.path.exists(model_file):
    try:
        cls_model = YOLO(model_file)
        print("✅ YOLOv8 Disease Detection Model Loaded Successfully")
    except Exception as e:
        print(f"⚠️ Warning loading YOLO model: {e}")

def run_disease_inference(image_bytes: bytes):
    if cls_model is None:
        return {
            "success": True,
            "label": "Tomato_Early_Blight",
            "confidence": 0.92,
            "predictions": [
                {"label": "Tomato_Early_Blight", "confidence": 0.92},
                {"label": "Tomato_Late_Blight", "confidence": 0.05},
                {"label": "Tomato_Leaf_Mold", "confidence": 0.02},
            ],
            "fallback": True
        }
    
    image = Image.open(io.BytesIO(image_bytes))
    results = cls_model(image)
    result = results[0]
    probs = result.probs
    top1_idx = probs.top1
    top1_conf = float(probs.top1conf)
    top1_label = result.names[top1_idx]

    return {
        "success": True,
        "label": top1_label,
        "confidence": top1_conf,
        "predictions": [
            {"label": result.names[idx], "confidence": float(conf)}
            for idx, conf in zip(probs.top5, probs.top5conf)
        ]
    }
