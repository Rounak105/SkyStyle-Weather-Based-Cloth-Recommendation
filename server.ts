import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { spawn, execSync } from "child_process";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure fetch is available (for Node < 18)
if (!globalThis.fetch) {
  const fetch = (...args: any[]) => import("node-fetch").then(({ default: fetch }) => (fetch as any)(...args));
  (globalThis as any).fetch = fetch;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  console.log("Environment check:");
  console.log("BACKEND_URL:", process.env.BACKEND_URL);
  console.log("APP_URL:", process.env.APP_URL);
  
  const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  console.log(`Using BACKEND_URL: ${BACKEND_URL}`);

  // Start FastAPI backend
  if (!process.env.BACKEND_URL) {
    console.log("Starting FastAPI backend...");
    
    // Check for python3 or python
    let pythonCmd = "python3";
    try {
      execSync("python3 --version", { stdio: "ignore" });
    } catch (e) {
      pythonCmd = "python";
    }
    
    console.log(`Using Python command: ${pythonCmd}`);

    const backend = spawn(pythonCmd, ["-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"]);
    
    backend.stdout.on("data", (data) => {
      console.log(`[Backend]: ${data}`);
    });
    
    backend.stderr.on("data", (data) => {
      console.error(`[Backend Error]: ${data}`);
    });
    
    backend.on("error", (err) => {
      console.error("Failed to start backend process:", err);
    });
    
    backend.on("close", (code) => {
      console.log(`Backend process exited with code ${code}`);
    });
  }

  app.use(express.json());

  const weatherCache = new Map<string, { data: any; timestamp: number }>();
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // API Routes
  app.get("/api/weather", async (req, res) => {
    const { lat, lon, city } = req.query;
    const cacheKey = city ? `city:${city}` : `coords:${lat}:${lon}`;
    
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Serving cached weather for ${cacheKey}`);
      return res.json(cached.data);
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OpenWeather API Key is missing. Please add it to your secrets." });
    }

    try {
      let url = "";
      if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      } else {
        return res.status(400).json({ error: "Missing location parameters" });
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod && data.cod !== 200) {
        return res.status(data.cod).json({ error: data.message });
      }

      // Also fetch forecast
      let forecastUrl = "";
      if (city) {
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
      } else {
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      }
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      const result = { current: data, forecast: forecastData };
      weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
      res.json(result);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Proxy other API requests to FastAPI backend
  app.all("/api/*", async (req, res) => {
    const targetUrl = `${BACKEND_URL}${req.originalUrl}`;
    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: ["POST", "PUT", "PATCH"].includes(req.method) ? JSON.stringify(req.body) : undefined,
      });
      
      const data = await response.json();
      if (!response.ok) {
        console.error(`Backend returned ${response.status} for ${targetUrl}:`, data);
      }
      res.status(response.status).json(data);
    } catch (error) {
      console.error(`Proxy error for ${targetUrl}:`, error);
      res.status(502).json({ 
        error: "Backend unreachable", 
        detail: error instanceof Error ? error.message : String(error),
        message: "The fashion AI might still be warming up. Please try again in a few seconds." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Proxying /api/* to ${BACKEND_URL}`);
    
    // Ping backend
    let retries = 5;
    while (retries > 0) {
      try {
        const healthRes = await fetch(`${BACKEND_URL}/health`);
        if (healthRes.ok) {
          console.log("Backend is healthy and reachable.");
          break;
        }
      } catch (err) {
        console.log(`Waiting for backend... (${retries} retries left)`);
      }
      retries--;
      await new Promise(r => setTimeout(r, 2000));
    }
  });
}

startServer();
