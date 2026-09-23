import React, { useState, useEffect } from 'react';
import { PAINT_COLORS, ROOF_COLORS, WHEEL_OPTIONS, VEHICLES } from '../data/miniData';
import { PaintColor, RoofColor, WheelOption, VehicleSpec } from '../types/mini';
import { Car3DStudio } from './Car3DStudio';
import { Car360Viewer } from './Car360Viewer';
import { miniAudio } from '../utils/audio';
import {
  RotateCcw,
  Play,
  Pause,
  Lightbulb,
  Check,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Box,
  Layers,
} from 'lucide-react';

interface Configurator360Props {
  currentVehicle?: VehicleSpec;
  onVehicleChange?: (vehicle: VehicleSpec) => void;
  onBookSpec: (config: {
    vehicle: VehicleSpec;
    paint: PaintColor;
    roof: RoofColor;
    wheel: WheelOption;
    totalPrice: number;
  }) => void;
  onOpenSpecSheet: (vehicle: VehicleSpec) => void;
}

export const Configurator360: React.FC<Configurator360Props> = ({
  currentVehicle,
  onVehicleChange,
  onBookSpec,
  onOpenSpecSheet,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSpec>(currentVehicle || VEHICLES[0]);
  const [selectedPaint, setSelectedPaint] = useState<PaintColor>(PAINT_COLORS[0]);
  const [selectedRoof, setSelectedRoof] = useState<RoofColor>(ROOF_COLORS[3]); // Default to Multitone 3-color!
  const [selectedWheel, setSelectedWheel] = useState<WheelOption>(WHEEL_OPTIONS[1]);
  const [angle, setAngle] = useState<number>(45); // Start at iconic Front 3/4 angle
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [activeZone, setActiveZone] = useState<'paint' | 'roof' | 'wheels'>('paint');
  const [studioMode, setStudioMode] = useState<'3d' | 'vector'>('3d');

  useEffect(() => {
    if (currentVehicle) {
      setSelectedVehicle(currentVehicle);
    }
  }, [currentVehicle]);

  // Auto-spin timer
  useEffect(() => {
    let animFrame: number;
    if (isAutoSpinning && studioMode === 'vector') {
      const step = () => {
        setAngle((prev) => (prev + 0.6) % 360);
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isAutoSpinning, studioMode]);

  // Pricing calculation
  const baseNumPrice = parseInt(selectedVehicle.priceFrom.replace(/[^0-9]/g, ''), 10) || 36650;
  const totalPrice = baseNumPrice + selectedPaint.price + selectedRoof.price + selectedWheel.price;

  const handleAnglePreset = (newAngle: number) => {
    setIsAutoSpinning(false);
    setAngle(newAngle);
    miniAudio.playClick(500);
  };

  const handlePaintSelect = (p: PaintColor) => {
    setSelectedPaint(p);
    miniAudio.playClick(650);
  };

  const handleRoofSelect = (r: RoofColor) => {
    setSelectedRoof(r);
    miniAudio.playClick(720);
  };

  const handleWheelSelect = (w: WheelOption) => {
    setSelectedWheel(w);
    miniAudio.playClick(580);
  };

  return (
    <section id="configurator" className="py-20 bg-[#F6F5F2] text-[#111215] border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-neutral-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A382C] font-mono mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00C2D6]" />
              Charismatic Simplicity Configurator
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-[#111215]">
              Design Your New MINI
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 font-sans max-w-xl">
              Rotate in full 360°, inspect high-fidelity 3D models of the MINI lineup, customize the signature 3-color Multitone roof, and open the cockpit doors to view the circular OLED display.
            </p>
          </div>

          {/* Model Switcher Dropdown / Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVehicle(v);
                  miniAudio.playClick(480);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                  selectedVehicle.id === v.id
                    ? 'bg-[#111215] text-white shadow-md'
                    : 'bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                {v.name.replace('The All-Electric ', '').replace('The All-New ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONFIGURATOR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 360 STAGE (Left 8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-neutral-200/80 flex flex-col items-center relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between mb-3 z-10">
              {/* Studio View Mode Switcher: 3D WebGL vs Stylized 2D */}
              <div className="flex items-center p-1 bg-neutral-100 rounded-xl">
                <button
                  onClick={() => {
                    setStudioMode('3d');
                    miniAudio.playClick(500);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    studioMode === '3d'
                      ? 'bg-[#111215] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-[#00C2D6]" />
                  <span>Exact 3D Studio</span>
                </button>
                <button
                  onClick={() => {
                    setStudioMode('vector');
                    miniAudio.playClick(500);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    studioMode === 'vector'
                      ? 'bg-[#111215] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2D Blueprints</span>
                </button>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setHeadlightsOn(!headlightsOn);
                    miniAudio.playClick(headlightsOn ? 400 : 700);
                  }}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    headlightsOn ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-neutral-100 text-neutral-600'
                  }`}
                  title="Toggle Headlights, Taillights & Floor Spotlights"
                >
                  <Lightbulb className={`w-3.5 h-3.5 ${headlightsOn ? 'text-amber-600 fill-amber-500' : ''}`} />
                  <span className="hidden sm:inline">LED Lights</span>
                </button>

                <button
                  onClick={() => {
                    setIsAutoSpinning(!isAutoSpinning);
                    miniAudio.playClick(isAutoSpinning ? 420 : 620);
                  }}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isAutoSpinning ? 'bg-[#00C2D6] text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  title={isAutoSpinning ? 'Pause rotation' : 'Auto rotate 360°'}
                >
                  {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="hidden sm:inline">{isAutoSpinning ? 'Pause' : 'Auto-Spin'}</span>
                </button>
              </div>
            </div>

            {/* Car Viewport (3D WebGL Studio or 2D Vector) */}
            {studioMode === '3d' ? (
              <Car3DStudio
                vehicle={selectedVehicle}
                paint={selectedPaint}
                roof={selectedRoof}
                wheel={selectedWheel}
                headlightsOn={headlightsOn}
                isAutoSpinning={isAutoSpinning}
                onToggleAutoSpin={() => setIsAutoSpinning(!isAutoSpinning)}
                onAngleChange={setAngle}
              />
            ) : (
              <Car360Viewer
                paint={selectedPaint}
                roof={selectedRoof}
                wheel={selectedWheel}
                angle={angle}
                onAngleChange={setAngle}
                headlightsOn={headlightsOn}
                isAutoSpinning={isAutoSpinning}
                onToggleAutoSpin={() => setIsAutoSpinning(!isAutoSpinning)}
              />
            )}

            {/* Bottom Current Spec Summary Strip */}
            <div className="w-full mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span>
                  <strong className="text-neutral-900">Model:</strong> {selectedVehicle.name.replace('The All-Electric ', '').replace('The All-New ', '')}
                </span>
                <span>
                  <strong className="text-neutral-900">Paint:</strong> {selectedPaint.name}
                </span>
                <span>
                  <strong className="text-neutral-900">Roof:</strong> {selectedRoof.name}
                </span>
                <span>
                  <strong className="text-neutral-900">Wheels:</strong> {selectedWheel.sizeInches}" {selectedWheel.name}
                </span>
              </div>
              <button
                onClick={() => onOpenSpecSheet(selectedVehicle)}
                className="text-xs font-bold text-[#0A382C] hover:underline flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" /> View Technical Spec Sheet
              </button>
            </div>
          </div>

          {/* CUSTOMIZATION CONTROLS PANEL (Right 4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/80 flex flex-col space-y-6">
            {/* Zone Selector Tabs: Paint / Roof / Wheels */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-xl">
              <button
                onClick={() => setActiveZone('paint')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeZone === 'paint' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                1. Body Paint
              </button>
              <button
                onClick={() => setActiveZone('roof')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeZone === 'roof' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                2. Roof & Caps
              </button>
              <button
                onClick={() => setActiveZone('wheels')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeZone === 'wheels' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                3. Alloy Wheels
              </button>
            </div>

            {/* TAB 1: BODY PAINT */}
            {activeZone === 'paint' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">
                    Body Color Palette
                  </span>
                  <span className="text-xs text-neutral-500">
                    {selectedPaint.price === 0 ? 'Standard' : `+€${selectedPaint.price}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {PAINT_COLORS.map((paint) => {
                    const isSelected = selectedPaint.id === paint.id;
                    return (
                      <button
                        key={paint.id}
                        onClick={() => handlePaintSelect(paint)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-[#111215] bg-neutral-50 shadow-sm ring-2 ring-[#111215]/20'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border border-black/15 shadow-inner shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: paint.hex }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-neutral-900 truncate">{paint.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono capitalize">
                            {paint.type} · {paint.price === 0 ? 'Included' : `+€${paint.price}`}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: ROOF & MIRROR CAPS */}
            {activeZone === 'roof' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">
                    Contrasting Roof Options
                  </span>
                  <span className="text-xs text-neutral-500">
                    {selectedRoof.price === 0 ? 'Standard' : `+€${selectedRoof.price}`}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {ROOF_COLORS.map((roof) => {
                    const isSelected = selectedRoof.id === roof.id;
                    return (
                      <button
                        key={roof.id}
                        onClick={() => handleRoofSelect(roof)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#111215] bg-neutral-50 shadow-sm ring-2 ring-[#111215]/20'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {roof.type === 'multitone' ? (
                            <div className="w-8 h-8 rounded-full border border-black/15 shadow-inner shrink-0 bg-gradient-to-r from-[#1C3F94] via-[#00C2D6] to-[#0E0E0E] flex items-center justify-center">
                              {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                            </div>
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full border border-black/15 shadow-inner shrink-0 flex items-center justify-center"
                              style={{
                                backgroundColor: roof.colors[0] === 'CURRENT_BODY' ? selectedPaint.hex : roof.colors[0],
                              }}
                            >
                              {isSelected && <Check className="w-4 h-4 text-neutral-800 drop-shadow" />}
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-bold text-neutral-900">{roof.name}</p>
                            <p className="text-[10px] text-neutral-500">
                              {roof.type === 'multitone'
                                ? 'Signature 3-Color Paint Shop Innovation'
                                : 'Contrasting roof & matching mirror caps'}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-neutral-700">
                          {roof.price === 0 ? 'Included' : `+€${roof.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ALLOY WHEELS */}
            {activeZone === 'wheels' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">
                    Light Alloy Wheel Rims
                  </span>
                  <span className="text-xs text-neutral-500">
                    {selectedWheel.price === 0 ? 'Standard' : `+€${selectedWheel.price}`}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {WHEEL_OPTIONS.map((wheel) => {
                    const isSelected = selectedWheel.id === wheel.id;
                    return (
                      <button
                        key={wheel.id}
                        onClick={() => handleWheelSelect(wheel)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#111215] bg-neutral-50 shadow-sm ring-2 ring-[#111215]/20'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900">{wheel.name}</span>
                            {wheel.id === 'jcw-runway-19' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-100 text-red-700 font-bold">
                                JCW
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-0.5">{wheel.style}</p>
                        </div>

                        <span className="text-xs font-mono font-bold text-neutral-700">
                          {wheel.price === 0 ? 'Included' : `+€${wheel.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PRICING & CALL TO ACTION */}
            <div className="pt-6 border-t border-neutral-200 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block">Total Configured Spec:</span>
                  <span className="text-2xl font-black font-display text-neutral-900 tabular-nums">
                    €{totalPrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  WLTP: {selectedVehicle.wltpRangeKm ? `${selectedVehicle.wltpRangeKm} km Range` : 'TwinPower Turbo'}
                </span>
              </div>

              {/* BOOK THIS SPEC BUTTON */}
              <button
                onClick={() =>
                  onBookSpec({
                    vehicle: selectedVehicle,
                    paint: selectedPaint,
                    roof: selectedRoof,
                    wheel: selectedWheel,
                    totalPrice,
                  })
                }
                className="w-full py-4 px-6 rounded-2xl bg-[#0A382C] hover:bg-[#0E493A] active:scale-98 text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <Calendar className="w-4 h-4 text-[#00C2D6]" />
                <span>BOOK TEST DRIVE IN THIS SPEC</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
