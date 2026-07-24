'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Share2, Copy, Send, Check, Calendar, RefreshCw, Shuffle } from 'lucide-react';
import { SkiResort, WeatherData, getWindDirectionLabel } from '@/services/dataService';

interface ShareReportProps {
  resort: SkiResort;
  weather: WeatherData;
}

type ReportStyle = 'clasico' | 'manija' | 'tecnico' | 'chistoso';

// --- DICCIONARIOS DE FRASES Y VARIACIONES ---

const openingPhrases: Record<ReportStyle, string[]> = {
  clasico: [
    '¡Reporte nevado para la banda! 🎿❄️ {resort} viene con pinta de {status}.',
    'Aviso importante para el grupo: ❄️🏂 Se viene reporte de nieve fresco para {resort}.',
    '¡Atención riders! 🏂 Aquí el parte meteorológico para {resort}.'
  ],
  manija: [
    '¡Se picó la montaña! 🏔️🔥 Reporte mega-manija para la banda. {resort} está listo para recibirnos.',
    '🚨 DETECTADO ALERTA DE MANIJA 🚨 {resort} se va a descontrolar con este clima. ¡A prepararse!',
    '¡Gente, no se queden dormidos! 🏂❄️ {resort} está tirando magia blanca. Se viene viaje histórico.'
  ],
  tecnico: [
    '📊 Boletín meteorológico consolidado para la estación {resort}.',
    '📈 Reporte técnico de condiciones e hidrología de nieve en {resort}.',
    '⚙️ Monitoreo de variables atmosféricas y acumulación de nieve en {resort}.'
  ],
  chistoso: [
    '🚨 ALERTA DE PISTAS: Reporte no apto para amargos. {resort} nos espera (y va a juzgar nuestro estilo).',
    'Aviso parroquial: 🎿 {resort} viene con nieve y alta probabilidad de caídas graciosas.',
    '¡Hola banda! 👋 Reporte para ver si justificamos la compra de esa ropa de montaña carísima en {resort}.'
  ]
};

const countdownPhrases: Record<ReportStyle, ((days: number) => string)[]> = {
  clasico: [
    (days) => `⏳ Countdown: faltan ${days} días para el viaje. Ya se escucha el “¿quién lleva cadenas?” desde acá.`,
    (days) => `⏳ Faltan ${days} días. El auto ya está casi cargado y la ansiedad no se aguanta más.`,
    (days) => `⏳ Cuenta regresiva: ${days} días. Idas y vueltas en el grupo de WhatsApp, se viene tremendo viaje.`
  ],
  manija: [
    (days) => `⏳ ¡Quedan solo ${days} días! Ya tengo la tabla encerada en el living y las botas puestas. ¡Manija total!`,
    (days) => `⏳ Faltan ${days} días para el paraíso. Manden stickers al grupo que ya se viaja.`,
    (days) => `⏳ Cuenta regresiva: ${days} días. Preparando el termo, los mates y las ganas de flotar en polvo.`
  ],
  tecnico: [
    (days) => `⏳ Cuenta regresiva: ${days} días para la llegada al destino. Monitoreando accesos terrestres.`,
    (days) => `⏳ Faltan ${days} días. Planificando itinerario según estado de caminos.`,
    (days) => `⏳ T-minus ${days} días. Logística y equipamiento técnico listos.`
  ],
  chistoso: [
    (days) => `⏳ Faltan ${days} días. Tiempo suficiente para entrenar piernas o inventar una excusa médica creíble en el trabajo.`,
    (days) => `⏳ Quedan ${days} días. Ya estoy practicando cómo caerme con estilo frente a la telesilla.`,
    (days) => `⏳ ${days} días para el viaje. ¿Quién va a ser el primero en perder un guante o la tarjeta de pase?`
  ]
};

