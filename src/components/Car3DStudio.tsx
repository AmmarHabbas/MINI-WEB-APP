import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PaintColor, RoofColor, WheelOption, VehicleSpec } from '../types/mini';
import {
  RotateCcw,
  Play,
  Pause,
  Lightbulb,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
} from 'lucide-react';
import { miniAudio } from '../utils/audio';

interface Car3DStudioProps {
  vehicle: VehicleSpec;
  paint: PaintColor;
  roof: RoofColor;
  wheel: WheelOption;
  headlightsOn: boolean;
  isAutoSpinning: boolean;
  onToggleAutoSpin: () => void;
  onAngleChange?: (angle: number) => void;
}

export const Car3DStudio: React.FC<Car3DStudioProps> = ({
  vehicle,
  paint,
  roof,
  wheel,
  headlightsOn,
  isAutoSpinning,
  onToggleAutoSpin,
  onAngleChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsGroupRef = useRef<THREE.Group[]>([]);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const headlightsSpotlightsRef = useRef<THREE.SpotLight[]>([]);

  // Materials refs for dynamic updates
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const roofMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const mirrorMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const headlightLedMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const taillightLedMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Camera Orbit State
  const sphericalRef = useRef({ radius: 7.2, theta: Math.PI / 4, phi: Math.PI / 2.6 });
  const targetLookAt = useRef(new THREE.Vector3(0, 0.75, 0));
  const isDragging = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });

  // Door open animation state
  const [doorsOpen, setDoorsOpen] = useState(false);
  const leftDoorPivotRef = useRef<THREE.Group | null>(null);
  const rightDoorPivotRef = useRef<THREE.Group | null>(null);

  // Helper to create Multitone Roof Texture
  const createMultitoneRoofTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#1C3F94'); // San Marino Blue
    grad.addColorStop(0.5, '#00C2D6'); // Pearly Aqua
    grad.addColorStop(1, '#0E0E0E'); // Jet Black
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#15171D');
    sceneRef.current = scene;

    // Soft Studio Distance Fog
    scene.fog = new THREE.FogExp2('#15171D', 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer with High-Fidelity Settings
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#E2E8F0', 0.85);
    scene.add(ambientLight);

    // Main Overhead Softbox Light
    const overheadLight = new THREE.DirectionalLight('#FFFFFF', 2.2);
    overheadLight.position.set(0, 8, 0);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.width = 2048;
    overheadLight.shadow.mapSize.height = 2048;
    overheadLight.shadow.camera.near = 1;
    overheadLight.shadow.camera.far = 15;
    overheadLight.shadow.camera.left = -5;
    overheadLight.shadow.camera.right = 5;
    overheadLight.shadow.camera.top = 5;
    overheadLight.shadow.camera.bottom = -5;
    overheadLight.shadow.bias = -0.001;
    scene.add(overheadLight);

    // Key Light (Front Right)
    const keyLight = new THREE.DirectionalLight('#F1F5F9', 1.8);
    keyLight.position.set(6, 4, 6);
    scene.add(keyLight);

    // Fill Light (Front Left)
    const fillLight = new THREE.DirectionalLight('#94A3B8', 1.2);
    fillLight.position.set(-6, 3, 5);
    scene.add(fillLight);

    // Rim Light (Rear highlight)
    const rimLight = new THREE.DirectionalLight('#00C2D6', 1.5);
    rimLight.position.set(0, 3, -6);
    scene.add(rimLight);

    // Overhead Emissive Softbox Panel (Studio Ceiling)
    const softboxGeo = new THREE.PlaneGeometry(8, 5);
    const softboxMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF', side: THREE.DoubleSide });
    const softbox = new THREE.Mesh(softboxGeo, softboxMat);
    softbox.rotation.x = Math.PI / 2;
    softbox.position.set(0, 7.9, 0);
    scene.add(softbox);

    // 5. Studio Showroom Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#1A1C23',
      roughness: 0.25,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor Studio Circular Turntable Platform
    const turntableGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.04, 64);
    const turntableMat = new THREE.MeshStandardMaterial({
      color: '#22252F',
      roughness: 0.4,
      metalness: 0.3,
    });
    const turntable = new THREE.Mesh(turntableGeo, turntableMat);
    turntable.position.y = 0.02;
    turntable.receiveShadow = true;
    scene.add(turntable);

    // Turntable glowing rim ring
    const rimGeo = new THREE.TorusGeometry(3.65, 0.015, 16, 100);
    const rimMat = new THREE.MeshBasicMaterial({ color: '#00C2D6' });
    const turntableRim = new THREE.Mesh(rimGeo, rimMat);
    turntableRim.rotation.x = Math.PI / 2;
    turntableRim.position.y = 0.04;
    scene.add(turntableRim);

    // Under-car shadow contact plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(4.4, 2.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 20, 128, 128, 128);
      grad.addColorStop(0, 'rgba(0,0,0,0.85)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.4)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.9,
    });
    const contactShadow = new THREE.Mesh(shadowPlaneGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.045;
    scene.add(contactShadow);

    // Headlight spotlights projecting onto floor
    const spotL = new THREE.SpotLight('#E0F7FA', 4, 12, Math.PI / 6, 0.4, 1);
    spotL.position.set(0.65, 0.7, 1.8);
    spotL.target.position.set(0.65, 0, 8);
    scene.add(spotL);
    scene.add(spotL.target);

    const spotR = new THREE.SpotLight('#E0F7FA', 4, 12, Math.PI / 6, 0.4, 1);
    spotR.position.set(-0.65, 0.7, 1.8);
    spotR.target.position.set(-0.65, 0, 8);
    scene.add(spotR);
    scene.add(spotR.target);

    headlightsSpotlightsRef.current = [spotL, spotR];

    // Build the 3D Car Model
    buildCarModel(scene);

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-spin logic
      if (isAutoSpinning) {
        sphericalRef.current.theta += 0.008;
        updateCameraPosition();
        if (onAngleChange) {
          let deg = (sphericalRef.current.theta * 180) / Math.PI % 360;
          if (deg < 0) deg += 360;
          onAngleChange(Math.round(deg));
        }
      }

      // Smooth door animation
      if (leftDoorPivotRef.current && rightDoorPivotRef.current) {
        const targetAngle = doorsOpen ? 0.85 : 0;
        leftDoorPivotRef.current.rotation.y = THREE.MathUtils.lerp(
          leftDoorPivotRef.current.rotation.y,
          targetAngle,
          0.1
        );
        rightDoorPivotRef.current.rotation.y = THREE.MathUtils.lerp(
          rightDoorPivotRef.current.rotation.y,
          -targetAngle,
          0.1
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
    };
  }, []);

  // Update Camera Position from Spherical Coordinates
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(targetLookAt.current);
  };

  // Build the Exact 3D Car Model matching CGTrader specifications
  const buildCarModel = (scene: THREE.Scene) => {
    // Clean old car if any
    if (carGroupRef.current) {
      scene.remove(carGroupRef.current);
    }

    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0, 0);
    carGroupRef.current = carGroup;
    wheelsGroupRef.current = [];

    // Scale factors for Countryman vs Cooper vs Aceman
    const isCountryman = vehicle.category === 'countryman';
    const isJCW = vehicle.category === 'jcw';
    const isAceman = vehicle.category === 'aceman';

    const lengthScale = isCountryman ? 1.15 : isAceman ? 1.06 : 1.0;
    const heightScale = isCountryman ? 1.14 : isAceman ? 1.05 : 1.0;
    const widthScale = isCountryman ? 1.08 : 1.0;

    // --- MATERIALS ---
    // 1. Car Body Metallic Paint with Real Clearcoat
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paint.hex),
      metalness: paint.type === 'metallic' ? 0.75 : 0.2,
      roughness: paint.type === 'metallic' ? 0.25 : 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });
    bodyMaterialRef.current = bodyMat;

    // 2. Roof Material (Multitone or Solid)
    let roofTex: THREE.Texture | null = null;
    if (roof.type === 'multitone') {
      roofTex = createMultitoneRoofTexture();
    }
    const roofMat = new THREE.MeshStandardMaterial({
      color: roof.type === 'multitone' ? '#FFFFFF' : new THREE.Color(roof.colors[0] === 'CURRENT_BODY' ? paint.hex : roof.colors[0]),
      map: roofTex,
      roughness: 0.15,
      metalness: 0.2,
    });
    roofMaterialRef.current = roofMat;

    // 3. Mirror Cap Material
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(roof.mirrorCapsHex === 'CURRENT_BODY' ? paint.hex : roof.mirrorCapsHex),
      roughness: 0.2,
      metalness: 0.3,
    });
    mirrorMaterialRef.current = mirrorMat;

    // 4. Glass Material (High transmission / reflective tint)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#0E1724',
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.72,
    });

    // 5. Piano Black Gloss Plastic (Pillars, wheel arches, grilles)
    const pianoBlackMat = new THREE.MeshStandardMaterial({
      color: '#0E0F12',
      roughness: 0.15,
      metalness: 0.3,
    });

    // 6. Chrome / Brushed Metal
    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      roughness: 0.1,
      metalness: 0.9,
    });

    // 7. Rubber Tire Material
    const tireMat = new THREE.MeshStandardMaterial({
      color: '#141619',
      roughness: 0.85,
      metalness: 0.05,
    });

    // 8. Headlight Corona LEDs & Taillights
    const headlightLedMat = new THREE.MeshBasicMaterial({
      color: headlightsOn ? '#E0F7FA' : '#64748B',
    });
    headlightLedMaterialRef.current = headlightLedMat;

    const taillightLedMat = new THREE.MeshBasicMaterial({
      color: headlightsOn ? '#FF1A1A' : '#7F1D1D',
    });
    taillightLedMaterialRef.current = taillightLedMat;

    // ==========================================
    // A. LOWER CHASSIS & FLOORPAN
    // ==========================================
    const underbodyGeo = new THREE.BoxGeometry(1.65 * widthScale, 0.18, 3.4 * lengthScale);
    const underbody = new THREE.Mesh(underbodyGeo, pianoBlackMat);
    underbody.position.set(0, 0.22, 0);
    underbody.castShadow = true;
    carGroup.add(underbody);

    // Front & Rear Skid Plates or Diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.4 * widthScale, 0.12, 0.3);
    const diffuser = new THREE.Mesh(diffuserGeo, pianoBlackMat);
    diffuser.position.set(0, 0.24, -1.75 * lengthScale);
    carGroup.add(diffuser);

    // JCW Central Dual Sport Exhaust
    if (isJCW) {
      const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 16);
      const exhaustL = new THREE.Mesh(exhaustGeo, chromeMat);
      exhaustL.rotation.x = Math.PI / 2;
      exhaustL.position.set(-0.06, 0.22, -1.82 * lengthScale);
      carGroup.add(exhaustL);

      const exhaustR = new THREE.Mesh(exhaustGeo, chromeMat);
      exhaustR.rotation.x = Math.PI / 2;
      exhaustR.position.set(0.06, 0.22, -1.82 * lengthScale);
      carGroup.add(exhaustR);
    }

    // ==========================================
    // B. MAIN BODY SHELL (Scupted Clamshell & Flanks)
    // ==========================================
    // Main Cabin Hull
    const mainHullGeo = new THREE.BoxGeometry(1.7 * widthScale, 0.65 * heightScale, 3.5 * lengthScale);
    const mainHull = new THREE.Mesh(mainHullGeo, bodyMat);
    mainHull.position.set(0, 0.62 * heightScale, 0);
    mainHull.castShadow = true;
    mainHull.receiveShadow = true;
    carGroup.add(mainHull);

    // Clamshell Hood (Curved front sloping down to headlights)
    const hoodGeo = new THREE.CylinderGeometry(0.85 * widthScale, 0.88 * widthScale, 1.2 * lengthScale, 32, 1, false, 0, Math.PI);
    const hood = new THREE.Mesh(hoodGeo, bodyMat);
    hood.rotation.x = -Math.PI / 2;
    hood.rotation.z = Math.PI;
    hood.position.set(0, 0.72 * heightScale, 1.15 * lengthScale);
    hood.scale.set(1, 0.35, 1);
    hood.castShadow = true;
    carGroup.add(hood);

    // JCW Dual Racing Stripes on Hood
    if (isJCW) {
      const stripeGeo = new THREE.PlaneGeometry(0.08, 1.1 * lengthScale);
      const stripeMat = new THREE.MeshBasicMaterial({ color: '#0E0E0E' });
      const stripeL = new THREE.Mesh(stripeGeo, stripeMat);
      stripeL.rotation.x = -Math.PI / 2;
      stripeL.position.set(0.2, 0.85 * heightScale, 1.15 * lengthScale);
      carGroup.add(stripeL);

      const stripeR = new THREE.Mesh(stripeGeo, stripeMat);
      stripeR.rotation.x = -Math.PI / 2;
      stripeR.position.set(-0.2, 0.85 * heightScale, 1.15 * lengthScale);
      carGroup.add(stripeR);
    }

    // Front Bumper Fascia
    const bumperGeo = new THREE.BoxGeometry(1.68 * widthScale, 0.32 * heightScale, 0.35);
    const bumper = new THREE.Mesh(bumperGeo, bodyMat);
    bumper.position.set(0, 0.42 * heightScale, 1.76 * lengthScale);
    bumper.castShadow = true;
    carGroup.add(bumper);

    // Iconic Octagonal Front Grille
    const grilleGeo = new THREE.BoxGeometry(0.8 * widthScale, 0.38 * heightScale, 0.05);
    const grille = new THREE.Mesh(grilleGeo, pianoBlackMat);
    grille.position.set(0, 0.52 * heightScale, 1.85 * lengthScale);
    carGroup.add(grille);

    // Front Grille Accent Blade
    const bladeGeo = new THREE.BoxGeometry(0.7 * widthScale, 0.04, 0.06);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: isJCW ? '#E60000' : new THREE.Color(paint.hex),
      roughness: 0.3,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, 0.52 * heightScale, 1.87 * lengthScale);
    carGroup.add(blade);

    // MINI Wing Badge on Hood
    const badgeGeo = new THREE.BoxGeometry(0.18, 0.04, 0.02);
    const badge = new THREE.Mesh(badgeGeo, chromeMat);
    badge.position.set(0, 0.78 * heightScale, 1.74 * lengthScale);
    carGroup.add(badge);

    // Front Circular LED Projector Headlights
    const createHeadlight = (x: number) => {
      const headGroup = new THREE.Group();
      headGroup.position.set(x, 0.72 * heightScale, 1.72 * lengthScale);

      // Outer Chrome Ring
      const ringGeo = new THREE.TorusGeometry(0.16, 0.02, 16, 32);
      const ring = new THREE.Mesh(ringGeo, chromeMat);
      headGroup.add(ring);

      // Luminous LED Ring
      const ledRingGeo = new THREE.TorusGeometry(0.13, 0.015, 16, 32);
      const ledRing = new THREE.Mesh(ledRingGeo, headlightLedMat);
      headGroup.add(ledRing);

      // Inner Projector Lens
      const lensGeo = new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const lens = new THREE.Mesh(lensGeo, headlightLedMat);
      lens.rotation.x = Math.PI / 2;
      headGroup.add(lens);

      return headGroup;
    };
    carGroup.add(createHeadlight(0.62 * widthScale));
    carGroup.add(createHeadlight(-0.62 * widthScale));

    // Rear Fascia & Tailgate
    const rearBumperGeo = new THREE.BoxGeometry(1.68 * widthScale, 0.35 * heightScale, 0.3);
    const rearBumper = new THREE.Mesh(rearBumperGeo, bodyMat);
    rearBumper.position.set(0, 0.44 * heightScale, -1.72 * lengthScale);
    rearBumper.castShadow = true;
    carGroup.add(rearBumper);

    // Horizontal Black Tailgate Strip with "COOPER"
    const tailgateStripGeo = new THREE.BoxGeometry(1.2 * widthScale, 0.1, 0.04);
    const tailgateStrip = new THREE.Mesh(tailgateStripGeo, pianoBlackMat);
    tailgateStrip.position.set(0, 0.78 * heightScale, -1.76 * lengthScale);
    carGroup.add(tailgateStrip);

    // Rear Union Jack Taillights
    const createTaillight = (x: number) => {
      const tailGroup = new THREE.Group();
      tailGroup.position.set(x, 0.78 * heightScale, -1.74 * lengthScale);

      // Housing
      const houseGeo = new THREE.BoxGeometry(0.18, 0.32 * heightScale, 0.05);
      const house = new THREE.Mesh(houseGeo, pianoBlackMat);
      tailGroup.add(house);

      // Union Jack Inner LEDs
      const ledGeo = new THREE.PlaneGeometry(0.14, 0.28 * heightScale);
      const led = new THREE.Mesh(ledGeo, taillightLedMat);
      led.rotation.y = Math.PI;
      led.position.z = -0.03;
      tailGroup.add(led);

      return tailGroup;
    };
    carGroup.add(createTaillight(0.64 * widthScale));
    carGroup.add(createTaillight(-0.64 * widthScale));

    // ==========================================
    // C. GREENHOUSE & FLOATING HELMET ROOF
    // ==========================================
    // Cabin Greenhouse Glass Shell
    const cabinGeo = new THREE.BoxGeometry(1.48 * widthScale, 0.52 * heightScale, 2.1 * lengthScale);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 1.15 * heightScale, -0.05 * lengthScale);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Windshield (sloped front glass)
    const windshieldGeo = new THREE.BoxGeometry(1.44 * widthScale, 0.58 * heightScale, 0.06);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.rotation.x = -Math.PI / 4.8;
    windshield.position.set(0, 1.08 * heightScale, 0.95 * lengthScale);
    carGroup.add(windshield);

    // A/B/C Pillars (High-Gloss Piano Black)
    const pillarGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.55 * heightScale);
    const pillarA_L = new THREE.Mesh(pillarGeo, pianoBlackMat);
    pillarA_L.rotation.x = -Math.PI / 4.8;
    pillarA_L.position.set(0.71 * widthScale, 1.08 * heightScale, 0.95 * lengthScale);
    carGroup.add(pillarA_L);

    const pillarA_R = new THREE.Mesh(pillarGeo, pianoBlackMat);
    pillarA_R.rotation.x = -Math.PI / 4.8;
    pillarA_R.position.set(-0.71 * widthScale, 1.08 * heightScale, 0.95 * lengthScale);
    carGroup.add(pillarA_R);

    // FLOATING ROOF SHELL (With Multitone or Solid Color)
    const roofGeo = new THREE.BoxGeometry(1.52 * widthScale, 0.09 * heightScale, 2.3 * lengthScale);
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(0, 1.42 * heightScale, -0.08 * lengthScale);
    roofMesh.castShadow = true;
    carGroup.add(roofMesh);

    // Roof Top Bevel / Aerodynamic curvature
    const roofTopGeo = new THREE.CylinderGeometry(0.72 * widthScale, 0.74 * widthScale, 2.2 * lengthScale, 32, 1, false, 0, Math.PI);
    const roofTop = new THREE.Mesh(roofTopGeo, roofMat);
    roofTop.rotation.x = -Math.PI / 2;
    roofTop.rotation.z = Math.PI;
    roofTop.position.set(0, 1.45 * heightScale, -0.08 * lengthScale);
    roofTop.scale.set(1, 0.1, 1);
    roofTop.castShadow = true;
    carGroup.add(roofTop);

    // Countryman Roof Rails
    if (isCountryman) {
      const railGeo = new THREE.BoxGeometry(0.04, 0.04, 1.9 * lengthScale);
      const railL = new THREE.Mesh(railGeo, chromeMat);
      railL.position.set(0.68 * widthScale, 1.54 * heightScale, -0.08 * lengthScale);
      carGroup.add(railL);

      const railR = new THREE.Mesh(railGeo, chromeMat);
      railR.position.set(-0.68 * widthScale, 1.54 * heightScale, -0.08 * lengthScale);
      carGroup.add(railR);
    }

    // JCW Sport Rear Roof Spoiler Wing
    if (isJCW) {
      const spoilerGeo = new THREE.BoxGeometry(1.48 * widthScale, 0.05, 0.35);
      const spoilerMat = new THREE.MeshStandardMaterial({ color: '#E60000', roughness: 0.2 });
      const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
      spoiler.position.set(0, 1.52 * heightScale, -1.25 * lengthScale);
      spoiler.rotation.x = -0.15;
      carGroup.add(spoiler);
    }

    // ==========================================
    // D. INTERIOR (Visible through glass or doors)
    // ==========================================
    // Dashboard
    const dashGeo = new THREE.BoxGeometry(1.4 * widthScale, 0.25, 0.45);
    const dashMat = new THREE.MeshStandardMaterial({ color: '#242830', roughness: 0.7 });
    const dash = new THREE.Mesh(dashGeo, dashMat);
    dash.position.set(0, 0.82 * heightScale, 0.65 * lengthScale);
    carGroup.add(dash);

    // The Iconic 240mm Circular OLED Display in Center of Dashboard!
    const oledCylinderGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 32);
    const oledScreenMat = new THREE.MeshBasicMaterial({ color: '#00C2D6' });
    const oled3D = new THREE.Mesh(oledCylinderGeo, oledScreenMat);
    oled3D.rotation.x = Math.PI / 2.8;
    oled3D.position.set(0, 0.95 * heightScale, 0.65 * lengthScale);
    carGroup.add(oled3D);

    // MINI 2-Spoke Vescin Steering Wheel
    const wheelSteerGeo = new THREE.TorusGeometry(0.15, 0.02, 16, 32);
    const steerMat = new THREE.MeshStandardMaterial({ color: '#1E2128', roughness: 0.4 });
    const steer = new THREE.Mesh(wheelSteerGeo, steerMat);
    steer.rotation.x = Math.PI / 3;
    steer.position.set(0.42 * widthScale, 0.88 * heightScale, 0.48 * lengthScale);
    carGroup.add(steer);

    // Front Bucket Seats
    const seatGeo = new THREE.BoxGeometry(0.45, 0.65, 0.45);
    const seatMat = new THREE.MeshStandardMaterial({
      color: isJCW ? '#15171C' : '#2A2D35',
      roughness: 0.6,
    });
    const seatL = new THREE.Mesh(seatGeo, seatMat);
    seatL.position.set(0.42 * widthScale, 0.72 * heightScale, 0.05 * lengthScale);
    carGroup.add(seatL);

    const seatR = new THREE.Mesh(seatGeo, seatMat);
    seatR.position.set(-0.42 * widthScale, 0.72 * heightScale, 0.05 * lengthScale);
    carGroup.add(seatR);

    // ==========================================
    // E. DOORS & SIDE MIRROR CAPS
    // ==========================================
    // Left Door Pivot Group
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(0.85 * widthScale, 0.65 * heightScale, 0.7 * lengthScale);
    leftDoorPivotRef.current = leftDoorPivot;

    const leftDoorPanelGeo = new THREE.BoxGeometry(0.06, 0.55 * heightScale, 1.15 * lengthScale);
    const leftDoorPanel = new THREE.Mesh(leftDoorPanelGeo, bodyMat);
    leftDoorPanel.position.set(0, 0, -0.55 * lengthScale);
    leftDoorPanel.castShadow = true;
    leftDoorPivot.add(leftDoorPanel);

    // Left Mirror Cap
    const mirrorStemGeo = new THREE.BoxGeometry(0.08, 0.04, 0.04);
    const mirrorStemL = new THREE.Mesh(mirrorStemGeo, pianoBlackMat);
    mirrorStemL.position.set(0.06, 0.28 * heightScale, -0.15 * lengthScale);
    leftDoorPivot.add(mirrorStemL);

    const mirrorCapGeo = new THREE.SphereGeometry(0.12, 16, 16);
    mirrorCapGeo.scale(1, 0.7, 1.4);
    const mirrorCapL = new THREE.Mesh(mirrorCapGeo, mirrorMaterialRef.current);
    mirrorCapL.position.set(0.14, 0.28 * heightScale, -0.15 * lengthScale);
    mirrorCapL.castShadow = true;
    leftDoorPivot.add(mirrorCapL);

    carGroup.add(leftDoorPivot);

    // Right Door Pivot Group
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(-0.85 * widthScale, 0.65 * heightScale, 0.7 * lengthScale);
    rightDoorPivotRef.current = rightDoorPivot;

    const rightDoorPanelGeo = new THREE.BoxGeometry(0.06, 0.55 * heightScale, 1.15 * lengthScale);
    const rightDoorPanel = new THREE.Mesh(rightDoorPanelGeo, bodyMat);
    rightDoorPanel.position.set(0, 0, -0.55 * lengthScale);
    rightDoorPanel.castShadow = true;
    rightDoorPivot.add(rightDoorPanel);

    // Right Mirror Cap
    const mirrorStemR = new THREE.Mesh(mirrorStemGeo, pianoBlackMat);
    mirrorStemR.position.set(-0.06, 0.28 * heightScale, -0.15 * lengthScale);
    rightDoorPivot.add(mirrorStemR);

    const mirrorCapR = new THREE.Mesh(mirrorCapGeo, mirrorMaterialRef.current);
    mirrorCapR.position.set(-0.14, 0.28 * heightScale, -0.15 * lengthScale);
    mirrorCapR.castShadow = true;
    rightDoorPivot.add(mirrorCapR);

    carGroup.add(rightDoorPivot);

    // ==========================================
    // F. WHEELS & ALLOY RIMS
    // ==========================================
    const wheelRadius = 0.35 * (isCountryman ? 1.08 : 1.0);
    const wheelWidth = 0.22;
    const rimRadius = wheelRadius * 0.78;

    const createWheelAssembly = (x: number, z: number, isRight: boolean) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, wheelRadius, z);

      // 1. Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 32);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // 2. Alloy Rim Base
      const rimBaseGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, wheelWidth + 0.01, 32);
      const rimColor = wheel.id === 'jcw-runway-19' ? '#0F1012' : '#CBD5E1';
      const rimMat = new THREE.MeshStandardMaterial({
        color: rimColor,
        roughness: 0.2,
        metalness: 0.85,
      });
      const rimBase = new THREE.Mesh(rimBaseGeo, rimMat);
      rimBase.rotation.z = Math.PI / 2;
      wheelGroup.add(rimBase);

      // 3. Spoke Variations
      const spokeGroup = new THREE.Group();
      spokeGroup.rotation.z = Math.PI / 2;
      const spokeMat = new THREE.MeshStandardMaterial({
        color: wheel.id === 'slide-spoke-18' ? '#0F1012' : rimColor,
        metalness: 0.9,
        roughness: 0.2,
      });

      const spokeCount = wheel.id === 'u-spoke-17' ? 5 : wheel.id === 'slide-spoke-18' ? 8 : 10;
      for (let i = 0; i < spokeCount; i++) {
        const angle = (i * Math.PI * 2) / spokeCount;
        const spokeGeo = new THREE.BoxGeometry(0.04, rimRadius * 0.95, wheelWidth + 0.015);
        const spoke = new THREE.Mesh(spokeGeo, spokeMat);
        spoke.position.set(Math.cos(angle) * rimRadius * 0.45, Math.sin(angle) * rimRadius * 0.45, 0);
        spoke.rotation.z = angle;
        spokeGroup.add(spoke);
      }

      // Red Outer Lip Ring for JCW Rim
      if (wheel.id === 'jcw-runway-19') {
        const jcwLipGeo = new THREE.TorusGeometry(rimRadius, 0.01, 16, 32);
        const jcwLipMat = new THREE.MeshBasicMaterial({ color: '#E60000' });
        const jcwLip = new THREE.Mesh(jcwLipGeo, jcwLipMat);
        jcwLip.position.z = isRight ? wheelWidth / 2 + 0.01 : -(wheelWidth / 2 + 0.01);
        spokeGroup.add(jcwLip);
      }

      wheelGroup.add(spokeGroup);

      // 4. Center MINI Hub Cap
      const hubGeo = new THREE.CylinderGeometry(0.06, 0.06, wheelWidth + 0.02, 16);
      const hubMat = new THREE.MeshStandardMaterial({ color: '#090A0D', roughness: 0.1 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);

      // 5. Brake Disc & Red/Silver Caliper
      const brakeDiscGeo = new THREE.CylinderGeometry(rimRadius * 0.75, rimRadius * 0.75, 0.03, 24);
      const brakeDiscMat = new THREE.MeshStandardMaterial({ color: '#94A3B8', metalness: 0.9, roughness: 0.3 });
      const brakeDisc = new THREE.Mesh(brakeDiscGeo, brakeDiscMat);
      brakeDisc.rotation.z = Math.PI / 2;
      wheelGroup.add(brakeDisc);

      const caliperGeo = new THREE.BoxGeometry(0.08, 0.15, 0.06);
      const caliperMat = new THREE.MeshStandardMaterial({
        color: isJCW ? '#E60000' : '#00C2D6',
        roughness: 0.3,
        metalness: 0.5,
      });
      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(0, rimRadius * 0.4, 0);
      wheelGroup.add(caliper);

      wheelsGroupRef.current.push(wheelGroup);
      return wheelGroup;
    };

    const wheelTrackX = 0.84 * widthScale;
    const frontWheelZ = 1.18 * lengthScale;
    const rearWheelZ = -1.18 * lengthScale;

    carGroup.add(createWheelAssembly(wheelTrackX, frontWheelZ, true));
    carGroup.add(createWheelAssembly(-wheelTrackX, frontWheelZ, false));
    carGroup.add(createWheelAssembly(wheelTrackX, rearWheelZ, true));
    carGroup.add(createWheelAssembly(-wheelTrackX, rearWheelZ, false));

    scene.add(carGroup);
  };

  // Re-build or update car when vehicle or wheel changes
  useEffect(() => {
    if (sceneRef.current) {
      buildCarModel(sceneRef.current);
    }
  }, [vehicle.id, wheel.id]);

  // Update Body Paint dynamically without rebuilding geometry
  useEffect(() => {
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(paint.hex);
      bodyMaterialRef.current.metalness = paint.type === 'metallic' ? 0.75 : 0.2;
      bodyMaterialRef.current.roughness = paint.type === 'metallic' ? 0.25 : 0.35;
    }
    // Also update mirror cap if body matched
    if (roof.mirrorCapsHex === 'CURRENT_BODY' && mirrorMaterialRef.current) {
      mirrorMaterialRef.current.color.set(paint.hex);
    }
    // Update roof if body matched
    if (roof.colors[0] === 'CURRENT_BODY' && roofMaterialRef.current) {
      roofMaterialRef.current.color.set(paint.hex);
      roofMaterialRef.current.map = null;
      roofMaterialRef.current.needsUpdate = true;
    }
  }, [paint.id]);

  // Update Roof and Mirror Caps dynamically
  useEffect(() => {
    if (!roofMaterialRef.current || !mirrorMaterialRef.current) return;

    if (roof.type === 'multitone') {
      roofMaterialRef.current.color.set('#FFFFFF');
      roofMaterialRef.current.map = createMultitoneRoofTexture();
      roofMaterialRef.current.needsUpdate = true;
      mirrorMaterialRef.current.color.set(roof.mirrorCapsHex);
    } else {
      roofMaterialRef.current.map = null;
      roofMaterialRef.current.color.set(
        roof.colors[0] === 'CURRENT_BODY' ? paint.hex : roof.colors[0]
      );
      roofMaterialRef.current.needsUpdate = true;
      mirrorMaterialRef.current.color.set(
        roof.mirrorCapsHex === 'CURRENT_BODY' ? paint.hex : roof.mirrorCapsHex
      );
    }
  }, [roof.id, paint.hex]);

  // Update Headlight LEDs & Floor Spotlights
  useEffect(() => {
    if (headlightLedMaterialRef.current) {
      headlightLedMaterialRef.current.color.set(headlightsOn ? '#E0F7FA' : '#64748B');
    }
    if (taillightLedMaterialRef.current) {
      taillightLedMaterialRef.current.color.set(headlightsOn ? '#FF1A1A' : '#7F1D1D');
    }
    headlightsSpotlightsRef.current.forEach((spot) => {
      spot.intensity = headlightsOn ? 4 : 0;
    });
  }, [headlightsOn]);

  // Pointer Drag Handlers for 3D Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
    if (isAutoSpinning) {
      onToggleAutoSpin();
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousPointerPosition.current.x;
    const deltaY = e.clientY - previousPointerPosition.current.y;
    previousPointerPosition.current = { x: e.clientX, y: e.clientY };

    // Orbit sensitivity
    sphericalRef.current.theta -= deltaX * 0.007;
    sphericalRef.current.phi -= deltaY * 0.007;

    // Clamp vertical orbit angle so camera doesn't go below ground
    sphericalRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2.05, sphericalRef.current.phi));

    updateCameraPosition();

    if (onAngleChange) {
      let deg = (sphericalRef.current.theta * 180) / Math.PI % 360;
      if (deg < 0) deg += 360;
      onAngleChange(Math.round(deg));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(4.2, Math.min(11.0, sphericalRef.current.radius + e.deltaY * 0.005));
    updateCameraPosition();
  };

  const setCameraPreset = (thetaDeg: number, phiDeg = 70, radius = 7.2) => {
    sphericalRef.current.theta = (thetaDeg * Math.PI) / 180;
    sphericalRef.current.phi = (phiDeg * Math.PI) / 180;
    sphericalRef.current.radius = radius;
    updateCameraPosition();
    miniAudio.playClick(500);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[560px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing touch-none bg-[#15171D] shadow-2xl border border-white/10"
        title="Click and drag to orbit in 3D. Scroll to zoom."
      />

      {/* Floating 3D HUD Controls Over Canvas */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#111215]/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-none z-10">
        <Sparkles className="w-3.5 h-3.5 text-[#00C2D6]" />
        <span className="font-mono font-bold uppercase tracking-wider">Exact 3D WebGL Model</span>
        <span className="text-white/40">·</span>
        <span className="text-white/80 font-sans">{vehicle.name.replace('The All-Electric ', '').replace('The All-New ', '')}</span>
      </div>

      {/* Camera Angle & Interactive Tools Floating Dock */}
      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#111215]/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setCameraPreset(45, 70, 7.2)}
            className="px-3 py-1.5 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Front 3/4
          </button>
          <button
            onClick={() => setCameraPreset(90, 75, 7.2)}
            className="px-3 py-1.5 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Side
          </button>
          <button
            onClick={() => setCameraPreset(225, 70, 7.2)}
            className="px-3 py-1.5 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Rear 3/4
          </button>
          <button
            onClick={() => setCameraPreset(0, 20, 8.5)}
            className="px-3 py-1.5 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Roof View
          </button>
        </div>

        {/* Interactive Features (Doors, Auto-Spin, Zoom) */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#111215]/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs">
          {/* Toggle Doors Open/Close */}
          <button
            onClick={() => {
              setDoorsOpen(!doorsOpen);
              miniAudio.playClick(doorsOpen ? 450 : 680);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
              doorsOpen ? 'bg-[#00C2D6] text-black shadow' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Open / Close Doors to inspect 240mm OLED Interior"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{doorsOpen ? 'Close Doors' : 'Open Doors'}</span>
          </button>

          {/* Auto-Spin Toggle */}
          <button
            onClick={onToggleAutoSpin}
            className={`p-2 rounded-xl transition-colors ${
              isAutoSpinning ? 'bg-[#00C2D6] text-black' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title={isAutoSpinning ? 'Pause rotation' : 'Auto 360° spin'}
          >
            {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* Reset Camera */}
          <button
            onClick={() => setCameraPreset(45, 70, 7.2)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
