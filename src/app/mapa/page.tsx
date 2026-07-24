'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PushModal from '@/components/PushModal';
import dynamic from 'next/dynamic';

// Importar dinámicamente para prevenir errores de compilación SSR con la librería de Leaflet
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#101418] text-slate-100 flex flex-col justify-center items-center gap-4">
      <div className="w-8 h-8 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando Mapa de Nevadas...</p>
    </div>
  )
});

export default function MapaPage() {
  const [selectedCountry, setSelectedCountry] = useState<'Argentina' | 'Chile' | 'ALL'>('ALL');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#101418] text-slate-100 overflow-hidden">
      
      {/* Navbar con toggles sincronizados con el mapa */}
      <Navbar
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onRefresh={() => {}}
        isRefreshing={false}
        lastUpdated="En Vivo"
      />

      <div className="pt-16">
        <InteractiveMap 
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>

      <PushModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

    </main>
  );
}
