'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Snowflake, Mountain, Thermometer, Wind, Navigation, 
  Heart, Calendar, Eye, MapPin, ChevronRight, Activity
} from 'lucide-react';
import { SkiResort, WeatherData, getWeatherIcon, getWindDirectionLabel } from '@/services/dataService';

interface ResortCardProps {
  resort: SkiResort;
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

type TabType = 'metrics' | 'forecast' | 'webcam' | 'access';

export default function ResortCard({
  resort,
  weather,
  isFavorite,
  onToggleFavorite
}: ResortCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    if (!weather.last_updated) {
      setLocalTime('');
      return;
    }
    
    if (weather.last_updated.includes('T') || !isNaN(Date.parse(weather.last_updated))) {
      try {
        const date = new Date(weather.last_updated);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const parts = date.toLocaleDateString('es-AR', { timeZoneName: 'short' }).split(' ');
        const tzName = parts[parts.length - 1] || '';
        setLocalTime(`${timeStr} ${tzName}`);
      } catch (e) {
        setLocalTime(weather.last_updated);
      }
    } else {
      setLocalTime(weather.last_updated);
    }
  }, [weather.last_updated]);

  const [nextSnowfallText, setNextSnowfallText] = useState('Cargando...');

  useEffect(() => {
    if (weather.is_snowing_now) {
      setNextSnowfallText('❄️ Nevando Ahora');
      return;
    }
    
    if (!weather.next_snowfall_time) {
      setNextSnowfallText('Sin nieve prevista (7d)');
      return;
    }

    try {
      const date = new Date(weather.next_snowfall_time);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();

      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (isToday) {
        setNextSnowfallText(`Hoy a las ${timeStr}`);
      } else if (isTomorrow) {
        setNextSnowfallText(`Mañana a las ${timeStr}`);
      } else {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
        let formatted = date.toLocaleDateString('es-AR', options);
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        setNextSnowfallText(formatted);
      }
    } catch (e) {
      setNextSnowfallText('Sin nieve prevista');
    }
  }, [weather.next_snowfall_time, weather.is_snowing_now]);

  // Mapear calidad de nieve a clases de colores
  const getQualityColor = (quality: WeatherData['snow_quality']) => {
    switch (quality) {
      case 'Polvo':
        return 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30';
      case 'Polvo/Dura':
        return 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30';
      case 'Húmeda/Sopa':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'Costra/Hielo':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
    }
  };

  // Determinar peligro de viento (cierre de medios)
  const isWindDangerous = weather.wind_speed_kmh > 45;

  return (
    <div className="group bg-[#1C2024] border border-[#2E3A44] hover:border-[#00E5FF] rounded-lg overflow-hidden flex flex-col h-[485px] transition-all duration-300 shadow-lg">
      
      {/* 1. Header Card - Banner & Overlay */}
      <div className="relative h-36 shrink-0 overflow-hidden">
        <img 
          src={resort.image_url} 
          alt={resort.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2024] via-[#1C2024]/45 to-transparent" />
        
        {/* Favorito & Bandera */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="flex items-center gap-1.5 bg-[#101418]/85 border border-[#2E3A44] px-2.5 py-1 rounded-full text-xs font-bold text-slate-200 backdrop-blur-md">
            <span>{resort.country === 'Argentina' ? '🇦🇷' : '🇨🇱'}</span>
            <span className="font-semibold">{resort.region}</span>
          </span>
          <button
            onClick={() => onToggleFavorite(resort.id)}
            className="p-1.5 rounded-full bg-[#101418]/85 border border-[#2E3A44] text-slate-400 hover:text-[#00FF9D] hover:border-[#00FF9D] transition-all duration-200 active:scale-90 backdrop-blur-md"
          >
            <Heart 
              className={`w-4 h-4 transition-all ${
                isFavorite ? 'fill-[#00FF9D] text-[#00FF9D] scale-110' : ''
              }`} 
            />
          </button>
        </div>

        {/* Nombre del Cerro */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <h3 className="text-lg font-black text-slate-100 group-hover:text-[#00E5FF] transition-colors leading-tight">
            {resort.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getQualityColor(weather.snow_quality)}`}>
              Nieve {weather.snow_quality}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
              weather.lift_status === 'Abierto'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : weather.lift_status === 'Parcial'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              Medios: {weather.lift_status}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Tabs de Selección Internas */}
      <div className="flex border-b border-[#2E3A44] bg-[#12161A]">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeTab === 'metrics'
              ? 'text-[#00E5FF] border-[#00E5FF] bg-[#1C2024]'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1E252B]/40'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Clima</span>
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeTab === 'forecast'
              ? 'text-[#00E5FF] border-[#00E5FF] bg-[#1C2024]'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1E252B]/40'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Pronóstico</span>
        </button>
        <button
          onClick={() => setActiveTab('webcam')}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeTab === 'webcam'
              ? 'text-[#00E5FF] border-[#00E5FF] bg-[#1C2024]'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1E252B]/40'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Cámara</span>
        </button>
        <button
          onClick={() => setActiveTab('access')}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeTab === 'access'
              ? 'text-[#00E5FF] border-[#00E5FF] bg-[#1C2024]'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1E252B]/40'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Acceso</span>
        </button>
      </div>

      {/* 3. Contenedor de Contenido Variable */}
      <div className="flex-1 p-4 overflow-hidden bg-[#1C2024] flex flex-col justify-between">
        
        {/* Vista Clima / Métricas */}
        {activeTab === 'metrics' && (
          <div className="flex flex-col gap-3 h-full justify-center">
            <div className="grid grid-cols-2 gap-3.5">
              {/* Nieve fresca */}
              <div className="bg-[#12161A] border border-[#2E3A44] p-3 rounded flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Nieve Fresca 24h
                </span>
                <span className="text-2xl font-black text-[#00FF9D] text-glow-green leading-none mt-2">
                  {weather.snowfall_24h_cm > 0 ? `+${weather.snowfall_24h_cm}` : '0'} <span className="text-xs">cm</span>
                </span>
                <span className="text-[9px] text-slate-500 font-semibold mt-1">
                  48h: {Math.round(weather.snowfall_48h_cm)} cm
                </span>
              </div>

              {/* Espesores Base/Top */}
              <div className="bg-[#12161A] border border-[#2E3A44] p-3 rounded flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Espesor Acumulado
                </span>
                <span className="text-lg font-black text-slate-200 leading-none mt-2">
                  {weather.snow_depth_base_cm} / {Math.round(weather.snow_depth_top_cm)} <span className="text-xs">cm</span>
                </span>
                <span className="text-[9px] text-slate-500 font-semibold mt-1">
                  Base / Cumbre
                </span>
              </div>

              {/* Isotermia 0°C */}
              <div className="bg-[#12161A] border border-[#2E3A44] p-3 rounded flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Isotermia 0°C
                </span>
                <span className="text-lg font-black text-slate-200 mt-2">
                  {weather.freezing_level_m} <span className="text-xs text-slate-400">msnm</span>
                </span>
                <span className={`text-[8px] font-bold mt-1 ${
                  weather.freezing_level_m > resort.elevation_top_m 
                    ? 'text-rose-400' 
                    : weather.freezing_level_m < resort.elevation_base_m 
                    ? 'text-[#00FF9D]' 
                    : 'text-amber-400'
                }`}>
                  {weather.freezing_level_m > resort.elevation_top_m 
                    ? '⚠️ Lluvia en Cumbre' 
                    : weather.freezing_level_m < resort.elevation_base_m 
                    ? '❄️ Nieve en Base' 
                    : '🏔️ Lluvia en Base / Nieve arriba'}
                </span>
              </div>

              {/* Viento y Dirección */}
              <div className={`bg-[#12161A] border p-3 rounded flex flex-col justify-between transition-colors ${
                isWindDangerous ? 'border-rose-500/30 bg-rose-950/5' : 'border-[#2E3A44]'
              }`}>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Viento en Altura
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <Navigation 
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isWindDangerous ? 'text-rose-400' : 'text-[#00E5FF]'
                    }`} 
                    style={{ transform: `rotate(${weather.wind_direction_deg}deg)` }}
                  />
                  <span className="text-base font-black text-slate-200">
                    {weather.wind_speed_kmh} <span className="text-[10px] font-medium text-slate-400">km/h</span>
                  </span>
                </div>
                <span className={`text-[8px] font-bold mt-1 ${
                  isWindDangerous ? 'text-rose-400' : 'text-slate-500'
                }`}>
                  Dirección: {getWindDirectionLabel(weather.wind_direction_deg)} {isWindDangerous ? '(Rachas fuertes)' : ''}
                </span>
              </div>
            </div>

            {/* Banner de Inicio de Nevada Seamless */}
            <div className="bg-[#12161A] border border-[#2E3A44]/75 px-3 py-2 rounded flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF9D]"></span>
                </span>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                  Inicio Nevada (ECMWF/GFS)
                </span>
              </div>
              <span className="text-[10px] font-black text-[#00E5FF] uppercase">
                {nextSnowfallText}
              </span>
            </div>
          </div>
        )}

        {/* Vista Pronóstico 5 días */}
        {activeTab === 'forecast' && (
          <div className="space-y-1.5 my-auto">
            {weather.forecast_5days.map((day, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between bg-[#12161A] border border-[#2E3A44] px-3 py-1.5 rounded"
              >
                <span className="text-xs text-slate-300 font-bold w-16">{day.date}</span>
                <span className="text-base" title="Código de clima">{getWeatherIcon(day.weather_code)}</span>
                <span className="text-xs font-black text-[#00FF9D] w-12 text-right">
                  {day.snowfall_sum_cm > 0 ? `+${Math.round(day.snowfall_sum_cm)} cm` : '-'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono w-16 text-right">
                  {day.temp_max}° / {day.temp_min}°
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Vista Webcam */}
        {activeTab === 'webcam' && (
          <div className="relative flex-1 rounded overflow-hidden border border-[#2E3A44] bg-[#12161A] flex flex-col justify-center items-center group/webcam h-full w-full">
            <img 
              src={resort.webcam_url} 
              onError={(e) => {
                // Fallback a la imagen del cerro de la base de datos si hay CORS o error de conexión
                e.currentTarget.src = resort.image_url;
                e.currentTarget.style.opacity = "0.6";
                e.currentTarget.style.filter = "blur(0.5px)";
              }}
              alt="Live Mountain Webcam" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-slate-950/20" />
            <div className="absolute top-2 left-2 bg-rose-600 text-white font-mono font-bold text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
              <span>LIVE</span>
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] text-slate-300 font-mono bg-[#101418]/60 px-1.5 py-0.5 rounded">
              Cámara en Vivo — {localTime || weather.last_updated}
            </div>
            <a 
              href={resort.webcam_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="absolute bg-[#1C2024]/90 hover:bg-[#00E5FF] hover:text-[#101418] border border-[#2E3A44] text-slate-100 text-[10px] font-black uppercase px-3 py-1.5 rounded tracking-wider transition-all duration-300 scale-95 group-hover/webcam:scale-100 shadow-md opacity-0 group-hover/webcam:opacity-100"
            >
              Ver Enlace Oficial
            </a>
          </div>
        )}

        {/* Vista Acceso */}
        {activeTab === 'access' && (
          <div className="bg-[#12161A] border border-[#2E3A44] p-4 rounded flex flex-col gap-3 my-auto justify-center h-full">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Accesos y Fronteras</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {resort.border_pass_info}
                </p>
              </div>
            </div>
            
            <div className="border-t border-[#2E3A44]/60 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Fuente: Vialidad Nacional / DMC</span>
              <span>Actualizado hace 15 min</span>
            </div>
          </div>
        )}

        {/* 4. Enlace al Reporte de Detalle Completo */}
        <div className="mt-4 pt-3 border-t border-[#2E3A44]/55 flex items-center justify-between">
          <span className="text-[9px] text-slate-500 font-mono font-medium">
            Últ. act: {weather.last_updated}
          </span>
          <Link
            href={`/resort/${resort.slug}`}
            className="text-[10px] text-[#00E5FF] font-black uppercase tracking-wider flex items-center gap-1.5 hover:text-slate-100 transition-colors"
          >
            <span>Ver Reporte Completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
