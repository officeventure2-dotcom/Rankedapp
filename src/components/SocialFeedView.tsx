import React, { useState } from 'react';
import { useRanked } from '../context/RankedContext';
import { getTierForLevel, getTierColor, CATEGORY_METADATA } from '../utils/levelMath';
import { Heart, MessageSquare, Share2, Plus, Sparkles, Send } from 'lucide-react';
import { CategoryType } from '../types';

export const SocialFeedView: React.FC = () => {
  const { feedPosts, toggleLikePost, addCommentToPost, createPost, user, openUserProfile } = useRanked();
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<CategoryType>('fitness');

  // Comment input per post
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const handleCommentSubmit = (postId: string) => {
    const text = commentDrafts[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text);
    setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    createPost(postTitle, postContent, postCategory);
    setPostTitle('');
    setPostContent('');
    setShowComposeModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* Header and Post Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
            Social Milestone Feed
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Celebrate verified achievements, marathon finishes, doctoral defenses, and reading records.
          </p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Milestone</span>
        </button>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">
              Share a Verified Milestone to Ranked
            </h3>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Discipline</label>
                <select
                  value={postCategory}
                  onChange={e => setPostCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {(Object.keys(CATEGORY_METADATA) as CategoryType[]).map(cat => (
                    <option key={cat} value={cat}>
                      {CATEGORY_METADATA[cat].name} — {CATEGORY_METADATA[cat].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-1">Milestone Headline</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="e.g. Defended Doctoral Thesis or Ran 21km Half Marathon"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-1">Reflection / Notes</label>
                <textarea
                  required
                  rows={3}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Share details of your discipline, time spent, or takeaway insights..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800"
                >
                  Broadcast Milestone (+1,500 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feed Stream */}
      <div className="space-y-4">
        {feedPosts.map(post => {
          const authorTier = getTierForLevel(post.userLevel);
          const authorTierStyle = getTierColor(authorTier);
          const meta = CATEGORY_METADATA[post.category];
          const isCommentsOpen = !!expandedComments[post.id];

          return (
            <article
              key={post.id}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-4"
            >
              {/* Post Author Bar */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => openUserProfile(post.userId)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 group-hover:ring-2 group-hover:ring-amber-500 transition-all"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        {post.userName}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${authorTierStyle.badgeBorder} ${authorTierStyle.badgeBg} ${authorTierStyle.badgeText}`}>
                        Lvl {post.userLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                      <span>{post.userHandle}</span>
                      <span>·</span>
                      <span>{post.timestamp}</span>
                      <span>·</span>
                      <span className="text-amber-500 group-hover:underline">View Profile &rarr;</span>
                    </div>
                  </div>
                </div>

                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                >
                  {meta.name}
                </span>
              </div>

              {/* Title & Content */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* XP Awarded badge */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                  +{post.xpGained.toLocaleString()} XP Verified
                </span>
                {post.badgeUnlocked && (
                  <span className="text-zinc-400">
                    · Unlocked Badge: <em>{post.badgeUnlocked}</em>
                  </span>
                )}
              </div>

              {/* Interactions Strip */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${
                      post.hasLiked ? 'text-rose-500 font-semibold' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500' : ''}`} />
                    <span className="font-mono tabular-nums">{post.likes}</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments(prev => ({
                        ...prev,
                        [post.id]: !prev[post.id]
                      }))
                    }
                    className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono tabular-nums">{post.commentsCount}</span>
                  </button>
                </div>

                <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-3">
                  {post.comments.map(c => (
                    <div key={c.id} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{c.userName}</span>
                        <span className="text-[10px] text-zinc-400">{c.timestamp}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-300">{c.text}</p>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentDrafts[post.id] || ''}
                      onChange={e =>
                        setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit(post.id);
                        }
                      }}
                      placeholder="Write an encouraging comment..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="p-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

    </div>
  );
};
