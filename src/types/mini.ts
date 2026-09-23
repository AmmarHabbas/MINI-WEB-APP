export type DrivetrainType = 'electric' | 'petrol' | 'all4';

export interface VehicleSpec {
  id: string;
  name: string;
  subName: string;
  category: 'cooper' | 'countryman' | 'aceman' | 'jcw';
  drivetrain: DrivetrainType;
  tagline: string;
  priceFrom: string;
  powerHp: number;
  powerKw: number;
  torqueNm: number;
  acceleration0to100: number; // seconds
  topSpeedKmH: number;
  wltpRangeKm?: number;
  batteryKwh?: number;
  dcFastChargingMin?: number; // 10-80% min
  fuelEconomyL100km?: number;
  luggageCapacityLitres: number;
  dimensions: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    wheelbaseMm: number;
  };
  features: string[];
  image: string;
  badge: string;
  highlightColor: string;
}

export interface PaintColor {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  type: 'solid' | 'metallic';
  price: number;
}

export interface RoofColor {
  id: string;
  name: string;
  type: 'solid' | 'multitone';
  colors: string[]; // 1 color for solid, 3 for multitone gradient
  mirrorCapsHex: string;
  price: number;
}

export interface WheelOption {
  id: string;
  name: string;
  sizeInches: number;
  style: string;
  price: number;
}

export interface ExperienceMode {
  id: 'gokart' | 'green' | 'vivid' | 'timeless';
  name: string;
  shortDesc: string;
  moodTag: string;
  primaryColor: string;
  ambientGlow: string;
  soundType: 'sport_rev' | 'harmonic_pulse' | 'vivid_pop' | 'vintage_tick';
  speedometerStyle: 'digital_sport' | 'eco_circle' | 'vivid_equalizer' | 'classic_1959';
  steeringFeel: string;
  quote: string;
}

export interface TestDriveBooking {
  id: string;
  bookingRef: string;
  vehicleId: string;
  vehicleName: string;
  paintColor: string;
  roofColor: string;
  dealership: string;
  city: string;
  date: string;
  timeSlot: string;
  fullName: string;
  email: string;
  phone: string;
  hasValidLicense: boolean;
  notes?: string;
  createdAt: string;
}
