def validate_plan(plan_json: dict):
    if not isinstance(plan_json, dict):
        return False, "Response is not a valid JSON object"

    if "days" not in plan_json or not isinstance(plan_json["days"], list):
        return False, "Missing or invalid 'days' array"

    days = plan_json["days"]
    if len(days) != 7:
        return False, f"Expected exactly 7 days, got {len(days)}"

    for i, day in enumerate(days):
        if "meals" not in day or not isinstance(day["meals"], list):
            return False, f"Day {i} missing 'meals' array"
        
        meals = day["meals"]
        if len(meals) != 5:
            return False, f"Day '{day.get('day', i)}' has {len(meals)} meals instead of 5"
        
        for j, meal in enumerate(meals):
            if "items" not in meal or not isinstance(meal["items"], list):
                return False, f"Meal {j} in day '{day.get('day', i)}' missing 'items' array"
            
            for k, item in enumerate(meal["items"]):
                required_keys = {"name", "protein", "calories", "tag"}
                missing_keys = required_keys - set(item.keys())
                if missing_keys:
                    return False, f"Item {k} in meal {j} day '{day.get('day', i)}' missing keys: {missing_keys}"

    return True, ""
