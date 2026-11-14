import React, { useState, useMemo, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useRanked } from '../context/RankedContext';
import { INITIAL_MAP_PLAYERS, calculateDistanceKm } from '../data/mapData';
import { MapPlayer } from '../types';
import { getTierForLevel, getTierColor } from '../utils/levelMath';
import {
  MapPin,
  Navigation,
  Search,
  Swords,
  MessageCircle,
  Radio,
  Compass,
  Crosshair,
  Maximize2,
  Minimize2,
  Users,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { haptics } from '../utils/haptics';
import { Avatar } from './Avatar';

// Controller component to handle programmatic pan/zoom when selecting players or centering
const MapController: React.FC<{
  targetCoords: { lat: number; lng: number } | null;
  targetZoom?: number;
}> = ({ targetCoords, targetZoom = 12 }) => {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      if (targetZoom) {
        map.setZoom(targetZoom);
      }
    }
  }, [map, targetCoords, targetZoom]);

  return null;
};

export const PlayersMapView: React.FC = () => {
  const {
    user,
    userLocation,
    locationEnabled,
    enableLocation,
    toggleLocation,
    openUserProfile,
    setActiveFriendId,
    setActiveTab
  } = useRanked();

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 'mythic_apex' | 'master_plus' | 'friends'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<MapPlayer | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: userLocation?.lat || 37.7749,
    lng: userLocation?.lng || -122.4194
  });
  const [mapZoom, setMapZoom] = useState<number>(3);
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'level'>('distance');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true); // Fullscreen by default as requested!

  // Sync user location to Alex Hunter's marker coordinates
  const playersWithLiveUser: MapPlayer[] = useMemo(() => {
    return INITIAL_MAP_PLAYERS.map(player => {
      if (player.id === 'usr_me' || player.isCurrentUser) {
        const myCoords = userLocation || { lat: 37.7749, lng: -122.4194 };
        return {
          ...player,
          level: user.level,
          xp: user.xp,
          tier: getTierForLevel(user.level),
          location: {
            ...player.location,
            lat: myCoords.lat,
            lng: myCoords.lng,
            city: userLocation?.city || player.location.city
          }
        };
      }
      return player;
    });
  }, [user.level, user.xp, userLocation]);

  // Compute live distance from current user location
  const playersWithDistance: MapPlayer[] = useMemo(() => {
    const userLat = userLocation?.lat || 37.7749;
    const userLng = userLocation?.lng || -122.4194;

    return playersWithLiveUser.map(p => {
      const dist = calculateDistanceKm(userLat, userLng, p.location.lat, p.location.lng);
      return {
        ...p,
        distanceKm: dist
      };
    });
  }, [playersWithLiveUser, userLocation]);

  // Filter players based on tier, friendship, and search query
  const filteredPlayers = useMemo(() => {
    return playersWithDistance.filter(player => {
      // Tier filter
      if (selectedTierFilter === 'mythic_apex') {
        if (player.tier !== 'Mythic' && player.tier !== 'Apex') return false;
      } else if (selectedTierFilter === 'master_plus') {
        if (!['Mythic', 'Apex', 'Grandmaster', 'Master'].includes(player.tier)) return false;
      } else if (selectedTierFilter === 'friends') {
        if (!player.isFriend && !player.isCurrentUser) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          player.name.toLowerCase().includes(q) ||
          player.handle.toLowerCase().includes(q) ||
          player.location.city.toLowerCase().includes(q) ||
          player.location.country.toLowerCase().includes(q) ||
          player.topCategory.toLowerCase().includes(q)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      return b.level - a.level;
    });
  }, [playersWithDistance, selectedTierFilter, searchQuery, sortBy]);

  const handleCenterOnMe = () => {
    haptics.bump();
    if (!locationEnabled) {
      enableLocation();
    }
    const coords = userLocation || { lat: 37.7749, lng: -122.4194 };
    setPanTarget({ lat: coords.lat, lng: coords.lng });
    setMapZoom(11);
    const me = playersWithDistance.find(p => p.isCurrentUser);
    if (me) setSelectedPlayer(me);
  };

  const handleJumpToCity = (lat: number, lng: number, zoom = 11) => {
    haptics.tap();
    setPanTarget({ lat, lng });
    setMapZoom(zoom);
  };

  const handleSelectPlayer = (player: MapPlayer) => {
    haptics.tap();
    setSelectedPlayer(player);
    setPanTarget({ lat: player.location.lat, lng: player.location.lng });
  };

  return (
    <div className={isFullscreen ? 'fixed inset-0 top-16 z-30 w-full h-[calc(100vh-4rem)] bg-zinc-950 overflow-hidden' : 'space-y-6 pb-24'}>
      
      {/* If not in fullscreen mode: show intro header */}
      {!isFullscreen && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Real-Time Polymath Geolocation Network</span>
            </div>
            <h2 className="text-2xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50">
              Global Polymath Radar & Player Map
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Discover ranked rivals, nearby scholars, and Grandmasters worldwide with verified level badges.
            </p>
          </div>

          <button
            onClick={() => setIsFullscreen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Enter Fullscreen Map</span>
          </button>
        </div>
      )}

      {/* Main Map Container */}
      <div className={`relative w-full h-full overflow-hidden ${!isFullscreen ? 'rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 min-h-[580px] shadow-2xl' : ''}`}>
        
        {/* Google Map Full View Canvas */}
        <div className="w-full h-full absolute inset-0">
          <APIProvider apiKey={apiKey} libraries={['marker']}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeControl={false}
              streetViewControl={false}
              fullscreenControl={false}
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              className="w-full h-full"
            >
              <MapController targetCoords={panTarget} targetZoom={mapZoom} />

              {/* Render Advanced Markers for All Active Radar Players */}
              {filteredPlayers.map(player => {
                const tier = getTierForLevel(player.level);
                const tierColor = getTierColor(tier);
                const isSelected = selectedPlayer?.id === player.id;
                const isMe = player.isCurrentUser;

                return (
                  <AdvancedMarker
                    key={player.id}
                    position={{ lat: player.location.lat, lng: player.location.lng }}
                    title={`${player.name} (Level ${player.level} - ${tier})`}
                    onClick={() => handleSelectPlayer(player)}
                  >
                    {/* Custom Player Pin with Avatar, Tier border, and Level Badge */}
                    <div className="relative group cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110">
                      
                      {/* Glow halo for higher tiers or current user */}
                      {(tier === 'Mythic' || tier === 'Apex' || isMe) && (
                        <div
                          className={`absolute inset-0 rounded-2xl blur-md pointer-events-none ${
                            isMe ? 'bg-amber-400/50 animate-ping' : 'bg-yellow-400/40 animate-pulse'
                          }`}
                        />
                      )}

                      <div
                        className={`relative p-0.5 rounded-2xl bg-zinc-950 border-2 shadow-2xl transition-all ${
                          isSelected
                            ? 'ring-4 ring-amber-500 scale-110'
                            : `${tierColor.badgeBorder} hover:scale-105`
                        }`}
                      >
                        <Avatar src={player.avatar} name={player.name} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover bg-zinc-800" />

                        {/* Level Badge Pin */}
                        <div
                          className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded font-mono text-[9px] font-extrabold whitespace-nowrap border shadow-md ${tierColor.badgeBg} ${tierColor.badgeBorder} ${tierColor.badgeText}`}
                        >
                          Lv.{player.level}
                        </div>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* InfoWindow for Selected Player */}
              {selectedPlayer && (
                <InfoWindow
                  position={{ lat: selectedPlayer.location.lat, lng: selectedPlayer.location.lng }}
                  onCloseClick={() => setSelectedPlayer(null)}
                  pixelOffset={[0, -25]}
                >
                  <div className="p-2 max-w-xs text-zinc-900 space-y-2 font-['Plus_Jakarta_Sans',sans-serif]">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={selectedPlayer.avatar} name={selectedPlayer.name} className="w-10 h-10 rounded-xl object-cover border border-zinc-300" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold font-['Outfit'] text-zinc-900 truncate">
                          {selectedPlayer.name}
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-500 block">
                          {selectedPlayer.handle} · {selectedPlayer.location.city}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono font-semibold pt-1 border-t border-zinc-100">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                        Level {selectedPlayer.level}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {selectedPlayer.tier}
                      </span>
                      {selectedPlayer.distanceKm !== undefined && (
                        <span className="text-zinc-500 ml-auto tabular-nums">
                          {selectedPlayer.distanceKm.toLocaleString()} km
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed">
                      {selectedPlayer.bio}
                    </p>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => openUserProfile(selectedPlayer.id)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-900 text-white text-[10px] font-semibold hover:bg-zinc-800 transition-colors text-center"
                      >
                        View Profile
                      </button>
                      {!selectedPlayer.isCurrentUser && (
                        <button
                          onClick={() => {
                            setActiveFriendId(selectedPlayer.id);
                            setActiveTab('chat');
                          }}
                          className="p-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors"
                          title="Direct Message"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!selectedPlayer.isCurrentUser && (
                        <button
                          onClick={() => setActiveTab('challenges')}
                          className="p-1.5 rounded-lg border border-zinc-300 text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Challenge to Mind Duel"
                        >
                          <Swords className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* ======================================================== */}
        {/* FLOATING TRANSPARENT GLASS CONTROLS (JAKOB'S LAW UX)    */}
        {/* ======================================================== */}

        {/* Top Floating Glass Command Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Left: Floating Search & Tier Filters Capsule */}
          <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/75 dark:bg-black/70 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-xl w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search player, city, country..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/10 dark:bg-zinc-900/50 text-white placeholder-zinc-400 border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Quick Tier Filters */}
            <div className="hidden sm:flex items-center gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'mythic_apex', label: 'Lv.850+' },
                { id: 'master_plus', label: 'Lv.450+' },
                { id: 'friends', label: 'Friends' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedTierFilter(f.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg transition-colors ${
                    selectedTierFilter === f.id
                      ? 'bg-amber-500 text-zinc-950 shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Drawer toggle button */}
            <button
              onClick={() => setIsDrawerOpen(prev => !prev)}
              className="p-2 rounded-xl bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20 transition-colors"
              title="Toggle Player Directory Drawer"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Floating Glass Location & Fullscreen Actions */}
          <div className="pointer-events-auto flex items-center gap-2 self-end md:self-auto">
            {/* GPS Status Toggle */}
            <button
              onClick={toggleLocation}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all ${
                locationEnabled
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-zinc-950/75 border-white/15 text-zinc-300 hover:bg-zinc-900/80'
              }`}
            >
              <Crosshair className={`w-3.5 h-3.5 ${locationEnabled ? 'text-emerald-400 animate-spin-slow' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">{locationEnabled ? 'GPS Active' : 'Enable GPS'}</span>
              <span className={`w-2 h-2 rounded-full ${locationEnabled ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-zinc-500'}`} />
            </button>

            {/* Locate Me */}
            <button
              onClick={handleCenterOnMe}
              className="p-2 rounded-2xl bg-zinc-950/75 backdrop-blur-2xl border border-white/15 text-amber-400 hover:text-amber-300 hover:bg-zinc-900 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all"
              title="Locate Me on Radar"
            >
              <Navigation className="w-4 h-4" />
            </button>

            {/* Quick Hub Jump Selector */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-zinc-950/75 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-[11px] font-mono">
              <button
                onClick={() => handleJumpToCity(37.7749, -122.4194, 11)}
                className="px-2 py-1 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                SF
              </button>
              <button
                onClick={() => handleJumpToCity(46.2044, 6.1432, 11)}
                className="px-2 py-1 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                CERN
              </button>
              <button
                onClick={() => handleJumpToCity(35.6762, 139.6503, 11)}
                className="px-2 py-1 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                Tokyo
              </button>
              <button
                onClick={() => handleJumpToCity(20, 0, 2)}
                className="px-2 py-1 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                Global
              </button>
            </div>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 rounded-2xl bg-zinc-950/75 backdrop-blur-2xl border border-white/15 text-zinc-300 hover:text-white hover:bg-zinc-900 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sliding Transparent Glass Player List Drawer (Collapsible) */}
        {isDrawerOpen && (
          <div className="absolute top-20 left-4 bottom-24 z-20 w-80 max-w-[85vw] rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-white/15 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.6)] flex flex-col space-y-3 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2 text-white text-xs font-bold font-['Outfit']">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Polymath Directory ({filteredPlayers.length})</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5 space-y-1">
              {filteredPlayers.map(p => {
                const tier = getTierForLevel(p.level);
                const tierColor = getTierColor(tier);
                const isSelected = selectedPlayer?.id === p.id;
                const isMe = p.isCurrentUser;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPlayer(p)}
                    className={`p-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/50'
                        : isMe
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar src={p.avatar} name={p.name} className={`w-9 h-9 rounded-xl object-cover border ${tierColor.badgeBorder}`} />
                      <span className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded font-mono text-[8px] font-bold border ${tierColor.badgeBg} ${tierColor.badgeBorder} ${tierColor.badgeText}`}>
                        {p.level}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span className="truncate">{p.name}</span>
                        {p.distanceKm !== undefined && (
                          <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
                            {p.distanceKm.toLocaleString()}km
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate">
                        {p.location.city} · <span className={tierColor.badgeText}>{p.tier}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Floating Transparent Glass HUD Card (Bottom Right Selected Player) */}
        {selectedPlayer && (
          <div className="absolute bottom-20 right-4 z-20 max-w-sm w-full bg-zinc-950/85 backdrop-blur-2xl rounded-3xl border border-white/15 p-4 text-white shadow-[0_16px_50px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-2 duration-150 hidden sm:block">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar src={selectedPlayer.avatar} name={selectedPlayer.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/80" />
                <div>
                  <h3 className="text-sm font-bold font-['Outfit'] text-white">
                    {selectedPlayer.name}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    {selectedPlayer.location.city}, {selectedPlayer.location.country}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                  Level {selectedPlayer.level}
                </span>
                <p className="text-[10px] font-mono text-zinc-400 mt-1 tabular-nums">
                  {selectedPlayer.distanceKm !== undefined ? `${selectedPlayer.distanceKm.toLocaleString()} km away` : ''}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 mt-2.5 line-clamp-2 leading-relaxed">
              {selectedPlayer.bio}
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => openUserProfile(selectedPlayer.id)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-xs font-bold hover:brightness-110 transition-all text-center"
              >
                Inspect Profile
              </button>
              {!selectedPlayer.isCurrentUser && (
                <button
                  onClick={() => {
                    setActiveFriendId(selectedPlayer.id);
                    setActiveTab('chat');
                  }}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/10 text-zinc-200 text-xs font-semibold hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              )}
              {!selectedPlayer.isCurrentUser && (
                <button
                  onClick={() => setActiveTab('challenges')}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/10 text-zinc-200 text-xs font-semibold hover:bg-white/20 transition-colors"
                >
                  <Swords className="w-3.5 h-3.5 text-rose-400" />
                  <span>Duel</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
