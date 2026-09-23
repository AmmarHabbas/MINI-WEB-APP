import React from 'react';
import { VehicleSpec } from '../types/mini';
import { X, Zap, Gauge, Battery, Clock, Maximize2, Shield, ArrowRight } from 'lucide-react';

interface VehicleSpecModalProps {
  vehicle: VehicleSpec | null;
  onClose: () => void;
  onConfigure: (vehicle: VehicleSpec) => void;
  onBookTestDrive: (vehicle: VehicleSpec) => void;
}

export const VehicleSpecModal: React.FC<VehicleSpecModalProps> = ({
  vehicle,
  onClose,
  onConfigure,
  onBookTestDrive,
}) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        {/* Modal Header */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] bg-[#111215] overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111215] via-[#111215]/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Close spec sheet"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00C2D6] font-bold">
              Official Technical Datasheet
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-white mt-1">
              {vehicle.name}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-mono mt-0.5">
              {vehicle.subName} · Starting from {vehicle.priceFrom}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto font-sans">
          {/* Section 1: Powertrain & Performance */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold mb-3 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#D0001B]" />
              Powertrain & Go-Kart Dynamics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                <span className="text-[11px] text-neutral-500 font-mono block">Max Power</span>
                <span className="text-lg font-black font-display text-neutral-900 tabular-nums">
                  {vehicle.powerHp} HP
                </span>
                <span className="text-[10px] text-neutral-500 block">({vehicle.powerKw} kW)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                <span className="text-[11px] text-neutral-500 font-mono block">Max Torque</span>
                <span className="text-lg font-black font-display text-neutral-900 tabular-nums">
                  {vehicle.torqueNm} Nm
                </span>
                <span className="text-[10px] text-neutral-500 block">Instant response</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                <span className="text-[11px] text-neutral-500 font-mono block">0–100 km/h</span>
                <span className="text-lg font-black font-display text-[#D0001B] tabular-nums">
                  {vehicle.acceleration0to100}s
                </span>
                <span className="text-[10px] text-neutral-500 block">Sprint sprint</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                <span className="text-[11px] text-neutral-500 font-mono block">Top Speed</span>
                <span className="text-lg font-black font-display text-neutral-900 tabular-nums">
                  {vehicle.topSpeedKmH} km/h
                </span>
                <span className="text-[10px] text-neutral-500 block">Electronically limited</span>
              </div>
            </div>
          </div>

          {/* Section 2: Battery, Range & Charging (or Petrol efficiency) */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#00C2D6]" />
              Energy & Efficiency
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vehicle.wltpRangeKm ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                    <span className="text-[11px] text-neutral-500 font-mono block">WLTP Range</span>
                    <span className="text-lg font-black font-display text-[#0A382C] tabular-nums">
                      {vehicle.wltpRangeKm} km
                    </span>
                    <span className="text-[10px] text-neutral-500 block">Combined test cycle</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                    <span className="text-[11px] text-neutral-500 font-mono block">Battery Capacity</span>
                    <span className="text-lg font-black font-display text-neutral-900 tabular-nums">
                      {vehicle.batteryKwh} kWh
                    </span>
                    <span className="text-[10px] text-neutral-500 block">High-voltage Li-ion</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                    <span className="text-[11px] text-neutral-500 font-mono block">DC Fast Charge (10–80%)</span>
                    <span className="text-lg font-black font-display text-neutral-900 tabular-nums">
                      ~{vehicle.dcFastChargingMin} min
                    </span>
                    <span className="text-[10px] text-neutral-500 block">Up to 130 kW DC</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                    <span className="text-[11px] text-neutral-500 font-mono block">Combined Consumption</span>
                    <span className="text-lg font-black font-display text-neutral-900 tabular-nums">
                      {vehicle.fuelEconomyL100km} L/100km
                    </span>
                    <span className="text-[10px] text-neutral-500 block">WLTP tested</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                    <span className="text-[11px] text-neutral-500 font-mono block">Transmission</span>
                    <span className="text-lg font-black font-display text-neutral-900">
                      7-Speed Steptronic
                    </span>
                    <span className="text-[10px] text-neutral-500 block">Dual-clutch sports</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F6F5F2] border border-neutral-200">
                    <span className="text-[11px] text-neutral-500 font-mono block">Emissions Standard</span>
                    <span className="text-lg font-black font-display text-neutral-900">
                      Euro 6e
                    </span>
                    <span className="text-[10px] text-neutral-500 block">Gasoline particulate filter</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Dimensions & Storage */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold mb-3 flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-[#0A382C]" />
              Dimensions & Space Architecture
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#F6F5F2] border border-neutral-200 text-center">
                <span className="text-[10px] text-neutral-500 font-mono block">Length</span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">
                  {vehicle.dimensions.lengthMm} mm
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F6F5F2] border border-neutral-200 text-center">
                <span className="text-[10px] text-neutral-500 font-mono block">Width</span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">
                  {vehicle.dimensions.widthMm} mm
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F6F5F2] border border-neutral-200 text-center">
                <span className="text-[10px] text-neutral-500 font-mono block">Height</span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">
                  {vehicle.dimensions.heightMm} mm
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F6F5F2] border border-neutral-200 text-center">
                <span className="text-[10px] text-neutral-500 font-mono block">Max Luggage</span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">
                  {vehicle.luggageCapacityLitres} L
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Standard Features List */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-neutral-700" />
              Standard Flagship Inclusions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vehicle.features.map((feat, i) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C2D6]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                onConfigure(vehicle);
              }}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#111215] text-white text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Configure in 360°</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onBookTestDrive(vehicle);
              }}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#0A382C] text-white text-xs font-bold hover:bg-[#0E493A] transition-colors flex items-center justify-center gap-2"
            >
              <span>Book Go-Kart Test Drive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
