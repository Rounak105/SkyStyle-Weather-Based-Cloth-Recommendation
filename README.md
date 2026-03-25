# SkyStyle – AI Weather Outfit Planner

Modern architecture upgrade with FastAPI, Supabase, and Scikit-learn.

## Project Structure

- `backend/`: FastAPI Python backend
  - `main.py`: Entry point and API routes
  - `model_loader.py`: ML model loading logic
  - `prediction.py`: Prediction logic using scikit-learn
  - `database.py`: Supabase client configuration
  - `schemas.py`: Pydantic models for data validation
- `src/`: React frontend
  - `components/PerformanceDashboard.tsx`: New model performance visualization
  - `components/OutfitRecommendation.tsx`: Updated to use AI backend

## Setup Instructions

### 1. Backend (FastAPI)

1. Navigate to the root directory.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your environment variables in `.env`:
   ```env
   OPENWEATHER_API_KEY=your_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
4. Run the FastAPI server:
   ```bash
   npm run dev:backend
   ```
   The server will run on `http://localhost:8000`.

### 2. Frontend (React + Vite)

1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` and proxy API requests to the FastAPI backend.

## Database Schema (Supabase)

Create the following tables in your Supabase project:

### `predictions`
- `id`: int8 (Primary Key, Auto-increment)
- `temperature`: float8
- `humidity`: float8
- `weather_condition`: text
- `predicted_outfit`: text
- `created_at`: timestamptz (Default: now())

### `wardrobe`
- `id`: int8 (Primary Key, Auto-increment)
- `name`: text
- `category`: text
- `color`: text
- `tags`: text
- `image_url`: text
