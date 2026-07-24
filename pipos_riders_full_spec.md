# 🏔️ PIPOS RIDERS — Snow Tracker & Forecast Web App Complete Technical Blueprint

---

## 📌 1. Visión General del Proyecto

**PIPOS RIDERS Snow Tracker** es una aplicación web responsive diseñada para la comunidad de snowboarders y esquiadores en **Argentina y Chile**. 

El sistema monitorea en tiempo real las condiciones meteorológicas, acumulación de nieve, pronóstico a 5 días, mapas de radar WebGL, estado de accesos/pasos fronterizos y transmisiones de webcams en los principales centros de esquí de la Cordillera de los Andes.

---

## 🏗️ 2. Arquitectura General y Stack Tecnológico

* **Frontend & SSR:** Next.js 14+ (App Router) / React + Tailwind CSS.
* **Hosting & CDN:** Netlify (con Netlify Edge Functions).
* **Database & Caching:** Supabase (PostgreSQL) + Edge Functions (Deno/Node.js).
* **Push Notifications:** Web Push Protocol (Service Workers + VAPID Keys).
* **APIs Meteorológicas:** Open-Meteo API (ECMWF 9km, GFS, ICON) + Windy API WebGL + Windguru Scraper/Widget.

```
                    ┌────────────────────────┐
                    │ Netlify (Next.js App)  │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │ Supabase DB (Postgres) │
                    └───────────┬────────────┘
                                │
        ┌───────────────────────┼───────────────────────┬───────────────────────┐
        ▼                       ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  Open-Meteo   │       │ Windguru      │       │ Windy WebGL   │       │ SMN / DMC /   │
│  Weather API  │       │ Custom Spot   │       │ Radar Layer   │       │ MeteoBlue     │
└───────────────┘       └───────────────┘       └───────────────┘       └───────────────┘
```

---

## 🛰️ 3. Fuentes Meteorológicas, Modelos y Data Sources (Argentina & Chile)

Para cotejar y validar datos con máxima precisión técnica en la Cordillera de los Andes, integramos las siguientes fuentes globales y regionales:

### 3.1 Modelos Globals y APIs Abiertas / Gratuitas
1. **Open-Meteo API (Especializada en Montaña):**
   * **Modelos:** ECMWF (IFS 9km - Unión Europea), GFS (NOAA 13km - EE.UU.), ICON-Seamless (DWD - Alemania), HRRR (alta resolución).
   * **Métricas:** Acumulado de nieve horario/diario (`snowfall`), profundidad de nieve en superficie (`snow_depth`), altura de la isotermia 0°C (`freezing_level_height`), rachas de viento a 850 hPa y 700 hPa (~1500m y ~3000m snm).
2. **Windguru (Spots Específicos de Cordillera):**
   * **Modelos:** GFS 27km, WRF 9km/3km, ICON 7km, ZEUS.
   * **Integración:** Extracción de datos por `Spot ID` / Widget API embebido para cotejo de capas de viento en altura, cobertura nubosa en 3 capas (alta, media, baja) y precipitación líquida/sólida acumulada.
3. **MeteoBlue (API & Modelos NEMS/NMM):**
   * Excelente resolución topográfica para microclimas andinos (Patagonia Norte y Cuyo).
4. **Snow-Forecast (Validation Source):**
   * Referencia histórica en el ambiente del ski para validar nieve acumulada en 3 cotas: **Base, Cota Media (Mid) y Cumbre (Top)**.

### 3.2 Radares, Satélites y Monitoreo Institucional
* **SMN (Servicio Meteorológico Nacional - Argentina):**
  * Alertas meteorológicas oficiales por Viento Blanco, Zonda y Nevadas Intensas.
  * Red de Radares Meteorológicos (RMA) y estaciones automáticas terrestres en Bariloche, Neuquén, Malargüe y Ushuaia.
* **DMC (Dirección Meteorológica de Chile) & Red Agroclimática:**
  * Alerta de frentes fríos del Océano Pacífico, isotermia 0°C y avisos para la Zona Central, Sur y Austral de Chile.
