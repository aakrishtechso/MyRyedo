import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight, 
  Star, 
  MapPin, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Car, 
  Heart, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Navbar } from './frontend/components/Navbar';
import { SearchBar } from './frontend/components/SearchBar';
import { VehicleCard } from './frontend/components/VehicleCard';
import { TrustAndHowItWorks } from './frontend/components/TrustAndHowItWorks';
import { TopCitiesSection } from './frontend/components/TopCitiesSection';
import { MapView } from './frontend/components/MapView';
import { BecomeOwnerSection } from './frontend/components/BecomeOwnerSection';
import { VehicleDetailsModal } from './frontend/components/VehicleDetailsModal';
import { BookingModal } from './frontend/components/BookingModal';
import { ChatModal } from './frontend/components/ChatModal';
import { BookerDashboard } from './frontend/components/BookerDashboard';
import { OwnerDashboard } from './frontend/components/OwnerDashboard';
import { ListVehicleModal } from './frontend/components/ListVehicleModal';
import { EditVehicleModal } from './frontend/components/EditVehicleModal';
import { FilterModal } from './frontend/components/FilterModal';
import { AuthModal } from './frontend/components/AuthModal';
import { ReviewModal } from './frontend/components/ReviewModal';
import { InspectionModal } from './frontend/components/InspectionModal';
import { WaitlistModal } from './frontend/components/WaitlistModal';
import { BookingPage } from './frontend/pages/BookingPage';
import { CancellationPage } from './frontend/pages/CancellationPage';
import { ProfilePage } from './frontend/pages/ProfilePage';
import { VehicleDetailsPage } from './frontend/pages/VehicleDetailsPage';
import { AuthPage } from './frontend/pages/AuthPage';
import { NotificationsPage } from './frontend/pages/NotificationsPage';
import { backendService } from './backend/api.js';

