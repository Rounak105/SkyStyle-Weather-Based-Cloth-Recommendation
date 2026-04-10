import { motion, AnimatePresence } from "motion/react";
import { WeatherData } from "../types";

type WeatherBackgroundProps = {
  weather: WeatherData | undefined;
};

export function WeatherBackground({ weather }: WeatherBackgroundProps) {
  const condition = weather?.weather?.[0]?.main.toLowerCase() || "clear";

  const renderEffect = () => {
    switch (condition) {
      case "rain":
      case "drizzle":
      case "thunderstorm":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                initial={{ y: -100, x: Math.random() * 100 + "%" }}
                animate={{ 
                  y: "110vh",
                  transition: { 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: Math.random() * 3 
                  } 
                }}
                className="absolute w-[1px] h-12 bg-cerulean/20"
              />
            ))}
          </div>
        );

      case "clouds":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`cloud-${i}`}
                initial={{ x: "-20%", y: 10 + Math.random() * 60 + "%", opacity: 0.1 }}
                animate={{ 
                  x: "120%",
                  transition: { 
                    duration: 40 + Math.random() * 20, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: i * 8
                  } 
                }}
                className="absolute w-96 h-48 bg-steel/5 blur-[80px] rounded-full"
              />
            ))}
          </div>
        );

      case "clear":
      case "sun":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.03, 0.06, 0.03],
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-[-10%] right-[-10%] w-[70%] aspect-square bg-strawberry/5 blur-[150px] rounded-full"
            />
          </div>
        );

      case "snow":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`snow-${i}`}
                initial={{ y: -20, x: Math.random() * 100 + "%" }}
                animate={{ 
                  y: "110vh",
                  x: (Math.random() * 100 + (Math.sin(i) * 10)) + "%",
                  transition: { 
                    duration: 5 + Math.random() * 5, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: Math.random() * 5 
                  } 
                }}
                className="absolute w-1.5 h-1.5 bg-white/20 rounded-full blur-[1px]"
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-bg-dark" />
      
      {/* Dynamic Weather Gradients */}
      <AnimatePresence mode="wait">
        <motion.div
          key={condition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          {condition === "rain" && (
            <div className="absolute inset-0 bg-gradient-to-b from-cerulean/10 to-transparent" />
          )}
          {condition === "clouds" && (
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal/30 to-transparent" />
          )}
          {condition === "clear" && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(251,54,64,0.03),_transparent_60%)]" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Particle Effects */}
      {renderEffect()}
    </div>
  );
}
