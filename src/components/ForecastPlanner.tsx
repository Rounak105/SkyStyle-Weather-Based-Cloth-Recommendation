import { ForecastData, StylePreference } from "../types";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Shirt, Calendar } from "lucide-react";

type ForecastPlannerProps = {
  forecast: ForecastData | undefined;
  style: StylePreference;
};

export function ForecastPlanner({ forecast, style }: ForecastPlannerProps) {
  if (!forecast) return null;

  // Group forecast by day (taking 12:00 PM for each day)
  const dailyForecast = forecast.list?.filter((item) => item.dt_txt?.includes("12:00:00") || format(new Date(item.dt * 1000), "HH") === "12").slice(0, 5) || [];

  const getRecommendation = (temp: number, weather: string) => {
    if (temp > 25) return "T-shirt + Shorts";
    if (temp > 15) return "Casual Shirt + Jeans";
    if (temp > 5) return "Hoodie + Jacket";
    return "Heavy Coat + Scarf";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-text-light">5-Day Outfit Planner</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyForecast.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-2xl p-4 flex flex-col items-center text-center group hover:bg-surface/60 transition-all"
          >
            <p className="text-xs font-bold text-steel uppercase tracking-wider mb-2">
              {format(new Date(day.dt * 1000), "EEEE")}
            </p>
            {day.weather?.[0]?.icon && (
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                alt="weather"
                className="w-12 h-12 mb-1"
                referrerPolicy="no-referrer"
              />
            )}
            <p className="text-xl font-bold mb-1 text-text-light">{Math.round(day.main?.temp || 0)}°</p>
            <p className="text-[10px] text-steel capitalize mb-4">{day.weather?.[0]?.main || "N/A"}</p>
            
            <div className="mt-auto w-full pt-4 border-t border-steel/20">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Shirt className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase">Wear</span>
              </div>
              <p className="text-[11px] font-medium text-text-light/80">
                {getRecommendation(day.main.temp, day.weather?.[0]?.main || "Clear")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
