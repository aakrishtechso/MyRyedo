import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';

export const VehicleCard = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isHighlighted = false
}) => {
  return (
    <div
      id={`vehicle-card-${vehicle.id}`}
      onClick={() => onSelect(vehicle)}
      className={`group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-lg ${
        isHighlighted
          ? 'border-[#FF6400] ring-2 ring-[#FF6400]/20 shadow-md'
          : 'border-gray-100 hover:border-gray-200 shadow-xs'
      }`}
    >
      <div>
        {/* Top Badges Row: Verified tag + Heart icon */}
        <div className="flex items-center justify-between mb-2">
          {vehicle.verified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified
            </span>
          ) : (
            <span />
          )}

          <button
            id={`fav-btn-${vehicle.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            className="text-gray-400 hover:text-rose-500 transition-colors p-1"
            aria-label="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Vehicle Name & Year */}
        <div className="mt-2">
          <h3 className="text-base font-extrabold text-[#111827] leading-snug">
            {vehicle.brand ? `${vehicle.brand} ${vehicle.model}` : vehicle.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {vehicle.year}
          </p>
        </div>

        {/* Rating and Distance */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
          <div className="flex items-center gap-1 font-semibold text-[#111827]">
            <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />
            <span>{vehicle.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({vehicle.tripsCount})</span>
          </div>
          <span className="text-gray-300">·</span>
          <div className="flex items-center gap-1 text-gray-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>{vehicle.distanceKm} km</span>
          </div>
        </div>

        {/* Specs Line: Fuel · Transmission · Seats */}
        <div className="text-xs text-gray-400 font-medium mt-2 flex items-center gap-1.5">
          <span>{vehicle.fuel}</span>
          <span>·</span>
          <span>{vehicle.transmission}</span>
          <span>·</span>
          <span>{vehicle.seats} seats</span>
        </div>

        {/* Availability & Rental Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Available
          </span>
          {!vehicle.maxRentalDays ? (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
              Unlimited duration
            </span>
          ) : (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-200">
              Max {vehicle.maxRentalDays}d
            </span>
          )}
        </div>
      </div>

      {/* Bottom Price & View Ride Button */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
        <div className="flex flex-col">
          {vehicle.hourlyRentalEnabled && (
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-[#FF6400]">
                ₹{Number(vehicle.hourlyPrice || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-semibold text-gray-500">/ hour</span>
              {vehicle.minRentalHours && (
                <span className="text-[10px] text-gray-400 ml-0.5">
                  ({vehicle.minRentalHours}–{vehicle.maxRentalHours || 24}h)
                </span>
              )}
            </div>
          )}

          {(vehicle.dailyRentalEnabled || (!vehicle.hourlyRentalEnabled && !vehicle.dailyRentalEnabled)) && (
            <div className="flex items-baseline gap-1">
              <span className={`font-black ${vehicle.hourlyRentalEnabled ? 'text-xs text-gray-700 font-bold' : 'text-base sm:text-lg text-[#FF6400]'}`}>
                ₹{Number(vehicle.dailyPrice || vehicle.pricePerDay || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-semibold text-gray-500">/ day</span>
              {vehicle.minRentalDays && (
                <span className="text-[10px] text-gray-400 ml-0.5">
                  (min {vehicle.minRentalDays}d)
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(vehicle);
          }}
          className="shrink-0 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          View ride
        </button>
      </div>

    </div>
  );
};