export default function App() {
  // Navigation & User State: MyRyedo always opens on Home. Authentication is required only for protected actions.
  const initialRestoredUser = backendService.getRestoredSession();
  const [currentUser, setCurrentUser] = useState(initialRestoredUser);
  const [currentView, setCurrentView] = useState('home');
  const [allUsers, setAllUsers] = useState([]);

  // Auth Guard & Pending Intent State
  const [pendingAction, setPendingAction] = useState(null);
  const [authIntentMessage, setAuthIntentMessage] = useState(null);
  const [authDefaultMode, setAuthDefaultMode] = useState('login');
  const [authRoleHint, setAuthRoleHint] = useState('booker');

  // Core Data State - Live backend data
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  // Selected vehicle for modal or map
  const [detailsVehicle, setDetailsVehicle] = useState(null);
  const [selectedVehicleForMap, setSelectedVehicleForMap] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);

  const fetchNotifications = async () => {
    try {
      const notifs = await backendService.getNotifications();
      if (Array.isArray(notifs)) {
        setNotifications(notifs);
      }
    } catch {}
  };

  const fetchMessages = async () => {
    if (!currentUser) return;
    try {
      const msgs = await backendService.getMessages();
      if (Array.isArray(msgs)) {
        setMessages(msgs);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    if (currentUser) {
      fetchMessages();
    }
    const interval = setInterval(() => {
      fetchNotifications();
      if (currentUser) {
        fetchMessages();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // Load real vehicle fleet on mount
  useEffect(() => {
    setIsLoadingVehicles(true);
    backendService.getVehicles()
      .then((data) => {
        if (Array.isArray(data)) {
          setVehicles(data);
          if (data.length > 0) {
            setSelectedVehicleForMap(data[0]);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load vehicles', err);
      })
      .finally(() => {
        setIsLoadingVehicles(false);
      });
  }, []);

  // Restore authenticated session from backendService on mount and load user's real bookings
  useEffect(() => {
    const savedUser = backendService.getRestoredSession();
    if (savedUser) {
      setCurrentUser(savedUser);
      backendService.getCurrentUser().then((user) => {
        if (user) {
          setCurrentUser(user);
          // Load real bookings for this user from backend
          backendService.getBookings().then((userBookings) => {
            if (Array.isArray(userBookings)) {
              setBookings(userBookings);
            }
          }).catch(() => {});
          fetchNotifications();
          fetchMessages();
        } else {
          setCurrentUser(null);
          setBookings([]);
          setNotifications([]);
          setMessages([]);
          showToast('Your session has expired. Please sign in again.');
        }
      }).catch(() => {});
    }
  }, []);

  // Booking modal state
  const [bookingVehicle, setBookingVehicle] = useState(null);

  // Inspection, Review, Dispute Modals
  const [reviewBooking, setReviewBooking] = useState(null);
  const [inspectionTarget, setInspectionTarget] = useState(null);

  // Chat modal state
  const [chatTarget, setChatTarget] = useState(null);

  // Generic Modals
  const [isListVehicleOpen, setIsListVehicleOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('login');

  // Filter State (No predefined fixed duration)
  const [filters, setFilters] = useState({
    category: 'all',
    searchLocation: '',
    pickupDate: '',
    returnDate: '',
    minPrice: 0,
    maxPrice: 15000,
    fuelTypes: [],
    transmissions: [],
    onlyVerified: false,
    instantBookingOnly: false,
    sortBy: 'recommended'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Toggle Favorite
  const handleToggleFavorite = (vehicleId) => {
    setFavorites(prev => {
      const exists = prev.includes(vehicleId);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter(id => id !== vehicleId);
      } else {
        showToast('Saved to your favorites ❤️');
        return [...prev, vehicleId];
      }
    });
  };

  // Role Switcher (Strictly 2 Roles: booker & owner)
  const handleRoleChange = (newRole) => {
    const roleToSet = newRole === 'owner' ? 'owner' : 'booker';
    if (currentUser) {
      const updatedUser = { ...currentUser, role: roleToSet };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    }
    
    if (roleToSet === 'owner') {
      setCurrentView('owner-dashboard');
    } else {
      setCurrentView('home');
    }
    showToast(`Switched to ${roleToSet.toUpperCase()} mode`);
  };

  // Open Auth Page with custom intent and mode
  const handleOpenAuthModal = (mode = 'login', message = null, role = 'booker') => {
    setAuthDefaultMode(typeof mode === 'string' ? mode : 'login');
    setAuthIntentMessage(message);
    setAuthRoleHint(role || 'booker');
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guarded initiate booking (preserves intent if guest)
  const handleInitiateBooking = (vehicle, bookingDetailsOrPickupDate, returnDate) => {
    let details = {};
    if (bookingDetailsOrPickupDate && typeof bookingDetailsOrPickupDate === 'object') {
      details = { ...bookingDetailsOrPickupDate };
    } else {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      details = {
        rentalType: vehicle.hourlyRentalEnabled && vehicle.dailyRentalEnabled === false ? 'hourly' : 'daily',
        pickupDate: bookingDetailsOrPickupDate || filters.pickupDate || today,
        returnDate: returnDate || filters.returnDate || tomorrow,
        pickupTime: '10:00',
        returnTime: '14:00'
      };
    }

    if (!currentUser) {
      setPendingAction({
        type: 'book',
        vehicle,
        ...details
      });
      handleOpenAuthModal('login', `Please sign in or create an account to book ${vehicle.name}.`, 'booker');
      return;
    }
    setBookingVehicle({
      vehicle,
      ...details
    });
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated view handler to open vehicle details page
  const handleSelectVehicle = (vehicle) => {
    setDetailsVehicle(vehicle);
    setCurrentView('vehicle-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guarded initiate list vehicle (preserves intent if guest)
  const handleInitiateListVehicle = () => {
    if (!currentUser) {
      setPendingAction({ type: 'list_vehicle' });
      handleOpenAuthModal('signup', 'Want to list your vehicle? Create an account or log in to get started.', 'owner');
      return;
    }
    if (currentUser.role !== 'owner') {
      handleRoleChange('owner');
      setCurrentView('list-vehicle');
      showToast('Switched to Owner mode so you can list your vehicle!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView('list-vehicle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guarded initiate chat (preserves intent if guest)
  const handleInitiateChat = (ownerId, vehicleId) => {
    if (!currentUser) {
      setPendingAction({ type: 'chat', ownerId, vehicleId });
      handleOpenAuthModal('login', 'Sign in or create an account to message the host.', 'booker');
      return;
    }
    setChatTarget({ ownerId, vehicleId });
  };

  // Login handler: seamlessly resumes pending action if present
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    const action = pendingAction;
    setPendingAction(null);
    setAuthIntentMessage(null);

    // Keep allUsers in sync if new user
    setAllUsers(prev => {
      if (prev.some(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase())) {
        return prev;
      }
      return [user, ...prev];
    });

    // Fetch real bookings, notifications, and messages for authenticated user
    backendService.getBookings().then((userBookings) => {
      if (Array.isArray(userBookings)) {
        setBookings(userBookings);
      }
    }).catch(() => {});
    fetchNotifications();
    fetchMessages();

    if (action) {
      if (action.type === 'book') {
        setBookingVehicle({
          vehicle: action.vehicle,
          ...action
        });
        setCurrentView('booking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Welcome, ${user.name}! Resuming booking for ${action.vehicle.name}.`);
        return;
      }
      if (action.type === 'list_vehicle') {
        if (user.role !== 'owner') {
          handleRoleChange('owner');
        }
        setCurrentView('list-vehicle');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Welcome, ${user.name}! Opening your vehicle listing wizard.`);
        return;
      }
      if (action.type === 'chat') {
        setChatTarget({ ownerId: action.ownerId, vehicleId: action.vehicleId });
        showToast(`Welcome, ${user.name}! Opening host chat.`);
        return;
      }
    }

    // Default flow: Always navigate immediately into the Home view
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Welcome to MyRyedo, ${user.name}!`);
  };

  // Logout handler: completely cleans up session, resets intents, and redirects to Login view
  const handleLogout = () => {
    backendService.logout();
    setCurrentUser(null);
    setBookings([]);
    setNotifications([]);
    setMessages([]);
    setPendingAction(null);
    setAuthIntentMessage(null);
    setAuthDefaultMode('login');
    setCurrentView('auth');
    setIsAuthModalOpen(false);
    showToast('You have been logged out.');
  };

  // Add a new vehicle (from owner flow)
  const handleVehicleAdded = (newVehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
    showToast(`Vehicle "${newVehicle.name}" published to MyRyedo! 🚗`);
    setCurrentView('owner-dashboard');
  };

  // Update existing vehicle
  const handleVehicleUpdated = (updatedVehicle) => {
    setVehicles(prev => prev.map(v => (v.id === updatedVehicle.id ? updatedVehicle : v)));
    showToast(`Updated "${updatedVehicle.name}" settings and rates.`);
  };

  // Delete vehicle
  const handleVehicleDeleted = (vehicleId) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    if (selectedVehicleForMap?.id === vehicleId) {
      setSelectedVehicleForMap(null);
    }
    showToast('Vehicle removed from garage.');
  };

  // Toggle vehicle availability
  const handleToggleAvailability = (vehicleId) => {
    setVehicles(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, isAvailable: !v.isAvailable } : v))
    );
    showToast('Vehicle live availability updated');
  };

  // Add confirmed booking and route to Booker Dashboard
  const handleBookingConfirmed = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    setBookingVehicle(null);
    setCurrentView('booker-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🎉 Booking Confirmed! Digital smart key generated.');
  };

  // Initiate full cancellation page
  const handleInitiateCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setCancellingBooking(booking);
      setCurrentView('cancel-booking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Booking not found.');
    }
  };

  // Called when cancellation is successfully completed on CancellationPage
  const handleCancellationCompleted = (bookingId, cancellationData) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled', cancellation: cancellationData } : b))
    );
    setCancellingBooking(null);
    setCurrentView('booker-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Booking cancelled. Refund breakdown has been sent to your email.');
  };

  // Direct cancel fallback
  const handleCancelBooking = (bookingId) => {
    handleInitiateCancelBooking(bookingId);
  };

  // Approve booking request (Owner action)
  const handleApproveBooking = (bookingId) => {
    backendService.updateBookingStatus(bookingId, 'confirmed').then(() => {
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
      );
      fetchNotifications();
    }).catch(() => {
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
      );
    });
    showToast('Booking approved! Driver has been notified.');
  };

  // Reject booking request (Owner action)
  const handleRejectBooking = (bookingId) => {
    backendService.updateBookingStatus(bookingId, 'rejected').then(() => {
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'rejected' } : b))
      );
      fetchNotifications();
    }).catch(() => {
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: 'rejected' } : b))
      );
    });
    showToast('Booking request declined.');
  };

  // Notification action handlers
  const handleMarkNotificationAsRead = async (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    await backendService.markNotificationAsRead(id);
  };

  const handleMarkAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await backendService.markAllNotificationsAsRead();
    showToast('All notifications marked as read.');
  };

  const handleNavigateNotification = (notif) => {
    if (notif.type === 'NEW_MESSAGE' || notif.conversationPartnerId) {
      const partnerId = notif.conversationPartnerId || notif.senderId;
      setChatTarget({ ownerId: partnerId, vehicleId: notif.vehicleId });
    } else if (notif.type?.includes('BOOKING') || notif.bookingId) {
      if (currentUser?.role === 'owner') {
        setCurrentView('owner-dashboard');
      } else {
        setCurrentView('booker-dashboard');
      }
    }
  };

  // Request payout (Owner action)
  const handleRequestPayout = (amount) => {
    if (amount <= 0) return;
    const newPayout = {
      id: `pay-${Date.now()}`,
      hostId: currentUser?.id || 'owner-current',
      amount,
      platformFee: Math.round(amount * 0.15),
      netPayout: Math.round(amount * 0.85),
      status: 'settled',
      accountNumber: 'HDFC Bank ··· 9821',
      createdAt: new Date().toISOString()
    };
    setPayouts(prev => [newPayout, ...prev]);
    showToast(`₹${newPayout.netPayout.toLocaleString()} transferred to your registered bank account!`);
  };

  // Send in-app message
  const handleSendMessage = async (text, recipientId, vehicleId) => {
    if (!currentUser) {
      handleOpenAuthModal('login', 'Sign in to message the host.');
      return;
    }

    try {
      const res = await backendService.sendMessage({ recipientId, vehicleId, text });
      if (res && res.success && res.message) {
        setMessages(prev => {
          if (prev.some(m => m.id === res.message.id)) return prev;
          return [...prev, res.message];
        });
        fetchNotifications();
      } else {
        const fallbackMsg = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          recipientId,
          vehicleId,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwner: currentUser.role === 'owner'
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } catch {
      const fallbackMsg = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        recipientId,
        vehicleId,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwner: currentUser.role === 'owner'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  // Admin Vehicle Approval
  const handleAdminApproveVehicle = async (vehicleId) => {
    try {
      await backendService.verifyVehicleRc(vehicleId, 'verified', 'Approved by MyRyedo Operations');
      setVehicles(prev =>
        prev.map(v => (v.id === vehicleId ? { ...v, verified: true } : v))
      );
      showToast('Vehicle RC & Insurance verified and approved for marketplace.');
    } catch (err) {
      showToast('Failed to approve vehicle: ' + (err.message || 'Error'));
    }
  };

  // Admin Feature Toggle
  const handleToggleVehicleFeatured = (vehicleId) => {
    setVehicles(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, isFeatured: !v.isFeatured } : v))
    );
    showToast('Vehicle featured status updated.');
  };

  // Admin Dispute Resolution
  const handleAdminResolveDispute = async (disputeId, resolution) => {
    try {
      await backendService.resolveDispute(disputeId, resolution, 0);
      setDisputes(prev =>
        prev.map(d => (d.id === disputeId ? { ...d, status: 'resolved', resolution } : d))
      );
      showToast(`Dispute arbitrated: ${resolution}`);
    } catch (err) {
      showToast('Failed to arbitrate dispute: ' + (err.message || 'Error'));
    }
  };

  // Admin Payout Settlement
  const handleAdminApprovePayout = async (payoutId) => {
    try {
      const txRef = `TX-${Date.now().toString(36).toUpperCase()}`;
      await backendService.settlePayout(payoutId, 'settled', txRef);
      setPayouts(prev =>
        prev.map(p => (p.id === payoutId ? { ...p, status: 'settled', txRef } : p))
      );
      showToast('Payout settled via automated bank transfer!');
    } catch (err) {
      showToast('Failed to settle payout: ' + (err.message || 'Error'));
    }
  };

  // Submit Review
  const handleSubmitReview = (review) => {
    if (reviewBooking) {
      setBookings(prev =>
        prev.map(b => (b.id === reviewBooking.id ? { ...b, review } : b))
      );
      showToast('Thank you for your review! Host rating updated.');
      setReviewBooking(null);
    }
  };

  // Submit Inspection
  const handleSubmitInspection = (photos, odoReading, notes) => {
    if (inspectionTarget) {
      const { booking, stage } = inspectionTarget;
      setBookings(prev =>
        prev.map(b => {
          if (b.id === booking.id) {
            return {
              ...b,
              inspection: {
                ...b.inspection,
                [stage]: {
                  photos,
                  odometerReading: odoReading,
                  notes,
                  completedAt: new Date().toISOString()
                }
              }
            };
          }
          return b;
        })
      );
      showToast(`${stage === 'pre_trip' ? 'Pre-trip' : 'Return'} inspection documented with photos!`);
      setInspectionTarget(null);
    }
  };

  // File a dispute from Renter
  const handleFileDispute = (booking, reason, description, amount) => {
    const newDispute = {
      id: `disp-${Date.now()}`,
      bookingId: booking.id,
      renterName: booking.renterName,
      ownerName: booking.vehicle.owner.name,
      vehicleName: booking.vehicle.name,
      raisedBy: 'renter',
      reason,
      description,
      amountClaimed: amount,
      photos: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
      ],
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setDisputes(prev => [newDispute, ...prev]);
    showToast('Dispute filed. MyRyedo arbitration team will review your photos.');
  };

  // Filtered vehicles based on user criteria
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Category filter
      if (filters.category && filters.category !== 'all' && v.category !== filters.category) {
        return false;
      }

      // Location / vehicle search (safe for incomplete MongoDB records)
      if (filters.searchLocation && filters.searchLocation.trim()) {
        const query = filters.searchLocation.trim().toLowerCase();
        const searchable = [
          v.location, v.name, v.brand, v.model, v.type, v.category,
          v.pickupAddress, v.state, v.postalCode
        ].filter(Boolean).join(' ').toLowerCase();
        const queryParts = query.split(',').map(part => part.trim()).filter(Boolean);
        if (queryParts.length && !queryParts.every(part => searchable.includes(part))) {
          return false;
        }
      }

      // Price filter
      const dailyPrice = Number(v.pricePerDay ?? v.dailyPrice ?? 0);
      if (dailyPrice < Number(filters.minPrice || 0) || dailyPrice > Number(filters.maxPrice || 15000)) {
        return false;
      }

      // Date validation is performed when Search is submitted; dates are not used to hide vehicles locally.

      // Fuel type
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(v.fuel)) {
        return false;
      }

      // Transmission
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(v.transmission)) {
        return false;
      }

      // Verified only
      if (filters.onlyVerified && !v.verified) {
        return false;
      }

      // Instant booking only
      if (filters.instantBookingOnly && !v.instantBooking) {
        return false;
      }

      return true;
    });
  }, [vehicles, filters]);

  // Category Pills definition with custom icons
  const categoryPills = [
    {
      id: 'cars',
      label: 'Cars',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
          <circle cx="7.5" cy="14.5" r="1.5"/>
          <circle cx="16.5" cy="14.5" r="1.5"/>
        </svg>
      )
    },
    {
      id: 'bikes',
      label: 'Bikes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="18.5" cy="17.5" r="3.5"/>
          <circle cx="5.5" cy="17.5" r="3.5"/>
          <circle cx="15" cy="5" r="1"/>
          <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
        </svg>
      )
    },
    {
      id: 'scooters',
      label: 'Scooters',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="18" r="3"/>
          <path d="M6 15h7l2-9h3"/>
          <path d="M16 6h4"/>
        </svg>
      )
    },
    {
      id: 'evs',
      label: 'EV',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M19 14v4"/>
          <path d="M22 16h-6"/>
          <path d="M14 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z"/>
          <circle cx="6.5" cy="15.5" r="1.5"/>
          <circle cx="11.5" cy="15.5" r="1.5"/>
        </svg>
      )
    },
    {
      id: 'suvs',
      label: 'SUVs',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M3 13l2-5h14l2 5v5H3v-5z"/>
          <circle cx="7" cy="18" r="2"/>
          <circle cx="17" cy="18" r="2"/>
        </svg>
      )
    },
    {
      id: 'vans',
      label: 'Vans',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <circle cx="7" cy="18" r="2"/>
          <circle cx="17" cy="18" r="2"/>
          <path d="M15 6v6H2"/>
        </svg>
      )
    },
    {
      id: 'luxury',
      label: 'Luxury',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans selection:bg-[#1769D1] selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-[#FF7A00] shrink-0" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenAuthModal={(modeOrRole = 'login') => {
          if (modeOrRole === 'owner' || modeOrRole === 'booker') {
            handleOpenAuthModal('login', null, modeOrRole);
          } else if (modeOrRole === 'signup' || modeOrRole === 'login') {
            handleOpenAuthModal(modeOrRole, null, 'booker');
          } else {
            handleOpenAuthModal('login', null, 'booker');
          }
        }}
        onOpenLogin={() => handleOpenAuthModal('login')}
        onOpenSignup={() => handleOpenAuthModal('signup')}
        onLogout={handleLogout}
        onOpenMessages={() => handleInitiateChat('owner-1', 'rr-1')}
        unreadCount={notifications.filter(n => !n.read).length}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onNavigateNotification={handleNavigateNotification}
        onOpenNotifications={() => setCurrentView('notifications')}
        onOpenListVehicle={handleInitiateListVehicle}
      />

      {/* VIEW: Home Landing Page */}
      {currentView === 'home' && (
        <main className="flex-1 space-y-4">
          
          {/* 1. Hero Section */}
          <section className="relative pt-6 sm:pt-10 pb-4 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Hero Left Content */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight leading-[1.05]">
                      <span className="text-[#1769D1]">YOUR RIDE.</span>
                      <br />
                      <span className="text-[#0F172A]">YOUR WAY.</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 font-normal mt-4 max-w-sm">
                      Rent verified vehicles from people around you.
                    </p>
                  </div>

                  {/* Explore vehicles orange button */}
                  <div>
                    <button
                      id="hero-explore-btn"
                      type="button"
                      onClick={() => {
                        document.getElementById('vehicles-near-you')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-[#FF6400] hover:bg-[#e85a00] active:scale-95 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Explore vehicles</span>
                      <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Platform Trust Guarantee */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% Verified Hosts & Transparent Pricing</span>
                    </div>
                  </div>
                </div>

                {/* Hero Right Graphic with Blue Hyundai Creta & Floating Card */}
                <div className="lg:col-span-6 relative flex items-center justify-center">
                  
                  {/* Skyline silhouette graphic */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <svg className="w-full h-full" viewBox="0 0 600 350" fill="none">
                      <path d="M 50,300 L 50,220 L 90,220 L 90,190 L 130,190 L 130,240 L 180,240 L 180,160 L 220,160 L 220,270 L 300,270 L 300,140 L 350,140 L 350,230 L 420,230 L 420,180 L 480,180 L 480,260 L 550,260 L 550,300 Z" fill="#EEF3F9" />
                      <path d="M 20,220 C 150,180 320,120 480,140 C 540,150 570,120 600,130" stroke="#FF7A00" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                  </div>

                  {/* Large Blue Map Pin in Skyline */}
                  <div className="absolute top-10 right-1/3 text-[#1769D1] pointer-events-none z-0">
                    <MapPin className="w-10 h-10 fill-[#1769D1] text-[#1769D1] drop-shadow-sm" />
                  </div>

                  {/* Blue Modern SUV Car Image */}
                  <div className="relative z-10 w-full max-w-lg">
                    <img
                      src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"
                      alt="Hyundai Creta Blue SUV"
                      className="w-full object-contain drop-shadow-xl"
                    />

                    {/* Floating Quality Assurance Card on the Car */}
                    <div className="absolute bottom-2 right-0 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-100 max-w-[210px] sm:max-w-[230px] z-20">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-[#111827]">
                          MyRyedo Quality
                        </span>
                        <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full shrink-0">
                          Inspected
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-gray-600 leading-tight">
                        Zero deposit options · Real-time digital key handover
                      </p>

                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#1769D1] mt-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Host ID Verified</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* 2. Floating Search Bar */}
              <div className="mt-8">
                <SearchBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onSearch={() => {
                    const { pickupDate, returnDate } = filters;
                    if (pickupDate && returnDate && returnDate < pickupDate) {
                      showToast('Return date must be on or after the pick-up date.');
                      return;
                    }
                    if (returnDate && !pickupDate) {
                      showToast('Please choose a pick-up date first.');
                      return;
                    }
                    document.getElementById('vehicles-near-you')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  onOpenFilters={() => setIsFilterModalOpen(true)}
                  totalResultsCount={filteredVehicles.length}
                />
              </div>

              {/* 3. Category Filter Pills Row (Cars, Bikes, Scooters, EV, SUVs, Vans, Luxury) */}
              <div className="mt-6">
                <div className="bg-[#FAFBFD] border border-gray-100 rounded-2xl p-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                  {categoryPills.map((cat) => {
                    const isActive = filters.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        id={`category-btn-${cat.id}`}
                        type="button"
                        onClick={() => handleFilterChange({ category: cat.id })}
                        className={`flex-1 min-w-[100px] py-2 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#EBF3FE] text-[#1769D1] shadow-xs'
                            : 'text-gray-600 hover:text-[#111827] hover:bg-white'
                        }`}
                      >
                        <span className="shrink-0">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>

          {/* 4. Trust & How It Works Row */}
          <TrustAndHowItWorks />

          {/* 5. Top Cities Section & Stats Bar */}
          <TopCitiesSection
            onSelectCity={(cityName) => {
              handleFilterChange({ searchLocation: `${cityName}` });
              document.getElementById('vehicles-near-you')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenWaitlist={() => setIsWaitlistOpen(true)}
          />

          {/* 6. "Vehicles near you" Section */}
          <section id="vehicles-near-you" className="w-full py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#111827]">
                    Vehicles near you
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Showing {filteredVehicles.length} verified {filters.category !== 'all' ? filters.category : 'vehicles'} available {filters.searchLocation ? `in ${filters.searchLocation.split(',')[0]}` : 'across all locations'}
                  </p>
                </div>

                {/* Right: View all link + category resets */}
                <div className="flex items-center gap-3">
                  {filters.category !== 'all' && (
                    <button
                      onClick={() => handleFilterChange({ category: 'all' })}
                      className="text-xs sm:text-sm font-black text-[#1769D1] hover:underline cursor-pointer"
                    >
                      Show all types
                    </button>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => showToast('Scrolling through nearby vehicles')}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Showing next set of vehicles')}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Vehicle Cards Grid */}
              {isLoadingVehicles ? (
                <div className="bg-[#FAFBFD] rounded-3xl p-12 text-center border border-gray-200">
                  <div className="w-8 h-8 border-3 border-[#FF6400] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-gray-700">Connecting to live fleet...</h3>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="bg-[#FAFBFD] rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                  <Car className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-base font-black text-[#111827]">No vehicles listed yet</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Be the first verified host to list a car or bike on MyRyedo and start earning daily rental income.
                  </p>
                  <button
                    onClick={handleInitiateListVehicle}
                    className="mt-2 bg-[#FF6400] hover:bg-[#e05800] text-white text-xs font-black px-6 py-3 rounded-xl cursor-pointer shadow-md shadow-orange-500/20"
                  >
                    + List Your Vehicle Now
                  </button>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="bg-[#FAFBFD] rounded-3xl p-12 text-center border border-gray-200">
                  <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-black text-[#111827]">No vehicles match your search filters</h3>
                  <p className="text-xs text-gray-500 mt-1">Try expanding your price range or adjusting fuel/transmission preferences.</p>
                  <button
                    onClick={() => setFilters({
                      category: 'all',
                      searchLocation: '',
                      pickupDate: '',
                      returnDate: '',
                      minPrice: 0,
                      maxPrice: 15000,
                      fuelTypes: [],
                      transmissions: [],
                      onlyVerified: false,
                      instantBookingOnly: false,
                      sortBy: 'recommended'
                    })}
                    className="mt-4 bg-[#1769D1] text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isFavorite={favorites.includes(vehicle.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={(v) => handleSelectVehicle(v)}
                    />
                  ))}
                </div>
              )}

            </div>
          </section>

          {/* 7. "Find your ride on the map" Section */}
          <MapView
            vehicles={filteredVehicles}
            selectedVehicle={selectedVehicleForMap}
            onSelectVehicle={(v) => {
              setSelectedVehicleForMap(v);
              handleSelectVehicle(v);
            }}
            onViewAll={() => {
              document.getElementById('vehicles-near-you')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 8. "Your vehicle can earn while you're away." */}
          <BecomeOwnerSection
            onListVehicle={handleInitiateListVehicle}
            onExploreClick={() => {
              document.getElementById('vehicles-near-you')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

        </main>
      )}

      {/* VIEW: Vehicle Details Page */}
      {currentView === 'vehicle-details' && detailsVehicle && (
        <main className="flex-1">
          <VehicleDetailsPage
            vehicle={detailsVehicle}
            currentUser={currentUser}
            isFavorite={favorites.includes(detailsVehicle.id)}
            onToggleFavorite={handleToggleFavorite}
            onStartBooking={(vehicle, pickupDate, returnDate) => {
              handleInitiateBooking(vehicle, pickupDate, returnDate);
            }}
            onOpenChat={(ownerId, vehicleId) => {
              handleInitiateChat(ownerId, vehicleId);
            }}
            onBack={() => setCurrentView('home')}
          />
        </main>
      )}

      {/* VIEW: Multi-Step Booking Page */}
      {currentView === 'booking' && bookingVehicle && (
        <main className="flex-1">
          <BookingPage
            vehicle={bookingVehicle.vehicle}
            bookingDetails={bookingVehicle}
            currentUser={currentUser}
            existingBookings={bookings}
            onBack={() => {
              setBookingVehicle(null);
              setCurrentView(detailsVehicle ? 'vehicle-details' : 'home');
            }}
            onBookingConfirmed={handleBookingConfirmed}
            onOpenAuthModal={(mode) => handleOpenAuthModal(mode, 'Sign in to complete your booking')}
            onGoToOwnerDashboard={() => setCurrentView('owner-dashboard')}
            onOpenChat={(ownerId, vehicleId) => handleInitiateChat(ownerId, vehicleId)}
            showToast={showToast}
          />
        </main>
      )}

      {/* VIEW: Authentication Page (Full-Page Workflow) */}
      {currentView === 'auth' && (
        <main className="flex-1">
          <AuthPage
            initialMode={authDefaultMode}
            intendedRole={authRoleHint}
            intentMessage={authIntentMessage}
            onLogin={handleLogin}
            onSuccess={handleLogin}
            onBack={() => {
              setCurrentView('home');
              setPendingAction(null);
              setAuthIntentMessage(null);
            }}
            showToast={showToast}
          />
        </main>
      )}

      {/* VIEW: Booking Cancellation Page */}
      {currentView === 'cancel-booking' && cancellingBooking && (
        <main className="flex-1">
          <CancellationPage
            booking={cancellingBooking}
            currentUser={currentUser}
            onBack={() => {
              setCancellingBooking(null);
              setCurrentView('booker-dashboard');
            }}
            onCancelled={(cancelledBooking) => handleCancellationCompleted(cancelledBooking?.id || cancellingBooking?.id, cancelledBooking?.cancellation || cancelledBooking)}
          />
        </main>
      )}

      {/* VIEW: Notifications Page */}
      {currentView === 'notifications' && (
        <main className="flex-1">
          <NotificationsPage
            notifications={notifications}
            unreadCount={notifications.filter(n => !n.read).length}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onNavigateNotification={handleNavigateNotification}
            onBack={() => setCurrentView('home')}
          />
        </main>
      )}

      {/* VIEW: User Profile & KYC & Settings Page */}
      {currentView === 'profile' && (
        <main className="flex-1">
          <ProfilePage
            currentUser={currentUser}
            bookings={bookings}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              showToast('Profile information updated successfully!');
            }}
            onBack={() => setCurrentView('home')}
            onLogout={handleLogout}
            onOpenBookings={() => setCurrentView('booker-dashboard')}
            onGoToOwnerDashboard={() => setCurrentView('owner-dashboard')}
            onAddNewVehicle={() => setCurrentView('list-vehicle')}
            showToast={showToast}
          />
        </main>
      )}

      {/* VIEW: List Vehicle Page */}
      {currentView === 'list-vehicle' && (
        <main className="flex-1">
          <ListVehicleModal
            isPageMode={true}
            isOpen={true}
            currentUser={currentUser}
            onClose={() => setCurrentView('owner-dashboard')}
            onVehicleAdded={(newV) => {
              handleVehicleAdded(newV);
              setCurrentView('owner-dashboard');
            }}
          />
        </main>
      )}

      {/* VIEW: Edit Vehicle Page */}
      {currentView === 'edit-vehicle' && editingVehicle && (
        <main className="flex-1">
          <EditVehicleModal
            isPageMode={true}
            vehicle={editingVehicle}
            isOpen={true}
            currentUser={currentUser}
            onClose={() => {
              setEditingVehicle(null);
              setCurrentView('owner-dashboard');
            }}
            onUpdateVehicle={(updated) => {
              handleVehicleUpdated(updated);
              setEditingVehicle(null);
              setCurrentView('owner-dashboard');
            }}
            onDeleteVehicle={(id) => {
              handleVehicleDeleted(id);
              setEditingVehicle(null);
              setCurrentView('owner-dashboard');
            }}
          />
        </main>
      )}

      {/* VIEW: Booker Dashboard */}
      {(currentView === 'booker-dashboard' || currentView === 'renter-dashboard') && (
        <main className="flex-1">
          <BookerDashboard
            currentUser={currentUser}
            bookings={bookings}
            onOpenVehicleDetails={(v) => handleSelectVehicle(v)}
            onOpenChat={(b) => setChatTarget({ ownerId: b.vehicle.owner.id, vehicleId: b.vehicle.id })}
            onCancelBooking={handleInitiateCancelBooking}
            onExploreVehicles={() => setCurrentView('home')}
          />
        </main>
      )}

      {/* VIEW: Host / Owner Dashboard */}
      {currentView === 'owner-dashboard' && (
        <main className="flex-1">
          <OwnerDashboard
            currentUser={currentUser}
            vehicles={vehicles}
            bookings={bookings}
            payouts={payouts}
            onOpenListVehicle={handleInitiateListVehicle}
            onOpenEditVehicle={(v) => {
              setEditingVehicle(v);
              setCurrentView('edit-vehicle');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleVehicleAvailability={handleToggleAvailability}
            onOpenVehicleDetails={(v) => handleSelectVehicle(v)}
            onApproveBooking={handleApproveBooking}
            onRejectBooking={handleRejectBooking}
            onRequestPayout={handleRequestPayout}
          />
        </main>
      )}

      {/* VIEW: Platform Admin Dashboard */}
      {currentView === 'admin-dashboard' && (
        <main className="flex-1">
          <AdminDashboard
            users={allUsers}
            vehicles={vehicles}
            bookings={bookings}
            disputes={disputes}
            payouts={payouts}
            onApproveVehicle={handleAdminApproveVehicle}
            onToggleVehicleFeatured={handleToggleVehicleFeatured}
            onResolveDispute={handleAdminResolveDispute}
            onApprovePayout={handleAdminApprovePayout}
          />
        </main>
      )}

      {/* Global Modals */}

      {/* 1. Vehicle Details Modal (Used when not in full-page mode) */}
      <VehicleDetailsModal
        vehicle={detailsVehicle}
        isOpen={currentView !== 'vehicle-details' && !!detailsVehicle}
        onClose={() => setDetailsVehicle(null)}
        onStartBooking={(vehicle, pickupDate, returnDate) => {
          setDetailsVehicle(null);
          handleInitiateBooking(vehicle, pickupDate, returnDate);
        }}
        onOpenChat={(ownerId, vehicleId) => {
          setDetailsVehicle(null);
          handleInitiateChat(ownerId, vehicleId);
        }}
        isFavorite={detailsVehicle ? favorites.includes(detailsVehicle.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 2. Advanced Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={(f) => {
          setFilters(f);
          showToast('Applied vehicle filters');
        }}
        totalVehiclesCount={filteredVehicles.length}
      />

      {/* 3. Authentication Modal (Login / Signup / Intent / Forgot) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
          setAuthIntentMessage(null);
        }}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onRoleSwitch={handleRoleChange}
        initialMode={authDefaultMode}
        intentMessage={authIntentMessage}
        intendedRole={authRoleHint}
      />

      {/* 4. Booking Modal (Used when not in full-page mode) */}
      {bookingVehicle && currentView !== 'booking' && (
        <BookingModal
          vehicle={bookingVehicle.vehicle}
          bookingDetails={bookingVehicle}
          rentalType={bookingVehicle.rentalType}
          pickupDate={bookingVehicle.pickupDate}
          pickupTime={bookingVehicle.pickupTime}
          returnDate={bookingVehicle.returnDate}
          returnTime={bookingVehicle.returnTime}
          isOpen={!!bookingVehicle}
          currentUser={currentUser}
          existingBookings={bookings}
          onClose={() => setBookingVehicle(null)}
          onBookingConfirmed={handleBookingConfirmed}
          onOpenVerification={() => {
            setBookingVehicle(null);
            setIsVerificationOpen(true);
          }}
          onNavigateToDashboard={() => setCurrentView('booker-dashboard')}
        />
      )}

      {/* 5. Real-time In-App Chat Modal */}
      {chatTarget && (
        <ChatModal
          isOpen={!!chatTarget}
          onClose={() => setChatTarget(null)}
          ownerId={chatTarget.ownerId}
          vehicleId={chatTarget.vehicleId}
          currentUserId={currentUser?.id}
          vehicles={vehicles}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* 6. Host Listing Wizard Modal (Used when not in full-page mode) */}
      <ListVehicleModal
        isOpen={currentView !== 'list-vehicle' && isListVehicleOpen}
        currentUser={currentUser}
        onClose={() => setIsListVehicleOpen(false)}
        onVehicleAdded={handleVehicleAdded}
      />

      {/* 7. Edit Vehicle Pricing & Deposit Modal (Used when not in full-page mode) */}
      {editingVehicle && currentView !== 'edit-vehicle' && (
        <EditVehicleModal
          vehicle={editingVehicle}
          isOpen={!!editingVehicle}
          currentUser={currentUser}
          onClose={() => setEditingVehicle(null)}
          onUpdateVehicle={handleVehicleUpdated}
          onDeleteVehicle={handleVehicleDeleted}
        />
      )}

      {/* 8. Inspection Modal */}
      {inspectionTarget && (
        <InspectionModal
          isOpen={!!inspectionTarget}
          onClose={() => setInspectionTarget(null)}
          booking={inspectionTarget.booking}
          stage={inspectionTarget.stage}
          onSubmitInspection={handleSubmitInspection}
        />
      )}

      {/* 9. Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          booking={reviewBooking}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* 10. Expansion Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        defaultCity="Indore"
        onJoined={() => showToast("You've been added to the priority launch waitlist!")}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-[#111827]">
                My<span className="text-[#FF6400]">Ryedo</span>
              </span>
              <span>© 2026 MyRyedo Technologies Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 font-bold">
              <span className="hover:text-[#FF6400] cursor-pointer" onClick={() => showToast('All trips covered up to ₹2,00,000 with bumper-to-bumper insurance')}>Insurance Protection</span>
              <span className="hover:text-[#FF6400] cursor-pointer" onClick={() => showToast('Quick 2-step paperless vehicle onboarding')}>Fast Direct Access</span>
              <span className="hover:text-[#FF6400] cursor-pointer" onClick={() => showToast('24/7 Roadside Assist: +91 800-MYRYEDO')}>24/7 Roadside Assist</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
