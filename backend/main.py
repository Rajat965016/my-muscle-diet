import os
import json
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from agents.diet_agent import DietAgent

# Load environment variables
load_dotenv()

app = FastAPI(title="My Muscle Diet API")

# Enable CORS for allowed frontend origins
ALLOWED_ORIGINS = [
    "http://localhost:3055",
    "http://localhost:5173",
    "http://127.0.0.1:3055",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://.*\.ngrok-free\.app|https?://.*\.ngrok\.io",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from database import (
    init_db,
    close_db,
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    get_user_by_email,
    save_user,
    save_plan,
    get_latest_plan_by_email
)
from fastapi import Header

@app.on_event("startup")
async def startup_db_client():
    init_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    close_db()

class UserData(BaseModel):
    name: str
    email: str
    password: Optional[str] = None
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

class SignupRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = "Athlete"
    user_data: Optional[dict] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class SetPasswordRequest(BaseModel):
    email: str
    password: str

class SavePlanRequest(BaseModel):
    user_email: str
    plan: dict
    user_data: Optional[dict] = None

agent = DietAgent()

@app.get("/health")
async def health():
    return {"status": "ok", "message": "My Muscle Diet API running"}

@app.post("/signup")
async def signup(request: SignupRequest):
    email = request.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="A valid email address is required")
    
    if not request.password or len(request.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    existing_user = await get_user_by_email(email)
    if existing_user and existing_user.get("password_hash"):
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists. Please log in."
        )

    # Hash password securely using bcrypt
    hashed = hash_password(request.password)
    user_doc = {
        "email": email,
        "name": request.name or "Athlete",
        "password_hash": hashed,
        "profile": request.user_data or {},
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await save_user(user_doc)

    # Issue JWT session token
    token = create_access_token({"sub": email, "name": user_doc["name"]})
    return {
        "success": True,
        "token": token,
        "user": {
            "email": email,
            "name": user_doc["name"],
            "profile": user_doc.get("profile", {})
        }
    }

@app.post("/login")
async def login(request: LoginRequest):
    email = request.email.strip().lower()
    user = await get_user_by_email(email)

    # Reject if user doesn't exist or doesn't have a password
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password against hash
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Fetch latest plan if exists
    latest_plan_doc = await get_latest_plan_by_email(email)
    token = create_access_token({"sub": email, "name": user.get("name", "Athlete")})

    return {
        "success": True,
        "token": token,
        "user": {
            "email": email,
            "name": user.get("name", "Athlete"),
            "profile": user.get("profile", {})
        },
        "plan": latest_plan_doc.get("plan") if latest_plan_doc else None
    }

@app.post("/set-password")
async def set_password(request: SetPasswordRequest):
    email = request.email.strip().lower()
    if not request.password or len(request.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    user = await get_user_by_email(email)
    hashed = hash_password(request.password)

    if user:
        user["password_hash"] = hashed
        await save_user(user)
    else:
        user = {
            "email": email,
            "name": "Athlete",
            "password_hash": hashed,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await save_user(user)

    token = create_access_token({"sub": email, "name": user.get("name", "Athlete")})
    return {
        "success": True,
        "token": token,
        "message": "Password saved successfully"
    }

@app.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")

    token = authorization.split(" ")[1]
    decoded = decode_access_token(token)
    if not decoded or "sub" not in decoded:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please log in again.")

    email = decoded["sub"]
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    latest_plan_doc = await get_latest_plan_by_email(email)

    # Sanitize user object (omit password_hash)
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}

    return {
        "user": safe_user,
        "plan": latest_plan_doc.get("plan") if latest_plan_doc else None
    }

@app.post("/generate-plan")
async def generate_plan(user_data: UserData):
    try:
        user_dict = user_data.dict()
        email = user_data.email.strip().lower()

        # If a password was provided during onboarding, hash and save/update the user account
        token = None
        if user_data.password and len(user_data.password) >= 8:
            hashed = hash_password(user_data.password)
            existing_user = await get_user_by_email(email)
            if existing_user:
                existing_user["password_hash"] = hashed
                existing_user["name"] = user_data.name
                existing_user["profile"] = user_data.dict(exclude={"password"})
                await save_user(existing_user)
            else:
                new_user = {
                    "email": email,
                    "name": user_data.name,
                    "password_hash": hashed,
                    "profile": user_data.dict(exclude={"password"}),
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await save_user(new_user)
            token = create_access_token({"sub": email, "name": user_data.name})
        else:
            # Generate token for session
            token = create_access_token({"sub": email, "name": user_data.name})

        # Generate plan using the diet agent
        result = await agent.generate_plan(user_dict)
        
        if not result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Plan generation failed: {result['error']}"
            )
        
        generated_plan = result["plan"]

        # Persist plan in database/storage
        try:
            await save_plan(email, generated_plan, user_data.dict(exclude={"password"}))
        except Exception as save_err:
            print(f"⚠️ Warning saving plan to storage: {save_err}")

        # Return plan with token and user profile attached
        response_data = dict(generated_plan)
        response_data["token"] = token
        response_data["user"] = {
            "email": email,
            "name": user_data.name,
            "profile": user_data.dict(exclude={"password"})
        }
        return response_data
    
    except HTTPException:
        raise
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
async def save_plan_endpoint(request: SavePlanRequest):
    plan_id = await save_plan(request.user_email, request.plan, request.user_data)
    return {"plan_id": plan_id}

@app.get("/get-plan/{email}")
async def get_plan(email: str, authorization: Optional[str] = Header(None)):
    plan_doc = await get_latest_plan_by_email(email)
    if not plan_doc:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return {
        "plan": plan_doc["plan"],
        "user_data": plan_doc.get("user_data", {})
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8055))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

