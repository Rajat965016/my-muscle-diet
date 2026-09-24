import os
import json
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
import bcrypt
import jwt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# JWT Config
JWT_SECRET = os.getenv("JWT_SECRET", "my_muscle_diet_super_secret_jwt_key_2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 30

# MongoDB Config
MONGODB_URI = os.getenv("MONGODB_URI")
db_client = None
db = None

# Local fallback directory
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
PLANS_FILE = os.path.join(DATA_DIR, "plans.json")


def _init_local_storage():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump({}, f)
    if not os.path.exists(PLANS_FILE):
        with open(PLANS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)


_init_local_storage()


def init_db():
    global db_client, db
    if MONGODB_URI and db is None:
        try:
            db_client = AsyncIOMotorClient(
                MONGODB_URI,
                serverSelectionTimeoutMS=4000,
                connectTimeoutMS=4000
            )
            db = db_client["muscle_diet_db"]
        except Exception as e:
            print(f"⚠️ MongoDB Client initialization warning: {e}")


def close_db():
    global db_client
    if db_client:
        db_client.close()


# -------------------------------------------------------------
# Password & JWT Helpers
# -------------------------------------------------------------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception:
        return None


# -------------------------------------------------------------
# Local Storage Fallback Helpers
# -------------------------------------------------------------
def _load_local_users() -> Dict[str, Any]:
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def _save_local_users(users: Dict[str, Any]):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, default=str)


def _load_local_plans() -> list:
    try:
        with open(PLANS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _save_local_plans(plans: list):
    with open(PLANS_FILE, "w", encoding="utf-8") as f:
        json.dump(plans, f, indent=2, default=str)


# -------------------------------------------------------------
# User Operations (MongoDB + Fallback)
# -------------------------------------------------------------
async def get_user_by_email(email: str) -> Optional[dict]:
    clean_email = email.strip().lower()
    
    # Try MongoDB first
    if db is not None:
        try:
            user = await asyncio.wait_for(
                db["users"].find_one({"email": clean_email}),
                timeout=3.0
            )
            if user:
                user["_id"] = str(user["_id"])
                return user
        except Exception as e:
            # Atlas SSL or connection timeout - fallback to local storage
            pass

    # Local fallback
    users = _load_local_users()
    return users.get(clean_email)


async def save_user(user_doc: dict) -> dict:
    clean_email = user_doc["email"].strip().lower()
    user_doc["email"] = clean_email
    user_doc.setdefault("updated_at", datetime.now(timezone.utc).isoformat())

    # Save to local fallback first to guarantee persistence
    users = _load_local_users()
    users[clean_email] = user_doc
    _save_local_users(users)

    # Also persist to MongoDB if available
    if db is not None:
        try:
            await asyncio.wait_for(
                db["users"].update_one(
                    {"email": clean_email},
                    {"$set": user_doc},
                    upsert=True
                ),
                timeout=3.0
            )
        except Exception:
            pass

    return user_doc


# -------------------------------------------------------------
# Plan Operations (MongoDB + Fallback)
# -------------------------------------------------------------
async def save_plan(email: str, plan: dict, user_data: Optional[dict] = None) -> str:
    clean_email = email.strip().lower()
    doc = {
        "user_email": clean_email,
        "plan": plan,
        "user_data": user_data or {},
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    # Save to local fallback
    plans = _load_local_plans()
    plans.append(doc)
    _save_local_plans(plans)

    # Persist to MongoDB
    plan_id = f"plan_{int(datetime.now().timestamp())}"
    if db is not None:
        try:
            mongo_doc = doc.copy()
            mongo_doc["created_at"] = datetime.now(timezone.utc)
            res = await asyncio.wait_for(db["plans"].insert_one(mongo_doc), timeout=3.0)
            plan_id = str(res.inserted_id)
        except Exception:
            pass

    return plan_id


async def get_latest_plan_by_email(email: str) -> Optional[dict]:
    clean_email = email.strip().lower()

    # Try MongoDB first
    if db is not None:
        try:
            plan_doc = await asyncio.wait_for(
                db["plans"].find_one(
                    {"user_email": clean_email},
                    sort=[("created_at", -1)]
                ),
                timeout=3.0
            )
            if plan_doc:
                return {
                    "plan": plan_doc["plan"],
                    "user_data": plan_doc.get("user_data", {}),
                    "created_at": str(plan_doc.get("created_at", ""))
                }
        except Exception:
            pass

    # Fallback to local storage
    plans = _load_local_plans()
    user_plans = [p for p in plans if p.get("user_email") == clean_email]
    if user_plans:
        latest = user_plans[-1]
        return {
            "plan": latest.get("plan"),
            "user_data": latest.get("user_data", {}),
            "created_at": str(latest.get("created_at", ""))
        }

    return None
