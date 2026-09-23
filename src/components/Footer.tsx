import React from 'react';
import { Heart, Globe } from 'lucide-react';

interface FooterProps {
  onOpenStandalone: () => void;
  onOpenTestDrive: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStandalone, onOpenTestDrive }) => {
  return (
    <footer className="bg-[#0E0E0E] text-white border-t border-white/10 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <span className="text-2xl font-black font-display tracking-tight text-white block">
              MINI
            </span>
            <p className="text-xs text-white/60 leading-relaxed">
              Official MINI Global Flagship. Celebrating Big Love, Charismatic Simplicity, and authentic electric Go-Kart feeling.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>Global Edition (EN)</span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-bold block">
              Vehicles
            </span>
            <ul className="space-y-2 text-xs text-white/70">
              <li><a href="#fleet" className="hover:text-white transition-colors">The All-Electric MINI Cooper</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">MINI Cooper S TwinPower</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">The All-New MINI Countryman</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">The All-New MINI Aceman</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">MINI John Cooper Works</a></li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-bold block">
              Experience & Innovation
            </span>
            <ul className="space-y-2 text-xs text-white/70">
              <li><a href="#oled-display" className="hover:text-white transition-colors">240mm Circular OLED Display</a></li>
              <li><a href="#configurator" className="hover:text-white transition-colors">360° Multitone Roof Configurator</a></li>
              <li><a href="#big-love" className="hover:text-white transition-colors">Big Love & Vescin Vegan Craft</a></li>
              <li>
                <button onClick={onOpenStandalone} className="hover:text-[#00C2D6] text-[#00C2D6] transition-colors text-left">
                  Standalone Pure HTML5 Edition
                </button>
              </li>
            </ul>
          </div>

          {/* Action Col */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-bold block">
              Connect & Test Drive
            </span>
            <p className="text-xs text-white/60">
              Reserve your personalized session at an official flagship studio.
            </p>
            <button
              onClick={onOpenTestDrive}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors w-full text-center"
            >
              Book Go-Kart Test Drive
            </button>
          </div>
        </div>

        {/* Environmental WLTP Energy Label Notice */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-white/50 space-y-1 mb-8">
          <p>
            <strong>Official WLTP Energy Notice:</strong> The All-Electric MINI Cooper: Power consumption combined in kWh/100 km: 14.1–14.7; CO2 emissions combined in g/km: 0; Electric range in km: up to 402. MINI Countryman SE ALL4: Power consumption combined in kWh/100 km: 16.8–18.5; CO2 emissions combined in g/km: 0; Electric range in km: up to 462.
          </p>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {new Date().getFullYear()} MINI Global. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            <a href="#" className="hover:text-white transition-colors">Legal Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
