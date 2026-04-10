import { Github, Twitter, Mail, ExternalLink, ShieldCheck, Zap, Globe } from "lucide-react";

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-strawberry to-cerulean bg-clip-text text-transparent">
          About SkyStyle
        </h2>
        <p className="text-steel text-lg max-w-2xl mx-auto">
          SkyStyle is an intelligent fashion companion that bridges the gap between meteorology and personal style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Real-time Data", desc: "Live weather updates from OpenWeather API for precise recommendations." },
          { icon: ShieldCheck, title: "AI-Powered", desc: "Advanced logic and Gemini AI to suggest the most comfortable outfits." },
          { icon: Globe, title: "Global Search", desc: "Plan your style for any city in the world with a single search." }
        ].map((feature, i) => (
          <div key={i} className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-light">{feature.title}</h3>
            <p className="text-steel text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-text-light">The Vision</h3>
            <p className="text-steel leading-relaxed">
              We believe that looking good shouldn't come at the cost of comfort. SkyStyle was built to simplify your morning routine, 
              ensuring you're always prepared for whatever the sky throws at you.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-primary hover:text-cerulean font-bold transition-all">
                <Github className="w-5 h-5" /> GitHub
              </button>
              <button className="flex items-center gap-2 text-strawberry hover:text-strawberry/80 font-bold transition-all">
                <Twitter className="w-5 h-5" /> Twitter
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-text-light">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {["React 19", "Vite", "Tailwind CSS", "Express", "SQLite", "Gemini AI", "Framer Motion"].map((tech) => (
                <span key={tech} className="bg-bg-dark/50 border border-steel/20 px-4 py-2 rounded-xl text-xs font-bold text-steel">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center pt-12 border-t border-steel/20">
        <p className="text-steel text-sm">© 2026 SkyStyle AI. Built with ❤️ for the modern explorer.</p>
      </footer>
    </div>
  );
}
