import { Fluid } from '/src/index.js';
import * as dat from 'dat.gui';

// 1. Detect Mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const wrapper = document.getElementById('sim-wrapper');
const overlay = document.getElementById('permission-overlay');
const slider = document.getElementById('rotate-slider');
const phone = document.getElementById('sim-phone');

// 2. Setup Canvas
if (isMobile) {
    document.body.appendChild(document.getElementById('fluid'));
    wrapper.style.display = 'none';
    overlay.classList.remove('hidden');
} else {
    overlay.style.display = 'none';
}

// 3. Initialize Fluid
const fluid = new Fluid('#fluid', {
    color: '#00ccff',
    // Default "Water" settings
    tension: 0.01,
    dampening: 0.02,
    spread: 0.25,
    inertia: 0.96
});
fluid.setFill(50);

// 4. PC Controls
if (!isMobile) {
    // Slider Logic
    slider.addEventListener('input', (e) => {
        const deg = parseInt(e.target.value);
        // Convert CSS rotation (Degrees) to Physics Rotation (Radians)
        // We add PI to align the slider's "Bottom" with the engine's "Bottom"
        const rad = deg * (Math.PI / 180);
        
        phone.style.transform = `rotate(${deg}deg)`;
        
        // Update Physics
        fluid.simulateTilt(rad);
    });

    // Full Dat.GUI
    const gui = new dat.GUI();
    const conf = fluid.config; 
    
    const f1 = gui.addFolder('Physics');
    f1.add(conf, 'tension', 0.001, 0.1).name('Tension');
    f1.add(conf, 'dampening', 0.001, 0.1).name('Friction');
    f1.add(conf, 'spread', 0.0, 0.5).name('Wave Speed');
    f1.add(conf, 'inertia', 0.8, 0.999).name('Momentum');
    f1.open();

    const f2 = gui.addFolder('Forces');
    f2.add(conf, 'wallClimb', 0, 5).name('U-Shape');
    f2.add(conf, 'splashFactor', 0, 5).name('Splash Force');
    f2.open();

    const f3 = gui.addFolder('Visuals');
    f3.addColor(conf, 'color');
    f3.add({ fill: 50 }, 'fill', 0, 100).name('Fill Level')
        .onChange(v => fluid.setFill(v));
    f3.open();
}

// 5. Mobile Start
if (isMobile) {
    document.getElementById('btn-enable').addEventListener('click', () => {
        overlay.style.display = 'none';
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(r => r === 'granted' && fluid.setupSensors());
        } else {
            fluid.setupSensors();
        }
    });
}