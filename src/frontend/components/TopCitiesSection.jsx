import React from 'react';
import { ShieldCheck, KeyRound, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

export const TopCitiesSection = ({ onSelectCity, onOpenWaitlist }) => {
  const cities = [
    {
      name: 'Indore',
      vehicles: 'Active Hub · Vijay Nagar Cluster',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
      badge: 'Active Launch Hub'
    },
    {
      name: 'Pune',
      vehicles: 'Cars, Bikes & EVs',
      image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Mumbai',
      vehicles: 'Airport & City Travel',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Bangalore',
      vehicles: 'Tech Parks & Getaways',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Top cities & service hubs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Explore vehicles in active operational clusters.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenWaitlist && onOpenWaitlist()}
              className="text-xs sm:text-sm font-bold text-[#FF6400] hover:underline cursor-pointer flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" /> Request my area
            </button>
            <button
              onClick={() => onSelectCity('Indore')}
              className="text-xs sm:text-sm font-bold text-[#1769D1] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
        </div>

        {/* 4 City Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cities.map((city) => (
            <div
              key={city.name}
              onClick={() => onSelectCity(city.name)}
              className="group relative h-40 sm:h-44 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {city.badge && (
                <div className="absolute top-3 left-3 bg-[#FF6400] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                  {city.badge}
                </div>
              )}
              <div className="absolute bottom-3.5 left-4 text-white">
                <h3 className="text-base font-bold leading-tight drop-shadow-xs">
                  {city.name}
                </h3>
                <p className="text-[11px] text-gray-200 font-medium">
                  {city.vehicles}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Core Guarantees Bar (Verified Real Standards) */}
        <div className="mt-10 py-6 px-4 bg-[#FAFBFD] rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1: ID Verified */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3EB] flex items-center justify-center text-[#FF7A00] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#111827] leading-tight">100% ID Verified</div>
              <div className="text-[11px] text-gray-500 font-medium">Verified driving licenses</div>
            </div>
          </div>

          {/* Feature 2: Smart Handover */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3EB] flex items-center justify-center text-[#FF7A00] shrink-0">
              <KeyRound className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#111827] leading-tight">Inspected Vehicles</div>
              <div className="text-[11px] text-gray-500 font-medium">Digital pre-trip handover logs</div>
            </div>
          </div>

          {/* Feature 3: Trip Protection */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3EB] flex items-center justify-center text-[#FF7A00] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#111827] leading-tight">Trip Protection</div>
              <div className="text-[11px] text-gray-500 font-medium">24/7 Roadside assistance</div>
            </div>
          </div>

          {/* Feature 4: Transparent Pricing */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3EB] flex items-center justify-center text-[#FF7A00] shrink-0">
              <Sparkles className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#111827] leading-tight">Direct Host Rates</div>
              <div className="text-[11px] text-gray-500 font-medium">No hidden commissions</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
