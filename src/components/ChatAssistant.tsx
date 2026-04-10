import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatAssistant({ weather }: { weather: WeatherData | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your SkyStyle assistant. Ask me anything about what to wear today!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: `You are SkyStyle AI, a fashion and weather expert. 
          Current weather: ${weather ? `${weather.main?.temp || 0}°C, ${weather.weather?.[0]?.description || "N/A"}` : "Unknown"}.
          Suggest outfits based on this weather and the user's query. Be helpful, stylish, and concise.`,
        }
      });

      const text = response.text;
      setMessages(prev => [...prev, { role: "assistant", content: text || "I'm not sure what to say." }]);
    } catch (err) {
      console.error("AI Assistant error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-text-light rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-all z-50 group"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-all" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-strawberry rounded-full border-2 border-bg-dark" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-bg-dark border border-steel/20 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-surface/50 border-bottom border-steel/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-text-light">SkyStyle AI</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-[10px] text-steel uppercase font-bold tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-steel hover:text-text-light transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-primary text-text-light rounded-tr-none" 
                      : "bg-surface text-text-light/90 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs text-steel">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-surface/30 border-t border-steel/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your outfit..."
                  className="w-full bg-bg-dark border border-steel/20 rounded-2xl pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-primary/50 text-text-light placeholder:text-steel/50"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-text-light rounded-xl flex items-center justify-center hover:bg-cerulean transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
