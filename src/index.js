import { FluidPhysics } from './physics.js';
import { PRESETS } from './presets.js';

export class Fluid {
    constructor(canvas, options = {}) {
        this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
        if (!this.canvas) throw new Error('Canvas not found');
        
        this.ctx = this.canvas.getContext('2d');
        
        this.config = { ...PRESETS.WATER, ...options };
        this.physics = new FluidPhysics(this.config);
        
        this.width = 0;
        this.height = 0;
        this.diag = 0;
        
        // GLOBAL STATE
        this.targetAngle = 0; // Can be set by Gyro OR Slider
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupSensors();
        this.loop();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.diag = Math.hypot(this.width, this.height) * 1.5;
    }

    setFill(percent) {
        const val = Math.max(percent / 100, 0.05);
        this.physics.fillPct = val;
    }

    /**
     * Manual Control for PC Demo
     * @param {number} rad - Angle in radians
     */
    simulateTilt(rad) {
        this.targetAngle = rad;
    }

    setupSensors() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (e) => {
                const ag = e.accelerationIncludingGravity;
                if (!ag) return;

                const x = ag.x || 0;
                const y = ag.y || 0;
                
                // Gravity Calculation
                // -PI/2 aligns Down with Phone Bottom
                this.targetAngle = Math.atan2(y, x) - (Math.PI / 2);
                
                // Handle Shake
                if (e.acceleration) {
                    const shake = Math.hypot(e.acceleration.x, e.acceleration.y);
                    if (shake > 10) this.physics.splash(Math.min(shake * 2, 100));
                }
            });
        }
    }

    loop() {
        // We always update using the current global targetAngle.
        // This allows the slider to work when sensors are absent.
        this.physics.update(this.targetAngle, null);

        this.render();
        requestAnimationFrame(() => this.loop());
    }

    render() {
        const { ctx, width, height, diag } = this;
        const phys = this.physics;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(width / 2, height / 2);
        
        // Visual Rotation
        ctx.rotate(-phys.liquidAngle);

        const waterY = (height / 2) - (phys.currentFill * height);

        ctx.beginPath();
        const startX = -diag / 2;
        const step = diag / phys.numSprings;

        ctx.moveTo(startX, waterY + phys.springs[0].p);

        for (let i = 1; i < phys.numSprings; i++) {
            const x = startX + (i * step);
            const y = waterY + phys.springs[i].p;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(diag / 2, diag);
        ctx.lineTo(-diag / 2, diag);
        ctx.closePath();

        ctx.fillStyle = this.config.color || '#3b82f6';
        ctx.globalAlpha = 0.9;
        ctx.fill();

        ctx.restore();
    }
}