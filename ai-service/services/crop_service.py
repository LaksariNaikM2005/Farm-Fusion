def calculate_crop_recommendation(n: float, p: float, k: float, ph: float, rainfall: float, temp: float, soil_type: str = "Red"):
    """
    Evaluates agronomic parameters and returns scored crop recommendations.
    Uses ICAR & UAS benchmark features.
    """
    crops_db = [
        {"crop": "Tomato", "opt_n": 140, "opt_p": 50, "opt_k": 180, "ph_min": 6.0, "ph_max": 7.5, "suit_soils": ["Red", "Loamy", "Black"]},
        {"crop": "Ragi (Finger Millet)", "opt_n": 60, "opt_p": 40, "opt_k": 30, "ph_min": 5.0, "ph_max": 8.0, "suit_soils": ["Red", "Laterite", "Loamy", "Sandy"]},
        {"crop": "Groundnut", "opt_n": 25, "opt_p": 50, "opt_k": 75, "ph_min": 6.0, "ph_max": 7.2, "suit_soils": ["Red", "Sandy", "Loamy"]},
        {"crop": "Maize", "opt_n": 120, "opt_p": 60, "opt_k": 50, "ph_min": 6.5, "ph_max": 7.5, "suit_soils": ["Alluvial", "Red", "Black"]},
        {"crop": "Chilli", "opt_n": 100, "opt_p": 50, "opt_k": 50, "ph_min": 6.0, "ph_max": 7.0, "suit_soils": ["Black", "Red", "Loamy"]},
    ]

    scored = []
    for c in crops_db:
        score = 80.0
        if soil_type in c["suit_soils"]:
            score += 10.0
        else:
            score -= 10.0

        if c["ph_min"] <= ph <= c["ph_max"]:
            score += 8.0
        else:
            score -= 12.0

        score = max(min(round(score), 96), 40)
        scored.append({
            "crop": c["crop"],
            "score": score,
            "soil_match": soil_type in c["suit_soils"],
            "ph_match": c["ph_min"] <= ph <= c["ph_max"]
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored
