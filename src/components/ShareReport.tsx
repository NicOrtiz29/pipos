'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Copy, Send, Check, Calendar } from 'lucide-react';
import { SkiResort, WeatherData, getWindDirectionLabel } from '@/services/dataService';

interface ShareReportProps {
  resort: SkiResort;
  weather: WeatherData;
}

export default function ShareReport({ resort, weather }: ShareReportProps) {
  const [tripDate, setTripDate] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [reportText, setReportText] = useState('');

  // Cargar fecha de viaje guardada
  useEffect(() => {
    const savedDate = localStorage.getItem('pipos_trip_date');
    if (savedDate) {
      setTripDate(savedDate);
    }
  }, []);

  // Guardar fecha de viaje
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTripDate(val);
    localStorage.setItem('pipos_trip_date', val);
  };

  // Generar reporte dinámico
  useEffect(() => {
    let diffDays: number | null = null;
    if (tripDate) {
      const trip = new Date(tripDate);
      const today = new Date();
      trip.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = trip.getTime() - today.getTime();
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    let countdownText = '⏳ Configura la fecha de tu viaje en Pipos Riders para activar el Countdown.';
    if (diffDays !== null) {
      if (diffDays > 0) {
        countdownText = `⏳ Countdown: faltan ${diffDays} días para el viaje. Ya se escucha el “¿quién lleva cadenas?” desde acá.`;
      } else if (diffDays === 0) {
        countdownText = `⏳ ¡El viaje es HOY! A calzar las tablas y disfrutar de la montaña.`;
      } else {
        countdownText = `⏳ ¡El viaje ya comenzó! A romper esas pistas.`;
      }
    }

    const snow24h = weather.snowfall_24h_cm;
    const snow48h = weather.snowfall_48h_cm;
    const baseDepth = weather.snow_depth_base_cm;
    const upcomingSnow = weather.forecast_5days.reduce((acc, curr) => acc + curr.snowfall_sum_cm, 0);

    // Fórmulas divertidas de riders
    const powderScore = Math.min(10, Math.max(1, parseFloat(((snow24h * 1.5) + (10 - Math.abs(weather.temp_top_c + 6)) / 1.5).toFixed(1))));
    const hypeMeter = Math.min(100, Math.max(10, Math.round(30 + (upcomingSnow * 4) + (snow24h * 5))));

    const events = [];
    if (snow24h > 15) events.push('Gran nevada 🌨️');
    else if (snow24h > 5) events.push('Nieve fresca reciente ❄️');
    if (upcomingSnow > 20) events.push('Semana prometedora 🙌');
    if (weather.wind_speed_kmh > 40) events.push('Viento fuerte en altura ⚠️');
    if (weather.temp_base_c > 3.0) events.push('Temperaturas templadas abajo 🌡️');
    if (events.length === 0) events.push('Condiciones estables de montaña 🏔️');

    let closing = 'si el pronóstico acompaña, la montaña se está preparando para recibirlos. Vayan encerando esas tablas.';
    if (snow24h > 10 || upcomingSnow > 20) {
      closing = `si el pronóstico acompaña, ${resort.name} se está preparando para recibirlos con alfombra blanca. Vayan encerando esas tablas. 🏂❄️`;
    } else if (weather.wind_speed_kmh > 45) {
      closing = 'atentos al viento en altura para mañana, revisen el estado de los medios antes de subir.';
    }

    const text = `¡Reporte nevado para la banda! 🎿❄️ ${resort.name} viene con pinta de ${snow24h > 10 ? 'fiesta blanca' : 'buen ride'}.

${countdownText}

🌨️ Nieve reciente: 
* ${snow24h.toFixed(1)} cm en 24 h: ${snow24h > 10 ? 'tremenda nevada, ideal para pensar en nieve fresca' : 'acumulación fresca para asentar las pistas'}. 
* ${snow48h.toFixed(1)} cm en 48 h.
* Base estimada: ${baseDepth} cm. Ojo: es estimación del modelo Open-Meteo, no parte oficial de pistas.

🔮 Nieve futura: 
* Pronóstico 5 días: ${upcomingSnow.toFixed(1)} cm. ${upcomingSnow > 15 ? 'Eso grita "semana prometedora" en idioma esquiador.' : 'Estable, ideal para pista.'}

🌡️ Clima actual: 
* Temperatura Cumbre: ${weather.temp_top_c} °C, Base: ${weather.temp_base_c} °C. 
* Viento: ${weather.wind_speed_kmh} km/h, soplando desde el ${getWindDirectionLabel(weather.wind_direction_deg)}.
* Calidad: Nieve ${weather.snow_quality}.

🏂 Powder Score: ${powderScore}/10 
${powderScore > 7 ? 'Excelente puntaje: altas chances de flotar en nieve polvo.' : 'Puntaje estándar: óptimo para esquiar en pistas pisadas.'}

🔥 Hype Meter: ${hypeMeter}% 
Nivel manija: ${hypeMeter > 75 ? 'peligrosamente alto. Se recomienda revisar equipo y mandar stickers al grupo.' : 'moderado. Apto para programar la subida.'}

🚨 Eventos detectados: 
${events.map(ev => `* ${ev}`).join('\n')}

Cierre técnico-emocional: ${closing}`;

    setReportText(text);
  }, [resort, weather, tripDate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg p-6 space-y-6">
      
      {/* Encabezado */}
      <div className="border-b border-[#2E3A44] pb-3 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#00E5FF]" /> Reporte para la Banda 🎿
        </h3>
        <span className="text-[9px] bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 px-2 py-0.5 rounded font-black uppercase">
          Listo para Compartir
        </span>
      </div>

      {/* Selector de fecha de viaje */}
      <div className="bg-[#12161A] p-3 border border-[#2E3A44]/70 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-semibold">Configurar Fecha de tu Viaje:</span>
        </div>
        <input
          type="date"
          value={tripDate}
          onChange={handleDateChange}
          className="bg-[#1C2024] border border-[#2E3A44] text-xs py-1.5 px-3 rounded text-slate-200 focus:border-[#00E5FF] focus:outline-none w-full sm:w-auto"
        />
      </div>

      {/* Previsualización del Reporte */}
      <div className="space-y-2">
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
          Previsualización del Mensaje (WhatsApp / Email)
        </span>
        <div className="bg-[#12161A] border border-[#2E3A44]/60 p-4 rounded text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed scrollbar-thin">
          {reportText}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleCopy}
          className="flex-1 bg-[#12161A] hover:bg-[#2D3740] border border-[#2E3A44] text-slate-200 py-2.5 px-4 rounded text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#00FF9D]" /> Copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" /> Copiar Reporte
            </>
          )}
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex-1 bg-[#00FF9D] hover:bg-[#00e68e] text-[#101418] py-2.5 px-4 rounded text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-[0_0_15px_rgba(0,255,157,0.2)]"
        >
          <Send className="w-4 h-4" /> Mandar al WhatsApp
        </button>
      </div>

    </div>
  );
}
