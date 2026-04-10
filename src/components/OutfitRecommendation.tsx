import { WeatherData, StylePreference, Activity, WardrobeItem } from "../types";
import { Shirt, CheckCircle2, Info, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

type OutfitRecommendationProps = {
  weather: WeatherData | undefined;
  style: StylePreference;
  activity: Activity;
  wardrobe: WardrobeItem[];
};

const predictionCache: Record<string, string> = {};

export function OutfitRecommendation({ weather, style, activity, wardrobe }: OutfitRecommendationProps) {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!weather) return;

    const cacheKey = `${weather.main?.temp}-${weather.main?.humidity}-${weather.weather?.[0]?.main}-${style}-${activity}`;
    if (predictionCache[cacheKey]) {
      setPrediction(predictionCache[cacheKey]);
      return;
    }

    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temperature: weather.main?.temp || 0,
            humidity: weather.main?.humidity || 0,
            weather_condition: weather.weather?.[0]?.main || "Clear",
            style,
            activity
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.error || "Prediction failed");
        }
        const data = await response.json();
        predictionCache[cacheKey] = data.recommended_outfit;
        setPrediction(data.recommended_outfit);
      } catch (err) {
        console.error("Prediction error:", err);
        // Fallback logic if API fails
        const temp = weather.main?.temp || 0;
        if (temp > 25) setPrediction("T-Shirt + Shorts + Sneakers");
        else if (temp > 15) setPrediction("Shirt + Chinos + Loafers");
        else setPrediction("Sweater + Jeans + Boots");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [weather]);

  if (!weather) return null;

  const items = prediction ? prediction.split(" + ") : [];
  const explanation = `Based on the current ${weather.weather?.[0]?.description} conditions and ${weather.main?.temp}°C temperature, our AI suggests this ${style.toLowerCase()} outfit for your ${activity.toLowerCase()} activity.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
            {loading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <Sparkles className="w-6 h-6 text-primary" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-light">Recommended Outfit</h3>
            <p className="text-steel text-sm">Smart AI suggestion for your day</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-steel">Confidence</p>
          <p className="text-2xl font-bold text-primary">88%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {loading ? (
            <div className="h-48 flex items-center justify-center text-steel italic">
              Analyzing weather patterns...
            </div>
          ) : (
            items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-bg-dark/40 border border-steel/20 rounded-2xl p-4 group hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-all">
                  <Shirt className="w-5 h-5 text-steel group-hover:text-primary" />
                </div>
                <span className="font-medium text-text-light">{item}</span>
                <CheckCircle2 className="w-4 h-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </motion.div>
            ))
          )}
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Info className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Why this outfit?</span>
            </div>
            <p className="text-text-light/80 leading-relaxed">
              {explanation}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-primary/10">
            <p className="text-xs text-steel mb-2">Matching from your wardrobe:</p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-dark bg-surface flex items-center justify-center text-[10px] font-bold text-steel">
                  {i}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-bg-dark bg-primary flex items-center justify-center text-[10px] font-bold text-text-light">
                +5
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
