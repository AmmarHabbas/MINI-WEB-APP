/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OLEDConsole } from './components/OLEDConsole';
import { Configurator360 } from './components/Configurator360';
import { FleetCatalog } from './components/FleetCatalog';
import { BigLoveSection } from './components/BigLoveSection';
import { Footer } from './components/Footer';
import { TestDriveModal } from './components/TestDriveModal';
import { VehicleSpecModal } from './components/VehicleSpecModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { VehicleSpec, PaintColor, RoofColor, WheelOption } from './types/mini';
import { VEHICLES } from './data/miniData';

export default function App() {
  const [testDriveOpen, setTestDriveOpen] = useState<boolean>(false);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<VehicleSpec>(VEHICLES[0]);
  const [preSelectedSpec, setPreSelectedSpec] = useState<{
    paintName?: string;
    roofName?: string;
    wheelName?: string;
  }>({});

  const [specModalOpen, setSpecModalOpen] = useState<boolean>(false);
  const [selectedVehicleForSpec, setSelectedVehicleForSpec] = useState<VehicleSpec | null>(null);

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [standaloneModalOpen, setStandaloneModalOpen] = useState<boolean>(false);
  const [configuredVehicle, setConfiguredVehicle] = useState<VehicleSpec>(VEHICLES[0]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleOpenTestDrive = (vehicle?: VehicleSpec) => {
    if (vehicle) {
      setSelectedVehicleForBooking(vehicle);
    }
    setTestDriveOpen(true);
  };

  const handleBookSpec = (config: {
    vehicle: VehicleSpec;
    paint: PaintColor;
    roof: RoofColor;
    wheel: WheelOption;
    totalPrice: number;
  }) => {
    setSelectedVehicleForBooking(config.vehicle);
    setPreSelectedSpec({
      paintName: config.paint.name,
      roofName: config.roof.name,
      wheelName: config.wheel.name,
    });
    setTestDriveOpen(true);
  };

  const handleOpenSpecSheet = (vehicle: VehicleSpec) => {
    setSelectedVehicleForSpec(vehicle);
    setSpecModalOpen(true);
  };

  const handleSelectVehicleToConfigure = (vehicle: VehicleSpec) => {
    setConfiguredVehicle(vehicle);
    // Scroll to configurator
    const element = document.getElementById('configurator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F2] text-[#111215] font-sans">
      {/* Top Header */}
      <Header
        onOpenTestDrive={() => handleOpenTestDrive()}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenStandalone={() => setStandaloneModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onOpenTestDrive={() => handleOpenTestDrive()} />
        <OLEDConsole />
        <Configurator360
          currentVehicle={configuredVehicle}
          onVehicleChange={setConfiguredVehicle}
          onBookSpec={handleBookSpec}
          onOpenSpecSheet={handleOpenSpecSheet}
        />
        <FleetCatalog
          onSelectVehicleToConfigure={handleSelectVehicleToConfigure}
          onOpenSpecSheet={handleOpenSpecSheet}
          onBookTestDrive={(vehicle) => handleOpenTestDrive(vehicle)}
        />
        <BigLoveSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenStandalone={() => setStandaloneModalOpen(true)}
        onOpenTestDrive={() => handleOpenTestDrive()}
      />

      {/* Interactive Modals */}
      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        preSelectedVehicle={selectedVehicleForBooking}
        preSelectedSpec={preSelectedSpec}
      />

      <VehicleSpecModal
        vehicle={selectedVehicleForSpec}
        onClose={() => setSpecModalOpen(false)}
        onConfigure={(v) => {
          setSpecModalOpen(false);
          handleSelectVehicleToConfigure(v);
        }}
        onBookTestDrive={(v) => {
          setSpecModalOpen(false);
          handleOpenTestDrive(v);
        }}
      />

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectVehicle={(v) => {
          handleOpenSpecSheet(v);
        }}
      />

      <StandaloneExportModal
        isOpen={standaloneModalOpen}
        onClose={() => setStandaloneModalOpen(false)}
      />
    </div>
  );
}
