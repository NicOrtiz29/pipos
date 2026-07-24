'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Mountain, Thermometer, Wind } from 'lucide-react';
import { SkiResort, WeatherData } from '@/services/dataService';

interface HeroRankingProps {
  resortsData: { resort: SkiResort; weather: WeatherData }[];
}

export default function HeroRanking({ resortsData }: HeroRankingProps) {
  // Ordenar por nieve caída en las últimas 24h descendente y tomar los top 3
  const topPowder = [...resortsData]
    .sort((a, b) => b.weather.snowfall_24h_cm - a.weather.snowfall_24h_cm)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#00FF9D]" /> Best Powder Right Now
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Clasificación de nieve fresca en tiempo real medida por sensores de altura.
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0 bg-[#1E252B] border border-[#2E3A44] px-3.5 py-1.5 rounded-md">
          <span className="text-[9px] text-[#00E5FF] font-black uppercase tracking-wider block">
            Modelo de Cotejo
          </span>
          <span className="text-xs text-slate-200 font-mono font-bold">
            ECMWF / GFS seamless
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topPowder.map(({ resort, weather }, index) => {
          const isZero = weather.snowfall_24h_cm === 0;
          return (
            <Link
              key={resort.id}
              href={`/resort/${resort.slug}`}
              className="group relative overflow-hidden rounded-lg border border-[#2E3A44] bg-[#1C2024] hover:border-[#00E5FF] transition-all duration-300 flex flex-col h-[260px] shadow-md cursor-pointer"
            >
              {/* Imagen de fondo con filtro oscuro */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={resort.image_url}
                  alt={resort.name}
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 opacity-35 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101418] via-[#101418]/65 to-transparent z-10" />
              </div>

              {/* Contenido */}
              <div className="relative z-20 p-5 flex flex-col h-full justify-between">
                
                {/* Header card: Ranking y Nombre */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center gap-1 bg-[#00FF9D]/15 text-[#00FF9D] font-mono text-[9px] font-black px-2 py-0.5 rounded border border-[#00FF9D]/30 uppercase tracking-widest">
                      🔥 Top {index + 1} Powder
                    </span>
                    <h3 className="text-lg font-black text-slate-100 mt-1.5 group-hover:text-[#00E5FF] transition-colors">
                      {resort.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {resort.region}, {resort.country === 'Argentina' ? '🇦🇷 AR' : '🇨🇱 CL'}
                    </p>
                  </div>
                  <span className="text-slate-400 text-xs bg-[#1E252B]/80 border border-[#2E3A44] px-2 py-1 rounded font-bold">
                    Cota Base: {resort.elevation_base_m}m
                  </span>
                </div>

                {/* Métricas de Nieve */}
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-5xl font-black text-[#00E5FF] text-glow leading-none font-sans">
                      {isZero ? '0' : `+${Math.round(weather.snowfall_24h_cm)}`}
                      <span className="text-lg font-bold text-slate-300 ml-1">cm</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-1">
                      Nieve Fresca 24h
                    </span>
                  </div>

                  <div className="text-right space-y-1.5">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300">
                      <Mountain className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold font-mono">
                        Base: {weather.snow_depth_base_cm} cm
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300">
                      <Thermometer className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span className="font-bold font-mono">
                        Cumbre: {weather.temp_top_c}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estado y Medios */}
                <div className="pt-3 border-t border-[#2E3A44]/55 flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    weather.lift_status === 'Abierto'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : weather.lift_status === 'Parcial'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    Medios: {weather.lift_status}
                  </span>

                  <span className="text-[9px] text-[#00FF9D] font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                    Ver Reporte Completo &rarr;
                  </span>
                </div>

              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
