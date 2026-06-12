# My Muscle Diet 💪

An AI-powered, personalized Indian diet planner Progressive Web App (PWA) designed specifically for gym-goers. It uses an advanced RAG (Retrieval-Augmented Generation) pipeline with ChromaDB and GPT-4o-mini to generate hyper-personalized 7-day meal plans based on regional availability, seasonality, budget, and local Indian ingredients.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### 1. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone https://github.com/Rajat965016/my-muscle-diet.git
cd my-muscle-diet
git checkout feature/ai-diet-generator1
```

---

### 2. Backend Setup (FastAPI & Python)

The backend handles AI generation, RAG, and interactions with external APIs.

**Prerequisites:** Python 3.9+ 

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment (Recommended):**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file inside the `backend/` directory and add your keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   MONGODB_URI=your_mongodb_connection_string_here
   ```

5. **Run the Backend Server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will now be running on http://localhost:8000*

---

### 3. Frontend Setup (React & Vite)

The frontend is a fully responsive PWA built with React, Vite, and TailwindCSS.

**Prerequisites:** Node.js v16+

1. **Navigate to the frontend directory:**
   ```bash
   # Assuming you are in the project root
   cd frontend
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file inside the `frontend/` directory (if not already present):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   *The frontend will now be running on http://localhost:5173*

---

### 4. Running the Complete App
With both servers running, open your browser and navigate to `http://localhost:5173`. You should see the onboarding screen ready to build diet plans!

## 📦 Key Technologies
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: FastAPI, Python, Motor (Async MongoDB)
- **AI/Agents**: OpenAI `gpt-4o-mini`, LangChain
- **Vector DB**: ChromaDB + HuggingFace Embeddings
- **APIs**: OpenWeatherMap API
