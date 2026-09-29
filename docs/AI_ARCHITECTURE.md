# 🧠 AI & Computer Vision Architecture

## 1. Plant Disease Vision Diagnostic (YOLOv8)
* **Model Architecture**: Ultralytics YOLOv8 Classification network (`farmfusion_v1.pt`).
* **Input**: 3-channel RGB leaf imagery (resized and normalized to 224x224 / 640x640).
* **Classes Detected**: Solanaceous crop diseases including Early Blight (*Alternaria solani*), Late Blight (*Phytophthora infestans*), Leaf Mold (*Passalora fulva*), and Healthy foliage.
* **Safety & Treatment Layer**: Direct mapping to ICAR-IIHR chemical & organic bio-control guidelines with disclaimers against unsupported pesticide overuse.

## 2. ML Crop Recommendation Engine
* **Input Features**: Soil Nitrogen (N), Phosphorus (P), Potassium (K), pH (0-14), Soil Texture Classification (Red, Black, Alluvial, Loamy, Laterite), and Irrigation Availability (Drip, Borewell, Rainfed).
* **Scoring Function**: Agronomic penalty/reward weighting normalized between 40% and 96% suitability.
* **Outputs**: Top 4 candidate crops with recommended high-yielding varieties, expected maturity duration, and estimated cost per acre.

## 3. Grounded Retrieval-Augmented Generation (RAG)
```
Farmer Context (Soil NPK, Crop, Location) + Natural Language Query
                                ↓
                 Semantic Keyword / Entity Parser
                                ↓
        Authoritative Knowledge Store (ICAR, KVK, IVRI Docs)
                                ↓
              Context Synthesis & Source Citation Layer
                                ↓
          Actionable Grounded Response + Expert Escalation
```
