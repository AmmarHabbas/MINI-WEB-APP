import React, { useState, useEffect } from 'react';
import { VEHICLES, DEALERSHIPS } from '../data/miniData';
import { VehicleSpec, TestDriveBooking } from '../types/mini';
import { miniAudio } from '../utils/audio';
import {
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  Gauge,
  History,
} from 'lucide-react';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedVehicle?: VehicleSpec;
  preSelectedSpec?: {
    paintName?: string;
    roofName?: string;
    wheelName?: string;
  };
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  preSelectedVehicle,
  preSelectedSpec,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    preSelectedVehicle?.id || VEHICLES[0].id
  );
  const [selectedDealerIndex, setSelectedDealerIndex] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-05');
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [hasLicense, setHasLicense] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submittedBooking, setSubmittedBooking] = useState<TestDriveBooking | null>(null);
  const [pastBookings, setPastBookings] = useState<TestDriveBooking[]>([]);
  const [viewHistory, setViewHistory] = useState<boolean>(false);

  useEffect(() => {
    if (preSelectedVehicle) {
      setSelectedVehicleId(preSelectedVehicle.id);
    }
  }, [preSelectedVehicle]);

  // Load past bookings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mini_test_drive_bookings');
      if (stored) {
        setPastBookings(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentVehicle = VEHICLES.find((v) => v.id === selectedVehicleId) || VEHICLES[0];
  const currentDealer = DEALERSHIPS[selectedDealerIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter a contact phone number.');
      return;
    }
    if (!hasLicense) {
      setErrorMsg('A valid driver’s license is required for the Go-Kart test drive.');
      return;
    }

    setErrorMsg('');
    const randomRefNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: TestDriveBooking = {
      id: `booking-${Date.now()}`,
      bookingRef: `MINI-GK-${randomRefNum}`,
      vehicleId: currentVehicle.id,
      vehicleName: currentVehicle.name,
      paintColor: preSelectedSpec?.paintName || 'British Racing Green IV',
      roofColor: preSelectedSpec?.roofName || 'Multitone 3-Color Gradient',
      dealership: currentDealer.name,
      city: currentDealer.city,
      date: selectedDate,
      timeSlot: selectedTime,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      hasValidLicense: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...pastBookings];
    setPastBookings(updated);
    try {
      localStorage.setItem('mini_test_drive_bookings', JSON.stringify(updated));
    } catch {
      // storage error
    }

    miniAudio.playGoKartModeSound();
    setSubmittedBooking(newBooking);
  };

  const handleResetForNewBooking = () => {
    setSubmittedBooking(null);
    setViewHistory(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        {/* Modal Header */}
        <div className="bg-[#111215] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E60000] flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display text-white">
                  Book a Go-Kart Test Drive
                </h3>
                <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-[#00C2D6]">
                  Official VIP Slot
                </span>
              </div>
              <p className="text-xs text-white/60">
                Experience the authentic low center of gravity and instant torque.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pastBookings.length > 0 && !submittedBooking && (
              <button
                type="button"
                onClick={() => setViewHistory(!viewHistory)}
                className="text-xs text-white/80 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 flex items-center gap-1"
              >
                <History className="w-3.5 h-3.5" />
                <span>{viewHistory ? 'Form' : `History (${pastBookings.length})`}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close test drive modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* VIEW: Confirmation Receipt */}
          {submittedBooking ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
                  VIP TEST DRIVE RESERVED
                </span>
                <h4 className="text-2xl font-black font-display text-neutral-900">
                  Ready for Go-Kart Feeling!
                </h4>
                <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2">
                  A confirmation voucher has been stored locally and queued for dispatch to{' '}
                  <strong className="text-neutral-900">{submittedBooking.email}</strong>.
                </p>
              </div>

              {/* Confirmation Ticket Card */}
              <div className="bg-[#F6F5F2] rounded-2xl p-6 border border-neutral-200 text-left max-w-lg mx-auto space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-xs text-neutral-500 font-mono">Reference Code:</span>
                  <span className="text-base font-mono font-bold text-[#E60000]">
                    {submittedBooking.bookingRef}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block">Vehicle Model:</span>
                    <strong className="text-neutral-900">{submittedBooking.vehicleName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Dealership:</span>
                    <strong className="text-neutral-900">{submittedBooking.dealership}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Date & Time:</span>
                    <strong className="text-neutral-900">
                      {submittedBooking.date} at {submittedBooking.timeSlot}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Guest Name:</span>
                    <strong className="text-neutral-900">{submittedBooking.fullName}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[#111215] text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                >
                  Done & Close
                </button>
                <button
                  onClick={handleResetForNewBooking}
                  className="px-4 py-3 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Book Another Vehicle
                </button>
              </div>
            </div>
          ) : viewHistory ? (
            /* VIEW: Past Bookings History */
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-500">
                Your Saved Test Drive Bookings ({pastBookings.length})
              </h4>
              <div className="space-y-3">
                {pastBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-[#F6F5F2] border border-neutral-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900">{b.vehicleName}</span>
                        <span className="font-mono text-xs font-bold text-[#E60000]">{b.bookingRef}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {b.dealership} · {b.date} at {b.timeSlot}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setViewHistory(false)}
                className="w-full py-2.5 text-xs font-bold text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200"
              >
                Back to New Reservation Form
              </button>
            </div>
          ) : (
            /* VIEW: Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Step 1: Model Selection */}
              <div>
                <label className="text-xs font-bold uppercase font-mono text-neutral-700 block mb-2">
                  1. Selected MINI Model
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VEHICLES.map((v) => {
                    const isSelected = selectedVehicleId === v.id;
                    return (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#111215] bg-[#111215] text-white shadow-md'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900'
                        }`}
                      >
                        <p className="text-xs font-bold leading-tight">{v.name.replace('The All-Electric ', '').replace('The All-New ', '')}</p>
                        <p className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-[#00C2D6]' : 'text-neutral-500'}`}>
                          {v.powerHp} HP · {v.priceFrom}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Global Dealership / Flagship Studio */}
              <div>
                <label className="text-xs font-bold uppercase font-mono text-neutral-700 block mb-2">
                  2. Choose Dealership / Flagship Studio
                </label>
                <div className="space-y-2">
                  {DEALERSHIPS.map((dealer, idx) => {
                    const isSelected = selectedDealerIndex === idx;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedDealerIndex(idx)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#0A382C] bg-[#0A382C]/5 ring-2 ring-[#0A382C]/20'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#0A382C]' : 'text-neutral-400'}`} />
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{dealer.name}</p>
                            <p className="text-[11px] text-neutral-500">{dealer.address}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-semibold text-neutral-600">
                          {dealer.city}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase font-mono text-neutral-700 block mb-2">
                    3. Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min="2026-10-01"
                      max="2026-12-31"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#111215]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase font-mono text-neutral-700 block mb-2">
                    Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#111215]"
                  >
                    <option value="10:00">10:00 AM (Morning Session)</option>
                    <option value="11:30">11:30 AM (Mid-Day)</option>
                    <option value="14:30">02:30 PM (Afternoon Curve Run)</option>
                    <option value="16:00">04:00 PM (Golden Hour Slot)</option>
                    <option value="17:30">05:30 PM (Evening City Lights)</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Contact Information */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase font-mono text-neutral-700 block">
                  4. Driver Credentials & Contact
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Legal Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#111215]"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#111215]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. +44 7911 123456)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#111215]"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={hasLicense}
                    onChange={(e) => setHasLicense(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A382C] focus:ring-[#0A382C]"
                  />
                  <span className="text-xs text-neutral-600">
                    I confirm I hold a valid, non-provisional driver's license for at least 12 months.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-neutral-200">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#E60000] hover:bg-[#FF1A1A] active:scale-98 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                >
                  <Gauge className="w-4 h-4 text-white" />
                  <span>CONFIRM GO-KART TEST DRIVE APPOINTMENT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
