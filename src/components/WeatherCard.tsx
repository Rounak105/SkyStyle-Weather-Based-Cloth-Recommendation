import { WeatherData } from "../types";
import { Cloud, Droplets, Wind, Sun, Thermometer, MapPin, Loader2 } from "lucide-react";
import { motion } from "motion/react";

type WeatherCardProps = {
  weather: WeatherData | undefined;
  loading: boolean;
  error: string | null;
};

export function WeatherCard({ weather, loading, error }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-12 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-steel text-sm animate-pulse">Detecting conditions...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
        <p className="text-red-400 font-medium">{error || "Weather data unavailable"}</p>
        <p className="text-red-400/60 text-xs mt-2">Please check your API key or connection.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 text-steel mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{weather.name}{weather.sys?.country ? `, ${weather.sys.country}` : ""}</span>
          </div>
          <h2 className="text-6xl font-bold tracking-tighter text-text-light">
            {Math.round(weather.main?.temp || 0)}°
          </h2>
          <p className="text-steel font-medium mt-1 capitalize">
            {weather.weather?.[0]?.description || "N/A"}
          </p>
        </div>
        <div className="w-20 h-20 bg-steel/20 rounded-2xl flex items-center justify-center">
          {weather.weather?.[0]?.icon && (
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
              alt="weather"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
        <div className="bg-bg-dark/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-cerulean/10 rounded-xl flex items-center justify-center">
            <Droplets className="w-5 h-5 text-cerulean" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-steel">Humidity</p>
            <p className="text-sm font-semibold text-text-light">{weather.main?.humidity || 0}%</p>
          </div>
        </div>
        <div className="bg-bg-dark/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Wind className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-steel">Wind</p>
            <p className="text-sm font-semibold text-text-light">{weather.wind?.speed || 0} km/h</p>
          </div>
        </div>
        <div className="bg-bg-dark/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-strawberry/10 rounded-xl flex items-center justify-center">
            <Sun className="w-5 h-5 text-strawberry" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-steel">Feels Like</p>
            <p className="text-sm font-semibold text-text-light">{Math.round(weather.main?.feels_like || 0)}°</p>
          </div>
        </div>
        <div className="bg-bg-dark/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-steel/10 rounded-xl flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-steel" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-steel">Pressure</p>
            <p className="text-sm font-semibold text-text-light">{weather.main?.pressure || 0} hPa</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
