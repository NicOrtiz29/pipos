'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Snowflake, Wind, Thermometer, MapPin, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { SKI_RESORTS, SkiResort, WeatherData } from '@/services/dataService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  selectedCountry: 'Argentina' | 'Chile' | 'ALL';
  setSelectedCountry: (c: 'Argentina' | 'Chile' | 'ALL') => void;
  heightClass?: string;
}

export default function InteractiveMap({
  selectedCountry,
  setSelectedCountry,
  heightClass = 'h-[calc(100vh-64px)]'
}: InteractiveMapProps) {
  const [resortsData, setResortsData] = useState<{ resort: SkiResort; weather: WeatherData }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState<'snow' | 'wind' | 'temp'>('snow');
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Cargar datos
  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        setResortsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Inicializar Leaflet Map una sola vez
  useEffect(() => {
    if (mapRef.current) return;

    // Crear mapa
    const map = L.map('map-viewport', {
      zoomControl: false,
      attributionControl: false
    }).setView([-38.5, -71.2], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambian los filtros, los datos o la capa activa
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current || resortsData.length === 0) return;

    // Limpiar marcadores anteriores
    markersGroupRef.current.clearLayers();

    // Filtrar centros
    const filtered = resortsData.filter(({ resort }) => {
      if (selectedCountry !== 'ALL' && resort.country !== selectedCountry) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          resort.name.toLowerCase().includes(query) ||
          resort.region.toLowerCase().includes(query)
        );
      }
      return true;
    });

    // Dibujar nuevos marcadores
    filtered.forEach(({ resort, weather }) => {
      // Determinar valor e icono según la capa activa
      let valText = '';
      if (activeLayer === 'snow') {
        valText = `${Math.round(weather.snow_depth_top_cm)}cm`;
      } else if (activeLayer === 'wind') {
        valText = `${weather.wind_speed_kmh}km/h`;
      } else {
        valText = `${weather.temp_top_c}°C`;
      }

      const isAr = resort.country === 'Argentina';
      const color = isAr ? '#00E5FF' : '#00FF9D';
      
      // Icono de punto brillante
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

      // Crear marcador
      const marker = L.marker([resort.latitude, resort.longitude], { icon: pinIcon });

      // Añadir etiqueta fija
      marker.bindTooltip(`${resort.name.toUpperCase()} [${valText}]`, {
        permanent: true,
        direction: 'top',
        offset: [0, -6],
        className: isAr ? 'custom-map-tooltip-ar' : 'custom-map-tooltip-cl'
      });

      // Popup
      marker.bindPopup(`
        <div class="p-2 bg-[#1C2024] text-slate-100 text-xs font-sans rounded space-y-1">
          <p class="font-bold border-b border-[#2E3A44] pb-1 text-slate-200">${resort.name}</p>
          <p class="text-[10px] text-slate-400">${resort.region}</p>
          <p class="text-[#00FF9D] font-bold">Nieve Base: ${weather.snow_depth_base_cm} cm</p>
          <p class="text-[#00E5FF] font-bold">Temp Cumbre: ${weather.temp_top_c} °C</p>
          <a href="/resort/${resort.slug}" class="block text-center bg-[#2E3A44] text-[#00E5FF] font-bold py-1 rounded mt-2 uppercase text-[9px] hover:bg-[#00E5FF] hover:text-[#101418] transition-all">Ver Reporte</a>
        </div>
      `);

      markersGroupRef.current?.addLayer(marker);
    });

  }, [resortsData, selectedCountry, searchQuery, activeLayer]);

  const handleZoom = (type: 'in' | 'out') => {
    if (!mapRef.current) return;
    if (type === 'in') {
      mapRef.current.zoomIn();
    } else {
      mapRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    mapRef.current?.setView([-38.5, -71.2], 5);
  };

  const handleZoomTo = (lat: number, lon: number) => {
    mapRef.current?.flyTo([lat, lon], 9);
  };

  // Filtrar para el panel izquierdo
  const sidebarResorts = resortsData.filter(({ resort }) => {
    if (selectedCountry !== 'ALL' && resort.country !== selectedCountry) return false;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        resort.name.toLowerCase().includes(query) ||
        resort.region.toLowerCase().includes(query)
      );
    }
    return true;
  }).sort((a, b) => {
    // Clasificar por espesor de nieve (capa activa)
    return b.weather.snow_depth_top_cm - a.weather.snow_depth_top_cm;
  });

  return (
    <div className={`flex flex-col lg:flex-row w-full overflow-hidden bg-[#101418] ${heightClass}`}>
      
      {/* Sidebar Izquierda */}
      <aside className="w-full lg:w-80 bg-[#1E252B] border-b lg:border-b-0 lg:border-r border-[#2E3A44] flex flex-col h-[280px] lg:h-full shrink-0">
        
        {/* Header Panel */}
        <div className="p-4 border-b border-[#2E3A44] space-y-3">
          <div>
            <h2 className="text-xs font-black text-[#00E5FF] uppercase tracking-wider">
              Snow Tracker
            </h2>
            <h3 className="text-sm font-black text-slate-100 uppercase mt-0.5">
              Mapa de Nevadas
            </h3>
          </div>

          {/* Lupa / Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cerro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12161A] border border-[#2E3A44] text-xs py-2 pl-9 pr-4 rounded text-slate-200 placeholder-slate-500 focus:border-[#00E5FF] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Lista de Centros */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
            Centros en Mapa ({sidebarResorts.length})
          </span>

          {loading ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-12 bg-[#12161A] rounded animate-pulse border border-[#2E3A44]" />
              ))}
            </div>
          ) : sidebarResorts.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic py-4">No se encontraron centros.</p>
          ) : (
            <div className="space-y-1.5">
              {sidebarResorts.map(({ resort, weather }) => {
                const isAr = resort.country === 'Argentina';
                return (
                  <div
                    key={resort.id}
                    onClick={() => handleZoomTo(resort.latitude, resort.longitude)}
                    className="flex items-center justify-between p-2.5 rounded bg-[#12161A]/50 border border-[#2E3A44]/65 hover:border-[#00E5FF] transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{isAr ? '🇦🇷' : '🇨🇱'}</span>
                        <p className="text-xs font-bold text-slate-200 group-hover:text-[#00E5FF] transition-colors">
                          {resort.name}
                        </p>
                      </div>
                      <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                        {resort.region}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        activeLayer === 'snow'
                          ? 'bg-[#00FF9D]/10 text-[#00FF9D]'
                          : activeLayer === 'wind'
                          ? 'bg-[#00E5FF]/10 text-[#00E5FF]'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {activeLayer === 'snow'
                          ? `${Math.round(weather.snow_depth_top_cm)}cm`
                          : activeLayer === 'wind'
                          ? `${weather.wind_speed_kmh}km/h`
                          : `${weather.temp_top_c}°C`}
                      </span>
                      <span className="text-[9px] text-[#00E5FF] hover:text-slate-100 font-bold block mt-1 transition-colors flex items-center justify-end gap-0.5">
                        <MapPin className="w-2.5 h-2.5" /> IR
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map Layers (Pie de Sidebar) */}
        <div className="p-4 border-t border-[#2E3A44] bg-[#12161A]/70 space-y-2">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
            Capas del Mapa
          </span>
          <div className="flex rounded border border-[#2E3A44] overflow-hidden p-0.5 bg-[#12161A]">
            <button
              onClick={() => setActiveLayer('snow')}
              className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded transition-all ${
                activeLayer === 'snow'
                  ? 'bg-[#00E5FF] text-[#101418] shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nieve
            </button>
            <button
              onClick={() => setActiveLayer('wind')}
              className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded transition-all ${
                activeLayer === 'wind'
                  ? 'bg-[#00E5FF] text-[#101418] shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Viento
            </button>
            <button
              onClick={() => setActiveLayer('temp')}
              className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded transition-all ${
                activeLayer === 'temp'
                  ? 'bg-[#00E5FF] text-[#101418] shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Temp
            </button>
          </div>
        </div>

      </aside>

      {/* Map Viewport Area */}
      <div className="flex-1 relative bg-[#101418] h-full w-full">
        
        {/* Contenedor del Mapa Leaflet */}
        <div id="map-viewport" className="w-full h-full" />

        {/* Legend Overlay (Top Right or Bottom Center) */}
        <div className="absolute bottom-4 left-4 z-30 bg-[#12161A]/90 border border-[#2E3A44] px-4 py-2.5 rounded-lg flex flex-col md:flex-row gap-4 items-center backdrop-blur-md">
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00E5FF]" /> Argentina Resorts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00FF9D]" /> Chile Resorts
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1.5 md:pt-0 border-t md:border-t-0 md:border-l border-[#2E3A44] md:pl-4">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black shrink-0">
              {activeLayer === 'snow' ? 'Espesor:' : activeLayer === 'wind' ? 'Viento:' : 'Temp:'}
            </span>
            <div className="w-24 h-2 rounded bg-gradient-to-r from-slate-800 via-[#00E5FF]/40 to-[#00E5FF] border border-[#2E3A44]" />
            <span className="text-[10px] text-slate-400 font-mono">
              {activeLayer === 'snow' ? '0 - 300cm' : activeLayer === 'wind' ? '0 - 80kmh' : '-10 - 15°C'}
            </span>
          </div>
        </div>

        {/* Map Control Buttons (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5">
          <button
            onClick={() => handleZoom('in')}
            className="p-2.5 bg-[#1E252B]/95 hover:bg-[#2E3A44] text-[#00E5FF] border border-[#2E3A44] rounded-md backdrop-blur shadow-lg transition-all active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2.5 bg-[#1E252B]/95 hover:bg-[#2E3A44] text-[#00E5FF] border border-[#2E3A44] rounded-md backdrop-blur shadow-lg transition-all active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2.5 bg-[#1E252B]/95 hover:bg-[#2E3A44] text-[#00E5FF] border border-[#2E3A44] rounded-md backdrop-blur shadow-lg transition-all active:scale-95"
            title="Centrar Vista"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
