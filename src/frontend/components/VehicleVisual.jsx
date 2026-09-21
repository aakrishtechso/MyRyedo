import React, { useState } from 'react';
import { Car, Zap, ShieldCheck } from 'lucide-react';

export const VehicleVisual = ({
  vehicle,
  className = '',
  aspectRatio = 'aspect-[16/10]',
  size = 'medium' // 'small' | 'medium' | 'large'
}) => {
  const [imageError, setImageError] = useState(false);

  const rawImage = vehicle?.images && vehicle.images.length > 0 ? vehicle.images[0] : null;
  const hasValidImage = !!rawImage && !rawImage.startsWith('blob:') && !imageError;

  const category = (vehicle?.category || 'cars').toLowerCase();
  const fuel = (vehicle?.fuel || '').toLowerCase();
  const isElectric = fuel.includes('electric') || category === 'evs';

  // Category styling theme
  const getCategoryMeta = () => {
    if (category === 'bikes') {
      return {
        label: 'Motorcycle',
        tag: 'Bike',
        bg: 'from-amber-900/10 via-amber-800/5 to-slate-900/10',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
        accentColor: '#D97706'
      };
    }
    if (category === 'scooters') {
      return {
        label: 'Scooter',
        tag: 'Scooter',
        bg: 'from-emerald-900/10 via-emerald-800/5 to-slate-900/10',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        accentColor: '#059669'
      };
    }
    if (category === 'suvs') {
      return {
        label: 'SUV / Crossover',
        tag: 'SUV',
        bg: 'from-blue-900/10 via-blue-800/5 to-slate-900/10',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
        accentColor: '#2563EB'
      };
    }
    if (isElectric) {
      return {
        label: 'Electric Vehicle',
        tag: 'EV',
        bg: 'from-teal-900/10 via-teal-800/5 to-slate-900/10',
        badgeBg: 'bg-teal-100 text-teal-900 border-teal-200',
        accentColor: '#0D9488'
      };
    }
    return {
      label: 'Car',
      tag: 'Car',
      bg: 'from-orange-900/10 via-orange-800/5 to-slate-900/10',
      badgeBg: 'bg-orange-100 text-[#FF6400] border-orange-200',
      accentColor: '#FF6400'
    };
  };

  const meta = getCategoryMeta();

  if (hasValidImage) {
    return (
      <div className={`relative overflow-hidden bg-slate-50 flex items-center justify-center ${className}`}>
        <img
          src={rawImage}
          alt={vehicle?.name || 'Vehicle'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300"
          loading="lazy"
        />
      </div>
    );
  }

  // Pure SVG/CSS Clean Fallback representation (no broken links or empty grey boxes)
  return (
    <div 
      className={`relative overflow-hidden bg-gradient-to-br ${meta.bg} bg-slate-900 text-white flex flex-col items-center justify-center p-4 select-none ${className}`}
    >
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Center Silhouette & Badges */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[90%]">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg">
          {isElectric ? (
            <Zap className="w-8 h-8 text-teal-400" />
          ) : (
            <Car className="w-8 h-8 text-orange-400" />
          )}
        </div>

        <div>
          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-1 border ${meta.badgeBg}`}>
            {meta.label}
          </span>
          <h4 className="text-sm sm:text-base font-black text-white truncate max-w-[240px]">
            {vehicle?.brand ? `${vehicle.brand} ${vehicle.model || ''}` : vehicle?.name || 'MyRyedo Verified'}
          </h4>
          <p className="text-[11px] text-slate-300 font-medium">
            {vehicle?.year || 'Verified'} · {vehicle?.fuel || 'Standard'} · {vehicle?.transmission || 'Manual'}
          </p>
        </div>
      </div>

      {/* Verified security tag */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-emerald-400 font-bold">
        <ShieldCheck className="w-3 h-3" />
        <span>Verified MyRyedo Listing</span>
      </div>
    </div>
  );
};
