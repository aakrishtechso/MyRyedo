import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

export const BecomeOwnerSection = ({ 
  onListVehicle, 
  onExploreClick 
}) => {
  return (
    <div className="w-full py-8 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Host / Earn Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Text & Earnings Stat */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
                  Your vehicle can earn while you're away.
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md">
                  List your vehicle, choose when it's available, and earn from every booking.
                </p>
              </div>

              {/* Earnings Stat Box with Bar Chart Graphic */}
              <div className="bg-[#FAFBFD] border border-gray-100 rounded-2xl p-4 sm:p-5 max-w-sm flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#111827]">
                    ₹48,500
                  </div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">
                    Example monthly earnings
                  </div>
                </div>

                {/* Light Blue Ascending Bar Chart Graphic */}
                <div className="flex items-end gap-1.5 h-10">
                  <div className="w-2 bg-[#D1E5FB] rounded-t-sm h-3"></div>
                  <div className="w-2 bg-[#B8D9F9] rounded-t-sm h-5"></div>
                  <div className="w-2 bg-[#92C4F7] rounded-t-sm h-7"></div>
                  <div className="w-2 bg-[#5EA5F4] rounded-t-sm h-9"></div>
                  <div className="w-2 bg-[#1769D1] rounded-t-sm h-10"></div>
                </div>
              </div>

              {/* Orange CTA Button */}
              <div>
                <button
                  type="button"
                  onClick={onListVehicle}
                  className="bg-[#FF6400] hover:bg-[#e85a00] active:scale-95 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  List your vehicle
                </button>
              </div>
            </div>

            {/* Right White SUV Graphic with warm glow & pin silhouettes */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Soft warm oval background glow */}
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#FFF5EE] absolute z-0 pointer-events-none" />
              
              {/* Subtle background location pin outlines */}
              <div className="absolute top-4 left-12 text-gray-200 pointer-events-none opacity-60">
                <MapPin className="w-12 h-12 stroke-1" />
              </div>
              <div className="absolute bottom-6 right-16 text-gray-200 pointer-events-none opacity-40">
                <MapPin className="w-10 h-10 stroke-1" />
              </div>

              {/* White Luxury SUV Photo */}
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"
                alt="White SUV"
                className="w-full max-w-lg object-contain relative z-10 drop-shadow-md"
              />
            </div>

          </div>
        </section>

        {/* 2. Bottom Dark Navy Call-to-Action Banner */}
        <section className="bg-[#0B1E40] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl text-white">
          
          {/* Subtle Vector Road Lines Background */}
          <svg className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" viewBox="0 0 1000 200" fill="none">
            <path d="M-50,150 C200,80 400,180 700,60 C850,0 950,80 1100,50" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M-50,80 C150,140 450,40 750,130 C900,180 1000,120 1100,150" stroke="#1769D1" strokeWidth="3" />
          </svg>

          {/* Floating Road Map Pins in Banner */}
          <div className="absolute top-1/2 left-[58%] -translate-y-1/2 hidden md:flex items-center gap-28 pointer-events-none z-10">
            <div className="w-7 h-7 rounded-full bg-[#FF6400] flex items-center justify-center text-white shadow-lg animate-bounce">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1769D1] flex items-center justify-center text-white shadow-lg">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left Info */}
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ready to hit the road?
                </h3>
                <p className="text-xs sm:text-sm text-blue-200 mt-1">
                  Find the perfect ride for your next journey.
                </p>
              </div>

              {/* Social Proof Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0B1E40]"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0B1E40]"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0B1E40]"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0B1E40]"
                  />
                </div>
                <span className="text-xs text-blue-100 font-medium">
                  Join thousands of happy riders.
                </span>
              </div>
            </div>

            {/* Right Action Button */}
            <div>
              <button
                type="button"
                onClick={onExploreClick}
                className="bg-white hover:bg-gray-100 text-[#111827] font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Explore now</span>
                <ArrowRight className="w-4 h-4 text-[#111827]" />
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
