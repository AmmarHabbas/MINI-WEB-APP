import React from 'react';
import { HERO_IMAGE } from '../data/miniData';
import { miniAudio } from '../utils/audio';
import { Sparkles, ArrowRight, Gauge, Zap } from 'lucide-react';

interface HeroProps {
  onOpenTestDrive: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTestDrive }) => {
  return (
    <section className="relative overflow-hidden bg-[#F6F5F2] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Text Block */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0A382C] font-bold mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C2D6]" />
            Big Love & Go-Kart Agility
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-[#111215] leading-[1.02]">
            CHARISMATIC SIMPLICITY.
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-neutral-600 font-sans leading-relaxed max-w-2xl">
            The all-new, all-electric MINI Cooper. Pure iconic proportions, the world's first 240mm circular OLED center display, and the legendary corner-carving go-kart feeling—now with zero tailpipe emissions.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#configurator"
              onClick={() => miniAudio.playClick(600)}
              className="py-4 px-7 rounded-full bg-[#111215] hover:bg-neutral-800 active:scale-98 text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2"
            >
              <span>Configure in 360°</span>
              <ArrowRight className="w-4 h-4 text-[#00C2D6]" />
            </a>

            <a
              href="#oled-display"
              onClick={() => miniAudio.playClick(700)}
              className="py-4 px-7 rounded-full bg-white hover:bg-neutral-100 active:scale-98 text-[#111215] border border-neutral-300 font-bold text-sm tracking-wide transition-all flex items-center gap-2"
            >
              <Gauge className="w-4 h-4 text-[#E60000]" />
              <span>Experience 240mm OLED</span>
            </a>
          </div>
        </div>

        {/* High-Fidelity Focal Carrier (16:9 cinematic photo) */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-neutral-300/80 group">
          <img
            src={HERO_IMAGE}
            alt="The All-Electric MINI Cooper in British Racing Green"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Bottom Floating Stats Overlay on Scrim (Zero-Pill, Typographic separators) */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between text-white gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00C2D6] font-bold block mb-1">
                MINI COOPER SE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                British Racing Green IV · Multitone Roof
              </h2>
            </div>

            {/* Quantified Metrics adjacent to claims */}
            <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-mono border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-8">
              <div>
                <span className="text-[10px] text-white/60 uppercase block">WLTP Range</span>
                <span className="text-lg sm:text-xl font-bold font-display text-white tabular-nums">402 km</span>
              </div>
              <span className="text-white/20 font-light text-xl">/</span>
              <div>
                <span className="text-[10px] text-white/60 uppercase block">Sprint 0-100</span>
                <span className="text-lg sm:text-xl font-bold font-display text-white tabular-nums">6.7 s</span>
              </div>
              <span className="text-white/20 font-light text-xl">/</span>
              <div>
                <span className="text-[10px] text-white/60 uppercase block">DC Fast Charge</span>
                <span className="text-lg sm:text-xl font-bold font-display text-[#00C2D6] tabular-nums">10-80% 30m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
