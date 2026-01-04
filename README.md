# fluid.js

**A tiny, zero-dependency fluid simulation for the web that reacts to device motion.**

<p>
  <img src="https://img.shields.io/npm/v/fluid.js.svg?style=flat-square&color=d25353" alt="npm version">
  <img src="https://img.shields.io/bundlephobia/minzip/fluid.js?style=flat-square&color=38bd24" alt="size">
  <img src="https://img.shields.io/npm/dt/fluid.js.svg?style=flat-square&color=38bd24" alt="npm downloads">
  <img src="https://img.shields.io/github/license/mgks/fluid.js.svg?style=flat-square&color=blue" alt="license">
</p>

Most fluid simulations are heavy particle engines (100KB+). **fluid.js** is different. It uses a 2D spring-mass system coupled with inertial angular physics to simulate the *feeling* of liquid in a container.

It is designed for **UI Backgrounds**, **Loading States**, and **Interactive Cards**.

## Features
- **Micro-Library:** ~4KB (minified + gzipped).
- **Device Ready:** Reacts to Gyroscope/Accelerometer (Mobile) and Mouse/Slider (PC).
- **Inertial Physics:** Simulates "Slosh", momentum, and wall climbing (U-Shape).
- **Zero Dependencies:** Pure Vanilla JS. Works with React, Vue, Svelte, or plain HTML.

## Installation

```bash
npm install fluid.js
```

## Usage

### Vanilla JS / HTML
```html
<canvas id="my-fluid-canvas"></canvas>

<script type="module">
  import { Fluid } from 'fluid.js';

  const fluid = new Fluid('#my-fluid-canvas', {
    color: '#00aaff', // Hex color
    tension: 0.01,    // Surface tension
    dampening: 0.02   // Ripple decay
  });

  // Set initial fill level (0 to 100)
  fluid.setFill(50);
</script>
```

### React / Vue
```javascript
import { useEffect, useRef } from 'react';
import { Fluid } from 'fluid.js';

export default function LiquidCard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const myFluid = new Fluid(canvasRef.current, {
      color: '#ff4444'
    });
    myFluid.setFill(60);
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
```

## Configuration

You can tune the liquid to feel like Water, Oil, or Jelly.

| Option | Default | Description |
| :--- | :--- | :--- |
| `color` | `#3b82f6` | The hex color of the liquid. |
| `tension` | `0.01` | Surface stiffness. Lower = more waves. |
| `dampening` | `0.02` | Friction. Lower = waves last longer. |
| `spread` | `0.25` | How fast ripples travel across the surface. |
| `inertia` | `0.96` | Momentum conservation. Higher = more slosh. |
| `wallClimb` | `2.5` | How high fluid climbs walls during rotation. |

### Presets
If you don't want to tune physics manually, copy these values:

**Water (Default)**
```javascript
{ tension: 0.01, dampening: 0.02, inertia: 0.96 }
```

**Oil / Honey**
```javascript
{ tension: 0.03, dampening: 0.1, inertia: 0.90 }
```

**Slime / Jelly**
```javascript
{ tension: 0.08, dampening: 0.05, inertia: 0.80 }
```

## Mobile Permissions (iOS)

On iOS 13+, you must request permission to access the Gyroscope. The browser **will not** let you access sensors automatically. You must trigger this from a button click (e.g., "Enable Gravity").

```javascript
// Run this inside a button click handler
if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
    .then(response => {
        if (response === 'granted') {
            // Sensors are now active, fluid.js will auto-detect them
        }
    })
    .catch(console.error);
}
```

## License

MIT

> **{ github.com/mgks }**
> 
> <a href="https://mgks.dev"><img src="https://img.shields.io/badge/Visit-mgks.dev-blue?style=flat&link=https%3A%2F%2Fmgks.dev"></a> <a href="https://github.com/sponsors/mgks"><img src="https://img.shields.io/badge/%20%20Become%20a%20Sponsor%20%20-red?style=flat&logo=github&link=https%3A%2F%2Fgithub.com%2Fsponsors%2Fmgks"></a>