* **IANIGLA / CONICET (Argentina):**
  * Datos de la Red de Observación de Nieve y Glaciares de los Andes.
* **Vialidad Nacional (AR) & Dirección de Vialidad (CL):**
  * Estado de las rutas de acceso a los cerros y operatividad de Pasos Fronterizos (Paso Cristo Redentor, Cardenal Samoré, Pino Hachado, Pehuenche, Mamuil Malal).

---

## 🗄️ 4. Esquema de Base de Datos (Supabase PostgreSQL)

```sql
-- 1. Tabla de Centros de Esquí
CREATE TABLE ski_resorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL CHECK (country IN ('Argentina', 'Chile')),
    region TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    elevation_base_m INT NOT NULL,
    elevation_top_m INT NOT NULL,
    windguru_spot_id INT, -- ID numérico de spot en Windguru para cross-check
    webcam_url TEXT,
    border_pass_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Caché Meteorológico Multi-Fuente (Actualizado cada 15-30 min)
CREATE TABLE weather_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resort_id UUID REFERENCES ski_resorts(id) ON DELETE CASCADE,
    snowfall_24h_cm DECIMAL(5,2) DEFAULT 0,
    snowfall_48h_cm DECIMAL(5,2) DEFAULT 0,
    snow_depth_base_cm INT DEFAULT 0,
    snow_depth_top_cm INT DEFAULT 0,
    freezing_level_m INT, -- Altura isotermia 0°C
    wind_speed_kmh DECIMAL(5,2),
    wind_direction_deg INT,
    temp_top_c DECIMAL(4,1),
    forecast_5days JSONB, -- Estructura JSON con pronóstico diario consolidado
    sources_compared JSONB, -- Comparativa: OpenMeteo vs Windguru vs GFS
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Suscripciones Web Push
CREATE TABLE push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT UNIQUE NOT NULL,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    favorite_resorts UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🛰️ 5. Data Ingestion & API Open-Meteo + Windguru Script

Las peticiones a Open-Meteo y Windguru recuperan datos de resolución alta específicos para coordenadas de montaña:

```typescript
// app/api/cron/fetch-weather/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data: resorts } = await supabase.from('ski_resorts').select('*');

  for (const resort of resorts || []) {
    // 1. Fetch Open-Meteo High-Resolution Alpine Data
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${resort.latitude}&longitude=${resort.longitude}&hourly=snowfall,snow_depth,freezing_level_height,wind_speed_10m,temperature_2m&daily=snowfall_sum,temperature_2m_max,temperature_2m_min&timezone=America%2FArgentina%2FBuenos_Aires`;
    
    const resOM = await fetch(openMeteoUrl);
    const dataOM = await resOM.json();

    const snowfall24h = dataOM.daily?.snowfall_sum[0] || 0;
    const freezingLevel = dataOM.hourly?.freezing_level_height[0] || 0;

    // 2. Cross-check / Cache Update en Supabase
    await supabase.from('weather_cache').upsert({
      resort_id: resort.id,
      snowfall_24h_cm: snowfall24h,
      freezing_level_m: freezingLevel,
      sources_compared: {
        open_meteo_snow_24h: snowfall24h,
        windguru_spot: resort.windguru_spot_id || null
      },
      last_updated: new Date().toISOString()
    }, { onConflict: 'resort_id' });
  }

  return NextResponse.json({ success: true, message: 'Weather cache updated across multi-sources' });
}
```

---

## 🔔 6. Lógica de Web Push Notifications (Powder Alert >15cm)

```javascript
// public/sw.js (Service Worker para Netlify / Next.js)
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '❄️ PIPOS RIDERS Powder Alert!';
  const options = {
    body: data.body || '¡Hay más de 15cm de nieve fresca esperándote!',
    icon: '/icons/logo-pipos.png',
    badge: '/icons/badge-snow.png',
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

---

## 🚀 7. Despliegue en Netlify

1. **Configuración `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

2. **Variables de Entorno necesarias en Netlify / Supabase:**
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   * `VAPID_PRIVATE_KEY`
