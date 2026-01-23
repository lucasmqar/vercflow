'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const CyberneticGridShaderInternal = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    // Color configurations for Light and Dark modes
    // Minimalist, low contrast colors as requested
    const gridColors = {
        light: {
            base: new THREE.Vector3(0.8, 0.8, 0.8),    // Very light grey
            pulse: new THREE.Vector3(0.6, 0.6, 0.7)    // Slightly darker grey/blueish
        },
        dark: {
            base: new THREE.Vector3(0.15, 0.15, 0.2), // Dark grey
            pulse: new THREE.Vector3(0.25, 0.25, 0.3) // Slightly lighter dark grey
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 1) Renderer, Scene, Camera, Clock
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const clock = new THREE.Clock();

        // 2) GLSL Shaders
        const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform vec3 uGridColor;
      uniform vec3 uPulseColor;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))
                     * 43758.5453123);
      }

      void main() {
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;

        float t         = iTime * 0.15; // Slowed down
        float mouseDist = length(uv - mouse);

        // warp effect around mouse
        float warp = sin(mouseDist * 10.0 - t * 2.0) * 0.02; // Reduced warp intensity
        warp *= smoothstep(0.4, 0.0, mouseDist);
        uv += warp;

        // grid lines
        vec2 gridUv = abs(fract(uv * 12.0) - 0.5);
        float line  = pow(1.0 - min(gridUv.x, gridUv.y), 60.0); // Sharper, thinner lines

        // base grid color
        vec3 color = uGridColor * line * (0.8 + sin(t * 1.5) * 0.1);

        // subtle pulses along grid
        float energy = sin(uv.x * 15.0 + t * 3.0) 
                     * sin(uv.y * 15.0 + t * 2.0);
        energy = smoothstep(0.7, 1.0, energy);
        
        color += uPulseColor * energy * line * 0.5; // Reduced pulse intensity

        // very subtle noise
        color += random(uv + t * 0.05) * 0.015;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

        const currentColors = theme === 'dark' ? gridColors.dark : gridColors.light;

        // 3) Uniforms, Material, Mesh
        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2() },
            iMouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
            uGridColor: { value: currentColors.base },
            uPulseColor: { value: currentColors.pulse }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 4) Resize handler
        const onResize = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            uniforms.iResolution.value.set(width, height);
        };
        window.addEventListener('resize', onResize);
        onResize();

        // 5) Mouse handler
        const onMouseMove = (e: MouseEvent) => {
            uniforms.iMouse.value.set(
                e.clientX,
                container ? container.clientHeight - e.clientY : 0
            );
        };
        window.addEventListener('mousemove', onMouseMove);

        // 6) Animation loop
        renderer.setAnimationLoop(() => {
            uniforms.iTime.value = clock.getElapsedTime();

            // Update colors dynamically if needed (less performant, but safe for React theme switch)
            // For better performance, we'd use a ref to track current theme and update uniforms only on change.
            // But given React's render cycle, updating uniforms here is tricky without props.
            // We will rely on React useEffect re-triggering this effect on theme change for simplicity, 
            // but that tears down the canvas. Ideally we update uniforms.

            renderer.render(scene, camera);
        });

        // 7) Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            renderer.setAnimationLoop(null);
            if (container && renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            material.dispose();
            geometry.dispose();
            renderer.dispose();
        };
    }, [theme]); // Re-run on theme change to pick up new colors

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            aria-hidden="true"
        />
    );
};

interface ConstructionLoaderProps {
    onComplete?: () => void;
}

export function CyberneticLoader({ onComplete }: ConstructionLoaderProps) {
    // Auto-complete after some time or just serve as background?
    // User requested "retire a animação de entrada INICIAL ATUAL... use ESTA".
    // So this replaces the loading screen.

    useEffect(() => {
        if (onComplete) {
            const timer = setTimeout(() => {
                onComplete();
            }, 3500); // 3.5s duration
            return () => clearTimeout(timer);
        }
    }, [onComplete]);

    return (
        <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-background">
            <CyberneticGridShaderInternal />

            <div className="z-10 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground/80">
                        VERC INTELLIGENCE
                    </h1>
                    <p className="text-xs md:text-sm font-bold tracking-[0.5em] text-muted-foreground uppercase mt-4">
                        Initializing Neural Core
                    </p>
                </motion.div>

                <motion.div
                    className="w-24 h-1 bg-muted-foreground/20 rounded-full mx-auto overflow-hidden mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    />
                </motion.div>
            </div>
        </div>
    );
}

export default CyberneticLoader;
