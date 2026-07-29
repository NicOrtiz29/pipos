export interface SkiResort {
  id: string;
  name: string;
  slug: string;
  country: 'Argentina' | 'Chile';
  region: string;
  latitude: number;
  longitude: number;
  elevation_base_m: number;
  elevation_top_m: number;
  windguru_spot_id?: number;
  webcam_url: string;
  border_pass_info: string;
  image_url: string;
}

export interface WeatherData {
  snowfall_24h_cm: number;
  snowfall_48h_cm: number;
  snow_depth_base_cm: number;
  snow_depth_top_cm: number;
  freezing_level_m: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  temp_top_c: number;
  temp_base_c: number;
  snow_quality: 'Polvo' | 'Polvo/Dura' | 'Húmeda/Sopa' | 'Costra/Hielo';
  lift_status: 'Abierto' | 'Parcial' | 'Cerrado';
  forecast_5days: {
    date: string;
    snowfall_sum_cm: number;
    temp_max: number;
    temp_min: number;
    weather_code: number;
  }[];
  last_updated: string;
  next_snowfall_time: string | null;
  is_snowing_now: boolean;
}

export const SKI_RESORTS: SkiResort[] = [
  {
    id: 'las-lenas',
    name: 'Las Leñas',
    slug: 'las-lenas',
    country: 'Argentina',
    region: 'Cuyo',
    latitude: -35.15,
    longitude: -70.13,
    elevation_base_m: 2240,
    elevation_top_m: 3430,
    windguru_spot_id: 48911,
    webcam_url: 'https://laslenas.com/camara-en-vivo/',
    border_pass_info: 'Paso Pehuenche: Abierto con precaución. Portación obligatoria de cadenas.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnUd4pQ6VyrBxIRiw9XsjLplfw99vLC2sOnHUvr3oV3_xBtSwQr3zjBOrMfNbx39I0NR5-CUcpeHx6Hg0JfCxu_pRc592sjcXM7fWPs28gXktqu97UMasrRM-g-Kbcq5a6uJmAOy_J67X97TIKWGrPZl-mb3poku55SWYmeS2Q7GG5D4fohqRWaDN3xjjrurohXCULeArzuQMbVsZkDNgeSTvccW8AUQMui6VEZJ6bY-4YfKAbbiFbL16B7wwi0sq6G-A57Wcj8ZU'
  },
  {
    id: 'cerro-catedral',
    name: 'Cerro Catedral',
    slug: 'cerro-catedral',
    country: 'Argentina',
    region: 'Patagonia Norte',
    latitude: -41.17,
    longitude: -71.43,
    elevation_base_m: 1030,
    elevation_top_m: 2180,
    windguru_spot_id: 11985,
    webcam_url: 'https://catedralaltapatagonia.com/webcams/',
    border_pass_info: 'Paso Cardenal Samoré: Abierto. Tránsito habilitado para todo tipo de vehículos.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaqPXIBKD71WotfTlmZZwFPa06YXfIeEl1dV0bAR0ZGg_gk_x4tHuuQbsySJrp7BeWj480uT6O8SnwFMcipYgSEzMC48r9faYY9OJB1hb7JYeFTIzEkhsHdhwiBTK4wXWiuY9b68YXlEtU4P8JXRH84e_QJ8dZhkvOgyQS7e8CUw3I7WWJNVIkltavb435UYFMx5fQ2uEvxWCx2a9J7TAUV7QabTCb3boAR1shbL-ofrdA4fJ2SL2agAiHR--l1tgS-DpU4X5rV2g'
  },
  {
    id: 'chapelco',
    name: 'Chapelco',
    slug: 'chapelco',
    country: 'Argentina',
    region: 'Patagonia Norte',
    latitude: -40.22,
    longitude: -71.29,
    elevation_base_m: 1250,
    elevation_top_m: 1980,
    windguru_spot_id: 18451,
    webcam_url: 'https://www.cerrochapelco.com.ar/webcams-cerro-chapelco/',
    border_pass_info: 'Paso Mamuil Malal: Abierto con extrema precaución por hielo en calzada.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8cIlaSLkCRZNszNuzNfYXYoHy9RnyaxDQAWTRcu1__OSUxa2Ebf6_qZbvHwwisQoUEFEMxUx_gvIaxkDrC_GHCHHr2MrHlxRPP05rtdQVKsY2f7Sp8Fa0hhmEIy_4wGJPlaxDqq42dHtD_bmpzw3F1Fu4cSfBYx20ew4Z51J5sVTd4AaXR-PGhP85KY0Q5uYVDaKHkMxIW1FaDXlvPh2toPLktJrniXq1u2KGkrvhNDGO3HxHFMa7SpSIEobQg40EMwVTEKJieBs'
  },
  {
    id: 'cerro-castor',
    name: 'Cerro Castor',
    slug: 'cerro-castor',
    country: 'Argentina',
    region: 'Patagonia Sur',
    latitude: -54.72,
    longitude: -68.02,
    elevation_base_m: 195,
    elevation_top_m: 1057,
    windguru_spot_id: 88722,
    webcam_url: 'https://www.cerrocastor.com/es_ar/live.html',
    border_pass_info: 'Ruta 3 Ushuaia-Río Grande: Habilitada con cadenas/clavos obligatorios por acumulación.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvd4ioz4t3sVFzfwUC9WVniyBTmp519O5sPJQdVFWqbNpVj26s91Hq8uu1Py2Qlfe-7fbsndpBCzGADftwdDQiiMxe3Q8BA68BBhkH0795aIr4kV0ctxGc4q07vFNDeJDN5GtsbBR42B33AsvqbWn0GFF4MYIhqPSWnwk5UFv3UlKY5opMrLS9afN6GHlFTxlC6na1-bmT0Jr_v-Sxmy4QWNGFtuddYUBZ4CyFGEguCj45_2qHCl-yl649VVh_uQgwNVWWuFCqjfQ'
  },
  {
    id: 'valle-nevado',
    name: 'Valle Nevado',
    slug: 'valle-nevado',
    country: 'Chile',
    region: 'Zona Central',
    latitude: -33.35,
    longitude: -70.25,
    elevation_base_m: 3025,
    elevation_top_m: 3670,
    windguru_spot_id: 48909,
    webcam_url: 'https://www.vallenevado.com/es/montana/mapas/servicios/',
    border_pass_info: 'Paso Cristo Redentor / Los Libertadores: Cerrado temporalmente por viento blanco en cordillera.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0g6LCmfNYvqhVvYnkRiCgkux4NATxQXmetoJVxLXByPyUhy5EMkWD8Ieh9746m5QR0v7zHogFyGgQ68uE44mkEHv04nJuLSZwu9Z40V8PnrH6OCc-VT2JmZ91GyorxXppdCGa6nFksiOKw-WSuCWrcgFBDKJOjYajxSK0PhNJjcqPVqi8BPGxVJ8jemWjkekpl96ZOzoGpgDk0TBlBRkq331WvIc3bcM9wWwOkO0DgaSCnbx4Q4cy8SjP1hS_FVMNoE7tRQGNn2Y'
  },
  {
    id: 'portillo',
    name: 'Portillo',
    slug: 'portillo',
    country: 'Chile',
    region: 'Zona Central',
    latitude: -32.83,
    longitude: -70.13,
    elevation_base_m: 2580,
    elevation_top_m: 3310,
    windguru_spot_id: 25412,
    webcam_url: 'https://skiportillo.com/montana/clima-y-condiciones/#webcams2',
    border_pass_info: 'Paso Los Libertadores: Cerrado por nevadas y baja visibilidad.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoq_T0KIgcw6fYEN-zr0RoVoTM-CbMvxKSnnE0wam14hFuS3kw7Q9LWluaZfZTbTSMPHtDFFBSCYXkKx7ygTFemeKUy41qiPXOgBYSLFvhbdldsvJFj3ZRkhczUwe79IgNBToDm771vTGf8OOvUKBNsOBKWqRdQq-ErbuM0g2X0rF38PsoO38NA2CP7ss-IVPz-jDrGC34St0fFImL3fMHHEL0Ir6VsKAFbgp7p5RlZWIP2YSaR4bv8CVWuy1buMZGPTPXAJjUFbI'
  },
  {
    id: 'la-parva',
    name: 'La Parva',
    slug: 'la-parva',
    country: 'Chile',
    region: 'Zona Central',
    latitude: -33.30,
    longitude: -70.28,
    elevation_base_m: 2663,
    elevation_top_m: 3630,
    windguru_spot_id: 48910,
    webcam_url: 'https://laparva.cl/es/reporte-de-montana/camaras-web/',
    border_pass_info: 'Paso Cristo Redentor / Los Libertadores: Cerrado temporalmente por nevadas.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu3QFPCdCJCJryhmlZw2rW6FbWI38kMj2lJQJ9UYsrgQ45y5KoIVR4sBWzNZF-OeeItVA-6l_9KCbFUUQS_N51jTuMFNf0Hwho5KK-Azqs-ysnY4PlZYL3pz3g0G4DiAxBG84SyGzexdDaAoS-XhTplzr_jVa344uhm_2oEIWNy-OfykTyqzFEkVY3BYH3LK_uixjV03jkISYjgFHmW1U5nql7xxb8y6qKO6pg_voSY1pP0bNZtVnPGF-K-dFDEqfoeU4XYMou4ro'
  },
  {
    id: 'cerro-bayo',
    name: 'Cerro Bayo',
    slug: 'cerro-bayo',
    country: 'Argentina',
    region: 'Patagonia Norte',
    latitude: -40.75,
    longitude: -71.60,
    elevation_base_m: 1050,
    elevation_top_m: 1780,
    windguru_spot_id: 11986,
    webcam_url: 'https://www.cerrobayo.com.ar/montana/camara/',
    border_pass_info: 'Paso Cardenal Samoré: Abierto. Uso obligatorio de cadenas.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG1OkpT97y_fExc5WbtxL_GPGTEVG5TRSUkA7evSuLtV-m70TaN-JA6UqYNy-A-JyCiiEOTxRAixTkOCtCkaQfedfbF9ummYF-VNK3wWk4R_Da8hH05fQ91nLCmN0-AgXvEQ47oOjMQj-u5khWaSjNQZBl99A3la1UIQg3n6vIDo0JEW83IztqmNHsD-nrp-tknggKC9pWkKO7oNkiwctg8NosRipUft4jAcSWHHeO9Mc6AhWPb_GcfWD6SUGJapeZjulXqt4bSBs'
  },
  {
    id: 'caviahue',
    name: 'Caviahue',
    slug: 'caviahue',
    country: 'Argentina',
    region: 'Patagonia Norte',
    latitude: -37.86,
    longitude: -71.02,
    elevation_base_m: 1650,
    elevation_top_m: 2900,
    windguru_spot_id: 18452,
    webcam_url: 'https://www.caviahue.com/partediarioclimamedios',
    border_pass_info: 'Paso Pino Hachado: Abierto. Transitar con extrema precaución.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy6nkWD7H9vDcFbASf9mapqge-XHz4sEn5BrgbfUAlIVXqvSgkuw0ZwAnLmqRPxE0bYuhlZNydMWMxAiLsMu8fha2RoXvdK4J_hdEsdQm_iBL9LjQzJuhcAi1o2o-7A72FFWPpxv32F9xBZdCPEKs__XkrtXfVJnplQZ0O6GUgTvsmEH6Ix78aAh_7ccXsiJj4jPNrAzZwg6oAQD3SvXnQDJiyG_foyNGhUuFRSnZdCcnn0yUywa2rH2h7tpdWZXTwrrXnQTq8gbs'
  },
  {
    id: 'nevados-de-chillan',
    name: 'Nevados de Chillán',
    slug: 'nevados-de-chillan',
    country: 'Chile',
    region: 'Zona Sur',
    latitude: -36.9,
    longitude: -71.41,
    elevation_base_m: 1600,
    elevation_top_m: 2700,
    windguru_spot_id: 56910,
    webcam_url: 'https://www.nevadosdechillan.com/camaras',
    border_pass_info: 'Accesos al cerro: Habilitados con cadenas obligatorias desde el km 55.',
    image_url: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=1000&auto=format&fit=crop'
  }
];

