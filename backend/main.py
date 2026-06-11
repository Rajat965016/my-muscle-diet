import os
import json
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from motor.motor_asyncio import AsyncIOMotorClient

from prompt_builder import build_prompt
from validator import validate_plan

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

# Initialize OpenAI Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

class UserRequest(BaseModel):
    email: str
    name: str
    age: int
    weight: float
    height: float
    gender: str
    goal: str
    activity_level: str
    diet_type: str
    allergies: str
    city: str
    budget: str
    gym_timing: str
    protein_target: float

class SavePlanRequest(BaseModel):
    user_email: str
    plan: dict
    user_data: dict

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/generate-plan")
def generate_plan(user_data: UserRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

    system_msg, user_msg = build_prompt(user_data)

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            temperature=0.7,
        )

        content = response.choices[0].message.content
        plan_json = json.loads(content)

        # Validate the response structure against our requirements
        is_valid, error_msg = validate_plan(plan_json)
        
        if not is_valid:
            raise HTTPException(
                status_code=500, 
                detail=f"AI generated an invalid plan structure: {error_msg}"
            )

        return plan_json

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI response was not valid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
