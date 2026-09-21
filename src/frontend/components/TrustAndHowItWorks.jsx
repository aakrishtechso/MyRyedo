import React from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Headphones, 
  Search, 
  Calendar, 
  Flag 
} from 'lucide-react';

export const TrustAndHowItWorks = () => {
  return (
    <section id="how-it-works-section" className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Built around trust (Dark Blue Card) */}
          <div className="lg:col-span-5 bg-[#1754CF] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-blue-900/10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6">
                Built around trust.
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3.5 sm:gap-4">
                {/* 1. Verified people */}
                <div className="bg-white/10 hover:bg-white/15 transition-colors border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1754CF] mb-3 shrink-0 shadow-xs">
                    <UserCheck className="w-4 h-4 text-[#1754CF] stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Verified people
                    </h3>
                    <p className="text-[11px] text-blue-100 leading-snug">
                      Every renter and owner goes through verification.
                    </p>
                  </div>
                </div>

                {/* 2. Verified vehicles */}
                <div className="bg-white/10 hover:bg-white/15 transition-colors border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1754CF] mb-3 shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-[#1754CF] stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Verified vehicles
                    </h3>
                    <p className="text-[11px] text-blue-100 leading-snug">
                      Vehicle information is reviewed before listing.
                    </p>
                  </div>
                </div>

                {/* 3. Secure bookings */}
                <div className="bg-white/10 hover:bg-white/15 transition-colors border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1754CF] mb-3 shrink-0 shadow-xs">
                    <Lock className="w-4 h-4 text-[#1754CF] stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Secure bookings
                    </h3>
                    <p className="text-[11px] text-blue-100 leading-snug">
                      Payments and booking information stay protected.
                    </p>
                  </div>
                </div>

                {/* 4. 24/7 support */}
                <div className="bg-white/10 hover:bg-white/15 transition-colors border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1754CF] mb-3 shrink-0 shadow-xs">
                    <Headphones className="w-4 h-4 text-[#1754CF] stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      24/7 support
                    </h3>
                    <p className="text-[11px] text-blue-100 leading-snug">
                      We're always here to help you, anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: How it works (White Stepper Card) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                How it works
              </h2>
            </div>

            {/* Stepper with 5 steps and orange dashed line */}
            <div className="relative my-auto">
              
              {/* Dashed orange line connecting step icons */}
              <div className="hidden sm:block absolute top-5 left-8 right-8 h-[2px] border-t-2 border-dashed border-[#FF7A00]/70 z-0" />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                
                {/* 01 DISCOVER */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1769D1] flex items-center justify-center text-[#1769D1] mb-2 shadow-xs">
                    <Search className="w-4 h-4 text-[#1769D1] stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#1769D1] mb-0.5">01</span>
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wide mb-1">
                    DISCOVER
                  </span>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Find the perfect ride near you
                  </p>
                </div>

                {/* 02 VERIFY */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1769D1] flex items-center justify-center text-[#1769D1] mb-2 shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-[#1769D1] stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#1769D1] mb-0.5">02</span>
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wide mb-1">
                    VERIFY
                  </span>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Get verified for a safer experience
                  </p>
                </div>

                {/* 03 BOOK */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1769D1] flex items-center justify-center text-[#1769D1] mb-2 shadow-xs">
                    <Calendar className="w-4 h-4 text-[#1769D1] stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#1769D1] mb-0.5">03</span>
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wide mb-1">
                    BOOK
                  </span>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Choose dates & book securely
                  </p>
                </div>

                {/* 04 RIDE */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1769D1] flex items-center justify-center text-[#1769D1] mb-2 shadow-xs">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-[#1769D1]">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v7"/>
                      <path d="M12 15v7"/>
                      <path d="M2 12h7"/>
                      <path d="M15 12h7"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-[#1769D1] mb-0.5">04</span>
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wide mb-1">
                    RIDE
                  </span>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Enjoy your ride with confidence
                  </p>
                </div>

                {/* 05 RETURN */}
                <div className="flex flex-col items-center text-center col-span-2 sm:col-span-1">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1769D1] flex items-center justify-center text-[#1769D1] mb-2 shadow-xs">
                    <Flag className="w-4 h-4 text-[#1769D1] stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#1769D1] mb-0.5">05</span>
                  <span className="text-xs font-black text-[#111827] uppercase tracking-wide mb-1">
                    RETURN
                  </span>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Return the vehicle on time
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
