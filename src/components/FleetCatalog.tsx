import React, { useState } from 'react';
import { VEHICLES } from '../data/miniData';
import { VehicleSpec } from '../types/mini';
import { miniAudio } from '../utils/audio';
import {
  Zap,
  Flame,
  Compass,
  Gauge,
  ArrowRight,
  Info,
  Calendar,
} from 'lucide-react';

interface FleetCatalogProps {
  onSelectVehicleToConfigure: (vehicle: VehicleSpec) => void;
  onOpenSpecSheet: (vehicle: VehicleSpec) => void;
  onBookTestDrive: (vehicle: VehicleSpec) => void;
}

export const FleetCatalog: React.FC<FleetCatalogProps> = ({
  onSelectVehicleToConfigure,
  onOpenSpecSheet,
  onBookTestDrive,
}) => {
  const [filter, setFilter] = useState<'all' | 'electric' | 'petrol' | 'all4'>('all');

  const filteredVehicles = VEHICLES.filter((v) => {
    if (filter === 'all') return true;
    return v.drivetrain === filter;
  });

  const handleFilter = (newFilter: 'all' | 'electric' | 'petrol' | 'all4') => {
    setFilter(newFilter);
    miniAudio.playClick(540);
  };

  return (
    <section id="fleet" className="py-24 bg-white text-[#111215]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D0001B] font-mono mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D0001B]" />
              The New Generation Model Lineup
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-[#111215]">
              Explore the MINI Fleet
            </h2>
            <p className="mt-3 text-base text-neutral-600 font-sans max-w-xl">
              From pure electric urban agility to rugged all-wheel drive Countryman adventures and track-bred John Cooper Works exhilaration.
            </p>
          </div>

          {/* Interactive Filter Tabs (Functional segmented buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl shrink-0">
            <button
              onClick={() => handleFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filter === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Models ({VEHICLES.length})
            </button>
            <button
              onClick={() => handleFilter('electric')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                filter === 'electric' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#00C2D6]" />
              100% Electric
            </button>
            <button
              onClick={() => handleFilter('petrol')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                filter === 'petrol' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#D0001B]" />
              TwinPower Turbo
            </button>
            <button
              onClick={() => handleFilter('all4')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                filter === 'all4' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#0A382C]" />
              ALL4 AWD
            </button>
          </div>
        </div>

        {/* VEHICLE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => {
            return (
              <div
                key={vehicle.id}
                className="group rounded-3xl bg-[#F6F5F2] border border-neutral-200/80 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-neutral-300"
              >
                {/* Vehicle Image Container */}
                <div className="relative aspect-[16/10] bg-neutral-200 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Clean unboxed category badge */}
                  <div className="absolute top-4 left-4 text-xs font-mono uppercase tracking-wider text-white font-semibold drop-shadow">
                    {vehicle.badge}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xl font-black font-display tracking-tight drop-shadow-md">
                      {vehicle.name}
                    </p>
                    <p className="text-xs text-white/80 font-mono mt-0.5">
                      {vehicle.subName}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  {/* Clean unboxed metadata row */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono border-b border-neutral-200/80 pb-3">
                    <span>{vehicle.powerHp} HP ({vehicle.powerKw} kW)</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">0-100 in {vehicle.acceleration0to100}s</span>
                    <span aria-hidden="true">·</span>
                    <span>Top: {vehicle.topSpeedKmH} km/h</span>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-neutral-700 font-sans leading-relaxed">
                    {vehicle.tagline}
                  </p>

                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-2 gap-3 py-2 bg-white/70 rounded-2xl p-3 border border-neutral-200/50">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono uppercase block">
                        {vehicle.wltpRangeKm ? 'Electric WLTP Range' : 'Fuel Economy'}
                      </span>
                      <span className="text-base font-black font-display text-neutral-900 tabular-nums">
                        {vehicle.wltpRangeKm ? `${vehicle.wltpRangeKm} km` : `${vehicle.fuelEconomyL100km} L/100km`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono uppercase block">
                        Luggage Capacity
                      </span>
                      <span className="text-base font-black font-display text-neutral-900 tabular-nums">
                        Up to {vehicle.luggageCapacityLitres} L
                      </span>
                    </div>
                  </div>

                  {/* Key Highlights bullet list */}
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    {vehicle.features.slice(0, 2).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#111215] mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Starting from</span>
                      <span className="text-lg font-black font-display text-neutral-900 tabular-nums">
                        {vehicle.priceFrom}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => onSelectVehicleToConfigure(vehicle)}
                        className="py-2.5 px-3 rounded-xl bg-[#111215] hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Gauge className="w-3.5 h-3.5 text-[#00C2D6]" />
                        <span>Configure 360°</span>
                      </button>

                      <button
                        onClick={() => onBookTestDrive(vehicle)}
                        className="py-2.5 px-3 rounded-xl bg-[#0A382C] hover:bg-[#0E493A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Test Drive</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenSpecSheet(vehicle)}
                      className="w-full py-2 text-center text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>View Full Technical Sheet</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
