export interface FluidConfig {
    /** Surface stiffness. Lower = more waves. Default: 0.01 */
    tension?: number;
    /** Friction. Lower = waves last longer. Default: 0.02 */
    dampening?: number;
    /** How fast ripples travel. Default: 0.25 */
    spread?: number;
    /** Momentum conservation. 0.0 to 1.0. Default: 0.96 */
    inertia?: number;
    /** How high fluid climbs walls during rotation. Default: 2.5 */
    wallClimb?: number;
    /** Sensitivity to shaking/splashing. Default: 0.8 */
    splashFactor?: number;
    /** Hex color of the liquid. Default: #3b82f6 */
    color?: string;
}

export const PRESETS: {
    WATER: FluidConfig;
    OIL: FluidConfig;
    JELLY: FluidConfig;
};

export class Fluid {
    constructor(canvas: string | HTMLCanvasElement, options?: FluidConfig);
    
    /**
     * Set the target fill level (0 to 100)
     */
    setFill(percent: number): void;

    /**
     * Manually update physics (useful for custom simulations)
     */
    simulateTilt(radians: number): void;
    
    /**
     * Initialize device motion sensors (Requires user interaction on iOS)
     */
    setupSensors(): void;
    
    /**
     * Configuration object
     */
    config: FluidConfig;
}