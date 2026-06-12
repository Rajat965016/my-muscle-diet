import os
import json
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv
from datetime import datetime

from agents.tools.weather_tool import get_weather_context
from agents.tools.food_db_tool import get_available_foods
from agents.tools.nutrition_tool import calculate_nutrition
from knowledge_base.loader import KnowledgeBaseLoader

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
            "name": string,
            "goal": string,
            "daily_protein_target": number,
            "diet_type": string,
            "city": string,
            "season": string,
            "weather_note": string,
            "generated_at": string
          },
          "days": [
            {
              "day": "Mon",
              "type": "Veg" or "Egg" or "NonVeg",
              "note": "tonight prep reminder string",
              "meals": [
                {
                  "name": "Breakfast",
                  "time": "7:00 AM",
                  "items": [
                    {
                      "name": string,
                      "protein": number,
                      "calories": number,
                      "tag": "ADD" or "existing"
                    }
                  ]
                }
              ]
            }
          ]
        }
        
        Each day MUST have exactly 5 meals:
        Breakfast 7:00 AM
        Mid-Morning 10:30 AM  
        Lunch 2:00 PM
        Post-Gym 5:30 PM (adjust based on gym_timing)
        Dinner 9:00 PM
        
        Generate all 7 days: Mon, Tue, Wed, Thu, Fri, Sat, Sun
        Vary meals across days - do not repeat same meals daily.
        tag "ADD" for new diet additions, "existing" for common foods.
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
    
    async def generate_plan(self, user_data: dict) -> dict:
        print("\n" + "="*50)
        print(f"Generating plan for {user_data.get('name')}")
        print("="*50)
        
        # Step 1: Gather all context in parallel
        context = await self.gather_context(user_data)
        print(f"✅ Context gathered. Season: {context['season']}")
        
        system_prompt = self.build_system_prompt()
        user_prompt = self.build_user_prompt(user_data, context)
        
        # Try up to 2 times
        for attempt in range(2):
            try:
                print(f"🤖 Calling GPT-4o-mini (attempt {attempt+1})...")
                
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
                
                # On retry add strict instruction
                if attempt == 1:
                    messages.append({
                        "role": "user", 
                        "content": """
                        RETRY: Return complete valid JSON only.
                        Keep each meal to MAX 3 food items.
                        Keep food names under 30 characters.
                        Must include all 7 days and 5 meals each.
                        """
                    })
                
                response = await client.chat.completions.create(
                    model="gpt-4o-mini",
                    response_format={"type": "json_object"},
                    messages=messages,
                    max_tokens=6000,
                    temperature=0.5
                )
                
                raw_response = response.choices[0].message.content
                
                plan = json.loads(raw_response)
                
                assert "days" in plan, "Missing days"
                assert len(plan["days"]) == 7, "Need 7 days"
                assert "meta" in plan, "Missing meta"
                
                plan["meta"]["generated_at"] = datetime.now().isoformat()
                plan["meta"]["season"] = context["season"]
                plan["meta"]["weather_note"] = context["weather"].get(
                    "diet_notes", ""
                )
                
                print(f"✅ Plan generated on attempt {attempt+1}")
                return {"success": True, "plan": plan}
            
            except (json.JSONDecodeError, AssertionError) as e:
                print(f"❌ Attempt {attempt+1} failed: {e}")
                if attempt == 1:
                    return {
                        "success": False,
                        "error": str(e)
                    }
                continue
