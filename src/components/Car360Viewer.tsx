import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PaintColor, RoofColor, WheelOption } from '../types/mini';

interface Car360ViewerProps {
  paint: PaintColor;
  roof: RoofColor;
  wheel: WheelOption;
  angle: number; // 0 to 359
  onAngleChange: (newAngle: number) => void;
  headlightsOn: boolean;
  isAutoSpinning: boolean;
  onToggleAutoSpin: () => void;
}

export const Car360Viewer: React.FC<Car360ViewerProps> = ({
  paint,
  roof,
  wheel,
  angle,
  onAngleChange,
  headlightsOn,
  isAutoSpinning,
  onToggleAutoSpin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);

  // Mouse & Touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startAngle.current = angle;
    if (isAutoSpinning) {
      onToggleAutoSpin();
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    // 360 degrees over ~500px drag
    const sensitivity = 0.7;
    let newAngle = (startAngle.current - deltaX * sensitivity) % 360;
    if (newAngle < 0) newAngle += 360;
    onAngleChange(Math.round(newAngle));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Convert angle to normalized radians
  const rad = (angle * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  // Determine current viewing perspective:
  // angle ~0: front view
  // angle ~90: right profile
  // angle ~180: rear view
  // angle ~270: left profile
  const isFrontHemisphere = cos > 0;
  const isRearHemisphere = cos < 0;
  const sideOffset = sin * 220; // lateral perspective shift
  const foreshortening = Math.abs(cos); // how deep front/rear is

  // Roof color resolution
  const resolvedRoofFill = () => {
    if (roof.type === 'multitone') {
      return 'url(#multitoneGradient)';
    }
    if (roof.colors[0] === 'CURRENT_BODY') {
      return paint.hex;
    }
    return roof.colors[0];
  };

  const resolvedMirrorFill = () => {
    if (roof.mirrorCapsHex === 'CURRENT_BODY') {
      return paint.hex;
    }
    return roof.mirrorCapsHex;
  };

  return (
    <div className="relative w-full select-none flex flex-col items-center">
      {/* 360 Interactive Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full max-w-[840px] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        title="Drag left or right to rotate MINI 360°"
      >
        {/* Soft Studio Floor Reflection & Drop Shadows */}
        <div className="absolute inset-x-8 bottom-6 sm:bottom-10 h-16 sm:h-20 bg-gradient-to-t from-black/25 via-black/10 to-transparent rounded-[100%] blur-xl pointer-events-none transform scale-y-50" />
        <div className="absolute inset-x-20 bottom-10 sm:bottom-14 h-8 bg-black/40 rounded-full blur-md pointer-events-none" />

        {/* Dynamic Vector MINI 360 Engine */}
        <svg
          viewBox="0 0 900 560"
          className="w-full h-full filter drop-shadow-2xl overflow-visible transition-transform duration-75"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Multitone Roof Gradient: San Marino Blue -> Pearly Aqua -> Jet Black */}
            <linearGradient id="multitoneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C3F94" />
              <stop offset="52%" stopColor="#00C2D6" />
              <stop offset="100%" stopColor="#0E0E0E" />
            </linearGradient>

            {/* Dynamic Paint Metallic Gradient */}
            <linearGradient id="carBodyPaintGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor={paint.accentHex} />
              <stop offset="45%" stopColor={paint.hex} />
              <stop offset="100%" stopColor={paint.hex} stopOpacity="0.88" />
            </linearGradient>

            {/* Glass Windshield Gradient */}
            <linearGradient id="glassWindshield" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#8AC6D1" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#2A3B4C" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0E1620" stopOpacity="0.95" />
            </linearGradient>

            {/* Chrome accents */}
            <linearGradient id="chromeTrim" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>

            {/* Headlight projector beam glow */}
            <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#D9F4FF" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#00C2D6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00C2D6" stopOpacity="0" />
            </radialGradient>

            {/* Taillight LED glow */}
            <radialGradient id="rearLightGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF3333" stopOpacity="1" />
              <stop offset="60%" stopColor="#D0001B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#990000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Under-chassis shadow plane */}
          <ellipse
            cx={450 + sideOffset * 0.15}
            cy="465"
            rx={320 - Math.abs(cos) * 40}
            ry={28 + Math.abs(cos) * 12}
            fill="#090A0D"
            opacity="0.82"
          />

          {/* ==============================================
              CAR LAYER: Render based on 360 angle interpolation
              ============================================== */}
          <g transform={`translate(${450 + sideOffset * 0.2}, 180)`}>
            {/* Wheels Layer (Back wheels depending on orientation) */}
            {/* Rear / Left Back Wheel */}
            {cos > -0.2 && (
              <g transform={`translate(${-240 + cos * 60}, ${180 - sin * 15})`}>
                <circle cx="0" cy="0" r="62" fill="#15171C" />
                <circle cx="0" cy="0" r="54" fill="#22252A" />
                {/* Wheel Rim Spoke Pattern */}
                <circle cx="0" cy="0" r="44" fill={wheel.id === 'jcw-runway-19' ? '#111' : '#CBD5E1'} stroke="#475569" strokeWidth="3" />
                {wheel.id === 'slide-spoke-18' && (
                  <path d="M-36 0 L36 0 M0 -36 L0 36 M-25 -25 L25 25 M-25 25 L25 -25" stroke="#111" strokeWidth="7" />
                )}
                {wheel.id === 'jcw-runway-19' && (
                  <circle cx="0" cy="0" r="42" fill="none" stroke="#D0001B" strokeWidth="2.5" />
                )}
                <circle cx="0" cy="0" r="14" fill="#0E0E0E" />
                <circle cx="0" cy="0" r="7" fill="#00C2D6" />
              </g>
            )}

            {/* Front / Right Back Wheel */}
            {cos < 0.2 && (
              <g transform={`translate(${240 - cos * 60}, ${180 + sin * 15})`}>
                <circle cx="0" cy="0" r="62" fill="#15171C" />
                <circle cx="0" cy="0" r="54" fill="#22252A" />
                <circle cx="0" cy="0" r="44" fill={wheel.id === 'jcw-runway-19' ? '#111' : '#CBD5E1'} stroke="#475569" strokeWidth="3" />
                {wheel.id === 'slide-spoke-18' && (
                  <path d="M-36 0 L36 0 M0 -36 L0 36 M-25 -25 L25 25 M-25 25 L25 -25" stroke="#111" strokeWidth="7" />
                )}
                {wheel.id === 'jcw-runway-19' && (
                  <circle cx="0" cy="0" r="42" fill="none" stroke="#D0001B" strokeWidth="2.5" />
                )}
                <circle cx="0" cy="0" r="14" fill="#0E0E0E" />
                <circle cx="0" cy="0" r="7" fill="#00C2D6" />
              </g>
            )}

            {/* CAR MAIN BODY SHELL */}
            {/* Dynamic perspective morphing body geometry */}
            <path
              d={`
                M ${-280 + cos * 40} ${140 - sin * 10}
                C ${-290 + cos * 40} ${60 - sin * 10}, ${-240 + cos * 30} ${10}, ${-180 + cos * 20} ${-15}
                C ${-120 + cos * 10} ${-35}, ${-20 + cos * 5} ${-38}, ${120 + cos * 15} ${-35}
                C ${200 + cos * 25} ${-10}, ${280 + cos * 35} ${50 + sin * 10}, ${290 + cos * 40} ${120 + sin * 10}
                C ${300 + cos * 40} ${170}, ${270 + cos * 30} ${205}, ${220 + cos * 20} ${210}
                L ${-220 + cos * 20} ${210}
                C ${-270 + cos * 30} ${205}, ${-290 + cos * 40} ${170}, ${-280 + cos * 40} ${140 - sin * 10}
                Z
              `}
              fill="url(#carBodyPaintGrad)"
              stroke="#090A0D"
              strokeWidth="2.5"
            />

            {/* Side Shoulder Flutes & Aerodynamic Crease */}
            <path
              d={`
                M ${-250 + cos * 30} ${95 - sin * 12}
                C ${-120 + cos * 10} ${85}, ${80 + cos * 10} ${85}, ${260 + cos * 30} ${95 + sin * 12}
              `}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d={`
                M ${-245 + cos * 30} ${99 - sin * 12}
                C ${-120 + cos * 10} ${89}, ${80 + cos * 10} ${89}, ${255 + cos * 30} ${99 + sin * 12}
              `}
              fill="none"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* GREENHOUSE: Glasshouse cabin windows & pillars */}
            <path
              d={`
                M ${-170 + cos * 15} ${-10 - sin * 8}
                L ${-130 + cos * 10} ${-115}
                C ${-70 + cos * 5} ${-122}, ${50 + cos * 5} ${-122}, ${120 + cos * 10} ${-115}
                L ${175 + cos * 15} ${-10 + sin * 8}
                Z
              `}
              fill="url(#glassWindshield)"
              stroke="#111827"
              strokeWidth="3"
            />

            {/* A/B/C Pillars (Piano Black high-gloss) */}
            <line
              x1={-10 + cos * 5}
              y1={-120}
              x2={-5 + cos * 5}
              y2={-12}
              stroke="#0E0E0E"
              strokeWidth="7"
            />

            {/* ROOF: Iconic floating helmet roof with Multitone or Solid color */}
            <path
              d={`
                M ${-155 + cos * 18} ${-115 - sin * 4}
                C ${-100 + cos * 10} ${-136}, ${30 + cos * 10} ${-136}, ${145 + cos * 18} ${-115 + sin * 4}
                C ${155 + cos * 18} ${-110}, ${150 + cos * 18} ${-102}, ${135 + cos * 15} ${-105}
                C ${30 + cos * 10} ${-122}, ${-90 + cos * 10} ${-122}, ${-145 + cos * 15} ${-105}
                C ${-158 + cos * 18} ${-102}, ${-162 + cos * 18} ${-110}, ${-155 + cos * 18} ${-115 - sin * 4}
                Z
              `}
              fill={resolvedRoofFill()}
              stroke="#0A0A0A"
              strokeWidth="2.5"
            />
            {/* Roof glossy reflection highlight */}
            <path
              d={`
                M ${-140 + cos * 15} ${-118 - sin * 3}
                C ${-80 + cos * 8} ${-132}, ${10 + cos * 8} ${-132}, ${125 + cos * 15} ${-118 + sin * 3}
              `}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* FRONT FASCIA & OCTAGONAL GRILLE (Visible mostly in front hemisphere) */}
            {isFrontHemisphere && (
              <g transform={`translate(${sideOffset * 0.45}, 85)`}>
                {/* Octagonal modern grille */}
                <polygon
                  points="-110,-35 110,-35 130,25 90,65 -90,65 -130,25"
                  fill="#111317"
                  stroke="#383D47"
                  strokeWidth="3"
                />
                {/* Vibrant Accent Blade in Grille */}
                <line x1="-80" y1="-5" x2="80" y2="-5" stroke={paint.hex} strokeWidth="5" strokeLinecap="round" />
                {/* MINI Wing Badge */}
                <ellipse cx="0" cy="-45" rx="28" ry="9" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
                <text x="0" y="-42" textAnchor="middle" fill="#0F172A" fontSize="7" fontWeight="bold" fontFamily="sans-serif">MINI</text>

                {/* Left Circular LED Headlight */}
                <g transform="translate(-165, -30)">
                  <circle cx="0" cy="0" r="32" fill="#1E293B" stroke="url(#chromeTrim)" strokeWidth="4" />
                  <circle cx="0" cy="0" r="26" fill="none" stroke={headlightsOn ? '#00C2D6' : '#64748B'} strokeWidth="4" />
                  {headlightsOn && (
                    <>
                      <circle cx="0" cy="0" r="20" fill="url(#ledGlow)" />
                      {/* Projected light cone on the floor */}
                      <polygon points="0,0 -200,240 -80,240" fill="#00C2D6" opacity="0.18" pointerEvents="none" />
                    </>
                  )}
                  <circle cx="0" cy="0" r="10" fill={headlightsOn ? '#FFF' : '#334155'} />
                </g>

                {/* Right Circular LED Headlight */}
                <g transform="translate(165, -30)">
                  <circle cx="0" cy="0" r="32" fill="#1E293B" stroke="url(#chromeTrim)" strokeWidth="4" />
                  <circle cx="0" cy="0" r="26" fill="none" stroke={headlightsOn ? '#00C2D6' : '#64748B'} strokeWidth="4" />
                  {headlightsOn && (
                    <>
                      <circle cx="0" cy="0" r="20" fill="url(#ledGlow)" />
                      <polygon points="0,0 80,240 200,240" fill="#00C2D6" opacity="0.18" pointerEvents="none" />
                    </>
                  )}
                  <circle cx="0" cy="0" r="10" fill={headlightsOn ? '#FFF' : '#334155'} />
                </g>
              </g>
            )}

            {/* REAR FASCIA & UNION JACK MATRIX TAILLIGHTS (Visible in rear hemisphere) */}
            {isRearHemisphere && (
              <g transform={`translate(${-sideOffset * 0.45}, 85)`}>
                {/* Rear Hatchback Lid */}
                <path
                  d="M -130,-40 C -80,-50 80,-50 130,-40 L 140,55 C 80,68 -80,68 -140,55 Z"
                  fill={paint.hex}
                  stroke="#0A0B0E"
                  strokeWidth="2"
                />
                {/* Horizontal Tailgate Black Trim Bar */}
                <rect x="-140" y="-12" width="280" height="22" rx="4" fill="#0E0E0E" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" letterSpacing="4" fontFamily="Outfit, sans-serif">
                  COOPER
                </text>

                {/* Left Union Jack Taillight Matrix */}
                <g transform="translate(-165, -30)">
                  <polygon points="-12,-35 22,-35 22,35 -12,35 -24,0" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
                  {headlightsOn && (
                    <>
                      <polygon points="-10,-32 20,-32 20,32 -10,32 -20,0" fill="url(#rearLightGlow)" />
                      {/* Union Jack Light Guides */}
                      <path d="M-8,-26 L16,26 M-8,26 L16,-26 M-14,0 L18,0 M4,-28 L4,28" stroke="#FFEAEA" strokeWidth="2.5" />
                    </>
                  )}
                  {!headlightsOn && (
                    <path d="M-8,-26 L16,26 M-8,26 L16,-26 M-14,0 L18,0 M4,-28 L4,28" stroke="#990000" strokeWidth="2" />
                  )}
                </g>

                {/* Right Union Jack Taillight Matrix */}
                <g transform="translate(165, -30)">
                  <polygon points="12,-35 -22,-35 -22,35 12,35 24,0" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
                  {headlightsOn && (
                    <>
                      <polygon points="10,-32 -20,-32 -20,32 10,32 20,0" fill="url(#rearLightGlow)" />
                      <path d="M8,-26 L-16,26 M8,26 L-16,-26 M14,0 L-18,0 M-4,-28 L-4,28" stroke="#FFEAEA" strokeWidth="2.5" />
                    </>
                  )}
                  {!headlightsOn && (
                    <path d="M8,-26 L-16,26 M8,26 L-16,-26 M14,0 L-18,0 M-4,-28 L-4,28" stroke="#990000" strokeWidth="2" />
                  )}
                </g>

                {/* Dual exhaust pipes or Electric Diffuser */}
                <rect x="-80" y="70" width="160" height="24" rx="6" fill="#14171A" stroke="#222" strokeWidth="2" />
                <text x="0" y="86" textAnchor="middle" fill="#00C2D6" fontSize="9" fontWeight="bold" letterSpacing="1">
                  100% ELECTRIC
                </text>
              </g>
            )}

            {/* MIRROR CAPS (Contrasting color or body match) */}
            <g transform={`translate(${-185 + cos * 15}, ${-5 - sin * 6})`}>
              <ellipse cx="0" cy="0" rx="20" ry="12" fill={resolvedMirrorFill()} stroke="#090A0D" strokeWidth="2" />
              <ellipse cx="-4" cy="-2" rx="14" ry="7" fill="rgba(255,255,255,0.4)" />
            </g>
            <g transform={`translate(${185 + cos * 15}, ${-5 + sin * 6})`}>
              <ellipse cx="0" cy="0" rx="20" ry="12" fill={resolvedMirrorFill()} stroke="#090A0D" strokeWidth="2" />
              <ellipse cx="4" cy="-2" rx="14" ry="7" fill="rgba(255,255,255,0.4)" />
            </g>

            {/* FRONT WHEELS LAYER (Foreground) */}
            {/* Front Wheel 1 */}
            <g transform={`translate(${-190 - cos * 25}, 185)`}>
              <circle cx="0" cy="0" r="66" fill="#111317" stroke="#000" strokeWidth="3" />
              <circle cx="0" cy="0" r="56" fill="#1E2126" />
              {/* Alloy Rim Details */}
              <circle
                cx="0"
                cy="0"
                r="46"
                fill={wheel.id === 'jcw-runway-19' ? '#0F1012' : '#E2E8F0'}
                stroke="#64748B"
                strokeWidth="3.5"
              />
              {/* Wheel Spokes */}
              {wheel.id === 'u-spoke-17' && (
                <g stroke="#334155" strokeWidth="5">
                  <line x1="-38" y1="0" x2="38" y2="0" />
                  <line x1="0" y1="-38" x2="0" y2="38" />
                  <line x1="-27" y1="-27" x2="27" y2="27" />
                  <line x1="-27" y1="27" x2="27" y2="-27" />
                </g>
              )}
              {wheel.id === 'slide-spoke-18' && (
                <g stroke="#090A0D" strokeWidth="8" strokeLinecap="round">
                  <path d="M-38 -10 L38 10 M-10 38 L10 -38 M-30 25 L30 -25 M-25 -30 L25 30" />
                </g>
              )}
              {wheel.id === 'jcw-runway-19' && (
                <>
                  <circle cx="0" cy="0" r="44" fill="none" stroke="#E60000" strokeWidth="3" />
                  <g stroke="#E60000" strokeWidth="3">
                    <line x1="-35" y1="0" x2="35" y2="0" />
                    <line x1="0" y1="-35" x2="0" y2="35" />
                    <line x1="-25" y1="-25" x2="25" y2="25" />
                    <line x1="-25" y1="25" x2="25" y2="-25" />
                  </g>
                </>
              )}
              {/* Wheel Center Cap */}
              <circle cx="0" cy="0" r="16" fill="#0A0B0E" stroke="#475569" strokeWidth="2" />
              <text x="0" y="3" textAnchor="middle" fill="#00C2D6" fontSize="7" fontWeight="bold" fontFamily="sans-serif">MINI</text>
            </g>

            {/* Front Wheel 2 */}
            <g transform={`translate(${190 + cos * 25}, 185)`}>
              <circle cx="0" cy="0" r="66" fill="#111317" stroke="#000" strokeWidth="3" />
              <circle cx="0" cy="0" r="56" fill="#1E2126" />
              <circle
                cx="0"
                cy="0"
                r="46"
                fill={wheel.id === 'jcw-runway-19' ? '#0F1012' : '#E2E8F0'}
                stroke="#64748B"
                strokeWidth="3.5"
              />
              {wheel.id === 'u-spoke-17' && (
                <g stroke="#334155" strokeWidth="5">
                  <line x1="-38" y1="0" x2="38" y2="0" />
                  <line x1="0" y1="-38" x2="0" y2="38" />
                  <line x1="-27" y1="-27" x2="27" y2="27" />
                  <line x1="-27" y1="27" x2="27" y2="-27" />
                </g>
              )}
              {wheel.id === 'slide-spoke-18' && (
                <g stroke="#090A0D" strokeWidth="8" strokeLinecap="round">
                  <path d="M-38 -10 L38 10 M-10 38 L10 -38 M-30 25 L30 -25 M-25 -30 L25 30" />
                </g>
              )}
              {wheel.id === 'jcw-runway-19' && (
                <>
                  <circle cx="0" cy="0" r="44" fill="none" stroke="#E60000" strokeWidth="3" />
                  <g stroke="#E60000" strokeWidth="3">
                    <line x1="-35" y1="0" x2="35" y2="0" />
                    <line x1="0" y1="-35" x2="0" y2="35" />
                    <line x1="-25" y1="-25" x2="25" y2="25" />
                    <line x1="-25" y1="25" x2="25" y2="-25" />
                  </g>
                </>
              )}
              <circle cx="0" cy="0" r="16" fill="#0A0B0E" stroke="#475569" strokeWidth="2" />
              <text x="0" y="3" textAnchor="middle" fill="#00C2D6" fontSize="7" fontWeight="bold" fontFamily="sans-serif">MINI</text>
            </g>
          </g>
        </svg>

        {/* 360 Drag Badge Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#111215]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
          <svg className="w-4 h-4 text-[#00C2D6] animate-spin" style={{ animationDuration: '4s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.57L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <span className="font-semibold tracking-wider font-mono">360° INTERACTIVE</span>
          <span className="text-white/40">·</span>
          <span className="text-white/70 font-mono tabular-nums">{Math.round(angle)}°</span>
        </div>
      </div>

      {/* Angle Slider Bar & Rotation Quick Dial */}
      <div className="w-full max-w-xl px-4 mt-2 flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="359"
          value={angle}
          onChange={(e) => onAngleChange(Number(e.target.value))}
          className="w-full h-1.5 bg-neutral-300 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#111215]"
          aria-label="Rotate car angle"
        />
      </div>
    </div>
  );
};
