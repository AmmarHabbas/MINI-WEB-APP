import React, { useState } from 'react';
import { BIG_LOVE_INITIATIVES, KNITTED_INTERIOR_IMAGE, BIG_LOVE_IMAGE } from '../data/miniData';
import { Leaf, Heart, Recycle, Sparkles, Trees, Droplets, ArrowRight } from 'lucide-react';

export const BigLoveSection: React.FC = () => {
  const [monthlyKm, setMonthlyKm] = useState<number>(1200);

  // Sustainability math:
  // Avg petrol car emits ~150g CO2 per km
  // 1 tree absorbs ~22kg CO2 per year
  // Petrol at ~€1.85/L (7L/100km) vs EV at €0.30/kWh (15 kWh/100km)
  const annualKm = monthlyKm * 12;
  const annualCo2SavedKg = Math.round((annualKm * 0.15));
  const treesEquivalent = Math.round(annualCo2SavedKg / 22);
  const petrolAnnualCost = (annualKm / 100) * 7.2 * 1.85;
  const electricAnnualCost = (annualKm / 100) * 15.5 * 0.32;
  const annualSavingsEuro = Math.round(petrolAnnualCost - electricAnnualCost);

  return (
    <section id="big-love" className="py-24 bg-[#111215] text-white relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2D6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#059669]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00C2D6] font-bold mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#00C2D6]" />
            Big Love for the Planet & People
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            Driven by Passion. Guided by Responsibility.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 font-sans leading-relaxed">
            "Big Love" is our continuous commitment to inclusivity, human connection, and circular design. We eliminate leather, recycle marine plastics, and prove that sustainable materials can feel even more luxurious than conventional ones.
          </p>
        </div>

        {/* 2-Column Visual Feature Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Knitted Interior Dashboard */}
          <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={KNITTED_INTERIOR_IMAGE}
                alt="MINI Knitted Dashboard Textile"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111215] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  Textile Innovation
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  100% Recycled Polyester Knitted Architecture
                </h3>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                Using advanced 2D weaving techniques originally pioneered in high-performance running sneakers, the new MINI dashboard is woven directly to final dimensions. This eliminates 100% of fabric cutting scraps while offering an exquisite, warm tactile feel that projects ambient lighting effortlessly.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-mono">
                <span>ZERO CUTTING WASTE</span>
                <span className="text-white font-bold">100% POST-CONSUMER PET</span>
              </div>
            </div>
          </div>

          {/* Card 2: Community & Vescin Animal-Free */}
          <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={BIG_LOVE_IMAGE}
                alt="MINI Community & Big Love"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111215] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-mono text-[#00C2D6] uppercase font-semibold">
                  Ethical Craft
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  Vescin: Animal-Free Luxury Experience
                </h3>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                The entire steering wheel rim, seating, and armrest surfaces are completely free of animal leather. Vescin replicates the buttery grain and breathability of finest nappa leather while generating 85% fewer lifecycle greenhouse gases and requiring zero toxic tanning baths.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-mono">
                <span>VEGAN CERTIFIED</span>
                <span className="text-white font-bold">85% CARBON FOOTPRINT REDUCTION</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Stat Grid (Zero-pill text styling) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BIG_LOVE_INITIATIVES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl sm:text-4xl font-black font-display text-[#00C2D6] tabular-nums block mb-2">
                  {item.stat}
                </span>
                <h4 className="text-base font-bold text-white font-display">{item.title}</h4>
                <p className="text-xs text-white/60 font-sans mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/40">
                {item.statLabel}
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE SUSTAINABILITY & EMISSIONS CALCULATOR */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0A382C] to-[#0E1F1A] border border-emerald-500/20 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 6 cols: Slider */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Interactive Impact Calculator
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                How Much Big Love Can Your Commute Give?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-sans">
                Adjust your estimated monthly driving distance to see real-world CO2 tailpipe savings and operational energy cost reductions by switching to an all-electric MINI Cooper.
              </p>

              {/* Slider Control */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-white/80">
                  <span>Monthly Distance:</span>
                  <span className="text-lg font-bold text-emerald-300 tabular-nums">
                    {monthlyKm.toLocaleString()} km / month
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3500"
                  step="50"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-950/60 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  aria-label="Monthly driving distance"
                />
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>300 km (City Hopper)</span>
                  <span>1,800 km (Daily Commute)</span>
                  <span>3,500 km (High Mileage)</span>
                </div>
              </div>
            </div>

            {/* Right 6 cols: Calculated Metrics */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm text-center flex flex-col justify-center">
                <Leaf className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <span className="text-2xl sm:text-3xl font-black font-display text-white tabular-nums">
                  {annualCo2SavedKg.toLocaleString()} kg
                </span>
                <span className="text-[11px] text-white/60 font-mono mt-1">CO2 Eliminated / Year</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm text-center flex flex-col justify-center">
                <Trees className="w-5 h-5 text-[#00C2D6] mx-auto mb-2" />
                <span className="text-2xl sm:text-3xl font-black font-display text-[#00C2D6] tabular-nums">
                  {treesEquivalent}
                </span>
                <span className="text-[11px] text-white/60 font-mono mt-1">Trees Equivalent Saved</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm text-center flex flex-col justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 mx-auto mb-2" />
                <span className="text-2xl sm:text-3xl font-black font-display text-amber-300 tabular-nums">
                  €{annualSavingsEuro.toLocaleString()}
                </span>
                <span className="text-[11px] text-white/60 font-mono mt-1">Est. Fuel Savings / Year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
