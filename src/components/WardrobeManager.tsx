import React, { useState } from "react";
import { WardrobeItem } from "../types";
import { Plus, Trash2, Shirt, Tag, Palette, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type WardrobeManagerProps = {
  wardrobe: WardrobeItem[];
  onUpdate: () => void;
};

export function WardrobeManager({ wardrobe, onUpdate }: WardrobeManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WardrobeItem>>({
    name: "",
    category: "Tops",
    color: "",
    tags: "",
    image_url: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add item");
      
      setIsAdding(false);
      setNewItem({ name: "", category: "Tops", color: "", tags: "", image_url: "" });
      onUpdate();
    } catch (err) {
      console.error("Add item error:", err);
      alert("Failed to add item to wardrobe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      onUpdate();
    } catch (err) {
      console.error("Delete item error:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Digital Wardrobe</h2>
          <p className="text-slate-400 mt-1">Manage your collection and get personalized suggestions.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary hover:bg-cerulean text-text-light px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm"
          >
            <div className="bg-surface border border-steel/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-text-light">Add New Clothing</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-steel mb-2 block">Item Name</label>
                  <input
                    required
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full bg-bg-dark border border-steel/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none text-text-light"
                    placeholder="e.g. Black Hoodie"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-steel mb-2 block">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full bg-bg-dark border border-steel/20 rounded-xl px-4 py-2 outline-none text-text-light"
                    >
                      {["Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-steel mb-2 block">Color</label>
                    <input
                      type="text"
                      value={newItem.color}
                      onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                      className="w-full bg-bg-dark border border-steel/20 rounded-xl px-4 py-2 outline-none text-text-light"
                      placeholder="e.g. Black"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-steel mb-2 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                    className="w-full bg-bg-dark border border-steel/20 rounded-xl px-4 py-2 outline-none text-text-light"
                    placeholder="e.g. warm, casual, cotton"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-steel mb-2 block">Clothing Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-bg-dark border border-steel/20 rounded-xl flex items-center justify-center overflow-hidden">
                      {newItem.image_url ? (
                        <img src={newItem.image_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-steel" />
                      )}
                    </div>
                    <label className="flex-1 cursor-pointer bg-bg-dark border border-steel/20 rounded-xl px-4 py-2 text-sm text-steel hover:text-text-light hover:border-primary/50 transition-all text-center">
                      <span>{newItem.image_url ? "Change Image" : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 bg-surface hover:bg-steel/20 text-text-light py-3 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-cerulean text-text-light py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Item"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wardrobe.length === 0 ? (
          <div className="col-span-full bg-slate-800/20 border border-dashed border-slate-700 rounded-3xl p-12 text-center">
            <Shirt className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Your wardrobe is empty. Start adding some clothes!</p>
          </div>
        ) : (
          wardrobe.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface/40 backdrop-blur-xl border border-steel/20 rounded-3xl p-6 group hover:border-primary/30 transition-all"
            >
              <div className="aspect-square bg-bg-dark/50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Shirt className="w-12 h-12 text-steel group-hover:text-primary/50 transition-all" />
                )}
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="absolute top-2 right-2 w-8 h-8 bg-strawberry/10 hover:bg-strawberry text-strawberry hover:text-text-light rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-bold text-lg text-text-light">{item.name}</h4>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">{item.category}</p>
              
              <div className="flex flex-wrap gap-2">
                {item.color && (
                  <div className="flex items-center gap-1 bg-bg-dark/50 px-2 py-1 rounded-lg text-[10px] font-medium text-steel">
                    <Palette className="w-3 h-3" />
                    {item.color}
                  </div>
                )}
                {item.tags?.split(",").map((tag, i) => (
                  <div key={i} className="flex items-center gap-1 bg-bg-dark/50 px-2 py-1 rounded-lg text-[10px] font-medium text-steel">
                    <Tag className="w-3 h-3" />
                    {tag.trim()}
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
