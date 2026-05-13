
import React from 'react';
import { TextureType } from '../types';

interface HUDProps {
  currentTexture: TextureType;
  setTexture: (t: TextureType) => void;
  onSave: () => void;
  onReset: () => void;
  onAssistant: () => void;
  isLoadingAssistant: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onPlaceStructure: (type: string) => void;
}

const textures: TextureType[] = ['dirt', 'grass', 'glass', 'wood', 'log', 'cobblestone'];

const HUD: React.FC<HUDProps> = ({ 
  currentTexture, 
  setTexture, 
  onSave, 
  onReset, 
  onAssistant, 
  isLoadingAssistant,
  isMenuOpen,
  setIsMenuOpen,
  onPlaceStructure
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-md border border-white/20">
          <h1 className="text-white font-bold text-xl minecraft-font">GEMINI CRAFT</h1>
          <p className="text-white/70 text-sm">WASD to move | E to toggle Build Menu</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onAssistant}
            disabled={isLoadingAssistant}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isLoadingAssistant ? (
              <span className="animate-spin text-xl">✨</span>
            ) : (
              <span>✨ Gemini AI</span>
            )}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md font-bold border border-white/20 transition-all shadow-lg">
            {isMenuOpen ? 'Close Menu' : 'Build Menu (E)'}
          </button>
          <button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold transition-all shadow-lg">
            Save
          </button>
          <button onClick={onReset} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold transition-all shadow-lg">
            Reset
          </button>
        </div>
      </div>

      {/* Build Menu Overlay */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 p-8 pointer-events-auto transition-transform duration-300 ease-in-out z-40 flex flex-col gap-8 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-white text-2xl font-black minecraft-font">BUILD MENU</h2>
          <button onClick={() => setIsMenuOpen(false)} className="text-white/50 hover:text-white">✕</button>
        </div>

        {/* Materials Section */}
        <section>
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Materials</h3>
          <div className="grid grid-cols-3 gap-3">
            {textures.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTexture(t);
                  setIsMenuOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                  currentTexture === t ? 'bg-white/10 border-white shadow-lg scale-105' : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded shadow-inner mb-2"
                  style={{ backgroundColor: getTextureColor(t) }}
                />
                <span className="text-white text-[10px] uppercase font-bold">{t}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Structures Section */}
        <section>
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Blueprints</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'hut', label: 'Small Hut', color: 'from-amber-700 to-amber-900' },
              { id: 'pillar', label: 'Tall Pillar', color: 'from-stone-600 to-stone-800' },
              { id: 'arch', label: 'Stone Arch', color: 'from-slate-500 to-slate-700' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => onPlaceStructure(s.id)}
                className={`w-full p-4 rounded-xl bg-gradient-to-br ${s.color} text-white font-bold text-left border border-white/10 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg group flex items-center justify-between`}
              >
                <span>{s.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">🔨</span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-auto text-white/30 text-[10px] leading-relaxed italic">
          Select a material to build manually, or use a blueprint to instantly generate structures.
        </div>
      </div>

      {/* Crosshair - only show when menu is closed */}
      {!isMenuOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-50">
          <div className="absolute w-full h-0.5 bg-white"></div>
          <div className="absolute h-full w-0.5 bg-white"></div>
        </div>
      )}

      {/* Hotbar */}
      <div className={`flex flex-col items-center gap-4 transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-90 translate-y-10' : 'opacity-100 translate-y-0'}`}>
        <div className="bg-black/40 p-2 rounded-xl backdrop-blur-md flex gap-2 border border-white/10 pointer-events-auto">
          {textures.map((t, i) => (
            <button
              key={t}
              onClick={() => setTexture(t)}
              className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all border-2 ${
                currentTexture === t ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-60'
              }`}
              title={`${t} (Key ${i + 1})`}
            >
              <div 
                className="w-10 h-10 rounded shadow-inner"
                style={{ backgroundColor: getTextureColor(t) }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const getTextureColor = (t: TextureType) => {
  switch(t) {
    case 'dirt': return '#5d4037';
    case 'grass': return '#4caf50';
    case 'glass': return '#e1f5fe';
    case 'wood': return '#795548';
    case 'log': return '#4e342e';
    case 'cobblestone': return '#757575';
    default: return '#fff';
  }
};

export default HUD;
