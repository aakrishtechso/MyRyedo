import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  PlusCircle, 
  Calendar, 
  Car, 
  Menu, 
  X,
  Sparkles,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuthModal,
  onLogout,
  unreadCount = 0,
  notifications = [],
  onOpenListVehicle,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateNotification,
  onOpenNotifications
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isOwner = currentUser?.role === 'owner';
  const isBooker = currentUser?.role === 'booker';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: MyRyedo Logo with stylized folded ribbon R */}
          <div className="flex items-center gap-3">
            <button 
              id="navbar-logo-btn"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 relative flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                  <path
                    d="M6 5C6 3.89543 6.89543 3 8 3H18C22.4183 3 26 6.58172 26 11C26 14.5 23.6 17.5 20.3 18.5L26.5 28.5C26.9 29.2 26.4 30 25.5 30H20.8C20.2 30 19.6 29.6 19.3 29.1L14.2 19H11.5V28C11.5 29.1046 10.6046 30 9.5 30H8C6.89543 30 6 29.1046 6 28V5Z"
                    fill="#FF6400"
                  />
                  <path
                    d="M11.5 8.5H17.5C19.1569 8.5 20.5 9.84315 20.5 11.5C20.5 13.1569 19.1569 14.5 17.5 14.5H11.5V8.5Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-[#111827]">
                My<span className="text-[#FF6400]">Ryedo</span>
              </span>
            </button>

            {/* Current Active Role Badge */}
            {currentUser && (
              <button
                onClick={() => onOpenAuthModal()}
                className={`hidden sm:flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isOwner
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
                title="Current active account role"
              >
                <span>{isOwner ? '🏠 Owner Mode' : '🚗 Booker Mode'}</span>
              </button>
            )}
          </div>

          {/* Center: Desktop Navigation Links strictly partitioned by role */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              id="nav-link-explore"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-sm transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#111827] font-black'
                  : 'text-gray-600 font-semibold hover:text-[#111827]'
              }`}
            >
              Explore Vehicles
            </button>

            <button
              id="nav-link-how-it-works"
              onClick={() => {
                if (currentView !== 'home') setCurrentView('home');
                setTimeout(() => {
                  document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-semibold text-gray-600 hover:text-[#111827] transition-colors cursor-pointer"
            >
              Trust & Safety
            </button>

            {/* BOOKER EXCLUSIVE NAV */}
            {isBooker && (
              <button
                id="nav-link-my-bookings"
                onClick={() => setCurrentView('booker-dashboard')}
                className={`text-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'booker-dashboard'
                    ? 'text-[#FF6400] font-black'
                    : 'text-gray-600 font-semibold hover:text-[#111827]'
                }`}
              >
                <Calendar className="w-4 h-4 text-[#FF6400]" />
                <span>My Bookings</span>
              </button>
            )}

            {/* OWNER EXCLUSIVE NAV */}
            {isOwner && (
              <>
                <button
                  id="nav-link-owner-dashboard"
                  onClick={() => setCurrentView('owner-dashboard')}
                  className={`text-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'owner-dashboard'
                      ? 'text-[#FF6400] font-black'
                      : 'text-gray-600 font-semibold hover:text-[#111827]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#FF6400]" />
                  <span>Host Dashboard</span>
                </button>

                <button
                  id="nav-link-add-vehicle"
                  onClick={onOpenListVehicle}
                  className="bg-[#FF6400] hover:bg-[#e05800] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ List Your Vehicle</span>
                </button>
              </>
            )}

            {/* GUEST NAV (Not logged in) */}
            {!currentUser && (
              <button
                onClick={() => onOpenAuthModal('owner')}
                className="text-sm font-bold text-[#FF6400] hover:text-[#e05800] transition-colors cursor-pointer flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Vehicle</span>
              </button>
            )}
          </nav>

          {/* Right: Auth Profile & Notifications / Sign In */}
          <div className="flex items-center gap-2.5">
            {currentUser && (
              <button
                id="navbar-notification-btn"
                type="button"
                onClick={() => {
                  if (onOpenNotifications) onOpenNotifications();
                }}
                className="relative p-2.5 rounded-2xl border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF6400] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  id="profile-dropdown-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <div className="text-left hidden sm:block pr-1">
                    <span className="text-xs font-black text-[#111827] block truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize block">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Profile dropdown */}
                {showProfileMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="p-3 border-b border-gray-100 mb-1">
                      <p className="text-xs font-black text-gray-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6400] capitalize">
                        {currentUser.role} account
                      </span>
                    </div>

                    <button
                      onClick={() => setCurrentView('profile')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#FF6400]" />
                      <span>My Profile & KYC</span>
                    </button>

                    {isBooker && (
                      <button
                        onClick={() => setCurrentView('booker-dashboard')}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>My Bookings</span>
                      </button>
                    )}

                    {isOwner && (
                      <>
                        <button
                          onClick={() => setCurrentView('owner-dashboard')}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          <span>Owner Dashboard</span>
                        </button>
                        <button
                          onClick={onOpenListVehicle}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 text-gray-400" />
                          <span>Add New Vehicle</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="sign-in-nav-btn"
                onClick={() => onOpenAuthModal('login')}
                className="bg-[#111827] hover:bg-black text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sign In / Register
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2 animate-in slide-in-from-top-2">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-xl"
            >
              Explore Vehicles
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  setCurrentView('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-xl flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#FF6400]" />
                <span>My Profile & KYC</span>
              </button>
            )}

            {isBooker && (
              <button
                onClick={() => {
                  setCurrentView('booker-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-xl"
              >
                My Bookings
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => {
                    setCurrentView('owner-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-xl"
                >
                  Owner Dashboard
                </button>
                <button
                  onClick={() => {
                    onOpenListVehicle();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-black text-[#FF6400] hover:bg-orange-50 rounded-xl"
                >
                  + List Your Vehicle
                </button>
              </>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  onOpenAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-black text-[#FF6400] hover:bg-orange-50 rounded-xl"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}
      </div>

    </header>
  );
};
