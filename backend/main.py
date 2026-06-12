import os
import json
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI
from motor.motor_asyncio import AsyncIOMotorClient

from agents.diet_agent import DietAgent

# Load environment variables
load_dotenv()

app = FastAPI(title="My Muscle Diet API")

# Enable CORS for all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Client setup
MONGODB_URI = os.getenv("MONGODB_URI")
db_client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global db_client, db
    if MONGODB_URI:
        db_client = AsyncIOMotorClient(MONGODB_URI)
        db = db_client["muscle_diet_db"]

@app.on_event("shutdown")
async def shutdown_db_client():
    if db_client:
        db_client.close()

class UserData(BaseModel):
    name: str
    email: str
    age: int
    weight: float
    height: float
    gender: str
    goal: str
    activity_level: str
    diet_type: str
    allergies: Optional[str] = None
    city: str
    budget: str
    gym_timing: str
    protein_target: int = 130

class SavePlanRequest(BaseModel):
    user_email: str
    plan: dict
    user_data: dict

agent = DietAgent()

@app.get("/health")
async def health():
    return {"status": "ok", "message": "My Muscle Diet API running"}

@app.post("/generate-plan")
async def generate_plan(user_data: UserData):
    try:
        result = await agent.generate_plan(user_data.dict())
        
        if not result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Plan generation failed: {result['error']}"
            )
        
        return result["plan"]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test-weather/{city}")
async def test_weather(city: str):
    from agents.tools.weather_tool import get_weather_context
    result = await get_weather_context(city)
    return result

@app.get("/test-rag")
async def test_rag(q: str = "high protein veg breakfast"):
    from knowledge_base.loader import KnowledgeBaseLoader
    loader = KnowledgeBaseLoader()
    result = loader.query(q, n_results=3)
    return {"query": q, "result": result}

@app.post("/save-plan")
async def save_plan(request: SavePlanRequest):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    document = {
        "user_email": request.user_email.lower(),
        "plan": request.plan,
        "user_data": request.user_data,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db["plans"].insert_one(document)
    return {"plan_id": str(result.inserted_id)}

@app.get("/get-plan/{email}")
async def get_plan(email: str):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    # Sort by created_at descending to get the most recent plan
    plan_doc = await db["plans"].find_one(
        {"user_email": email.lower()},
        sort=[("created_at", -1)]
    )
    
    if not plan_doc:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # Remove MongoDB's internal _id field before returning
    plan_doc["_id"] = str(plan_doc["_id"])
    
    return {
        "plan": plan_doc["plan"],
        "user_data": plan_doc.get("user_data", {})
    }
