import json
from pathlib import Path

NUTRITION_FILE = Path(__file__).parent.parent.parent / \
    "knowledge_base/json/nutrition_data.json"

_nutrition_cache = None

def load_nutrition_data():
    global _nutrition_cache
    if _nutrition_cache is None:
        if NUTRITION_FILE.exists():
            with open(NUTRITION_FILE) as f:
                data = json.load(f)
            _nutrition_cache = {
                food["name"].lower(): food 
                for food in data["foods"]
            }
            # Also index by aliases
            for food in data["foods"]:
                for alias in food.get("aliases", []):
                    _nutrition_cache[alias.lower()] = food
        else:
            _nutrition_cache = {}
    return _nutrition_cache

def calculate_nutrition(items: list) -> dict:
    """
    Input: [{"food_name": "Moong Dal", "quantity_g": 150}]
    Output: total protein, calories with breakdown
    """
    db = load_nutrition_data()
    result_items = []
    total_protein = 0
    total_calories = 0
    
    for item in items:
        food_name = item["food_name"].lower()
        quantity = item.get("quantity_g", 100)
        
        food_data = db.get(food_name)
        
        if food_data:
            factor = quantity / 100
            protein = round(
                food_data["per_100g"]["protein"] * factor, 1
            )
            calories = round(
                food_data["per_100g"]["calories"] * factor, 1
            )
            result_items.append({
                "food": food_data["name"],
                "quantity": f"{quantity}g",
                "protein": protein,
                "calories": calories
            })
            total_protein += protein
            total_calories += calories
        else:
            result_items.append({
                "food": item["food_name"],
                "quantity": f"{quantity}g",
                "protein": "unknown",
                "calories": "unknown",
                "note": "not in database"
            })
    
    return {
        "items": result_items,
        "total_protein_g": round(total_protein, 1),
        "total_calories_kcal": round(total_calories, 1),
        "hits_protein_target": total_protein >= 130
    }

def get_food_info(food_name: str) -> dict:
    """Get nutrition info for a single food item"""
    db = load_nutrition_data()
    food = db.get(food_name.lower())
    if food:
        return food
    return {"error": f"{food_name} not found in database"}
