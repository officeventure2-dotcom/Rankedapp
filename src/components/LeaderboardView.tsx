import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { getTierForLevel, getTierColor, CATEGORY_METADATA } from '../utils/levelMath';
import { LeaderboardUser, CategoryType } from '../types';
import { Search, Trophy, Users, Shield, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, user, setActiveFriendId, setActiveTab, openUserProfile } = useRanked();
  const [filterType, setFilterType] = useState<'all' | 'friends'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForCompare, setSelectedUserForCompare] = useState<LeaderboardUser | null>(null);

  const filteredList = leaderboard.filter(item => {
    if (filterType === 'friends' && !item.isFriend && !item.isCurrentUser) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.handle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            Global & Friends Leaderboard
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Ranked hierarchy across 25,000,000 XP mastery and 1,000 levels.
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              All Global
            </button>
            <button
              onClick={() => setFilterType('friends')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'friends'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Friends Only
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search user or handle..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Top Pillar</th>
                <th className="py-3 px-4 text-right">Level</th>
                <th className="py-3 px-4 text-right">Total XP</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
              {filteredList.map((entry) => {
                const tier = getTierForLevel(entry.level);
                const tierColor = getTierColor(tier);
                const isCurrent = entry.isCurrentUser || entry.id === user.id;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 font-semibold'
                        : 'hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                      {entry.rank === 1 ? (
                        <span className="text-yellow-500 flex items-center gap-1">
                          <Trophy className="w-4 h-4 fill-yellow-500" /> 1
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Trophy className="w-4 h-4 fill-zinc-400" /> 2
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="text-amber-700 flex items-center gap-1">
                          <Trophy className="w-4 h-4 fill-amber-700" /> 3
                        </span>
                      ) : (
                        <span className="text-zinc-500">#{entry.rank}</span>
                      )}
                    </td>

                    {/* User profile info */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => openUserProfile(entry.id)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 group-hover:ring-2 group-hover:ring-amber-500 transition-all"
                        />
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 group-hover:text-amber-500 transition-colors">
                            <span>{entry.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono">{entry.handle}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${tierColor.badgeBorder} ${tierColor.badgeBg} ${tierColor.badgeText}`}>
                        {tier.toUpperCase()}
                      </span>
                    </td>

                    {/* Top Discipline Pillar */}
                    <td className="py-3.5 px-4">
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                        {CATEGORY_METADATA[entry.topCategory]?.name || 'General'}
                      </span>
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-zinc-900 dark:text-zinc-50 tabular-nums">
                      {entry.level}
                    </td>

                    {/* Total XP */}
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-600 dark:text-zinc-400 tabular-nums">
                      {entry.xp.toLocaleString()} XP
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openUserProfile(entry.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                        >
                          Achievements
                        </button>
                        <button
                          onClick={() => setSelectedUserForCompare(entry)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          Compare
                        </button>
                        {entry.isFriend && entry.id !== user.id && (
                          <button
                            onClick={() => {
                              setActiveFriendId(entry.id);
                              setActiveTab('chat');
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
                          >
                            Chat
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Modal Side-by-Side */}
      {selectedUserForCompare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
                Side-by-Side Competitor Comparison
              </h3>
              <button
                onClick={() => setSelectedUserForCompare(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              {/* You */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-amber-500"
                />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{user.name}</h4>
                <p className="text-xs text-zinc-500">Level {user.level} · {getTierForLevel(user.level)}</p>
                <p className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {user.xp.toLocaleString()} XP
                </p>
                <div className="pt-2 text-left text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
                  <p>Verified IQ: <strong>{user.stats.iqScore}</strong></p>
                  <p>Books Read: <strong>{user.stats.booksRead}</strong></p>
                  <p>Logged Km: <strong>{user.stats.kmLogged} km</strong></p>
                </div>
              </div>

              {/* Opponent */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <img
                  src={selectedUserForCompare.avatar}
                  alt={selectedUserForCompare.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-zinc-400"
                />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{selectedUserForCompare.name}</h4>
                <p className="text-xs text-zinc-500">Level {selectedUserForCompare.level} · {selectedUserForCompare.tier}</p>
                <p className="font-mono text-sm font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
                  {selectedUserForCompare.xp.toLocaleString()} XP
                </p>
                <div className="pt-2 text-left text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
                  <p>Rank Position: <strong>#{selectedUserForCompare.rank}</strong></p>
                  <p>Primary Domain: <strong>{CATEGORY_METADATA[selectedUserForCompare.topCategory]?.name}</strong></p>
                  <p>Status: <strong>{selectedUserForCompare.isFriend ? 'Connected Friend' : 'Global Contender'}</strong></p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setSelectedUserForCompare(null)}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
