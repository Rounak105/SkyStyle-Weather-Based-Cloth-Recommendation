from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    weather_condition: str
    style: Optional[str] = "Casual"
    activity: Optional[str] = "College"

class PredictionResponse(BaseModel):
    recommended_outfit: str

class PredictionHistory(BaseModel):
    id: int
    temperature: float
    humidity: float
    weather_condition: str
    predicted_outfit: str
    created_at: datetime

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    confusion_matrix: List[List[int]]
    model_name: str
    dataset_size: int