export async function fetchWeatherForResort(resort: SkiResort): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.latitude}&longitude=${resort.longitude}&hourly=snowfall,snow_depth,freezing_level_height,wind_speed_10m,wind_direction_10m,temperature_2m&daily=snowfall_sum,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status} al conectar con la API de Open-Meteo`);
    const data = await res.json();

    // Procesar datos horarios
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    // Métricas del momento actual (usamos el primer slot de hora o el promedio de las primeras horas)
    const currentSnowfall24h = (daily.snowfall_sum && daily.snowfall_sum[0]) || 0;
    const currentSnowfall48h = currentSnowfall24h + ((daily.snowfall_sum && daily.snowfall_sum[1]) || 0);

    // Espesor de nieve en superficie
    // La API de Open-Meteo estima el espesor de nieve (snow_depth) en una cota media-alta (cumbre) debido a la altitud de la grilla.
    // Tratamos rawDepth como espesor estimado en cumbre (top).
    const rawDepth = (hourly.snow_depth && hourly.snow_depth[0]) || 0;
    const topDepthCm = Math.round(rawDepth * 100) || 45; // backup default en cumbre si no hay nieve detectada

    // El espesor en la base depende de la altitud de la base. Centros más altos (como Valle Nevado o Portillo) retienen más nieve en la base.
    // Calculamos un factor de base dinámico entre 0.2 (bases bajas ~1000m) y 0.45 (bases altas ~3000m).
    const elevationBase = resort.elevation_base_m;
    let baseRatio = 0.2; // Default para bases muy bajas
    if (elevationBase > 1000) {
      // Escalar linealmente entre 1000m (ratio 0.2) y 3000m (ratio 0.45)
      baseRatio = 0.2 + Math.min(0.25, ((elevationBase - 1000) / 2000) * 0.25);
    }

    const baseDepthCm = Math.max(15, Math.round(topDepthCm * baseRatio));

    // Altura de la isotermia 0°C
    const freezingLevel = Math.round((hourly.freezing_level_height && hourly.freezing_level_height[0]) || 0);

    // Viento actual
    const windSpeedKmh = (hourly.wind_speed_10m && hourly.wind_speed_10m[0]) || 12;
    const windDir = (hourly.wind_direction_10m && hourly.wind_direction_10m[0]) || 270;

    // Temperaturas
    const tempBase = (hourly.temperature_2m && hourly.temperature_2m[0]) || 0;
    // Gradiente térmico: -0.65°C cada 100m
    const elevationDifference = resort.elevation_top_m - resort.elevation_base_m;
    const tempTop = parseFloat((tempBase - 0.0065 * elevationDifference).toFixed(1));

    // Determinar la calidad de la nieve basándose en meteorología física de montaña
    let snowQuality: WeatherData['snow_quality'] = 'Polvo/Dura';
    if (tempTop < -2.5 && currentSnowfall24h > 4) {
      snowQuality = 'Polvo';
    } else if (tempBase > 2.0 || freezingLevel > resort.elevation_top_m) {
      snowQuality = 'Húmeda/Sopa';
    } else if (daily.temperature_2m_max && daily.temperature_2m_max[0] > 1.5 && daily.temperature_2m_min && daily.temperature_2m_min[0] < -2) {
      snowQuality = 'Costra/Hielo';
    }

    // Estado de los medios según vientos de montaña
    let liftStatus: WeatherData['lift_status'] = 'Abierto';
    if (windSpeedKmh > 50) {
      liftStatus = 'Cerrado';
    } else if (windSpeedKmh > 30) {
      liftStatus = 'Parcial';
    }

    // Pronóstico a 5 días
    const forecast_5days = [];
    for (let i = 0; i < 5; i++) {
      const dateStr = daily.time ? daily.time[i] : new Date().toISOString().split('T')[0];
      forecast_5days.push({
        date: dateStr,
        snowfall_sum_cm: daily.snowfall_sum ? daily.snowfall_sum[i] : 0,
        temp_max: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[i]) : 0,
        temp_min: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[i]) : 0,
        weather_code: daily.weather_code ? daily.weather_code[i] : 0
      });
    }

    // Encontrar cuándo empieza a nevar (primer registro a partir de ahora con snowfall > 0.1)
    let nextSnowfallTime: string | null = null;
    let isSnowingNow = false;
    const now = new Date();
    
    if (hourly.time && hourly.snowfall) {
      let currentIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < hourly.time.length; i++) {
        const diff = Math.abs(new Date(hourly.time[i]).getTime() - now.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          currentIdx = i;
        }
      }

      if (hourly.snowfall[currentIdx] > 0.1) {
        isSnowingNow = true;
        nextSnowfallTime = hourly.time[currentIdx];
      } else {
        for (let i = currentIdx + 1; i < hourly.time.length; i++) {
          if (hourly.snowfall[i] > 0.1) {
            nextSnowfallTime = hourly.time[i];
            break;
          }
        }
      }
    }

    return {
      snowfall_24h_cm: currentSnowfall24h,
      snowfall_48h_cm: currentSnowfall48h,
      snow_depth_base_cm: Math.round(baseDepthCm),
      snow_depth_top_cm: Math.round(topDepthCm),
      freezing_level_m: freezingLevel,
      wind_speed_kmh: parseFloat(windSpeedKmh.toFixed(1)),
      wind_direction_deg: windDir,
      temp_top_c: tempTop,
      temp_base_c: parseFloat(tempBase.toFixed(1)),
      snow_quality: snowQuality,
      lift_status: liftStatus,
      forecast_5days,
      last_updated: new Date().toISOString(),
      next_snowfall_time: nextSnowfallTime,
      is_snowing_now: isSnowingNow
    };

  } catch (error) {
    console.error(`Error en fetchWeatherForResort para ${resort.name}:`, error);
    // Retornar fallback razonable si falla la API
    return getFallbackWeatherData(resort);
  }
}

function getFallbackWeatherData(resort: SkiResort): WeatherData {
  // Generar algunos datos estáticos coherentes y realistas para montaña
  const defaultBase = resort.slug === 'cerro-castor' ? 40 : 80;
  return {
    snowfall_24h_cm: 12,
    snowfall_48h_cm: 25,
    snow_depth_base_cm: defaultBase,
    snow_depth_top_cm: defaultBase * 2 + 10,
    freezing_level_m: resort.elevation_base_m - 300, // Isotermia baja (buena nieve)
    wind_speed_kmh: 18,
    wind_direction_deg: 270,
    temp_top_c: -6.5,
    temp_base_c: -1.0,
    snow_quality: 'Polvo',
    lift_status: 'Abierto',
    forecast_5days: [
      { date: 'Hoy', snowfall_sum_cm: 12, temp_max: 1, temp_min: -8, weather_code: 73 },
      { date: 'Mañana', snowfall_sum_cm: 18, temp_max: -1, temp_min: -9, weather_code: 75 },
      { date: 'Día 3', snowfall_sum_cm: 0, temp_max: 3, temp_min: -5, weather_code: 1 },
      { date: 'Día 4', snowfall_sum_cm: 0, temp_max: 4, temp_min: -4, weather_code: 0 },
      { date: 'Día 5', snowfall_sum_cm: 5, temp_max: 2, temp_min: -6, weather_code: 71 }
    ],
    last_updated: 'Fallback (Sin Conexión)',
    next_snowfall_time: null,
    is_snowing_now: false
  };
}

export function getWeatherIcon(code: number): string {
  // Mapeo simple de códigos WMO (World Meteorological Organization)
  if (code === 0) return '☀️'; // Sol
  if (code >= 1 && code <= 3) return '🌤️'; // Parcialmente nublado
  if (code >= 45 && code <= 48) return '🌫️'; // Niebla
  if (code >= 51 && code <= 67) return '🌧️'; // Llovizna/Lluvia
  if (code >= 71 && code <= 77) return '❄️'; // Nieve
  if (code >= 80 && code <= 82) return '🌦️'; // Chaparrones
  if (code >= 85 && code <= 86) return '🌨️'; // Chaparrones de nieve
  if (code >= 95 && code <= 99) return '⛈️'; // Tormenta
  return '☁️';
}

export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(((deg % 360) / 45)) % 8;
  return directions[index];
}
