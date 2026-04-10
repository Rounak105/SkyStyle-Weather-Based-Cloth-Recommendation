import { useState } from "react";
import { Plane, MapPin, Calendar, CheckCircle2, Luggage, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{ items: string[]; weather: string } | null>(null);

  const generatePlan = async () => {
    setLoading(true);
    // Simulate AI logic
    setTimeout(() => {
      setPlan({
        weather: "Sunny & Warm (28°C)",
        items: [
          `${days} T-shirts`,
          `${Math.ceil(days / 2)} Shorts`,
          "1 Sunglasses",
          "1 Sandals",
          "1 Swimwear",
          "Sunscreen",
          "Power Bank"
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
          <Plane className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-text-light">Travel Packing Assistant</h2>
        <p className="text-steel">Never forget an essential again. Smart packing lists based on your destination.</p>
      </div>

      <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase text-steel mb-2 block">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Goa, Paris"
                className="w-full bg-bg-dark border border-steel/20 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 text-text-light placeholder:text-steel/50"
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase text-steel mb-2 block">Duration (Days)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full bg-bg-dark border border-steel/20 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 text-text-light"
              />
            </div>
          </div>
          <button
            onClick={generatePlan}
            disabled={!destination || loading}
            className="bg-primary hover:bg-cerulean disabled:opacity-50 text-text-light font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate List</>}
          </button>
        </div>
      </div>

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Luggage className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-text-light">Packing Checklist</h3>
            </div>
            <div className="space-y-3">
              {plan.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-bg-dark/40 p-4 rounded-2xl border border-steel/20">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-text-light">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 flex flex-col justify-center text-center space-y-4">
            <p className="text-primary font-bold uppercase tracking-widest text-xs">Expected Weather</p>
            <p className="text-3xl font-bold text-text-light">{plan.weather}</p>
            <p className="text-steel text-sm leading-relaxed">
              Based on historical data for {destination}, we recommend light fabrics and sun protection. 
              Enjoy your {days}-day trip!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
