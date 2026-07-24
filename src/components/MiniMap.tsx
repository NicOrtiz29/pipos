'use client';

import React, { useEffect, useRef } from 'react';
import { SkiResort, WeatherData } from '@/services/dataService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MiniMapProps {
  resort: SkiResort;
  weather: WeatherData;
}

export default function MiniMap({ resort, weather }: MiniMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    // Crear mapa centrado en el cerro
    const map = L.map('mini-map-viewport-detail', {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false
    }).setView([resort.latitude, resort.longitude], 10);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(map);

    const isAr = resort.country === 'Argentina';
    const color = isAr ? '#00E5FF' : '#00FF9D';

    // Icono
    const pinIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <span class="relative flex h-3.5 w-3.5 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: ${color}"></span>
          <span class="relative inline-flex rounded-full h-2 w-2" style="background-color: ${color}"></span>
        </span>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const marker = L.marker([resort.latitude, resort.longitude], { icon: pinIcon }).addTo(map);

    marker.bindTooltip(`${resort.name.toUpperCase()} [${Math.round(weather.snow_depth_top_cm)}cm]`, {
      permanent: true,
      direction: 'top',
      offset: [0, -6],
      className: isAr ? 'custom-map-tooltip-ar' : 'custom-map-tooltip-cl'
    });

    marker.bindPopup(`
      <div class="p-2 bg-[#1C2024] text-slate-100 text-xs font-sans rounded space-y-1">
        <p class="font-bold border-b border-[#2E3A44] pb-0.5 text-slate-200">${resort.name}</p>
        <p class="text-[#00FF9D] font-bold text-[10px]">Nieve Cumbre: ${Math.round(weather.snow_depth_top_cm)} cm</p>
        <p class="text-[#00E5FF] font-bold text-[10px]">Temp Cumbre: ${weather.temp_top_c} °C</p>
        <p class="text-slate-300 text-[10px]">Viento: ${weather.wind_speed_kmh} km/h</p>
      </div>
    `).openPopup();

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [resort, weather]);

  return (
    <div className="w-full h-[220px] rounded overflow-hidden border border-[#2E3A44]" id="mini-map-viewport-detail" />
  );
}
