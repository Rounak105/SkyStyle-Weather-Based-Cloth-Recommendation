import { motion } from "motion/react";
import { Fragment } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  BarChart3, 
  PieChart, 
  Cpu, 
  Database, 
  Layers, 
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Shirt,
  Info
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  Legend
} from "recharts";

const metrics = [
  { name: "Model Accuracy", value: 92, trend: "+2.4%", up: true, icon: Target },
  { name: "Precision", value: 89, trend: "+1.1%", up: true, icon: Activity },
  { name: "Recall", value: 94, trend: "-0.5%", up: false, icon: BarChart3 },
  { name: "F1 Score", value: 91, trend: "+1.8%", up: true, icon: PieChart },
];

const trainingData = [
  { epoch: 1, train: 65, val: 60 },
  { epoch: 2, train: 72, val: 68 },
  { epoch: 3, train: 78, val: 74 },
  { epoch: 4, train: 82, val: 79 },
  { epoch: 5, train: 85, val: 82 },
  { epoch: 6, train: 88, val: 85 },
  { epoch: 7, train: 90, val: 87 },
  { epoch: 8, train: 91, val: 88 },
  { epoch: 9, train: 92, val: 89 },
  { epoch: 10, train: 93, val: 90 },
];

const distributionData = [
  { category: "Hot", samples: 1250, color: "#FB3640" },
  { category: "Cold", samples: 980, color: "#1D3461" },
  { category: "Rainy", samples: 750, color: "#247BA0" },
  { category: "Windy", samples: 450, color: "#605F5E" },
  { category: "Mild", samples: 1100, color: "#1F487E" },
];

const confusionMatrix = [
  { actual: "Hot", predicted: "Hot", value: 45 },
  { actual: "Hot", predicted: "Cold", value: 2 },
  { actual: "Hot", predicted: "Rainy", value: 1 },
  { actual: "Hot", predicted: "Mild", value: 2 },
  { actual: "Cold", predicted: "Hot", value: 1 },
  { actual: "Cold", predicted: "Cold", value: 42 },
  { actual: "Cold", predicted: "Rainy", value: 3 },
  { actual: "Cold", predicted: "Mild", value: 4 },
  { actual: "Rainy", predicted: "Hot", value: 0 },
  { actual: "Rainy", predicted: "Cold", value: 5 },
  { actual: "Rainy", predicted: "Rainy", value: 38 },
  { actual: "Rainy", predicted: "Mild", value: 7 },
  { actual: "Mild", predicted: "Hot", value: 3 },
  { actual: "Mild", predicted: "Cold", value: 2 },
  { actual: "Mild", predicted: "Rainy", value: 5 },
  { actual: "Mild", predicted: "Mild", value: 40 },
];

const categories = ["Hot", "Cold", "Rainy", "Mild"];

