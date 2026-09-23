import React, { useState, useEffect, useRef } from 'react';
import { VEHICLES, PAINT_COLORS, ROOF_COLORS, EXPERIENCE_MODES, BIG_LOVE_INITIATIVES } from '../data/miniData';
import { VehicleSpec } from '../types/mini';
import { Search, X, ArrowRight, Gauge, Sparkles, Leaf, Car } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (v: VehicleSpec) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVehicle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search matches
  const matchedVehicles = VEHICLES.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.subName.toLowerCase().includes(q) ||
      v.tagline.toLowerCase().includes(q) ||
      v.badge.toLowerCase().includes(q)
  );

  const matchedColors = PAINT_COLORS.filter((p) => p.name.toLowerCase().includes(q));
  const matchedRoofs = ROOF_COLORS.filter((r) => r.name.toLowerCase().includes(q));
  const matchedModes = Object.values(EXPERIENCE_MODES).filter(
    (m) => m.name.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q)
  );
  const matchedStories = BIG_LOVE_INITIATIVES.filter(
    (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  );

  const totalResults =
    matchedVehicles.length +
    matchedColors.length +
    matchedRoofs.length +
    matchedModes.length +
    matchedStories.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search MINI models, colors, multitone roofs, OLED modes, or Big Love..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-sans text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-neutral-400 hover:text-neutral-700 px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {q.length === 0 ? (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Cooper SE', 'Countryman ALL4', 'Multitone Roof', 'Go-Kart Mode', 'Vescin Leather', 'British Racing Green', 'JCW Runway'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-neutral-500">
              <p className="text-sm">No matching MINI specifications found for "{query}".</p>
              <p className="text-xs text-neutral-400 mt-1">Try searching for "Electric", "Chili Red", or "Countryman".</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Vehicles */}
              {matchedVehicles.length > 0 && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                    Vehicles ({matchedVehicles.length})
                  </span>
                  <div className="space-y-2">
                    {matchedVehicles.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          onSelectVehicle(v);
                          onClose();
                        }}
                        className="w-full p-3 rounded-2xl bg-[#F6F5F2] hover:bg-neutral-200/80 transition-colors flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <Car className="w-5 h-5 text-[#0A382C]" />
                          <div>
                            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#0A382C]">
                              {v.name}
                            </p>
                            <p className="text-[11px] text-neutral-500">{v.subName} · {v.priceFrom}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-neutral-900 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exterior Colors & Roofs */}
              {(matchedColors.length > 0 || matchedRoofs.length > 0) && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                    Customization Paints & Roofs
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {matchedColors.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-xl border border-neutral-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="text-xs font-semibold text-neutral-800 truncate">{c.name}</span>
                      </div>
                    ))}
                    {matchedRoofs.map((r) => (
                      <div key={r.id} className="p-2.5 rounded-xl border border-neutral-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-black/20 shrink-0 bg-[#111]" />
                        <span className="text-xs font-semibold text-neutral-800 truncate">{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modes */}
              {matchedModes.length > 0 && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                    OLED Experience Modes
                  </span>
                  <div className="space-y-2">
                    {matchedModes.map((m) => (
                      <div key={m.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                        <p className="text-xs font-bold text-neutral-900">{m.name}</p>
                        <p className="text-[11px] text-neutral-600 mt-0.5">{m.shortDesc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Big Love */}
              {matchedStories.length > 0 && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                    Big Love Sustainability
                  </span>
                  <div className="space-y-2">
                    {matchedStories.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                        <p className="text-xs font-bold text-neutral-900">{s.title}</p>
                        <p className="text-[11px] text-neutral-600 mt-0.5">{s.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
