'use client';

import React, { useState } from 'react';
import { Map, Layers, Snowflake, Wind, Thermometer, MapPin } from 'lucide-react';
import { SKI_RESORTS, SkiResort } from '@/services/dataService';

export default function WindyMap() {
  const [overlay, setOverlay] = useState<'snow' | 'wind' | 'temp'>('snow');
  const [mapCenter, setMapCenter] = useState({ lat: -38.5, lon: -71.2, zoom: 5 });

  const handleZoomToResort = (resort: SkiResort) => {
    setMapCenter({
      lat: resort.latitude,
      lon: resort.longitude,
      zoom: 8
    });
  };

  const iframeUrl = `https://embed.windy.com/embed2.html?lat=${mapCenter.lat}&lon=${mapCenter.lon}&zoom=${mapCenter.zoom}&level=surface&overlay=${overlay}&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C`;

  return (
    <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg overflow-hidden flex flex-col lg:flex-row h-[550px] shadow-lg">
      
      {/* Barra lateral de control rápido */}
      <div className="w-full lg:w-64 bg-[#12161A] p-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#2E3A44] overflow-y-auto shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00E5FF]">
            <Map className="w-4 h-4" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider">Radar de Nevadas</h3>
          </div>
          
          {/* Selector de capas */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Capas del Mapa
            </span>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-1">
              <button
                onClick={() => setOverlay('snow')}
                className={`flex items-center justify-center lg:justify-start gap-2 px-3 py-2 text-xs font-bold rounded transition-all ${
                  overlay === 'snow'
                    ? 'bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30'
                    : 'bg-[#1E252B] text-slate-400 border border-transparent hover:border-[#2E3A44]'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>Nieve</span>
              </button>
              <button
                onClick={() => setOverlay('wind')}
                className={`flex items-center justify-center lg:justify-start gap-2 px-3 py-2 text-xs font-bold rounded transition-all ${
                  overlay === 'wind'
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'bg-[#1E252B] text-slate-400 border border-transparent hover:border-[#2E3A44]'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Viento</span>
              </button>
              <button
                onClick={() => setOverlay('temp')}
                className={`flex items-center justify-center lg:justify-start gap-2 px-3 py-2 text-xs font-bold rounded transition-all ${
                  overlay === 'temp'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-[#1E252B] text-slate-400 border border-transparent hover:border-[#2E3A44]'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>Temp</span>
              </button>
            </div>
          </div>

          {/* Buscador de ubicación rápido */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Enfocar en Cerro
            </span>
            <div className="space-y-1 max-h-[220px] lg:max-h-none overflow-y-auto">
              {SKI_RESORTS.map((resort) => (
                <button
                  key={resort.id}
                  onClick={() => handleZoomToResort(resort)}
                  className="w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded text-[11px] font-semibold bg-[#1E252B]/40 hover:bg-[#1E252B] text-slate-300 border border-transparent hover:border-[#2E3A44]/65 transition-all"
                >
                  <span className="truncate">{resort.name}</span>
                  <span className="text-[9px] text-[#00E5FF] font-mono flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 shrink-0" /> IR
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="hidden lg:block pt-4 border-t border-[#2E3A44]/50">
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            Mapa provisto por Windy. Capa WebGL de alta precisión para nieve acumulada en tiempo real.
          </p>
        </div>

      </div>

      {/* Contenedor del Iframe de Windy */}
      <div className="flex-1 relative bg-[#101418]">
        <iframe
          src={iframeUrl}
          className="w-full h-full border-0 absolute inset-0"
          allowFullScreen
          title="Windy Weather Map Widget"
        />
      </div>

    </div>
  );
}
