import React, { useState, useEffect } from 'react';
import { EXPERIENCE_MODES } from '../data/miniData';
import { ExperienceMode } from '../types/mini';
import { miniAudio } from '../utils/audio';
import { KNITTED_INTERIOR_IMAGE } from '../data/miniData';
import {
  Volume2,
  VolumeX,
  Gauge,
  Leaf,
  Sparkles,
  History,
  Compass,
  Thermometer,
  Music,
  Play,
  Pause,
  SkipForward,
  Zap,
} from 'lucide-react';

interface OLEDConsoleProps {
  onSelectMode?: (mode: ExperienceMode) => void;
}

export const OLEDConsole: React.FC<OLEDConsoleProps> = ({ onSelectMode }) => {
  const [activeModeKey, setActiveModeKey] = useState<string>('gokart');
  const [activeTab, setActiveTab] = useState<'modes' | 'climate' | 'nav' | 'media'>('modes');
  const [speed, setSpeed] = useState<number>(74);
  const [tempDriver, setTempDriver] = useState<number>(21.5);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);
  const [musicProgress, setMusicProgress] = useState<number>(45);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [gForce, setGForce] = useState({ x: 0.2, y: 0.8 });
  const [isRevving, setIsRevving] = useState<boolean>(false);

  const currentMode = EXPERIENCE_MODES[activeModeKey];

  // Sound triggering when mode switches
  const handleModeChange = (modeKey: string) => {
    setActiveModeKey(modeKey);
    const mode = EXPERIENCE_MODES[modeKey];
    onSelectMode?.(mode);

    if (modeKey === 'gokart') {
      miniAudio.playGoKartModeSound();
    } else if (modeKey === 'green') {
      miniAudio.playGreenModeSound();
    } else if (modeKey === 'vivid') {
      miniAudio.playVividModeSound();
    } else if (modeKey === 'timeless') {
      miniAudio.playTimelessModeSound();
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    miniAudio.setMuted(nextMuted);
  };

  // Interactive rev / throttle burst
  const handleRevThrottle = () => {
    setIsRevving(true);
    miniAudio.playRevBurst();
    setSpeed((s) => Math.min(138, s + 22));
    setGForce({ x: (Math.random() - 0.5) * 1.4, y: 1.2 });
    setTimeout(() => {
      setIsRevving(false);
      setSpeed(74);
      setGForce({ x: 0.1, y: 0.4 });
    }, 900);
  };

  // Simulated live speed drift
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRevving) {
        setSpeed((prev) => {
          const delta = Math.floor(Math.random() * 3) - 1;
          const next = Math.max(68, Math.min(82, prev + delta));
          return next;
        });
      }
      if (isPlayingMusic) {
        setMusicProgress((p) => (p >= 100 ? 0 : p + 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRevving, isPlayingMusic]);

  return (
    <section id="oled-display" className="relative py-24 bg-[#111215] text-white overflow-hidden">
      {/* Dynamic Ambient Background Projection derived from active OLED Mode */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentMode.primaryColor} 0%, rgba(17,18,21,0) 65%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wider font-mono uppercase mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentMode.primaryColor }} />
            MINI Operating System 9
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            The 240mm Circular OLED Display
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 font-sans leading-relaxed">
            The world’s first circular automotive OLED center display with ultra-thin glass, vibrant color gamut, and the iconic toggle bar beneath. Experience all four signature MINI drive modes.
          </p>
        </div>

        {/* Console Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mode Switcher & Details */}
          <div className="lg:col-span-4 space-y-3 order-2 lg:order-1">
            <h3 className="text-xs uppercase tracking-widest text-white/50 font-mono mb-2">
              Select MINI Experience Mode
            </h3>

            {Object.values(EXPERIENCE_MODES).map((mode) => {
              const isSelected = activeModeKey === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border flex items-center gap-4 ${
                    isSelected
                      ? 'bg-white/15 border-white/30 shadow-lg translate-x-2'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-white/70'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform"
                    style={{
                      backgroundColor: isSelected ? mode.primaryColor : 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                    }}
                  >
                    {mode.id === 'gokart' && <Gauge className="w-6 h-6" />}
                    {mode.id === 'green' && <Leaf className="w-6 h-6" />}
                    {mode.id === 'vivid' && <Sparkles className="w-6 h-6" />}
                    {mode.id === 'timeless' && <History className="w-6 h-6" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-white">{mode.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 line-clamp-1 mt-0.5">{mode.moodTag}</p>
                  </div>
                </button>
              );
            })}

            {/* Mode Quote / Description Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mt-4 backdrop-blur-md">
              <p className="text-xs text-white/90 italic font-sans leading-relaxed">
                {currentMode.quote}
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                <span>Steering Dynamic:</span>
                <span className="text-white font-medium">{currentMode.steeringFeel}</span>
              </div>
            </div>

            {/* Interactive Go-Kart Throttle Button */}
            {activeModeKey === 'gokart' && (
              <button
                onClick={handleRevThrottle}
                disabled={isRevving}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#E60000] hover:bg-[#FF1A1A] active:scale-98 transition-all font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
              >
                <Zap className="w-4 h-4 fill-white animate-pulse" />
                {isRevving ? 'ACCELERATING (BOOST ACTIVE)...' : 'TAP FOR GO-KART BOOST ACCELERATION'}
              </button>
            )}
          </div>

          {/* Center Column: The 240mm Circular OLED Display */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center order-1 lg:order-2">
            {/* Knitted Recycled Polyester Dashboard Frame */}
            <div className="relative p-6 sm:p-10 rounded-[48px] bg-gradient-to-b from-[#242830] to-[#15171D] border border-white/10 shadow-2xl flex flex-col items-center">
              {/* Knitted fabric ambient projection overlay */}
              <div
                className="absolute inset-0 rounded-[48px] opacity-25 mix-blend-screen pointer-events-none transition-all duration-700"
                style={{
                  boxShadow: `inset 0 0 100px ${currentMode.primaryColor}`,
                  backgroundImage: `radial-gradient(${currentMode.primaryColor} 1px, transparent 1px)`,
                  backgroundSize: '8px 8px',
                }}
              />

              {/* Top Mute and Status Bar */}
              <div className="w-full flex items-center justify-between px-4 mb-4 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono uppercase text-[11px] tracking-wider">MINI OS 9 Connected</span>
                </div>
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-[11px]"
                  title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>
              </div>

              {/* THE 240MM CIRCULAR BEZEL */}
              <div
                className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] rounded-full p-2.5 sm:p-3 transition-all duration-700"
                style={{
                  background: 'linear-gradient(145deg, #2A2E38 0%, #0E0F12 100%)',
                  boxShadow: `0 0 45px ${currentMode.ambientGlow}, 0 20px 50px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2)`,
                }}
              >
                {/* Thin Bezel Inner Edge */}
                <div className="w-full h-full rounded-full bg-[#050608] overflow-hidden relative border border-white/10 flex flex-col items-center justify-between p-4 sm:p-6">
                  {/* Top Display Zone: Time & Battery / Range */}
                  <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-mono text-white/80 z-20 px-4">
                    <span className="tabular-nums">10:42 AM</span>
                    <span className="font-bold tracking-widest uppercase text-[10px] text-white/50">
                      {currentMode.name}
                    </span>
                    <span className="flex items-center gap-1 text-[#00C2D6] font-bold tabular-nums">
                      <Zap className="w-3 h-3 fill-current" /> 84% · 338 km
                    </span>
                  </div>

                  {/* CENTER CONTENT BASED ON ACTIVE MODE */}
                  <div className="w-full flex-1 flex flex-col items-center justify-center text-center relative z-10">
                    {/* MODE 1: GO-KART MODE */}
                    {activeModeKey === 'gokart' && (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          {/* Speedometer ring */}
                          <svg className="w-44 h-44 sm:w-56 sm:h-56 transform -rotate-90">
                            <circle cx="50%" cy="50%" r="42%" stroke="#330000" strokeWidth="8" fill="none" />
                            <circle
                              cx="50%"
                              cy="50%"
                              r="42%"
                              stroke="#E60000"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray="264"
                              strokeDashoffset={264 - (speed / 180) * 264}
                              strokeLinecap="round"
                              className="transition-all duration-300"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl sm:text-7xl font-black font-display tracking-tight text-white tabular-nums drop-shadow-md">
                              {speed}
                            </span>
                            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#E60000] font-bold">
                              KM / H
                            </span>
                          </div>
                        </div>

                        {/* G-Force Dynamic Visualizer */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-[10px] font-mono text-white/70">
                            <span>LAT G:</span>
                            <span className="text-[#E60000] font-bold tabular-nums">{gForce.x.toFixed(2)}g</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-mono text-white/70">
                            <span>TORQUE:</span>
                            <span className="text-white font-bold tabular-nums">{isRevving ? '330 Nm' : '140 Nm'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MODE 2: GREEN MODE */}
                    {activeModeKey === 'green' && (
                      <div className="flex flex-col items-center">
                        <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
                          {/* Green Leaf Pulse Rings */}
                          <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                          <div className="absolute inset-6 rounded-full border border-emerald-500/50" />
                          <div className="flex flex-col items-center justify-center">
                            <Leaf className="w-8 h-8 text-emerald-400 mb-1" />
                            <span className="text-4xl sm:text-5xl font-black font-display text-white tabular-nums">
                              {speed}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                              ECO KM/H
                            </span>
                            <span className="text-[11px] text-emerald-300 mt-1 font-sans">
                              +42 km Bonus Range
                            </span>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-white/60">
                          RECUPERATION: <span className="text-emerald-400 font-bold">ACTIVE (ONE-PEDAL)</span>
                        </div>
                      </div>
                    )}

                    {/* MODE 3: VIVID MODE */}
                    {activeModeKey === 'vivid' && (
                      <div className="flex flex-col items-center max-w-[220px]">
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/20 mb-3 group">
                          <img
                            src={KNITTED_INTERIOR_IMAGE}
                            alt="MINI Soundtrack"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <button
                              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                              className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            >
                              {isPlayingMusic ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </button>
                          </div>
                        </div>

                        <span className="font-bold text-xs sm:text-sm text-white truncate w-full">
                          Electric Feel · Big Love Mix
                        </span>
                        <span className="text-[11px] text-white/60">MINI Soundscapes</span>

                        {/* Equalizer Visualizer Bars */}
                        <div className="flex items-end justify-center gap-1 h-5 mt-2">
                          {[40, 75, 100, 60, 85, 45, 90, 70].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-[#00C2D6] rounded-full transition-all duration-200"
                              style={{
                                height: isPlayingMusic ? `${(h * (0.5 + Math.random() * 0.5))}%` : '20%',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MODE 4: TIMELESS MODE */}
                    {activeModeKey === 'timeless' && (
                      <div className="flex flex-col items-center">
                        {/* 1959 Vintage Speedometer Dial */}
                        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#EFE9D9] text-[#1B1B18] p-4 flex flex-col items-center justify-between border-4 border-[#8C7A5B] shadow-inner relative">
                          <div className="text-[9px] font-serif tracking-widest text-[#5C5243] font-bold">
                            SMITHS · ENGLAND
                          </div>

                          {/* Rolling mechanical odometer window */}
                          <div className="bg-[#111] text-[#EFE9D9] px-2 py-0.5 rounded font-mono text-xs tracking-wider border border-[#555]">
                            0 1 9 5 9 4
                          </div>

                          {/* Retro Dial Numbers & Needle */}
                          <div className="text-center">
                            <span className="text-3xl sm:text-4xl font-serif font-black text-[#1F1E1B] tabular-nums">
                              {speed}
                            </span>
                            <div className="text-[8px] font-serif uppercase tracking-widest text-[#736856]">
                              MILES / HOUR
                            </div>
                          </div>

                          <div className="text-[8px] font-serif text-[#7A6E5C] italic">
                            Issigonis 1959 Heritage
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM TOUCH CONTROL BAR: Climate & Temperature */}
                  <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md z-20 text-xs">
                    {/* Left Temp */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTempDriver((t) => Number((t - 0.5).toFixed(1)))}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                      >
                        -
                      </button>
                      <span className="font-mono text-[11px] font-bold text-white tabular-nums px-1">
                        {tempDriver}°C
                      </span>
                      <button
                        onClick={() => setTempDriver((t) => Number((t + 0.5).toFixed(1)))}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                      >
                        +
                      </button>
                    </div>

                    {/* Center Navigation Pin */}
                    <div className="flex items-center gap-1 text-[11px] text-white/80">
                      <Compass className="w-3.5 h-3.5 text-[#00C2D6]" />
                      <span>Oxford Plant</span>
                    </div>

                    {/* Right AC Auto indicator */}
                    <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-bold">
                      <Thermometer className="w-3 h-3" /> AUTO
                    </div>
                  </div>
                </div>
              </div>

              {/* MINI Physical Toggle Bar Representation underneath OLED */}
              <div className="mt-8 flex items-center gap-3 sm:gap-6 bg-[#0E0F12] px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-8 rounded-md bg-[#242830] border border-white/20 flex items-center justify-center shadow-inner">
                    <span className="w-1.5 h-3 bg-red-500 rounded-sm" />
                  </div>
                  <span className="text-[9px] font-mono text-white/40 uppercase mt-1">START</span>
                </div>

                <div className="h-6 w-px bg-white/10" />

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-md bg-[#242830] border border-white/20 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] font-mono font-bold text-white">P R N D</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/40 uppercase mt-1">GEAR</span>
                </div>

                <div className="h-6 w-px bg-white/10" />

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-md bg-[#242830] border border-white/20 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] font-mono font-bold text-[#00C2D6]">MODES</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/40 uppercase mt-1">EXPERIENCE</span>
                </div>

                <div className="h-6 w-px bg-white/10" />

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-md bg-[#242830] border border-white/20 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">VOL</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/40 uppercase mt-1">AUDIO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
