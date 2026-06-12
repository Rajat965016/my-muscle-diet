import json
from pathlib import Path

REGIONAL_FILE = Path(__file__).parent.parent.parent / \
    "knowledge_base/json/regional_foods.json"

_regional_cache = None

def load_regional_data():
    global _regional_cache
    if _regional_cache is None:
        if REGIONAL_FILE.exists():
            with open(REGIONAL_FILE) as f:
                _regional_cache = json.load(f)
        else:
            _regional_cache = []
    return _regional_cache

def find_region(city: str) -> dict:
    data = load_regional_data()
    city_lower = city.lower()
    
    for region in data:
        cities = [c.lower() for c in region["cities"]]
        if city_lower in cities:
            return region
    
    # Default to Delhi NCR if city not found
    for region in data:
        if region["region"] == "Delhi NCR":
            return region
    
    return data[0] if data else {}

def get_available_foods(
    city: str, 
    season: str, 
    budget: str,
    diet_type: str
) -> str:
    region_data = find_region(city)
    if not region_data:
        return "No regional data found."
    
    season_data = region_data.get("seasons", {}).get(season.lower(), {})
    if not season_data:
        season_data = region_data.get("seasons", {}).get("summer", {})
        
    budget_key = f"{budget.lower()}_budget"
    budget_data = season_data.get(budget_key, {})
    if not budget_data:
        budget_data = season_data.get("low_budget", {})
        
    foods = budget_data.get("top_protein_foods", [])
    
    result = f"Available foods in {city} for {season} ({budget} budget):\n"
    if foods:
        for f in foods:
            result += f"- {f['name']}: {f['price']}, {f['protein_per_unit']}g protein per {f['unit']}\n"
    else:
        result += "- Data not explicitly mapped; check general nutrition guide.\n"
        
    avoid = budget_data.get("avoid_in_season", [])
    if avoid:
        result += "\nAvoid:\n" + "\n".join([f"- {a}" for a in avoid])
        
    extras = budget_data.get("recommended_extras", [])
    if extras:
        result += "\nRecommended Extras:\n" + "\n".join([f"- {e}" for e in extras])
        
    return result
