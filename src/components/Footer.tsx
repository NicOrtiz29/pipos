'use client';

import React from 'react';
import { ExternalLink, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#12161A] border-t border-[#2E3A44] mt-16 py-12 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Info del Sitio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-100">
            <span className="font-extrabold text-sm tracking-wider uppercase">
              🏔️ PIPOS RIDERS
            </span>
            <span className="text-[10px] bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 px-2 py-0.5 rounded font-black tracking-wider uppercase">
              Datos Científicos
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md font-medium">
            Seguimiento meteorológico de montaña de alta resolución y estado de acumulación de nieve en la cordillera de los Andes de Argentina y Chile. Diseñado para riders y deportistas de invierno.
          </p>
          <div className="text-[10px] text-slate-500 font-medium">
            © 2026 PIPOS RIDERS. Chasing the perfect powder.
          </div>
        </div>

        {/* Fuentes y Links Oficiales */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#00E5FF]" /> Fuentes de Información
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                Meteorología & Pronóstico
              </span>
              <ul className="space-y-2 text-xs text-slate-300 font-bold">
                <li>
                  <a 
                    href="https://open-meteo.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#00E5FF] inline-flex items-center gap-1 transition-colors"
                  >
                    Open-Meteo API <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.windy.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#00E5FF] inline-flex items-center gap-1 transition-colors"
                  >
                    Windy WebGL Layers <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                Vialidad & Pasos Fronterizos
              </span>
              <ul className="space-y-2 text-xs text-slate-300 font-bold">
                <li>
                  <a 
                    href="https://www.argentina.gob.ar/obras-publicas/vialidad-nacional" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#00E5FF] inline-flex items-center gap-1 transition-colors"
                  >
                    Vialidad Nacional AR <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a 
                    href="http://www.vialidad.cl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#00E5FF] inline-flex items-center gap-1 transition-colors"
                  >
                    Vialidad Chile (MOP) <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
        </div>

      </div>
    </footer>
  );
}
