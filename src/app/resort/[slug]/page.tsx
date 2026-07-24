'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Snowflake, Mountain, Thermometer, Wind, 
  MapPin, Eye, Calendar, AlertTriangle, ShieldCheck, Heart, Navigation
} from 'lucide-react';
import { SKI_RESORTS, SkiResort, WeatherData, getWeatherIcon, getWindDirectionLabel } from '@/services/dataService';
import Footer from '@/components/Footer';

export default function ResortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [resort, setResort] = useState<SkiResort | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundResort = SKI_RESORTS.find(r => r.slug === slug);
    if (foundResort) {
      setResort(foundResort);
      
      // Cargar favoritos
      const favs = localStorage.getItem('pipos_favorite_resorts');
      if (favs) {
        try {
          const parsed = JSON.parse(favs);
          setIsFavorite(parsed.includes(foundResort.id));
        } catch (e) {
          console.error(e);
        }
      }

      // Fetch weather from local server-side API to bypass browser blockages
      fetch(`/api/weather?slug=${foundResort.slug}`)
        .then(res => {
          if (!res.ok) throw new Error('Error al obtener clima del servidor');
          return res.json();
        })
        .then(data => {
          setWeather(data.weather);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [slug]);

  const handleToggleFavorite = () => {
    if (!resort) return;
    const favs = localStorage.getItem('pipos_favorite_resorts');
    let updated: string[] = [];
    if (favs) {
      try {
        const parsed = JSON.parse(favs);
        if (parsed.includes(resort.id)) {
          updated = parsed.filter((id: string) => id !== resort.id);
        } else {
          updated = [...parsed, resort.id];
        }
      } catch (e) {
        updated = [resort.id];
      }
    } else {
      updated = [resort.id];
    }
    setIsFavorite(updated.includes(resort.id));
    localStorage.setItem('pipos_favorite_resorts', JSON.stringify(updated));
    localStorage.setItem('pipos_subscribed_resorts', JSON.stringify(updated));
    window.dispatchEvent(new Event('favorites-updated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101418] text-slate-100 flex flex-col justify-center items-center gap-4">
        <Snowflake className="w-10 h-10 text-[#00E5FF] animate-spin" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando reporte de montaña...</p>
      </div>
    );
  }

  if (!resort || !weather) {
    return (
      <div className="min-h-screen bg-[#101418] text-slate-100 flex flex-col justify-center items-center gap-6 p-4">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold">Centro de Esquí No Encontrado</h2>
          <p className="text-xs text-slate-400">El cerro solicitado no se encuentra registrado en nuestra base de datos andina.</p>
        </div>
        <Link 
          href="/" 
          className="flex items-center gap-2 bg-[#00E5FF] hover:bg-[#00cce3] text-[#101418] px-5 py-2.5 rounded text-xs font-black uppercase shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </Link>
      </div>
    );
  }

  // Comprobar si hay peligro de viento en altura
  const isHighWind = weather.wind_speed_kmh > 45;
  const isCriticalTemp = weather.temp_base_c > 2.0 || weather.freezing_level_m > resort.elevation_top_m;

  return (
    <main className="min-h-screen bg-[#101418] text-slate-100 pb-20">
      
      {/* 1. Hero Header Banner */}
      <section className="relative h-[320px] md:h-[400px] w-full overflow-hidden">
        <img 
          src={resort.image_url} 
          alt={resort.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101418] via-[#101418]/60 to-[#101418]/85" />
        
        {/* Flotante: Botón Atrás & Favorito */}
        <div className="absolute top-6 left-4 right-4 md:left-8 md:right-8 max-w-[1200px] mx-auto flex items-center justify-between z-20">
          <Link 
            href="/"
            className="flex items-center gap-2 bg-[#1E252B]/90 hover:bg-[#00E5FF] hover:text-[#101418] border border-[#2E3A44] text-slate-200 px-4 py-2 rounded text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Link>
          
          <button
            onClick={handleToggleFavorite}
            className="flex items-center gap-2 bg-[#1E252B]/90 hover:bg-[#00E5FF] hover:text-[#101418] border border-[#2E3A44] text-slate-200 px-4 py-2 rounded text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all active:scale-95"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#00FF9D] text-[#00FF9D]' : 'text-slate-400'}`} />
            <span>{isFavorite ? 'Seguido' : 'Seguir Cerro'}</span>
          </button>
        </div>

        {/* Título e Info Principal */}
        <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-8 max-w-[1200px] mx-auto z-20 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl md:text-2xl">{resort.country === 'Argentina' ? '🇦🇷' : '🇨🇱'}</span>
            <span className="text-xs md:text-sm font-black text-[#00E5FF] uppercase tracking-widest">{resort.region}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight text-glow">
            {resort.name}
          </h1>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="bg-[#1E252B] border border-[#2E3A44] text-slate-300 px-3 py-1 rounded text-xs font-semibold">
              Cota Base: {resort.elevation_base_m} msnm
            </span>
            <span className="bg-[#1E252B] border border-[#2E3A44] text-slate-300 px-3 py-1 rounded text-xs font-semibold">
              Cota Cumbre: {resort.elevation_top_m} msnm
            </span>
            <span className="bg-[#1E252B] border border-[#2E3A44] text-slate-300 px-3 py-1 rounded text-xs font-semibold">
              Desnivel: {resort.elevation_top_m - resort.elevation_base_m} m
            </span>
          </div>
        </div>
      </section>

      {/* 2. Grid de Información Avanzada */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda & Central: Clima, Pronóstico y Meteorología */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Bloque de Métricas Principales */}
          <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg p-6 space-y-6">
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider border-b border-[#2E3A44] pb-2">
              Reporte de Condiciones Actuales
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-[#12161A] p-4 rounded border border-[#2E3A44] flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Nieve 24h</span>
                <span className="text-2xl font-black text-[#00FF9D] text-glow-green mt-2">
                  {weather.snowfall_24h_cm > 0 ? `+${weather.snowfall_24h_cm} cm` : '0 cm'}
                </span>
                <span className="text-[9px] text-slate-500 mt-1">48h: {Math.round(weather.snowfall_48h_cm)} cm</span>
              </div>

              <div className="bg-[#12161A] p-4 rounded border border-[#2E3A44] flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Espesor Base</span>
                <span className="text-2xl font-black text-slate-200 mt-2">
                  {weather.snow_depth_base_cm} cm
                </span>
                <span className="text-[9px] text-slate-500 mt-1">Cota: {resort.elevation_base_m}m</span>
              </div>

              <div className="bg-[#12161A] p-4 rounded border border-[#2E3A44] flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Espesor Cumbre</span>
                <span className="text-2xl font-black text-slate-200 mt-2">
                  {Math.round(weather.snow_depth_top_cm)} cm
                </span>
                <span className="text-[9px] text-slate-500 mt-1">Cota: {resort.elevation_top_m}m</span>
              </div>

              <div className="bg-[#12161A] p-4 rounded border border-[#2E3A44] flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Calidad Nieve</span>
                <span className={`text-sm font-black uppercase mt-2 text-center py-1.5 px-2 rounded border ${
                  weather.snow_quality === 'Polvo' 
                    ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/30' 
                    : weather.snow_quality === 'Polvo/Dura' 
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {weather.snow_quality}
                </span>
                <span className="text-[9px] text-slate-500 mt-1">Física de ladera</span>
              </div>

            </div>

            {/* Temperaturas detalladas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex justify-between items-center bg-[#12161A]/50 px-4 py-3 rounded border border-[#2E3A44]/75">
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-400" /> Temperatura en la Base
                </span>
                <span className="text-sm font-bold font-mono">{weather.temp_base_c} °C</span>
              </div>
              <div className="flex justify-between items-center bg-[#12161A]/50 px-4 py-3 rounded border border-[#2E3A44]/75">
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#00E5FF]" /> Temperatura en Cumbre (~{resort.elevation_top_m}m)
                </span>
                <span className="text-sm font-bold font-mono text-[#00E5FF] text-glow">{weather.temp_top_c} °C</span>
              </div>
            </div>

          </div>

          {/* Análisis de Isotermia 0°C y Viento Blanco */}
          <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider border-b border-[#2E3A44] pb-2">
              💡 Análisis Técnico de Meteorología Alpina
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bloque Isotermia */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <Thermometer className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Isotermia 0°C: {weather.freezing_level_m} msnm</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  La altura de la isotermia determina el límite de congelamiento en la montaña.
                </p>
                {weather.freezing_level_m > resort.elevation_top_m ? (
                  <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded text-xs text-rose-300 flex gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Alerta de Lluvia:</strong> La isotermia está por encima de la cumbre ({resort.elevation_top_m}m). La precipitación será líquida en todo el cerro, lavando la nieve y poniéndola tipo sopa.
                    </span>
                  </div>
                ) : weather.freezing_level_m < resort.elevation_base_m ? (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded text-xs text-emerald-300 flex gap-2">
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Excelentes Condiciones:</strong> La isotermia está por debajo de la base ({resort.elevation_base_m}m). Nevará seco y con frío hasta la base, garantizando nieve polvo de alta calidad.
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded text-xs text-amber-300 flex gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Isotermia Media:</strong> Entre la base y la cumbre. Habrá lluvia húmeda abajo y nevadas frescas a partir de los {weather.freezing_level_m} metros. Cuidado con el cambio brusco de calidad.
                    </span>
                  </div>
                )}
              </div>

              {/* Bloque Viento */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <Wind className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Viento a 700 hPa: {weather.wind_speed_kmh} km/h</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Los vientos en cordillera son vitales para la seguridad y el funcionamiento de las telesillas y medios de arrastre.
                </p>
                <div className="flex items-center gap-3 bg-[#12161A] p-3.5 rounded border border-[#2E3A44]">
                  <Navigation 
                    className="w-5 h-5 text-[#00E5FF] shrink-0" 
                    style={{ transform: `rotate(${weather.wind_direction_deg}deg)` }}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      Soplando desde el {getWindDirectionLabel(weather.wind_direction_deg)} ({weather.wind_direction_deg}°)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Viento predominante del Pacífico en la alta cordillera.
                    </p>
                  </div>
                </div>
                {isHighWind ? (
                  <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded text-xs text-rose-300 flex gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Riesgo de Viento Blanco:</strong> Viento excesivo ({weather.wind_speed_kmh} km/h). Alta probabilidad de cierre de telesillas en cumbre y visibilidad nula por ráfagas.
                    </span>
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded text-xs text-emerald-300 flex gap-2">
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Medios Operativos:</strong> Viento en calma ({weather.wind_speed_kmh} km/h). Las condiciones permiten la apertura normal de las telesillas y el disfrute en cumbre.
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Pronóstico extendido a 5 días */}
          <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider border-b border-[#2E3A44] pb-2">
              📅 Pronóstico Detallado a 5 Días
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
              {weather.forecast_5days.map((day, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#12161A] border border-[#2E3A44] p-3 rounded flex flex-col items-center justify-between text-center min-h-[140px]"
                >
                  <span className="text-xs text-slate-400 font-bold">{day.date}</span>
                  <span className="text-3xl my-2">{getWeatherIcon(day.weather_code)}</span>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-[#00FF9D] block">
                      {day.snowfall_sum_cm > 0 ? `+${Math.round(day.snowfall_sum_cm)} cm` : '0 cm'}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {day.temp_max}°C / {day.temp_min}°C
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Columna Derecha: Webcams y Estado de Accesos */}
        <div className="space-y-8">
          
          {/* Estado de Acceso / Vialidad */}
          <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider border-b border-[#2E3A44] pb-2">
              🚗 Estado de Acceso Vial
            </h3>
            
            <div className="space-y-3.5">
              <div className="bg-[#12161A] p-4 border border-[#2E3A44] rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-wider">Vialidad e Info</span>
                  <span className="text-[9px] bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 rounded font-bold">OFICIAL</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {resort.border_pass_info}
                </p>
              </div>

              <div className="text-[10px] text-slate-500 font-medium space-y-1">
                <p>• Portar siempre cadenas en zona de alta montaña.</p>
                <p>• Los pasos fronterizos cierran por nevadas extremas o congelamiento.</p>
              </div>
            </div>
          </div>

          {/* Webcam Live */}
          <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#2E3A44] pb-2">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                📷 Webcam de Montaña
              </h3>
              <span className="bg-rose-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-black flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span> LIVE
              </span>
            </div>

            <div className="relative aspect-video rounded overflow-hidden border border-[#2E3A44] bg-[#12161A] flex items-center justify-center">
              <img 
                src={resort.webcam_url} 
                onError={(e) => {
                  // Fallback a la imagen del cerro de la base de datos si hay error
                  e.currentTarget.src = resort.image_url;
                  e.currentTarget.style.opacity = "0.7";
                }}
                alt="Webcam Live View" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
              <div className="absolute bottom-2 left-2 text-[9px] text-slate-300 font-mono bg-[#101418]/65 px-1.5 py-0.5 rounded">
                Cámara en Vivo — {weather.last_updated}
              </div>
            </div>

            <a
              href={resort.webcam_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-[#12161A] hover:bg-[#2E3A44] border border-[#2E3A44] text-slate-200 py-2.5 rounded text-xs font-black uppercase tracking-wider block transition-all"
            >
              Ver Webcam Pantalla Completa
            </a>
          </div>

        </div>

      </section>

      {/* Footer de Fuentes */}
      <Footer />

    </main>
  );
}
