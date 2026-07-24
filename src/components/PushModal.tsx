'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, Shield, Check, Heart } from 'lucide-react';
import { SKI_RESORTS, SkiResort } from '@/services/dataService';

interface PushModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PushModal({ isOpen, onClose }: PushModalProps) {
  const [subscribedResorts, setSubscribedResorts] = useState<string[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Cargar suscripciones guardadas desde LocalStorage
    const saved = localStorage.getItem('pipos_subscribed_resorts');
    if (saved) {
      try {
        setSubscribedResorts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const savedPerm = localStorage.getItem('pipos_push_permission');
    if (savedPerm === 'granted') {
      setPermissionGranted(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleToggleResort = (id: string) => {
    let updated;
    if (subscribedResorts.includes(id)) {
      updated = subscribedResorts.filter(rId => rId !== id);
    } else {
      updated = [...subscribedResorts, id];
    }
    setSubscribedResorts(updated);
  };

  const handleRequestPermission = () => {
    setLoading(true);
    // Simular solicitud de permiso Web Push
    setTimeout(() => {
      setPermissionGranted(true);
      localStorage.setItem('pipos_push_permission', 'granted');
      setLoading(false);
    }, 1200);
  };

  const handleSave = () => {
    localStorage.setItem('pipos_subscribed_resorts', JSON.stringify(subscribedResorts));
    // Guardar también en los favoritos globales para sincronizar la UI
    localStorage.setItem('pipos_favorite_resorts', JSON.stringify(subscribedResorts));
    
    // Disparar evento para notificar al dashboard que los favoritos cambiaron
    window.dispatchEvent(new Event('favorites-updated'));
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101418]/80 backdrop-blur-md transition-all duration-300">
      <div 
        className="relative w-full max-w-md bg-[#1E252B] border border-[#2E3A44] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#2E3A44]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#00FF9D] animate-bounce" />
            <div>
              <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wide">
                Configurar Alertas
              </h2>
              <p className="text-[10px] text-[#00E5FF] font-semibold tracking-wider uppercase">
                Powder Alerts (+15cm)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-[#2E3A44] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <p className="text-xs text-slate-400 leading-relaxed">
            Te notificaremos instantáneamente en tu navegador cuando tus centros favoritos acumulen <span className="text-[#00FF9D] font-bold">+15 cm</span> de nieve fresca en las últimas 24 horas.
          </p>

          {/* Permiso Web Push */}
          {!permissionGranted ? (
            <div className="bg-[#12161A] border border-[#2E3A44] p-4 rounded-md flex flex-col gap-3">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-200">Permiso de Notificaciones</h3>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Debes conceder permisos de notificación en tu navegador para recibir los reportes en tiempo real.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRequestPermission}
                disabled={loading}
                className="w-full bg-[#00E5FF] hover:bg-[#00cce3] text-[#101418] py-2 text-xs font-extrabold rounded-md shadow-[0_0_10px_rgba(0,229,255,0.15)] transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Solicitando...' : 'Habilitar Notificaciones'}
              </button>
            </div>
          ) : (
            <div className="bg-[#12161A]/40 border border-[#00FF9D]/30 px-3 py-2 rounded-md flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00FF9D]" /> Notificaciones Habilitadas
              </span>
              <span className="text-[9px] bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20 px-2 py-0.5 rounded-full font-bold">
                ACTIVO
              </span>
            </div>
          )}

          {/* Lista de Centros */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Selecciona tus Cerros Favoritos
            </h3>
            
            <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
              {SKI_RESORTS.map((resort) => {
                const isSelected = subscribedResorts.includes(resort.id);
                return (
                  <div
                    key={resort.id}
                    onClick={() => handleToggleResort(resort.id)}
                    className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#1E252B] border-[#00FF9D]/40 text-[#00FF9D] shadow-[inset_0_0_10px_rgba(0,255,157,0.02)]' 
                        : 'bg-[#12161A]/55 border-[#2E3A44] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {resort.country === 'Argentina' ? '🇦🇷' : '🇨🇱'}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{resort.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{resort.region}</p>
                      </div>
                    </div>
                    <button className="focus:outline-none">
                      <Heart 
                        className={`w-4 h-4 transition-all duration-300 ${
                          isSelected 
                            ? 'fill-[#00FF9D] text-[#00FF9D] scale-110' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`} 
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#2E3A44] bg-[#12161A]/60 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-transparent hover:bg-[#2E3A44] text-slate-300 hover:text-slate-100 py-2 border border-[#2E3A44] text-xs font-bold rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#00FF9D] hover:bg-[#00e089] text-[#002110] py-2 text-xs font-extrabold rounded-md shadow-[0_0_15px_rgba(0,255,157,0.2)] transition-all active:scale-[0.98]"
          >
            Guardar Alertas
          </button>
        </div>

      </div>
    </div>
  );
}
