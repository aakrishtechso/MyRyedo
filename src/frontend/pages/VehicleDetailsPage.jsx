import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Fuel, 
  Car, 
  Users, 
  Heart, 
  Share2, 
  Check, 
  MessageSquare, 
  FileText, 
  AlertCircle,
  Sparkles,
  Award,
  Lock,
  Edit,
  ExternalLink
} from 'lucide-react';
import { GoogleMapsWrapper } from '../components/GoogleMapsWrapper.jsx';

export const VehicleDetailsPage = ({
  vehicle,
  currentUser,
  isFavorite,
  onToggleFavorite,
  onStartBooking,
  onOpenChat,
  onEditVehicle,
  onGoToOwnerDashboard,
  onBack,
  showToast
}) => {
  if (!vehicle) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image];

  // Resolve dynamic price without any glitch
  const resolvedDailyPrice = Number(vehicle.dailyPrice || vehicle.pricePerDay || vehicle.price || 0);
  const resolvedHourlyPrice = Number(vehicle.hourlyPrice || Math.round(resolvedDailyPrice / 10) || 120);
  const resolvedDeposit = Number(vehicle.securityDeposit || 2500);

  // Strictly check if current logged-in user is the owner of this vehicle
  const isOwnerOfThisVehicle = Boolean(
    currentUser && (
      (vehicle.ownerId && currentUser.id === vehicle.ownerId) ||
      (vehicle.owner?.id && currentUser.id === vehicle.owner.id) ||
      (vehicle.owner?.email && currentUser.email && vehicle.owner.email.toLowerCase() === currentUser.email.toLowerCase())
    )
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.name} on MyRyedo`,
        text: `Rent ${vehicle.name} in ${vehicle.location} on MyRyedo`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      if (showToast) showToast('Vehicle link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Navigation Bar: Back, Share, Favorite */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#111827] bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Vehicles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-pointer transition-colors shadow-2xs"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(vehicle.id)}
              className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-rose-500 cursor-pointer transition-colors shadow-2xs"
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. VEHICLE IMAGES (Photo Gallery) */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <div className="aspect-video sm:aspect-21/9 rounded-3xl overflow-hidden border border-gray-200 bg-black relative shadow-sm">
            <img
              src={images[activeImageIndex] || vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-24 sm:w-32 aspect-video shrink-0 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImageIndex === idx ? 'border-[#FF6400] ring-2 ring-orange-200' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. VEHICLE NAME & TITLE BAR */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#FF6400]/10 text-[#FF6400] text-xs font-black px-3 py-1 rounded-full uppercase">
              {vehicle.category}
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Inspected & Verified
            </span>
            {vehicle.rating && (
              <span className="bg-amber-50 text-amber-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {vehicle.rating} ({vehicle.reviewsCount || 24} trips)
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#111827]">
            {vehicle.name}
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF6400] shrink-0" />
            <span>{vehicle.location}</span>
          </p>
        </div>

        {/* ======================================================== */}
        {/* 3. HOST DETAILS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={vehicle.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={vehicle.owner?.name || 'Verified Host'}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-xs"
            />
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#FF6400] uppercase tracking-wide flex items-center gap-1">
                <Award className="w-3 h-3" /> Superhost
              </span>
              <h2 className="text-base font-black text-[#111827]">
                Hosted by {vehicle.owner?.name || 'Ajeet Lodhi'}
              </h2>
              <p className="text-xs text-gray-500">
                100% response rate • Fast handover • Certified owner
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenChat?.(vehicle.owner?.id || 'host-1', vehicle.id)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#FF6400]" />
            <span>Chat with Host</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 4. VEHICLE SPECIFICATIONS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-black text-gray-900">Vehicle Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 space-y-1">
              <span className="text-gray-400 block font-bold">Transmission</span>
              <span className="font-black text-gray-900 text-sm">{vehicle.transmission || 'Automatic'}</span>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 space-y-1">
              <span className="text-gray-400 block font-bold">Fuel Type</span>
              <span className="font-black text-gray-900 text-sm">{vehicle.fuel || 'Petrol'}</span>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 space-y-1">
              <span className="text-gray-400 block font-bold">Seating</span>
              <span className="font-black text-gray-900 text-sm">{vehicle.seats || 5} Passengers</span>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 space-y-1">
              <span className="text-gray-400 block font-bold">Registration</span>
              <span className="font-mono font-bold text-gray-900 text-sm uppercase">{vehicle.regNumber || 'MH-12-AB-1234'}</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. PRICING / BOOKING SECTION (Arranged per prompt specs) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400 font-bold block">Starting at</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#111827]">
                  ₹{resolvedDailyPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-gray-500">/ day</span>
              </div>
              {vehicle.hourlyRentalEnabled && (
                <p className="text-xs text-[#FF6400] font-black mt-1">
                  Or ₹{resolvedHourlyPrice}/hour (Min {vehicle.minRentalHours || 2} hrs)
                </p>
              )}
            </div>

            {/* If the current user is the owner, do NOT show the booking CTA */}
            {isOwnerOfThisVehicle ? (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-left space-y-2 max-w-md">
                <div className="flex items-center gap-2 text-orange-950 font-black text-xs">
                  <Lock className="w-4 h-4 text-[#FF6400]" />
                  <span>You are the host of this vehicle</span>
                </div>
                <p className="text-[11px] text-orange-800 leading-relaxed">
                  Vehicle owners cannot book their own vehicles. You can view booking requests or edit vehicle details from the Owner Dashboard.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {onEditVehicle && (
                    <button
                      onClick={() => onEditVehicle(vehicle)}
                      className="px-3.5 py-1.5 bg-[#FF6400] hover:bg-[#e05800] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Listing</span>
                    </button>
                  )}
                  {onGoToOwnerDashboard && (
                    <button
                      onClick={onGoToOwnerDashboard}
                      className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Owner Dashboard</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => onStartBooking(vehicle)}
                className="w-full sm:w-auto px-8 py-4 bg-[#FF6400] hover:bg-[#e05800] text-white text-base font-black rounded-2xl cursor-pointer shadow-lg shadow-orange-500/30 transition-all transform active:scale-98 text-center"
              >
                Reserve This Vehicle
              </button>
            )}
          </div>

          {/* Refundable Deposit & Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">Refundable Deposit</span>
                <span className="text-gray-500 text-xs">
                  ₹{resolvedDeposit.toLocaleString('en-IN')} held safely in MyRyedo Escrow. Fully refunded upon safe return.
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">Free Cancellation</span>
                <span className="text-gray-500 text-xs">
                  100% refund up to 24 hours prior to scheduled pickup time.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. PICKUP REQUIREMENTS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF6400]" />
            Pickup Requirements
          </h2>
          <p className="text-xs text-gray-500">
            Please ensure you have all mandated credentials ready prior to handover:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-900 block">1. Original Driving License</span>
              <p className="text-gray-500 text-[11px]">
                Physical original DL must be presented at vehicle pickup for physical inspection.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-900 block">2. Government Photo ID</span>
              <p className="text-gray-500 text-[11px]">
                Aadhaar card or Passport required to verify booking name and permanent address.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-900 block">3. In-Person Handover</span>
              <p className="text-gray-500 text-[11px]">
                Both host and driver inspect vehicle body, fuel meter, and odometer together before sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. OTHER RELEVANT VEHICLE INFORMATION */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* About this ride & Amenities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-3">
              <h2 className="text-base font-black text-gray-900">About this Ride</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {vehicle.description || `Experience comfortable and hassle-free travel with this impeccably maintained ${vehicle.name}. Ideal for outstation road trips, business commutes, or weekend getaways with complete sanitized assurance, full fuel tank on handover, and 24/7 MyRyedo roadside assistance.`}
              </p>
            </div>

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                  Vehicle Amenities & Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((f, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actual Pickup Location Map (No surrounding business fluff) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF6400]" />
              Pickup Location
            </h2>
            <p className="text-xs text-gray-600 font-semibold">
              {vehicle.location}
            </p>
            <div className="h-64 rounded-2xl overflow-hidden border border-gray-200">
              <GoogleMapsWrapper
                vehicles={[vehicle]}
                selectedVehicle={vehicle}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Exact pickup coordinates and host contact are confirmed immediately upon reservation.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
export default VehicleDetailsPage;