const snowPhrases: Record<ReportStyle, { recent: string[]; future: string[] }> = {
  clasico: {
    recent: [
      '* {snow24h} cm en 24 h: {status_snow_24h}.\n* {snow48h} cm en 48 h.\n* Base estimada: {baseDepth} cm. Ojo: es estimación del modelo Open-Meteo, no parte oficial de pistas.',
      '* Reciente: {snow24h} cm en las últimas 24 horas y {snow48h} cm acumulados en 48 horas. Espesor en base estimado: {baseDepth} cm.'
    ],
    future: [
      '* Pronóstico 5 días: {upcomingSnow} cm. {status_upcoming_snow}',
      '* Próximos 5 días: se esperan {upcomingSnow} cm en total. Ideal para ir planificando las bajadas.'
    ]
  },
  manija: {
    recent: [
      '* ¡Cayeron {snow24h} cm de polvo en 24h! Esto es oro puro. Acumulado 48h: {snow48h} cm. Base estimada: {baseDepth} cm. ¡Pura felicidad!',
      '* Nieve fresca: {snow24h} cm en 24h. ¡La cordillera se está pintando por completo! Espesor base: {baseDepth} cm.'
    ],
    future: [
      '* ¡El modelo da {upcomingSnow} cm para los próximos 5 días! Se viene tormenta de la buena, a cebar la manija.',
      '* ¡Se vienen {upcomingSnow} cm en 5 días! Nos vamos a cansar de pisar nieve fresca. ¡Salud por eso!'
    ]
  },
  tecnico: {
    recent: [
      '* Precipitación sólida (24h): {snow24h} cm de nieve nueva registrada. Acumulado 48h: {snow48h} cm. Espesor medio estimado en cota base: {baseDepth} cm.',
      '* Datos de acumulación horaria: 24h: {snow24h} cm. 48h: {snow48h} cm. Nivel de espesor en base: {baseDepth} cm.'
    ],
    future: [
      '* Modelo predictivo a 120 horas: Acumulación estimada de {upcomingSnow} cm.',
      '* Pronóstico a mediano plazo (5 días): {upcomingSnow} cm de precipitación sólida acumulada.'
    ]
  },
  chistoso: {
    recent: [
      '* {snow24h} cm de nieve fresca en 24h. Lo suficiente para amortiguar los golpes en la pista base. Acumulado 48h: {snow48h} cm. Espesor base: {baseDepth} cm.',
      '* Cayeron {snow24h} cm en 24h. Si te quedás atascado en el polvo, yo no te busco. Base estimada: {baseDepth} cm.'
    ],
    future: [
      '* Pronóstico 5 días: {upcomingSnow} cm. Las nubes están trabajando más duro que mi grupo de amigos organizando el viaje.',
      '* Se vienen {upcomingSnow} cm en 5 días. Andá practicando cómo desenterrar el auto con una pala.'
    ]
  }
};

const climatePhrases: Record<ReportStyle, string[]> = {
  clasico: [
    '* Temp. Cumbre: {tempTop} °C, Base: {tempBase} °C.\n* Viento: {windSpeed} km/h, soplando desde el {windDirLabel}.\n* Calidad: Nieve {snowQuality}.'
  ],
  manija: [
    '* Cumbre a {tempTop} °C (fresquito del bueno) y base a {tempBase} °C.\n* Viento: {windSpeed} km/h (¡agarrate el gorro!) desde el {windDirLabel}.\n* Calidad: Nieve {snowQuality} total.'
  ],
  tecnico: [
    '* Gradiente térmico: Cumbre ({elevationTop}m): {tempTop} °C / Base ({elevationBase}m): {tempBase} °C.\n* Dinámica de viento: {windSpeed} km/h dirección {windDirLabel} ({windDirDeg}°).\n* Estado físico de la superficie: Nieve {snowQuality}.'
  ],
  chistoso: [
    '* Temperatura: Cumbre a {tempTop} °C (ideal para conservar pingüinos) y Base: {tempBase} °C.\n* Viento: {windSpeed} km/h desde el {windDirLabel}.\n* Calidad de nieve: {snowQuality} (apta para muñecos de nieve).'
  ]
};

const powderScorePhrases: Record<ReportStyle, string[]> = {
  clasico: [
    '🏂 Powder Score: {powderScore}/10 \n{status_powder}'
  ],
  manija: [
    '🏂 Powder Score: {powderScore}/10 \n{powderScore > 7 ? "¡De locos! Vas a flotar en la nube." : "Perfecto para meter carves hermosos."}'
  ],
  tecnico: [
    '🏂 Powder Index: {powderScore}/10 (Coeficiente de flotabilidad y calidad superficial).'
  ],
  chistoso: [
    '🏂 Powder Score: {powderScore}/10 \n{powderScore > 7 ? "¿Vas a esquiar o te vas a quedar sacándote fotos en el parador?" : "Nivel pistas pisadas. Traé buena técnica o te caés."}'
  ]
};

