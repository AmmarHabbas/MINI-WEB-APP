/**
 * MINI Global Flagship - Standalone Pure Vanilla JavaScript Edition
 * Zero dependencies. Runs in all modern web browsers.
 */

// Web Audio Synthesizer for MINI Modes
class StandaloneAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && window.AudioContext) {
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playGoKart() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.4);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.8);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.9);
  }

  playGreen() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [440, 554, 659].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.08);
      gain.gain.setValueAtTime(0.001, t + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.1, t + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.85);
    });
  }

  playVivid() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [523, 659, 783, 1046].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t + i * 0.06);
      gain.gain.setValueAtTime(0.001, t + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, t + i * 0.06 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.55);
    });
  }

  playTimeless() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.06);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }
}

const audio = new StandaloneAudio();

// 360 Configurator State
let currentAngle = 45;
let currentPaint = '#0A382C';
let currentRoof = 'multitone'; // or hex
let isDragging = false;
let startX = 0;
let startAngle = 45;

const carBodyPath = document.getElementById('car-body-path');
const carRoofPath = document.getElementById('car-roof-path');
const angleSlider = document.getElementById('angle-slider');
const angleDisplay = document.getElementById('angle-display');
const oledHousing = document.getElementById('oled-housing');
const oledModeName = document.getElementById('oled-mode-name');
const oledSpeedNum = document.getElementById('oled-speed');

function renderCar() {
  const rad = (currentAngle * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const sideOffset = sin * 220;

  if (angleSlider) angleSlider.value = Math.round(currentAngle);
  if (angleDisplay) angleDisplay.textContent = `${Math.round(currentAngle)}°`;

  const carGroup = document.getElementById('car-group');
  if (carGroup) {
    carGroup.setAttribute('transform', `translate(${450 + sideOffset * 0.2}, 180)`);
  }

  // Update roof fill
  if (carRoofPath) {
    if (currentRoof === 'multitone') {
      carRoofPath.setAttribute('fill', 'url(#multitoneGradient)');
    } else if (currentRoof === 'body') {
      carRoofPath.setAttribute('fill', currentPaint);
    } else {
      carRoofPath.setAttribute('fill', currentRoof);
    }
  }

  // Update paint fill
  const stop1 = document.getElementById('paint-stop-1');
  const stop2 = document.getElementById('paint-stop-2');
  if (stop1 && stop2) {
    stop1.setAttribute('stop-color', currentPaint);
    stop2.setAttribute('stop-color', currentPaint);
  }
}

// Drag listeners
const stage = document.getElementById('canvas-stage');
if (stage) {
  stage.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startAngle = currentAngle;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    currentAngle = (startAngle - deltaX * 0.7) % 360;
    if (currentAngle < 0) currentAngle += 360;
    renderCar();
  });

  stage.addEventListener('pointerup', (e) => {
    isDragging = false;
    try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
  });
}

if (angleSlider) {
  angleSlider.addEventListener('input', (e) => {
    currentAngle = Number(e.target.value);
    renderCar();
  });
}

// Color Swatch pickers
document.querySelectorAll('.paint-swatch').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.paint-swatch').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentPaint = btn.getAttribute('data-hex');
    renderCar();
  });
});

document.querySelectorAll('.roof-swatch').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.roof-swatch').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentRoof = btn.getAttribute('data-roof');
    renderCar();
  });
});

// OLED Experience Modes
document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.getAttribute('data-mode');

    if (mode === 'gokart') {
      audio.playGoKart();
      oledHousing.style.boxShadow = '0 0 50px rgba(230, 0, 0, 0.5), 0 20px 60px rgba(0,0,0,0.8)';
      oledModeName.textContent = 'GO-KART MODE';
      oledModeName.style.color = '#E60000';
      oledSpeedNum.style.color = '#FFFFFF';
    } else if (mode === 'green') {
      audio.playGreen();
      oledHousing.style.boxShadow = '0 0 50px rgba(5, 150, 105, 0.45), 0 20px 60px rgba(0,0,0,0.8)';
      oledModeName.textContent = 'GREEN MODE';
      oledModeName.style.color = '#059669';
      oledSpeedNum.style.color = '#34D399';
    } else if (mode === 'vivid') {
      audio.playVivid();
      oledHousing.style.boxShadow = '0 0 50px rgba(0, 194, 214, 0.5), 0 20px 60px rgba(0,0,0,0.8)';
      oledModeName.textContent = 'VIVID MODE';
      oledModeName.style.color = '#00C2D6';
      oledSpeedNum.style.color = '#FFFFFF';
    } else if (mode === 'timeless') {
      audio.playTimeless();
      oledHousing.style.boxShadow = '0 0 45px rgba(217, 119, 6, 0.4), 0 20px 60px rgba(0,0,0,0.8)';
      oledModeName.textContent = 'TIMELESS 1959';
      oledModeName.style.color = '#D97706';
      oledSpeedNum.style.color = '#FDE68A';
    }
  });
});

// Interactive Speedometer pulse
setInterval(() => {
  if (oledSpeedNum) {
    const base = 74;
    const delta = Math.floor(Math.random() * 5) - 2;
    oledSpeedNum.textContent = base + delta;
  }
}, 1200);

// Test Drive Booking with LocalStorage
const bookingForm = document.getElementById('test-drive-form');
const bookingStatus = document.getElementById('booking-status');

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-name').value;
    const email = document.getElementById('input-email').value;
    const model = document.getElementById('input-model').value;
    const dealer = document.getElementById('input-dealer').value;

    const ref = 'MINI-GK-' + Math.floor(1000 + Math.random() * 9000);
    const booking = { name, email, model, dealer, ref, date: new Date().toISOString() };

    const stored = JSON.parse(localStorage.getItem('standalone_mini_bookings') || '[]');
    stored.push(booking);
    localStorage.setItem('standalone_mini_bookings', JSON.stringify(stored));

    audio.playGoKart();

    if (bookingStatus) {
      bookingStatus.innerHTML = `
        <div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:1.25rem; border-radius:1rem; color:#065f46; margin-top:1.5rem;">
          <h4 style="font-weight:800; font-size:1.125rem;">Test Drive Reserved! Reference: ${ref}</h4>
          <p style="font-size:0.875rem; margin-top:0.25rem;">
            Thank you, <strong>${name}</strong>. Your session in the <strong>${model}</strong> at <strong>${dealer}</strong> is confirmed.
          </p>
        </div>
      `;
    }
    bookingForm.reset();
  });
}

// Initial draw
renderCar();
