import React, { useState, useRef, useEffect } from 'react';
import { useRanked } from '../context/RankedContext';
import { getTierForLevel, getTierColor } from '../utils/levelMath';
import { Send, Circle, Sparkles, MessageCircle } from 'lucide-react';
import { Avatar } from './Avatar';

export const ChatView: React.FC = () => {
  const {
    friends,
    activeFriendId,
    setActiveFriendId,
    chatMessages,
    sendChatMessage,
    user,
    openUserProfile
  } = useRanked();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeFriend = friends.find(f => f.id === activeFriendId) || friends[0];
  const messages = chatMessages[activeFriend?.id] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(activeFriend.id, inputText);
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Friends Directory (Left Sidebar) */}
        <div className="md:col-span-4 border-r border-zinc-200 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between px-2 pt-1">
            <h3 className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-amber-500" />
              <span>Ranked Friends</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              {friends.length} Active
            </span>
          </div>

          <div className="space-y-1">
            {friends.map(friend => {
              const isSelected = friend.id === activeFriend?.id;
              const friendTier = getTierForLevel(friend.level);
              const tierStyle = getTierColor(friendTier);

              return (
                <button
                  key={friend.id}
                  onClick={() => setActiveFriendId(friend.id)}
                  className={`w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700/80'
                      : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar src={friend.avatar} name={friend.name} className="w-10 h-10 rounded-xl object-cover" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                        friend.status === 'online'
                          ? 'bg-emerald-500'
                          : friend.status === 'in_challenge'
                          ? 'bg-amber-500'
                          : 'bg-zinc-400'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {friend.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${tierStyle.badgeText}`}>
                        Lvl {friend.level}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {friend.lastMessage}
                    </p>

                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {friend.sharedInterests.slice(0, 2).map((interest, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-zinc-400 dark:text-zinc-500"
                        >
                          {interest} {i === 0 ? '·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Pane (Right) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-zinc-900">
          
          {/* Active Contact Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div
              onClick={() => openUserProfile(activeFriend.id)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Avatar src={activeFriend.avatar} name={activeFriend.name} className="w-9 h-9 rounded-xl object-cover group-hover:ring-2 group-hover:ring-amber-500 transition-all" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                    {activeFriend.name}
                  </h4>
                  <span className="text-xs text-zinc-400 font-mono">{activeFriend.handle}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>Level {activeFriend.level} {getTierForLevel(activeFriend.level)}</span>
                  <span>·</span>
                  <span>Shared: {activeFriend.sharedInterests.join(', ')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openUserProfile(activeFriend.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              View Achievements
            </button>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[380px] max-h-[500px]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.isSelf
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-br-none'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Discussion Starters */}
          <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-zinc-400 shrink-0">Quick Ask:</span>
            <button
              onClick={() => sendChatMessage(activeFriend.id, "How do you maintain focus for high-level study sessions?")}
              className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 shrink-0"
            >
              Study Focus Routine?
            </button>
            <button
              onClick={() => sendChatMessage(activeFriend.id, "What book recommendation took your thinking to the next level?")}
              className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 shrink-0"
            >
              Book Recommendation?
            </button>
            <button
              onClick={() => sendChatMessage(activeFriend.id, "Any tips for cracking the hardest IQ matrices?")}
              className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 shrink-0"
            >
              Matrix Deduction Tips?
            </button>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${activeFriend.name} about workouts, books, or IQ puzzles...`}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 transition-colors inline-flex items-center justify-center min-h-touch min-w-touch"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
