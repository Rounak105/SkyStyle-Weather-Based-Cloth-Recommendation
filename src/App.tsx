import { useState, useEffect, useMemo } from "react";
import { WeatherData, ForecastData, WardrobeItem, StylePreference, Activity } from "./types";
import { Navbar } from "./components/Navbar";
import { WeatherCard } from "./components/WeatherCard";
import { WeatherBackground } from "./components/WeatherBackground";
import { OutfitRecommendation } from "./components/OutfitRecommendation";
import { ForecastPlanner } from "./components/ForecastPlanner";
import { WardrobeManager } from "./components/WardrobeManager";
import { TripPlanner } from "./components/TripPlanner";
import { PerformanceDashboard } from "./components/PerformanceDashboard";
import { ChatAssistant } from "./components/ChatAssistant";
import { About } from "./components/About";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, CloudRain, Sun, Wind } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [weather, setWeather] = useState<{ current: WeatherData; forecast: ForecastData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<StylePreference>("Casual");
  const [activity, setActivity] = useState<Activity>("College");
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);

  const fetchWeather = async (lat?: number, lon?: number, city?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = "";
      if (city) query = `city=${city}`;
      else if (lat && lon) query = `lat=${lat}&lon=${lon}`;
      else {
        // Default to London if no location
        query = "city=London";
      }

      const res = await fetch(`/api/weather?${query}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.detail) throw new Error(data.detail);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const fetchWardrobe = async () => {
    try {
      const res = await fetch("/api/wardrobe");
      const data = await res.json();
      setWardrobe(data);
    } catch (err) {
      console.error("Failed to fetch wardrobe", err);
    }
  };

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(), // Fallback
        { timeout: 5000 } // 5 second timeout
      );
    } else {
      fetchWeather();
    }
    fetchWardrobe();
  }, []);

  const alerts = useMemo(() => {
    if (!weather) return [];
    const list = [];
    const current = weather.current;
    if (current.weather?.[0]?.main.toLowerCase().includes("rain")) {
      list.push({ icon: <CloudRain className="w-5 h-5" />, text: "Rain expected! Don't forget your umbrella." });
    }
    if (current.main?.temp > 30) {
      list.push({ icon: <Sun className="w-5 h-5" />, text: "High UV levels. Wear sunglasses and sunscreen." });
    }
    if (current.wind?.speed > 10) {
      list.push({ icon: <Wind className="w-5 h-5" />, text: "Strong winds detected. Layer up!" });
    }
    return list;
  }, [weather]);

  return (
    <div className={`min-h-screen bg-bg-dark text-text-light font-sans selection:bg-primary/30 ${!isDarkMode ? "light" : ""}`}>
      <WeatherBackground weather={weather?.current} />
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero / Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}
                  </h1>
                  <p className="text-slate-400 mt-2">Here's your personalized style guide for today.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search city..."
                      className="bg-surface/50 border border-steel/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-text-light placeholder:text-steel/50"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchWeather(undefined, undefined, (e.target as HTMLInputElement).value);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {alerts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alerts.map((alert, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl p-4 text-primary"
                    >
                      {alert.icon}
                      <span className="text-sm font-medium">{alert.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weather Panel */}
                <div className="lg:col-span-1 space-y-8">
                  <WeatherCard weather={weather?.current} loading={loading} error={error} />
                  
                  {/* Preferences */}
                  <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-6 space-y-6">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-steel mb-3 block">Style Preference</label>
                      <div className="flex flex-wrap gap-2">
                        {["Casual", "Formal", "Streetwear", "Sporty", "Minimalist"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setStyle(s as StylePreference)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              style === s ? "bg-primary text-text-light shadow-lg shadow-primary/20" : "bg-steel/20 text-steel hover:bg-steel/30"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-steel mb-3 block">Current Activity</label>
                      <div className="flex flex-wrap gap-2">
                        {["College", "Office", "Gym", "Party", "Travel", "Outdoor sports"].map((a) => (
                          <button
                            key={a}
                            onClick={() => setActivity(a as Activity)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              activity === a ? "bg-primary text-text-light shadow-lg shadow-primary/20" : "bg-steel/20 text-steel hover:bg-steel/30"
                            }`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="lg:col-span-2 space-y-8">
                  <OutfitRecommendation 
                    weather={weather?.current} 
                    style={style} 
                    activity={activity} 
                    wardrobe={wardrobe}
                  />
                  <ForecastPlanner forecast={weather?.forecast} style={style} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "performance" && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PerformanceDashboard />
            </motion.div>
          )}

          {activeTab === "wardrobe" && (
            <motion.div
              key="wardrobe"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <WardrobeManager wardrobe={wardrobe} onUpdate={fetchWardrobe} />
            </motion.div>
          )}

          {activeTab === "planner" && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TripPlanner />
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <About />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ChatAssistant weather={weather?.current} />
    </div>
  );
}
