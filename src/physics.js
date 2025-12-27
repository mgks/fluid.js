export class FluidPhysics {
    constructor(config) {
        this.conf = config;
        
        // State
        this.fillPct = 0;       
        this.currentFill = 0;   
        
        this.deviceAngle = 0;   
        this.liquidAngle = 0;    
        this.liquidVelocity = 0; 
        this.lastVelocity = 0;
        this.time = 0;

        // Springs
        this.springs = [];
        this.numSprings = 60; 
        for(let i=0; i<this.numSprings; i++) {
            this.springs.push({ p: 0, v: 0 });
        }
    }

    update(targetAngle, acceleration, dt = 1) {
        this.time += this.conf.waveSpeed * dt;

        // 1. Fill Lerp
        this.currentFill += (this.fillPct - this.currentFill) * 0.05;

        // 2. Inertia (The Slosh)
        let diff = targetAngle - this.liquidAngle;
        // PI Wrap
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        // Spring pull towards gravity
        const springAccel = diff * 0.005; 
        
        this.liquidVelocity += springAccel;
        this.liquidVelocity *= this.conf.inertia; 
        
        // Safety Clamp
        this.liquidVelocity = Math.max(Math.min(this.liquidVelocity, 0.5), -0.5);
        
        this.liquidAngle += this.liquidVelocity;

        // 3. Forces
        const centrifugal = Math.max(Math.min(this.liquidVelocity * this.conf.wallClimb * 100, 50), -50);
        
        const velocityChange = this.liquidVelocity - this.lastVelocity;
        const jerk = Math.max(Math.min(velocityChange * this.conf.splashFactor * 300, 50), -50);
        this.lastVelocity = this.liquidVelocity;

        // 4. Springs
        for (let i = 0; i < this.numSprings; i++) {
            const spring = this.springs[i];
            
            const ratio = (i / (this.numSprings - 1)) * 2 - 1;
            const totalForce = (ratio * centrifugal) + (ratio * jerk);

            spring.v += totalForce * 0.02;

            const wave = Math.sin(this.time + i * 0.2) * this.conf.ambientWave;
            const targetP = wave;
            
            const extension = spring.p - targetP;
            const accel = -this.conf.tension * extension - this.conf.dampening * spring.v;
            
            spring.v += accel;
            spring.p += spring.v;
        }

        this.spreadWaves();
    }

    spreadWaves() {
        const left = new Array(this.numSprings).fill(0);
        const right = new Array(this.numSprings).fill(0);

        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < this.numSprings; i++) {
                if (i > 0) {
                    left[i] = this.conf.spread * (this.springs[i].p - this.springs[i-1].p);
                    this.springs[i-1].v += left[i];
                }
                if (i < this.numSprings - 1) {
                    right[i] = this.conf.spread * (this.springs[i].p - this.springs[i+1].p);
                    this.springs[i+1].v += right[i];
                }
            }
            for (let i = 0; i < this.numSprings; i++) {
                if (i > 0) this.springs[i-1].p += left[i];
                if (i < this.numSprings - 1) this.springs[i+1].p += right[i];
            }
        }
    }
    
    splash(force) {
        const index = Math.floor(Math.random() * this.numSprings);
        this.springs[index].v += force;
    }
}