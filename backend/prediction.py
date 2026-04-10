from .model_loader import load_model, load_encoders

_model = None
_encoders = None

def get_model():
    global _model
    if _model is None:
        _model = load_model()
    return _model

def get_encoders():
    global _encoders
    if _encoders is None:
        _encoders = load_encoders()
    return _encoders

def predict_outfit(temperature: float, humidity: float, weather_condition: str, style: str = "Casual", activity: str = "College"):
    print(f"Predicting outfit for: {temperature}C, {humidity}%, {weather_condition}, Style: {style}, Activity: {activity}")
    
    # Basic input validation
    if weather_condition is None:
        weather_condition = "Clear"
    
    model = get_model()
    encoders = get_encoders()
    
    base_outfit = ""
    
    # Check if model and encoders are available
    if model is None or encoders is None:
        print("Model or encoders not loaded. Using fallback.")
        base_outfit = get_fallback_outfit(temperature)
    else:
        try:
            import pandas as pd
            print("Using ML model for prediction...")
            
            # Normalize weather condition
            normalized_condition = str(weather_condition).capitalize()
            if normalized_condition == "Rain": normalized_condition = "Rainy"
            if normalized_condition == "Clouds": normalized_condition = "Cloudy"
            if normalized_condition == "Clear": normalized_condition = "Sunny"
            
            try:
                weather_encoded = encoders['Weather Type'].transform([normalized_condition])[0]
            except Exception as e:
                print(f"Encoder transform failed for {normalized_condition}: {e}")
                try:
                    # Try original if normalized fails
                    weather_encoded = encoders['Weather Type'].transform([weather_condition])[0]
                except Exception as e2:
                    print(f"Encoder transform failed for original {weather_condition}: {e2}")
                    weather_encoded = 0
                
            input_data = pd.DataFrame([[float(temperature), float(humidity), weather_encoded]], 
                                     columns=['Temperature', 'Humidity', 'Weather Type'])
            base_outfit = str(model.predict(input_data)[0])
            print(f"ML Prediction: {base_outfit}")
        except (ImportError, Exception) as e:
            print(f"Prediction logic error: {e}")
            base_outfit = get_fallback_outfit(temperature)
            
    return get_full_outfit(base_outfit, style, activity)

def get_full_outfit(base_outfit: str, style: str, activity: str):
    # Mapping for accessories based on base item, style and activity
    accessories = {
        "Casual": {
            "Shoes": "Sneakers",
            "Jewelry": "Minimalist Watch",
            "College": "Backpack",
            "Travel": "Crossbody Bag"
        },
        "Formal": {
            "Shoes": "Dress Shoes" if "Shirt" in base_outfit or "Sweater" in base_outfit else "Loafers",
            "Jewelry": "Silver Watch + Leather Belt",
            "Office": "Briefcase",
            "Party": "Statement Watch"
        },
        "Sporty": {
            "Shoes": "Running Shoes",
            "Jewelry": "Fitness Tracker",
            "Gym": "Duffel Bag"
        },
        "Streetwear": {
            "Shoes": "Chunky Sneakers",
            "Jewelry": "Chain Necklace",
            "Party": "Beanie"
        }
    }
    
    # Get style-specific options or default to Casual
    opt = accessories.get(style, accessories["Casual"])
    
    # Construct full outfit
    parts = base_outfit.split(" + ")
    
    # Ensure variety - if base doesn't have shoes, add them
    if not any(kind in base_outfit.lower() for kind in ["shoes", "boots", "sneakers", "loafers"]):
        parts.append(opt.get("Shoes", "Sneakers"))
        
    # Add jewelry/accessories
    parts.append(opt.get("Jewelry", "Watch"))
    
    # Add activity specific item
    if activity in opt:
        parts.append(opt[activity])
        
    return " + ".join(parts)

def get_fallback_outfit(temperature: float):
    if temperature > 25:
        return "T-Shirt + Shorts"
    elif temperature > 15:
        return "Shirt + Chinos"
    else:
        return "Sweater + Jeans"
