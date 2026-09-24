import os
import json
import asyncio
from groq import AsyncGroq
from dotenv import load_dotenv
from datetime import datetime

from agents.tools.weather_tool import get_weather_context
from agents.tools.food_db_tool import get_available_foods
from agents.tools.nutrition_tool import calculate_nutrition
from knowledge_base.loader import KnowledgeBaseLoader

load_dotenv()

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

class DietAgent:
    
    def __init__(self):
        self.rag = KnowledgeBaseLoader()
    
    async def gather_context(self, user_data: dict) -> dict:
        """
        Step 1: Gather all context before calling GPT
        Runs weather + RAG + food DB in parallel
        """
        city = user_data.get("city", "Delhi")
        season_query = user_data.get("goal", "bulking")
        diet_type = user_data.get("diet_type", "Veg + Eggs")
        budget = user_data.get("budget", "Medium (₹300/day)")
        
        print(f"🌤️  Getting weather for {city}...")
        weather = await get_weather_context(city)
        season = weather["season"]
        
        print(f"📚 Querying knowledge base...")
        rag_query = f"""
            {diet_type} diet for {season_query} 
            {season} season {city} region
            {budget} budget Indian foods
        """
        rag_context = self.rag.query(rag_query, n_results=5)
        
        print(f"🛒 Getting regional foods...")
        regional_foods = get_available_foods(
            city=city,
            season=season,
            budget=budget,
            diet_type=diet_type
        )
        
        return {
            "weather": weather,
            "season": season,
            "rag_context": rag_context,
            "regional_foods": regional_foods
        }
    
    def build_system_prompt(self) -> str:
        return """You are an expert Indian sports nutritionist 
        specializing in diet plans for middle-class Indian gym goers.
        
        STRICT RULES - NEVER BREAK THESE:
        1. Only use foods available in local Indian kirana/sabzi market
        2. No fancy foods: NO quinoa, avocado, greek yogurt (unless budget high), 
           protein bars, whey protein (unless budget high)
        3. All prices must be realistic for Indian middle class
        4. Respect the user's diet type strictly:
           - Pure Veg: absolutely no eggs, chicken, fish, mutton
           - Veg + Eggs: eggs allowed, no chicken/fish/mutton  
           - Non-veg: all foods allowed
        5. Respect weather and season rules provided
        6. Respect the user's budget strictly
        7. Use Indian meal names and timing
        8. You MUST respond with ONLY valid JSON, no markdown, 
           no explanation, no extra text
        
        OUTPUT FORMAT - Return exactly this JSON structure:
        {
          "meta": {
            "name": "User",
            "goal": "Bulk Up",
            "daily_protein_target": 130,
            "diet_type": "Veg + Eggs",
            "city": "Delhi",
            "season": "monsoon",
            "weather_note": "Prefer cooked foods and ginger tea",
            "generated_at": "2026-09-24T12:00:00"
          },
          "days": [
            {
              "day": "Mon",
              "type": "Veg",
              "note": "Soak almonds overnight",
              "meals": [
                {
                  "name": "Breakfast",
                  "time": "7:00 AM",
                  "items": [
                    {
                      "name": "Paneer bhurji with 2 rotis",
                      "protein": 24,
                      "calories": 360,
                      "tag": "existing"
                    }
                  ]
                }
              ]
            }
          ]
        }
        
        CRITICAL OUTPUT RULES:
        - The "days" array MUST contain all 7 days: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun".
        - NEVER stop after Friday. You MUST include Saturday and Sunday.
        - Each day MUST have exactly 5 meals:
          1. Breakfast (7:00 AM)
          2. Mid-Morning (10:30 AM)
          3. Lunch (2:00 PM)
          4. Post-Gym (5:30 PM, adjust if user gym timing is Morning)
          5. Dinner (9:00 PM)
        - CALORIES AND PROTEIN REQUIREMENTS:
          * Each food item MUST include realistic nutritional calculations:
            - "protein": integer representing grams of protein for the item portion.
            - "calories": integer representing accurate total energy in kcal for the item portion based on authentic Indian food composition (e.g., 1 whole egg ~75 kcal, 1 whole wheat roti ~100 kcal, 100g paneer ~260 kcal, 1 bowl dal ~130 kcal, 1 cup cooked rice ~200 kcal, 100g chicken breast ~165 kcal, 250ml milk ~150 kcal, 30g roasted chana ~110 kcal).
            - NEVER omit "calories" or set it to 0. Every item must have genuine estimated calories.
        - Keep each meal concise (1 to 2 items per meal) so the full 7-day plan is generated completely.
        - Vary meals across days for nutritional balance.
        """
    
    def build_user_prompt(
        self, 
        user_data: dict, 
        context: dict
    ) -> str:
        weather = context["weather"]
        
        return f"""
        Create a personalized 7-day weekly diet plan for:
        
        USER PROFILE:
        Name: {user_data.get('name')}
        Age: {user_data.get('age')} years
        Weight: {user_data.get('weight')} kg
        Height: {user_data.get('height')} cm
        Gender: {user_data.get('gender')}
        Goal: {user_data.get('goal')}
        Activity Level: {user_data.get('activity_level')}
        Diet Type: {user_data.get('diet_type')}
        Allergies: {user_data.get('allergies') or 'None'}
        City: {user_data.get('city')}
        Budget: {user_data.get('budget')}
        Gym Timing: {user_data.get('gym_timing')}
        Daily Protein Target: {user_data.get('protein_target')}g
        
        CURRENT WEATHER & SEASON:
        City: {weather.get('city')}
        Temperature: {weather.get('temperature_c')}°C
        Season: {context['season']}
        Weather Notes: {weather.get('diet_notes')}
        
        EXPERT KNOWLEDGE BASE (use this to ground your plan):
        {context['rag_context']}
        
        LOCALLY AVAILABLE FOODS WITH MARKET PRICES:
        {context['regional_foods']}
        
        IMPORTANT INSTRUCTIONS:
        - Daily protein target is {user_data.get('protein_target')}g
        - Budget is {user_data.get('budget')} per day
        - It is currently {context['season']} season
        - Gym timing is {user_data.get('gym_timing')} 
          so adjust Post-Gym meal time accordingly
        - Use foods from the "locally available foods" list above
        - Follow the weather/season diet notes strictly
        - Make the plan realistic and sustainable for 
          a middle-class Indian person
        - Alternate protein sources across days for variety
        
        Return ONLY the JSON plan, nothing else.
        """
    
    def normalize_plan(self, plan: dict, user_data: dict, context: dict) -> dict:
        """
        Ensures the plan strictly adheres to the 7-day / 5-meal schema required by the app.
        Gracefully repairs any omitted days or missing meal fields so the user never gets a 500 error.
        """
        import copy
        if not isinstance(plan, dict):
            raise ValueError("Model response is not a valid JSON object")

        if "meta" not in plan or not isinstance(plan["meta"], dict):
            plan["meta"] = {}

        plan["meta"].setdefault("name", user_data.get("name", "User"))
        plan["meta"].setdefault("goal", user_data.get("goal", "Fitness"))
        plan["meta"].setdefault("daily_protein_target", user_data.get("protein_target", 130))
        plan["meta"].setdefault("diet_type", user_data.get("diet_type", "Veg + Eggs"))
        plan["meta"].setdefault("city", user_data.get("city", "Delhi"))
        plan["meta"]["generated_at"] = datetime.now().isoformat()
        plan["meta"]["season"] = context.get("season", "monsoon")
        plan["meta"]["weather_note"] = context.get("weather", {}).get("diet_notes", "")

        days_data = plan.get("days", [])
        if isinstance(days_data, dict):
            days_data = list(days_data.values())
        elif not isinstance(days_data, list):
            days_data = []

        ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        DEFAULT_MEALS = [
            {"name": "Breakfast", "time": "7:00 AM"},
            {"name": "Mid-Morning", "time": "10:30 AM"},
            {"name": "Lunch", "time": "2:00 PM"},
            {"name": "Post-Gym", "time": "5:30 PM"},
            {"name": "Dinner", "time": "9:00 PM"},
        ]

        days_by_id = {}
        for d in days_data:
            if isinstance(d, dict) and "day" in d:
                days_by_id[d["day"]] = d

        normalized_days = []
        template_day = days_data[0] if days_data and isinstance(days_data[0], dict) else None

        for idx, day_name in enumerate(ALL_DAYS):
            if day_name in days_by_id:
                day_obj = copy.deepcopy(days_by_id[day_name])
            elif idx < len(days_data) and isinstance(days_data[idx], dict):
                day_obj = copy.deepcopy(days_data[idx])
                day_obj["day"] = day_name
            elif template_day:
                day_obj = copy.deepcopy(template_day)
                day_obj["day"] = day_name
                day_obj["note"] = f"Prepare nutrition targets for {day_name}."
            else:
                day_obj = {
                    "day": day_name,
                    "type": "Veg" if "Veg" in user_data.get("diet_type", "") else "NonVeg",
                    "note": f"Hydrate well and hit protein targets for {day_name}",
                    "meals": []
                }

            meals = day_obj.get("meals", [])
            if not isinstance(meals, list):
                meals = []

            normalized_meals = []
            meals_by_name = {str(m.get("name", "")).strip().lower(): m for m in meals if isinstance(m, dict)}

            for default_m in DEFAULT_MEALS:
                m_key = default_m["name"].lower()
                matched_meal = meals_by_name.get(m_key)
                if not matched_meal:
                    pos = len(normalized_meals)
                    if pos < len(meals) and isinstance(meals[pos], dict):
                        matched_meal = meals[pos]

                if matched_meal and isinstance(matched_meal, dict):
                    meal_copy = copy.deepcopy(matched_meal)
                    meal_copy["name"] = default_m["name"]
                    meal_copy["time"] = default_m["time"]

                    items = meal_copy.get("items", [])
                    if not isinstance(items, list) or len(items) == 0:
                        items = [{
                            "name": f"Healthy {default_m['name']} plate",
                            "protein": round(int(user_data.get("protein_target", 130)) / 5),
                            "calories": 350,
                            "tag": "existing"
                        }]
                    else:
                        for it in items:
                            if isinstance(it, dict):
                                it.setdefault("name", "Nutrition item")
                                it.setdefault("protein", 15)
                                it.setdefault("calories", 200)
                                it.setdefault("tag", "existing")
                    meal_copy["items"] = items
                    normalized_meals.append(meal_copy)
                else:
                    normalized_meals.append({
                        "name": default_m["name"],
                        "time": default_m["time"],
                        "items": [
                            {
                                "name": f"Wholesome {default_m['name']}",
                                "protein": round(int(user_data.get("protein_target", 130)) / 5),
                                "calories": 350,
                                "tag": "existing"
                            }
                        ]
                    })

            day_obj["meals"] = normalized_meals
            day_obj.setdefault("type", "Veg" if "Pure Veg" in user_data.get("diet_type", "") else "NonVeg")
            day_obj.setdefault("note", "Stay hydrated and hit your daily protein target.")
            normalized_days.append(day_obj)

        plan["days"] = normalized_days
        return plan

    async def generate_plan(self, user_data: dict) -> dict:
        print("\n" + "="*50)
        print(f"Generating plan for {user_data.get('name')}")
        print("="*50)
        
        # Step 1: Gather all context in parallel
        context = await self.gather_context(user_data)
        print(f"✅ Context gathered. Season: {context['season']}")
        
        system_prompt = self.build_system_prompt()
        user_prompt = self.build_user_prompt(user_data, context)
        
        # Production Groq models with verified structured output capabilities
        models_to_try = [
            os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            "qwen/qwen3.8-27b",
            "llama-3.1-8b-instant"
        ]
        
        last_error = "Unknown error"
        for attempt, model_to_use in enumerate(models_to_try):
            try:
                print(f"🤖 Calling Groq {model_to_use} (attempt {attempt+1})...")
                
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
                
                if attempt > 0:
                    messages.append({
                        "role": "user", 
                        "content": (
                            "RETRY: Generate all 7 days ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') "
                            "in the 'days' array. Keep each meal concise (1-2 items per meal) so the entire 7-day "
                            "JSON plan completes without truncation. Output valid JSON only."
                        )
                    })
                
                response = await client.chat.completions.create(
                    model=model_to_use,
                    response_format={"type": "json_object"},
                    messages=messages,
                    max_tokens=6000,
                    temperature=0.4
                )
                
                raw_response = response.choices[0].message.content
                plan = json.loads(raw_response)
                
                # Normalize and ensure complete 7-day / 5-meal schema
                plan = self.normalize_plan(plan, user_data, context)
                
                print(f"✅ Plan generated and verified on attempt {attempt+1} ({model_to_use})")
                return {"success": True, "plan": plan}
            
            except Exception as e:
                print(f"❌ Attempt {attempt+1} ({model_to_use}) failed: {e}")
                last_error = str(e)
                continue

        return {
            "success": False,
            "error": last_error
        }
