'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { WorldGlobeProps, DataPoint } from './WorldGlobe';

// Dynamically import to keep it client-only and avoid SSR WebGL issues
const WorldGlobe = dynamic<React.ComponentType<WorldGlobeProps>>(
  () => import('./WorldGlobe'),
  {
    ssr: false,
    loading: () => (
      <div className="w-40 h-40 rounded-full border border-slate-200 dark:border-slate-700 animate-pulse" />
    ),
  }
);

export interface GlobeLoaderProps {
  size?: number;
  subtitle?: string;
  data?: DataPoint[];
  cycleMs?: number;
  autoRotate?: boolean;
}

const mockData: DataPoint[] = [
  { lat: 37.7749, lng: -122.4194, name: 'SF', status: 'active' },
  { lat: 40.7128, lng: -74.006, name: 'NYC', status: 'active' },
  { lat: 51.5074, lng: -0.1278, name: 'London', status: 'idle' },
  { lat: 28.6139, lng: 77.209, name: 'Delhi', status: 'active' },
];

export default function GlobeLoader({
  size = 480,
  subtitle = 'Loading…',
  data = mockData,
  cycleMs = 1500,
  autoRotate = true,
}: GlobeLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[400px]">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size, maxWidth: '90vw', maxHeight: '70vh' }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-blue-400/20 blur-[60px] opacity-60" />
        <WorldGlobe
          data={data}
          cycleMs={cycleMs}
          autoRotate={autoRotate}
          className="w-full h-full"
        />
      </div>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-white font-medium animate-pulse">
          {subtitle}
        </p>
      )}
    </div>
  );
}

