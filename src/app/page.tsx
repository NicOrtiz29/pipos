'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Snowflake, Star, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroRanking from '@/components/HeroRanking';
import ResortCard from '@/components/ResortCard';
import WindyMap from '@/components/WindyMap';
import PushModal from '@/components/PushModal';
import { SKI_RESORTS, SkiResort, WeatherData } from '@/services/dataService';

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<'Argentina' | 'Chile' | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortBy, setSortBy] = useState<'snowfall_24h' | 'snow_depth_top' | 'name'>('snowfall_24h');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [resortsData, setResortsData] = useState<{ resort: SkiResort; weather: WeatherData }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('08:45 AM ART');

  // Cargar datos al montar
  useEffect(() => {
    loadFavorites();
    fetchAllWeather();

    // Sincronizar favoritos cuando se actualicen en el modal
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
    };
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('pipos_favorite_resorts');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const fetchAllWeather = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/weather');
      if (!res.ok) throw new Error('Error al obtener datos climáticos del servidor');
      const results = await res.json();
      setResortsData(results);
      if (results.length > 0) {
        setLastUpdatedTime(results[0].weather.last_updated);
      }
    } catch (e) {
      console.error('Error al obtener el clima:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('pipos_favorite_resorts', JSON.stringify(updated));
    localStorage.setItem('pipos_subscribed_resorts', JSON.stringify(updated));
  };

  // Regiones dinámicas según país
  const getRegionsForCountry = () => {
    if (selectedCountry === 'Argentina') {
      return ['ALL', 'Cuyo', 'Patagonia Norte', 'Patagonia Sur'];
    }
    if (selectedCountry === 'Chile') {
      return ['ALL', 'Zona Central', 'Zona Sur'];
    }
    return ['ALL', 'Cuyo', 'Patagonia Norte', 'Patagonia Sur', 'Zona Central', 'Zona Sur'];
  };

  // Filtrado y Ordenamiento
  const filteredResorts = resortsData.filter(({ resort }) => {
    // Filtro por país
    if (selectedCountry !== 'ALL' && resort.country !== selectedCountry) {
      return false;
    }
    // Filtro por región
    if (selectedRegion !== 'ALL' && resort.region !== selectedRegion) {
      return false;
    }
    // Filtro por buscador
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = resort.name.toLowerCase().includes(query);
      const matchRegion = resort.region.toLowerCase().includes(query);
      if (!matchName && !matchRegion) {
        return false;
      }
    }
    return true;
  });

  // Ordenar
  const sortedResorts = [...filteredResorts].sort((a, b) => {
    if (sortBy === 'snowfall_24h') {
      return b.weather.snowfall_24h_cm - a.weather.snowfall_24h_cm;
    }
    if (sortBy === 'snow_depth_top') {
      return b.weather.snow_depth_top_cm - a.weather.snow_depth_top_cm;
    }
    return a.resort.name.localeCompare(b.resort.name);
  });

  // Separar los favoritos de los demás cerros para mostrarlos destacados si existen
  const favoriteResortsList = sortedResorts.filter(r => favorites.includes(r.resort.id));
  const normalResortsList = sortedResorts.filter(r => !favorites.includes(r.resort.id));

  return (
    <main className="min-h-screen bg-[#101418] text-slate-100 pb-20">
      
      {/* Navbar Global */}
      <Navbar
        selectedCountry={selectedCountry}
        setSelectedCountry={(c) => {
          setSelectedCountry(c);
          setSelectedRegion('ALL'); // resetear región al cambiar país
        }}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onRefresh={fetchAllWeather}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdatedTime}
      />

      <div className="pt-24 px-4 md:px-8 max-w-[1280px] mx-auto space-y-12">
        
        {/* Loader de Shimmer */}
        {loading ? (
          <div className="space-y-12">
            {/* Shimmer Hero */}
            <div className="space-y-4">
              <div className="h-6 w-48 bg-[#1E252B] rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-56 bg-[#1E252B] rounded-lg animate-pulse border border-[#2E3A44]" />
                ))}
              </div>
            </div>

            {/* Shimmer Filtros */}
            <div className="h-14 bg-[#1E252B] rounded-lg animate-pulse border border-[#2E3A44]" />

            {/* Shimmer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-[#1E252B] rounded-lg animate-pulse border border-[#2E3A44]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 1. Sección Hero - Clasificación Top Powder */}
            <HeroRanking resortsData={resortsData} />

            {/* 2. Barra de Búsqueda y Filtros Interactivos */}
            <section className="bg-[#1E252B] border border-[#2E3A44] p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar cerro (ej: Chapelco)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12161A] border border-[#2E3A44] hover:border-slate-500 focus:border-[#00E5FF] text-xs py-2.5 pl-10 pr-4 rounded text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Filtros de Región */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#00E5FF]" /> Región:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {getRegionsForCountry().map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all border ${
                        selectedRegion === reg
                          ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/45 shadow-[0_0_10px_rgba(0,229,255,0.05)]'
                          : 'bg-[#12161A] text-slate-400 border-transparent hover:border-[#2E3A44] hover:text-slate-200'
                      }`}
                    >
                      {reg === 'ALL' ? 'Todas' : reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordenamiento */}
              <div className="w-full md:w-auto flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#2E3A44]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block shrink-0">
                  Ordenar por:
                </span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-[#12161A] border border-[#2E3A44] text-xs px-3 py-2 rounded text-slate-300 focus:border-[#00E5FF] focus:outline-none transition-all cursor-pointer font-bold w-full md:w-auto"
                >
                  <option value="snowfall_24h">Mayor Nieve 24h</option>
                  <option value="snow_depth_top">Mayor Espesor Cumbre</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </section>

            {/* 3. Grilla de Reportes de Cerros */}
            <section className="space-y-6">
              
              {/* Sección de Favoritos Destacados */}
              {favoriteResortsList.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#2E3A44]/60 pb-2">
                    <Star className="w-4 h-4 text-[#00FF9D] fill-[#00FF9D]" />
                    <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                      Tus Centros Seguidos
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteResortsList.map(({ resort, weather }) => (
                      <ResortCard
                        key={resort.id}
                        resort={resort}
                        weather={weather}
                        isFavorite={true}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Todos los Cerros */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 border-b border-[#2E3A44]/60 pb-2">
                  <Snowflake className="w-4 h-4 text-[#00E5FF]" />
                  <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                    {favoriteResortsList.length > 0 ? 'Otros Reportes de Montaña' : 'Reportes de Nieve'}
                  </h3>
                </div>

                {sortedResorts.length === 0 ? (
                  <div className="bg-[#1E252B] border border-[#2E3A44] rounded-lg p-10 text-center text-slate-400">
                    No se encontraron centros de esquí con los criterios de búsqueda actuales.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {normalResortsList.map(({ resort, weather }) => (
                      <ResortCard
                        key={resort.id}
                        resort={resort}
                        weather={weather}
                        isFavorite={favorites.includes(resort.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>

            </section>

            {/* 4. Mapa Meteorológico Interactivo */}
            <section className="space-y-4">
              <div className="border-b border-[#2E3A44]/60 pb-2">
                <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
                  </span>
                  Mapa en Vivo de la Cordillera
                </h3>
              </div>
              <WindyMap />
            </section>
          </>
        )}

      </div>

      {/* Modal de Alertas */}
      <PushModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

    </main>
  );
}