const hypePhrases: Record<ReportStyle, string[]> = {
  clasico: [
    '🔥 Hype Meter: {hypeMeter}% \nNivel manija: {status_hype}'
  ],
  manija: [
    '🔥 Hype Meter: {hypeMeter}% \n¡Ansiedad nivel dios! ¡No dormimos hasta viajar!'
  ],
  tecnico: [
    '🔥 Hype Index: {hypeMeter}% (Porcentaje de expectativa y motivación del grupo).'
  ],
  chistoso: [
    '🔥 Hype Meter: {hypeMeter}% \nNivel de manija clínica. Cuidado con los picos de adrenalina.'
  ]
};

const eventHeaders: Record<ReportStyle, string> = {
  clasico: '🚨 Eventos detectados:',
  manija: '🔥 Datazo de la montaña:',
  tecnico: '⚠️ Alertas y Avisos Técnicos:',
  chistoso: '🤓 Cositas a tener en cuenta:'
};

const closingPhrases: Record<ReportStyle, string[]> = {
  clasico: [
    'si el pronóstico acompaña, {resort} se está preparando para recibirlos con alfombra blanca. Vayan encerando esas tablas. 🏂❄️',
    'a preparar el abrigo, poner a punto la tabla y disfrutar de la nieve. ¡Nos vemos arriba!'
  ],
  manija: [
    '¡nos fuimos mundial muchachos! Vayan encerando las tablas y preparando el Fernet. ¡Se viaja! 🏂🔥🍹',
    '¡se pudrió todo en la montaña! Si el pronóstico se cumple, este viaje queda en la historia. ¡A romper todo! ⚡🏔️'
  ],
  tecnico: [
    'se sugiere portación obligatoria de cadenas y consultar estado del paso fronterizo antes de emprender viaje.',
    'monitorear de cerca los vientos a 700 hPa en caso de ráfagas fuertes que comprometan los medios de elevación.'
  ],
  chistoso: [
    'el último que llega a la base paga los panqueques con dulce de leche en el parador. Quedan avisados. 🥞⛷️',
    'si vas con este reporte y te quedás durmiendo en el hotel en vez de subir, sos un amargo de campeonato.'
  ]
};

// --- FIN DICCIONARIOS ---

