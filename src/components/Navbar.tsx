import { LayoutDashboard, Shirt, Plane, Info, Search, Activity, Sun, Moon } from "lucide-react";
import { cn } from "../lib/utils";

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
};

export function Navbar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: NavbarProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "performance", label: "Model Performance", icon: Activity },
    { id: "wardrobe", label: "Wardrobe", icon: Shirt },
    { id: "planner", label: "Trip Planner", icon: Plane },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto bg-surface/50 backdrop-blur-xl border border-steel/30 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Shirt className="text-text-light w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-text-light to-steel bg-clip-text text-transparent hidden sm:block">
            SkyStyle
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-steel hover:text-text-light hover:bg-surface/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
          
          <div className="w-px h-6 bg-steel/20 mx-2 hidden sm:block" />
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-steel hover:text-text-light hover:bg-surface/50 transition-all"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
