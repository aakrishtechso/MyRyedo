import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Map, AdvancedMarker, Pin, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Search, ShieldCheck, CheckCircle2, AlertCircle, Building2, Eye, EyeOff } from 'lucide-react';

// Default center: Pune, Maharashtra
const DEFAULT_CENTER = { lat: 18.5590, lng: 73.7868 };

export const LocationPicker = ({
  initialAddress = '',
  initialCity = 'Pune',
  initialCoords = DEFAULT_CENTER,
  initialPickupType = 'public_nearby', // 'exact' | 'public_nearby'
  initialInstructions = '',
  onChange
}) => {
  const [coords, setCoords] = useState(initialCoords || DEFAULT_CENTER);
  const [address, setAddress] = useState(initialAddress || 'Baner High Street, Baner, Pune');
  const [city, setCity] = useState(initialCity || 'Pune');
  const [stateName, setStateName] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('411045');
  const [pickupType, setPickupType] = useState(initialPickupType);
  const [instructions, setInstructions] = useState(initialInstructions);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  const placesLib = useMapsLibrary('places');
  const sessionTokenRef = useRef(null);
  const map = useMap();

  // Notify parent of location data changes
  const notifyChange = useCallback((updated) => {
    if (onChange) {
      onChange({
        coordinates: updated.coords || coords,
        address: updated.address ?? address,
        city: updated.city ?? city,
        state: updated.state ?? stateName,
        postalCode: updated.postalCode ?? postalCode,
        pickupType: updated.pickupType ?? pickupType,
        instructions: updated.instructions ?? instructions,
        formattedAddress: `${updated.address ?? address}, ${updated.city ?? city}, ${updated.state ?? stateName}`
      });
    }
  }, [coords, address, city, stateName, postalCode, pickupType, instructions, onChange]);

  // Pan map when coordinates change
  useEffect(() => {
    if (map && coords) {
      map.panTo(coords);
    }
  }, [map, coords]);

  // Places Autocomplete suggestion search using modern Places API
  useEffect(() => {
    if (!placesLib || !searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
    if (!sessionTokenRef.current && AutocompleteSessionToken) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    if (!AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
      return;
    }

    setIsSearching(true);
    AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: searchQuery,
      sessionToken: sessionTokenRef.current,
      region: 'IN'
    })
      .then((res) => {
        setSuggestions(res.suggestions || []);
        setIsSearching(false);
      })
      .catch((err) => {
        console.warn('Autocomplete fetch error:', err);
        setIsSearching(false);
      });
  }, [placesLib, searchQuery]);

  // Handle selecting an autocomplete suggestion
  const handleSelectSuggestion = async (suggestion) => {
    if (!suggestion.placePrediction) return;
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'addressComponents']
      });

      const newLat = place.location?.lat() ?? coords.lat;
      const newLng = place.location?.lng() ?? coords.lng;
      const newCoords = { lat: newLat, lng: newLng };
      const formatted = place.formattedAddress || suggestion.placePrediction.text?.text || searchQuery;

      // Parse address components
      let extractedCity = 'Pune';
      let extractedState = 'Maharashtra';
      let extractedPostal = '411045';

      if (place.addressComponents) {
        for (const comp of place.addressComponents) {
          if (comp.types.includes('locality')) extractedCity = comp.longText || comp.shortText;
          if (comp.types.includes('administrative_area_level_1')) extractedState = comp.longText || comp.shortText;
          if (comp.types.includes('postal_code')) extractedPostal = comp.longText || comp.shortText;
        }
      }

      setCoords(newCoords);
      setAddress(formatted);
      setCity(extractedCity);
      setStateName(extractedState);
      setPostalCode(extractedPostal);
      setSearchQuery('');
      setSuggestions([]);
      sessionTokenRef.current = null; // Reset session token per Google guidelines

      notifyChange({
        coords: newCoords,
        address: formatted,
        city: extractedCity,
        state: extractedState,
        postalCode: extractedPostal
      });

      setLocationStatus('Location selected successfully');
    } catch (err) {
      console.warn('Place fetchFields error:', err);
      // Fallback
      setAddress(suggestion.placePrediction?.text?.text || searchQuery);
      setSuggestions([]);
    }
  };

  // Reverse geocoding helper via browser fetch or fallback
  const reverseGeocode = async (lat, lng) => {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (resp.ok) {
        const data = await resp.json();
        const road = data.address?.road || data.address?.neighbourhood || data.address?.suburb || 'Main Street';
        const cty = data.address?.city || data.address?.town || data.address?.state_district || 'Pune';
        const st = data.address?.state || 'Maharashtra';
        const pc = data.address?.postcode || '411045';
        const full = data.display_name?.split(',').slice(0, 3).join(',') || `${road}, ${cty}`;

        setAddress(full);
        setCity(cty);
        setStateName(st);
        setPostalCode(pc);
        notifyChange({
          coords: { lat, lng },
          address: full,
          city: cty,
          state: st,
          postalCode: pc
        });
        return;
      }
    } catch (e) {
      console.warn('Reverse geocode fallback', e);
    }
    // Static coordinate fallback
    const fallbackAddr = `Near Landmark (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    setAddress(fallbackAddr);
    notifyChange({ coords: { lat, lng }, address: fallbackAddr });
  };

  // "Use My Current Location" handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Acquiring precise GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(newCoords);
        setIsLocating(false);
        setLocationStatus('GPS location detected!');
        reverseGeocode(newCoords.lat, newCoords.lng);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Could not retrieve GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. You can search or select on the map.';
        }
        setLocationStatus(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle map click to place pin
  const handleMapClick = (e) => {
    if (e.detail?.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      const newCoords = { lat, lng };
      setCoords(newCoords);
      reverseGeocode(lat, lng);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Current Location bar */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center justify-between">
          <span>Vehicle Pickup Location</span>
          <span className="text-gray-400 font-normal lowercase text-[11px]">(search or click on map)</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Autocomplete Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pickup area, metro, or landmark..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#FF6400] focus:ring-1 focus:ring-[#FF6400] focus:outline-none"
            />
            {isSearching && (
              <span className="absolute right-3 top-3 text-[10px] text-gray-400 font-bold animate-pulse">
                Searching...
              </span>
            )}

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 divide-y divide-gray-100 max-h-56 overflow-y-auto">
                {suggestions.map((sugg, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSuggestion(sugg)}
                    className="p-3 text-xs font-semibold text-gray-800 hover:bg-orange-50 hover:text-[#FF6400] cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{sugg.placePrediction?.text?.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Current Location button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-black text-gray-800 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#FF6400] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
          </button>
        </div>

        {locationStatus && (
          <p className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5 pt-0.5">
            <AlertCircle className="w-3 h-3 text-[#FF6400]" />
            <span>{locationStatus}</span>
          </p>
        )}
      </div>

      {/* Interactive Google Map */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
        <Map
          defaultCenter={coords}
          center={coords}
          defaultZoom={15}
          zoom={15}
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          disableDefaultUI={false}
          gestureHandling="greedy"
          onClick={handleMapClick}
          className="w-full h-full"
        >
          <AdvancedMarker
            position={coords}
            title="Pickup Spot"
          >
            <div className="flex flex-col items-center cursor-pointer -translate-y-2">
              <div className="bg-[#FF6400] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1">
                📍 Pickup Point
              </div>
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[#FF6400] shadow-lg flex items-center justify-center text-[#FF6400]">
                <MapPin className="w-4 h-4 fill-[#FF6400] text-white" />
              </div>
            </div>
          </AdvancedMarker>
        </Map>

        {/* Map overlay hint */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-600 shadow-xs border border-gray-200 pointer-events-none">
          Click map to reposition pin
        </div>
      </div>

      {/* Selected Location Summary Box */}
      <div className="bg-[#FAFBFD] p-3.5 rounded-2xl border border-gray-100 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Resolved Pickup Address
            </span>
            <p className="text-xs font-bold text-gray-900 leading-snug">
              {address}
            </p>
            <p className="text-[11px] text-gray-500 font-medium">
              {city}, {stateName} · PIN: {postalCode}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-gray-400 block">
              {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
              <CheckCircle2 className="w-3 h-3" /> Pin Verified
            </span>
          </div>
        </div>

        {/* Host Privacy / Pickup Style Option */}
        <div className="pt-2 border-t border-gray-200/60">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1.5">
            Privacy & Handover Preference
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setPickupType('public_nearby');
                notifyChange({ pickupType: 'public_nearby' });
              }}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                pickupType === 'public_nearby'
                  ? 'border-[#FF6400] bg-orange-50/60 text-[#FF6400] ring-1 ring-[#FF6400]'
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-black">
                <Building2 className="w-3.5 h-3.5" />
                <span>Nearby Public Landmark</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                Recommended for privacy (metro station, mall, commercial garage)
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPickupType('exact');
                notifyChange({ pickupType: 'exact' });
              }}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                pickupType === 'exact'
                  ? 'border-[#FF6400] bg-orange-50/60 text-[#FF6400] ring-1 ring-[#FF6400]'
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-black">
                <MapPin className="w-3.5 h-3.5" />
                <span>Exact Home / Office Spot</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                Revealed only to verified bookers after confirmed reservation
              </p>
            </button>
          </div>
        </div>

        {/* Handover Instructions input */}
        <div className="pt-2 border-t border-gray-200/60">
          <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">
            Handover & Key Pickup Instructions
          </label>
          <input
            type="text"
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              notifyChange({ instructions: e.target.value });
            }}
            placeholder="e.g. Call 15 min before arrival; collect keys at security desk or smart lockbox"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#FF6400] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
