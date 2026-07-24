'use client';

import React, { useState, useEffect } from 'react';
import { Bell, RotateCw } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  selectedCountry: 'Argentina' | 'Chile' | 'ALL';
  setSelectedCountry: (country: 'Argentina' | 'Chile' | 'ALL') => void;
  onOpenAlerts: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export default function Navbar({
  selectedCountry,
  setSelectedCountry,
  onOpenAlerts,
  onRefresh,
  isRefreshing,
  lastUpdated
}: NavbarProps) {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    if (!lastUpdated) {
      setLocalTime('');
      return;
    }
    
    // Comprobar si es un timestamp ISO válido
    if (lastUpdated.includes('T') || !isNaN(Date.parse(lastUpdated))) {
      try {
        const date = new Date(lastUpdated);
        // Formato de hora corto (ej: 16:39)
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Obtener zona horaria del cliente en formato corto (ej: ART, CLT, GMT-3)
        const parts = date.toLocaleDateString('es-AR', { timeZoneName: 'short' }).split(' ');
        const tzName = parts[parts.length - 1] || '';
        
        setLocalTime(`${timeStr} ${tzName}`);
      } catch (e) {
        setLocalTime(lastUpdated);
      }
    } else {
      setLocalTime(lastUpdated);
    }
  }, [lastUpdated]);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#12161A]/90 frost-glass border-b border-[#2E3A44]">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1280px] mx-auto h-16">
        
        {/* Izquierda: Logo y Navegación */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-[#2E3A44] group-hover:border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors">
              <img 
                src="/logo.png" 
                alt="PIPOS RIDERS Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-lg font-extrabold tracking-wider text-slate-100 group-hover:text-[#00E5FF] transition-colors text-glow">
                PIPOS RIDERS
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Snow Tracker
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-4 ml-6 pl-6 border-l border-[#2E3A44]/60">
            <Link href="/" className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-[#00E5FF] transition-colors">
              Dashboard
            </Link>
            <Link href="/mapa" className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-[#00E5FF] transition-colors">
              Mapa
            </Link>
          </nav>
        </div>

        {/* Centro: Toggles de País */}
        <div className="hidden sm:flex items-center bg-[#1E252B] p-1 rounded-full border border-[#2E3A44]">
          <button
            onClick={() => setSelectedCountry('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              selectedCountry === 'ALL'
                ? 'bg-[#00E5FF] text-[#101418] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TODOS
          </button>
          <button
            onClick={() => setSelectedCountry('Argentina')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              selectedCountry === 'Argentina'
                ? 'bg-[#00E5FF] text-[#101418] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇦🇷</span> Argentina
          </button>
          <button
            onClick={() => setSelectedCountry('Chile')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              selectedCountry === 'Chile'
                ? 'bg-[#00E5FF] text-[#101418] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇨🇱</span> Chile
          </button>
        </div>

        {/* Derecha: Estado, Sync, CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-[#1E252B]/50 px-3 py-1.5 rounded-md border border-[#2E3A44]/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D]"></span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Act: {localTime || lastUpdated}
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-[#00E5FF] hover:bg-[#1E252B] rounded-full border border-transparent hover:border-[#2E3A44] transition-all active:scale-95 disabled:opacity-50"
            title="Sincronizar datos"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#00E5FF]' : ''}`} />
          </button>

          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-2 bg-[#00FF9D] hover:bg-[#00e089] text-[#002110] px-4 py-2 text-xs font-extrabold rounded-md shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all duration-200 active:scale-95"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Activar Powder Alerts</span>
            <span className="sm:hidden">Alertas</span>
          </button>
        </div>

      </div>
    </header>
  );
}
