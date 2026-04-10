from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PredictionRequest, PredictionResponse, ModelMetrics
from .prediction import predict_outfit
from .model_loader import get_performance_metrics
from .database import get_supabase_client
import uvicorn
import httpx
import os

app = FastAPI(title="SkyStyle API")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    outfit = predict_outfit(request.temperature, request.humidity, request.weather_condition, request.style, request.activity)
    
    # Store in database
    supabase = get_supabase_client()
    try:
        supabase.table("predictions").insert({
            "temperature": request.temperature,
            "humidity": request.humidity,
            "weather_condition": request.weather_condition,
            "predicted_outfit": outfit
        }).execute()
    except Exception as e:
        print(f"Database error: {e}")
            
    return {"recommended_outfit": outfit}

@app.get("/api/history")
async def get_history():
    supabase = get_supabase_client()
    try:
        response = supabase.table("predictions").select("*").order("created_at", desc=True).limit(10).execute()
        return response.data
    except Exception as e:
        print(f"Database error: {e}")
        return []

@app.get("/api/model-performance", response_model=ModelMetrics)
async def model_performance():
    metrics = get_performance_metrics()
    return metrics

@app.get("/api/wardrobe")
async def get_wardrobe():
    print("Fetching wardrobe items...")
    supabase = get_supabase_client()
    try:
        response = supabase.table("wardrobe").select("*").execute()
        print(f"Found {len(response.data)} items")
        return response.data
    except Exception as e:
        print(f"Database error in get_wardrobe: {e}")
        return []

@app.post("/api/wardrobe")
async def add_wardrobe_item(item: dict):
    print(f"Adding wardrobe item: {item.get('name')}")
    supabase = get_supabase_client()
    try:
        response = supabase.table("wardrobe").insert(item).execute()
        new_id = response.data[0]["id"] if response.data else 0
        print(f"Added item with ID: {new_id}")
        return {"id": new_id}
    except Exception as e:
        print(f"Database error in add_wardrobe_item: {e}")
        return {"id": 0}

@app.delete("/api/wardrobe/{item_id}")
async def delete_wardrobe_item(item_id: int):
    print(f"Deleting wardrobe item: {item_id}")
    supabase = get_supabase_client()
    try:
        supabase.table("wardrobe").delete().eq("id", item_id).execute()
        print("Deleted successfully")
        return {"success": True}
    except Exception as e:
        print(f"Database error in delete_wardrobe_item: {e}")
        return {"success": False}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
