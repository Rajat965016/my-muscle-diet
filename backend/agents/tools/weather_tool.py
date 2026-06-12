import os
import httpx
from datetime import datetime

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

def get_season(month: int, temp: float) -> str:
    if month in [7, 8, 9]:
        return "monsoon"
    elif month in [11, 12, 1, 2] and temp < 20:
        return "winter"
    elif month in [3, 4, 5, 6] and temp > 28:
        return "summer"
    else:
        return "spring"

def get_diet_notes(season: str, temp: float) -> str:
    notes = {
        "summer": f"""
            Very hot ({temp}°C) - Follow these rules:
            - Drink 4-5 litres water daily
            - Eat light meals, avoid heavy non-veg at lunch
            - Include curd or buttermilk every day
            - Best post-gym: coconut water + banana
            - Prefer morning workout over evening
            - Include cooling foods: cucumber, watermelon
        """,
        "winter": f"""
            Cold weather ({temp}°C) - Follow these rules:
            - Best season for muscle building
            - Can eat heavier meals
            - Add ghee to dal and roti
            - Include dry fruits in morning
            - Evening workout is comfortable
            - Include warm foods: chicken curry, dal tadka
        """,
        "monsoon": f"""
            Monsoon season - Follow these rules:
            - Avoid raw sprouts (bacterial risk)
            - Prefer cooked and hot foods only
            - Add turmeric and ginger to all meals
            - Avoid street food strictly
            - Include haldi doodh at night
            - Prefer boiled/steamed over raw vegetables
        """,
        "spring": f"""
            Pleasant weather ({temp}°C) - Follow these rules:
            - Good time for all types of foods
            - Stay hydrated (2-3 litres water)
            - All protein sources work well
            - Morning or evening workout both fine
        """
    }
    return notes.get(season, notes["spring"]).strip()

async def get_weather_context(city: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                BASE_URL,
                params={
                    "q": f"{city},IN",
                    "appid": OPENWEATHER_API_KEY,
                    "units": "metric"
                },
                timeout=5.0
            )
            
            if response.status_code != 200:
                raise Exception(f"Weather API error: {response.status_code}")
            
            data = response.json()
            temp = data["main"]["temp"]
            humidity = data["main"]["humidity"]
            month = datetime.now().month
            season = get_season(month, temp)
            
            return {
                "city": city,
                "temperature_c": round(temp, 1),
                "humidity": humidity,
                "season": season,
                "weather_description": data["weather"][0]["description"],
                "diet_notes": get_diet_notes(season, temp),
                "success": True
            }
    
    except Exception as e:
        print(f"Weather API failed for {city}: {e}")
        month = datetime.now().month
        # Smart fallback based on month only
        if month in [7, 8, 9]:
            season = "monsoon"
        elif month in [11, 12, 1, 2]:
            season = "winter"
        elif month in [3, 4, 5, 6]:
            season = "summer"
        else:
            season = "spring"
        
        return {
            "city": city,
            "temperature_c": None,
            "humidity": None,
            "season": season,
            "weather_description": "data unavailable",
            "diet_notes": get_diet_notes(season, 30),
            "success": False,
            "fallback": True
        }
