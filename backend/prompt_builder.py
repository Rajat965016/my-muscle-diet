def build_prompt(user_data):
    system_msg = (
        "You are a professional Indian sports nutritionist and diet planner. "
        "You only respond with valid JSON, no markdown, no explanation."
    )

    user_msg = f"""
Please generate a 7-day weekly meal plan customized for a client with the following profile:
- Goal: {user_data.goal}
- Target Daily Protein: {user_data.protein_target}g
- Diet Type: {user_data.diet_type}
- Allergies: {user_data.allergies or 'None'}
- City/Location: {user_data.city} (Use common Indian foods available here)
- Budget: {user_data.budget} (Be realistic and affordable)
- Gym Timing: {user_data.gym_timing}

You must return EXACTLY the following JSON structure and nothing else:

{{
  "meta": {{
    "name": "{user_data.name}",
    "goal": "{user_data.goal}",
    "daily_protein_target": {user_data.protein_target},
    "diet_type": "{user_data.diet_type}",
    "generated_at": "<ISO date string>"
  }},
  "days": [
    {{
      "day": "Mon",
      "type": "Veg", // Must be "Veg", "Egg", or "NonVeg"
      "note": "<tonight prep reminder string>",
      "meals": [
        {{
          "name": "Breakfast",
          "time": "7:00 AM",
          "items": [
            {{
              "name": "<food item string>",
              "protein": <number>,
              "calories": <number>,
              "tag": "ADD" // Must be "ADD" or "existing"
            }}
          ]
        }}
      ]
    }}
  ]
}}

STRICT RULES:
1. The "days" array MUST contain exactly 7 items (Mon, Tue, Wed, Thu, Fri, Sat, Sun).
2. Each day MUST contain EXACTLY 5 meals:
   - Breakfast (7:00 AM)
   - Mid-Morning (10:30 AM)
   - Lunch (2:00 PM)
   - Post-Gym (5:30 PM)
   - Dinner (9:00 PM)
3. Ensure the daily protein total matches the target closely.
"""
    return system_msg, user_msg