export default function ShareReport({ resort, weather }: ShareReportProps) {
  const [tripDate, setTripDate] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [reportText, setReportText] = useState('');
  
  // Estados para actualizar clima
  const [localWeather, setLocalWeather] = useState<WeatherData>(weather);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Estados para variación del texto
  const [reportStyle, setReportStyle] = useState<ReportStyle>('clasico');
  const [randomSeed, setRandomSeed] = useState(0);

  // Sincronizar el estado local si la prop original cambia de afuera
  useEffect(() => {
    setLocalWeather(weather);
  }, [weather]);

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

  // Función para obtener clima más reciente de la API
  const handleRefreshWeather = async () => {
    setLoadingWeather(true);
    try {
      const res = await fetch(`/api/weather?slug=${resort.slug}`);
      if (!res.ok) throw new Error('Error al actualizar datos');
      const data = await res.json();
      if (data && data.weather) {
        setLocalWeather(data.weather);
        // Incrementamos la semilla para darle variedad al texto tras actualizar
        setRandomSeed(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error refreshing weather:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Cambiar estilo e incrementar semilla para dar frescura
  const handleStyleChange = (style: ReportStyle) => {
    setReportStyle(style);
    setRandomSeed(prev => prev + 1);
  };

  // Generar reporte dinámico con variaciones
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

    // Selector helper basado en la semilla actual y largo de la lista
    const selectPhrase = <T,>(list: T[]): T => {
      return list[randomSeed % list.length];
    };

    let countdownText = '⏳ Configura la fecha de tu viaje en Pipos Riders para activar el Countdown.';
    if (diffDays !== null) {
      if (diffDays > 0) {
        countdownText = selectPhrase(countdownPhrases[reportStyle])(diffDays);
      } else if (diffDays === 0) {
        countdownText = reportStyle === 'manija' 
          ? `⏳ ¡EL VIAJE ES HOY! Despierten a todos que ya abrieron los medios. 🏂🎉`
          : `⏳ ¡El viaje es HOY! A calzar las tablas y disfrutar de la montaña.`;
      } else {
        countdownText = reportStyle === 'manija'
          ? `⏳ ¡Ya estamos arriba! A exprimir al máximo ese pase diario.`
          : `⏳ ¡El viaje ya comenzó! A romper esas pistas.`;
      }
    }

    const snow24h = localWeather.snowfall_24h_cm;
    const snow48h = localWeather.snowfall_48h_cm;
    const baseDepth = localWeather.snow_depth_base_cm;
    const upcomingSnow = localWeather.forecast_5days.reduce((acc, curr) => acc + curr.snowfall_sum_cm, 0);

    // Fórmulas divertidas de riders
    const powderScore = Math.min(10, Math.max(1, parseFloat(((snow24h * 1.5) + (10 - Math.abs(localWeather.temp_top_c + 6)) / 1.5).toFixed(1))));
    const hypeMeter = Math.min(100, Math.max(10, Math.round(30 + (upcomingSnow * 4) + (snow24h * 5))));

    // Lógicas de textos dinámicos
    const status = snow24h > 10 ? 'fiesta blanca' : 'buen ride';
    const status_snow_24h = snow24h > 10 ? 'tremenda nevada, ideal para pensar en nieve fresca' : 'acumulación fresca para asentar las pistas';
    const status_upcoming_snow = upcomingSnow > 15 ? 'Eso grita "semana prometedora" en idioma esquiador.' : 'Estable, ideal para pista.';
    const status_powder = powderScore > 7 ? 'Excelente puntaje: altas chances de flotar en nieve polvo.' : 'Puntaje estándar: óptimo para esquiar en pistas pisadas.';
    const status_hype = hypeMeter > 75 ? 'peligrosamente alto. Se recomienda revisar equipo y mandar stickers al grupo.' : 'moderado. Apto para programar la subida.';

    // Procesar intro
    const introText = selectPhrase(openingPhrases[reportStyle])
      .replace('{resort}', resort.name)
      .replace('{status}', status);

    // Procesar nieve reciente y futura
    const recentSnowRaw = selectPhrase(snowPhrases[reportStyle].recent);
    const recentSnowText = recentSnowRaw
      .replace('{snow24h}', snow24h.toFixed(1))
      .replace('{status_snow_24h}', status_snow_24h)
      .replace('{snow48h}', snow48h.toFixed(1))
      .replace('{baseDepth}', baseDepth.toString());

    const futureSnowRaw = selectPhrase(snowPhrases[reportStyle].future);
    const futureSnowText = futureSnowRaw
      .replace('{upcomingSnow}', upcomingSnow.toFixed(1))
      .replace('{status_upcoming_snow}', status_upcoming_snow);

    // Procesar clima
    const windDirLabel = getWindDirectionLabel(localWeather.wind_direction_deg);
    const climateRaw = selectPhrase(climatePhrases[reportStyle]);
    const climateText = climateRaw
      .replace('{tempTop}', localWeather.temp_top_c.toString())
      .replace('{tempBase}', localWeather.temp_base_c.toString())
      .replace('{windSpeed}', localWeather.wind_speed_kmh.toFixed(1))
      .replace('{windDirLabel}', windDirLabel)
      .replace('{windDirDeg}', localWeather.wind_direction_deg.toString())
      .replace('{elevationTop}', resort.elevation_top_m.toString())
      .replace('{elevationBase}', resort.elevation_base_m.toString())
      .replace('{snowQuality}', localWeather.snow_quality);

    // Procesar Powder Score
    const powderRaw = selectPhrase(powderScorePhrases[reportStyle]);
    const powderText = powderRaw
      .replace('{powderScore}', powderScore.toFixed(1))
      .replace('{status_powder}', status_powder)
      // Evaluación condicional simple para manija y chistoso
      .replace('{powderScore > 7 ? "¡De locos! Vas a flotar en la nube." : "Perfecto para meter carves hermosos."}', powderScore > 7 ? '¡De locos! Vas a flotar en la nube.' : 'Perfecto para meter carves hermosos.')
      .replace('{powderScore > 7 ? "¿Vas a esquiar o te vas a quedar sacándote fotos en el parador?" : "Nivel pistas pisadas. Traé buena técnica o te caés."}', powderScore > 7 ? '¿Vas a esquiar o te vas a quedar sacándote fotos en el parador?' : 'Nivel pistas pisadas. Traé buena técnica o te caés.');

    // Procesar Hype Meter
    const hypeRaw = selectPhrase(hypePhrases[reportStyle]);
    const hypeText = hypeRaw
      .replace('{hypeMeter}', hypeMeter.toString())
      .replace('{status_hype}', status_hype);

    // Procesar Eventos
    const events = [];
    if (snow24h > 15) events.push('Gran nevada 🌨️');
    else if (snow24h > 5) events.push('Nieve fresca reciente ❄️');
    if (upcomingSnow > 20) events.push('Semana prometedora 🙌');
    if (localWeather.wind_speed_kmh > 40) events.push('Viento fuerte en altura ⚠️');
    if (localWeather.temp_base_c > 3.0) events.push('Temperaturas templadas abajo 🌡️');
    if (events.length === 0) events.push('Condiciones estables de montaña 🏔️');

    const eventsHeader = eventHeaders[reportStyle];
    const eventsText = `${eventsHeader}\n${events.map(ev => `* ${ev}`).join('\n')}`;

    // Cierre
    let customClosing = selectPhrase(closingPhrases[reportStyle])
      .replace('{resort}', resort.name);
    
    // Sobreescritura condicional por seguridad si hay mucho viento o nieve
    if (reportStyle === 'clasico') {
      if (snow24h > 10 || upcomingSnow > 20) {
        customClosing = `si el pronóstico acompaña, ${resort.name} se está preparando para recibirlos con alfombra blanca. Vayan encerando esas tablas. 🏂❄️`;
      } else if (localWeather.wind_speed_kmh > 45) {
        customClosing = 'atentos al viento en altura para mañana, revisen el estado de los medios antes de subir.';
      }
    }

    const text = `${introText}

${countdownText}

🌨️ Nieve reciente: 
${recentSnowText}

🔮 Nieve futura: 
${futureSnowText}

🌡️ Clima actual: 
${climateText}

${powderText}

${hypeText}

${eventsText}

Cierre técnico-emocional: ${customClosing}`;

    setReportText(text);
  }, [resort, localWeather, tripDate, reportStyle, randomSeed]);

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
      <div className="border-b border-[#2E3A44] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#00E5FF]" /> Reporte para la Banda 🎿
        </h3>
        
        <div className="flex items-center gap-3">
          {/* Botón de actualizar clima de la API en tiempo real */}
          <button
            onClick={handleRefreshWeather}
            disabled={loadingWeather}
            className="flex items-center gap-1.5 text-[10px] bg-[#12161A] hover:bg-[#2A343D] border border-[#2E3A44] text-slate-300 hover:text-white px-2.5 py-1.5 rounded transition-all font-bold disabled:opacity-50"
            title="Refrescar datos del clima desde la API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00FF9D] ${loadingWeather ? 'animate-spin' : ''}`} />
            {loadingWeather ? 'Actualizando...' : 'Actualizar Clima'}
          </button>

          <span className="text-[9px] bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 px-2 py-1 rounded font-black uppercase">
            Listo para Compartir
          </span>
        </div>
      </div>

      {/* Selector de Estilo y Variantes */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
            Estilo de Reporte
          </span>
          {/* Botón de barajar variaciones de texto */}
          <button
            onClick={() => setRandomSeed(prev => prev + 1)}
            className="flex items-center gap-1 text-[10px] text-[#00E5FF] hover:text-[#5ce7ff] transition-all font-bold"
            title="Cambiar combinaciones de palabras"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Variar Texto
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['clasico', 'manija', 'tecnico', 'chistoso'] as ReportStyle[]).map((style) => {
            const labelMap: Record<ReportStyle, string> = {
              clasico: 'Clásico 🏂',
              manija: 'Manija 🔥',
              tecnico: 'Técnico 📊',
              chistoso: 'Chistoso 🤪'
            };
            const isActive = reportStyle === style;
            return (
              <button
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`py-2 px-3 text-xs font-black uppercase rounded border transition-all text-center ${
                  isActive
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                    : 'bg-[#12161A] border-[#2E3A44]/70 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                {labelMap[style]}
              </button>
            );
          })}
        </div>
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
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
            Previsualización del Mensaje (WhatsApp / Email)
          </span>
          <span className="text-[9px] text-[#00FF9D] font-bold block">
            {reportStyle === 'tecnico' ? '✓ Estilo formal' : reportStyle === 'manija' ? '✓ Nivel manija 100%' : reportStyle === 'chistoso' ? '✓ Modo humor activado' : '✓ Estilo rider clásico'}
          </span>
        </div>
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