export function ModelDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-light">Model Performance Dashboard</h2>
          <p className="text-steel">Weather-Based Clothing Recommendation System v2.1</p>
        </div>
        <div className="flex items-center gap-3 bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-2xl px-4 py-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-steel">Model Status: Active</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-6 group hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${metric.up ? "text-emerald-400" : "text-strawberry"}`}>
                {metric.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {metric.trend}
              </div>
            </div>
            <h4 className="text-steel text-sm font-medium mb-1">{metric.name}</h4>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-text-light">{metric.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-bg-dark rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                className="h-full bg-primary"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Training Accuracy Graph */}
        <div className="lg:col-span-2 bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-text-light">Training vs Validation Accuracy</h3>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-steel">Training</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-strawberry" />
                <span className="text-steel">Validation</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F487E" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="epoch" 
                  stroke="#605F5E" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  label={{ value: 'Epochs', position: 'insideBottom', offset: -5, fill: '#605F5E', fontSize: 10 }}
                />
                <YAxis 
                  stroke="#605F5E" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[50, 100]}
                  label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fill: '#605F5E', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1B263B', border: '1px solid #1F487E', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="train" 
                  stroke="#247BA0" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#247BA0', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#FB3640" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#FB3640', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction Confidence Gauge */}
        <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-text-light mb-8">Prediction Confidence</h3>
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#0D1B2A"
                strokeWidth="8"
                strokeDasharray="282.7"
                strokeDashoffset="70.7"
                transform="rotate(135 50 50)"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#247BA0"
                strokeWidth="8"
                strokeDasharray="282.7"
                initial={{ strokeDashoffset: 282.7 }}
                animate={{ strokeDashoffset: 282.7 - (282.7 * 0.75 * 0.88) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(135 50 50)"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-text-light">88%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-steel">High Confidence</span>
            </div>
          </div>
          <p className="text-steel text-sm mt-8 leading-relaxed">
            The model demonstrates strong certainty in its current recommendations based on historical patterns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-text-light mb-8">Confusion Matrix</h3>
          <div className="grid grid-cols-5 gap-2">
            <div />
            {categories.map(cat => (
              <div key={cat} className="text-[10px] font-bold uppercase tracking-widest text-steel text-center pb-2">
                Pred {cat}
              </div>
            ))}
            {categories.map(actual => (
              <Fragment key={`row-${actual}`}>
                <div key={`label-${actual}`} className="text-[10px] font-bold uppercase tracking-widest text-steel flex items-center pr-2">
                  {actual}
                </div>
                {categories.map(pred => {
                  const cell = confusionMatrix.find(c => c.actual === actual && c.predicted === pred);
                  const isDiagonal = actual === pred;
                  const opacity = (cell?.value || 0) / 50;
                  return (
                    <div 
                      key={`${actual}-${pred}`}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all hover:scale-105 cursor-help ${
                        isDiagonal ? "bg-primary text-text-light" : "bg-steel/10 text-steel"
                      }`}
                      style={{ opacity: isDiagonal ? 0.4 + opacity * 0.6 : 0.2 + opacity * 0.8 }}
                      title={`Actual: ${actual}, Predicted: ${pred}, Count: ${cell?.value}`}
                    >
                      {cell?.value}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="text-[10px] font-bold uppercase text-steel">Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-steel/20" />
              <span className="text-[10px] font-bold uppercase text-steel">Incorrect</span>
            </div>
          </div>
        </div>

        {/* Dataset Distribution */}
        <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-text-light mb-8">Dataset Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F487E" opacity={0.2} vertical={false} />
                <XAxis dataKey="category" stroke="#605F5E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#605F5E" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(31, 72, 126, 0.1)' }}
                  contentStyle={{ backgroundColor: '#1B263B', border: '1px solid #1F487E', borderRadius: '12px' }}
                />
                <Bar dataKey="samples" radius={[8, 8, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-Time Prediction Panel */}
        <div className="lg:col-span-2 bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-strawberry/10 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-strawberry" />
            </div>
            <h3 className="text-xl font-bold text-text-light">Real-Time Prediction Panel</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-steel">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Input Data</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-dark/40 p-4 rounded-2xl border border-steel/10">
                  <div className="flex items-center gap-2 text-steel mb-1">
                    <Thermometer className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">Temp</span>
                  </div>
                  <p className="text-lg font-bold text-text-light">28°C</p>
                </div>
                <div className="bg-bg-dark/40 p-4 rounded-2xl border border-steel/10">
                  <div className="flex items-center gap-2 text-steel mb-1">
                    <Droplets className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">Humidity</span>
                  </div>
                  <p className="text-lg font-bold text-text-light">65%</p>
                </div>
                <div className="bg-bg-dark/40 p-4 rounded-2xl border border-steel/10">
                  <div className="flex items-center gap-2 text-steel mb-1">
                    <Wind className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">Wind</span>
                  </div>
                  <p className="text-lg font-bold text-text-light">12 km/h</p>
                </div>
                <div className="bg-bg-dark/40 p-4 rounded-2xl border border-steel/10">
                  <div className="flex items-center gap-2 text-steel mb-1">
                    <Cloud className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">Cond</span>
                  </div>
                  <p className="text-lg font-bold text-text-light">Cloudy</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Shirt className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Model Output</span>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 h-full flex flex-col justify-center">
                <p className="text-steel text-xs mb-2">Recommended Outfit:</p>
                <p className="text-2xl font-bold text-text-light leading-tight">
                  Casual shirt + Jeans + Sneakers
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="px-2 py-1 bg-primary/20 rounded text-[10px] font-bold text-primary uppercase">Summer</div>
                  <div className="px-2 py-1 bg-primary/20 rounded text-[10px] font-bold text-primary uppercase">Casual</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Training Info */}
        <div className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-text-light mb-8">Model Info</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-steel/10 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-steel" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-steel">Algorithm</p>
                <p className="font-bold text-text-light">Random Forest Classifier</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-steel/10 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-steel" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-steel">Dataset Size</p>
                <p className="font-bold text-text-light">15,420 Samples</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-steel/10 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-steel" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-steel">Features</p>
                <p className="font-bold text-text-light">12 Input Parameters</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-steel/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-steel" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-steel">Last Training</p>
                <p className="font-bold text-text-light">March 04, 2026</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-steel/20 hover:bg-steel/30 text-text-light rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" /> Retrain Model
          </button>
        </div>
      </div>
    </div>
  );
}
