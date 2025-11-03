'use client';

import React, { useEffect, useRef, useState } from 'react';
// @ts-expect-error react-globe.gl ships without full TS types; we cast to any below.
import Globe from 'react-globe.gl';

export type DataPoint = {
  lat: number;
  lng: number;
  name?: string;
  status?: 'active' | 'idle' | 'error' | string;
};

export interface WorldGlobeProps {
  data?: DataPoint[];
  cycleMs?: number;
  className?: string;
  autoRotate?: boolean;
}

type GlobeInstance = any; // react-globe.gl lacks types; we safely narrow at call sites

// Custom hook for dynamic square sizing
function useSquareSize(containerRef: React.RefObject<HTMLElement>, pad = 0) {
  const [size, setSize] = useState<number>(480);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      const s = Math.floor(Math.min(rect.width, rect.height) - pad);
      setSize(Math.max(200, s)); // clamp minimum size
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, pad]);

  return size;
}

export default function WorldGlobe({
  data,
  cycleMs = 1500,
  className = '',
  autoRotate = true,
}: WorldGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeInstance>(null);
  const size = useSquareSize(containerRef, 0);

  // autoresize globe canvas
  useEffect(() => {
    if (!globeRef.current) return;
    try {
      globeRef.current.width?.(size);
      globeRef.current.height?.(size);
    } catch {
      // ignore if not mounted yet
    }
  }, [size]);

  // autorotate camera and configure scroll-to-rotate
  useEffect(() => {
    if (!globeRef.current || !containerRef.current) return;
    const controls = globeRef.current.controls?.();
    if (!controls) return;
    
    // Configure auto-rotate
    controls.autoRotate = !!autoRotate;
    controls.autoRotateSpeed = 0.6;
    
    // Disable zoom on scroll
    controls.enableZoom = false;
    
    // Add scroll-to-rotate functionality
    const container = containerRef.current;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      try {
        // Convert scroll delta to rotation
        // Negative deltaY (scrolling up) rotates left, positive (scrolling down) rotates right
        const rotationSpeed = 0.003; // Adjust sensitivity as needed
        const rotationDelta = -event.deltaY * rotationSpeed;
        
        // Primary Method: Spherical Coordinates (Most Reliable)
        if (controls.spherical && typeof controls.spherical.theta === 'number') {
          controls.spherical.theta += rotationDelta;
          controls.update();
          return;
        }
        
        // Fallback Method 1: Camera Rotation via controls.object
        const camera = controls.object;
        if (camera && typeof camera.rotateY === 'function') {
          camera.rotateY(rotationDelta);
          controls.update();
          return;
        }
        
        // Fallback Method 2: Camera via globe instance
        const globeCamera = globeRef.current?.camera?.();
        if (globeCamera && typeof globeCamera.rotateY === 'function') {
          globeCamera.rotateY(rotationDelta);
          controls.update();
          return;
        }
        
        // Fallback Method 3: rotateLeft if available
        if (typeof controls.rotateLeft === 'function') {
          controls.rotateLeft(rotationDelta);
          controls.update();
          return;
        }
      } catch (error) {
        // Silently fail in production, log in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Globe rotation error:', error);
        }
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [autoRotate]);

  // Cast Globe to any to satisfy TS (package lacks types)
  const GlobeComp = Globe as unknown as React.ComponentType<any>;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <GlobeComp
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showGraticules={true}
      />
    </div>
  );
}

