import React from 'react';
import { Atom, BookOpen, BookOpenText, BrainCircuit, Globe, HeartHandshake, Youtube } from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { HubTiles, HubItem } from './HubTiles';

export const KNOWLEDGE_ITEMS: HubItem[] = [
  { id: 'library', label: 'Foundational Books', blurb: 'The classics worth reading', icon: <BookOpen />, tone: 'text-amber-500' },
  { id: 'academy', label: 'Video Masterclasses', blurb: 'Learn from the best lectures', icon: <Youtube />, tone: 'text-red-500' },
  { id: 'science', label: 'Science Codex', blurb: 'Fact cards across the sciences', icon: <Atom />, tone: 'text-cyan-500' },
  { id: 'language', label: 'Language Lab', blurb: 'Practise and track a language', icon: <Globe />, tone: 'text-emerald-500' },
  { id: 'books', label: 'Books Read', blurb: 'Log what you have finished', icon: <BookOpenText />, tone: 'text-orange-500' },
  { id: 'memory', label: 'Memory', blurb: 'Train recall and focus', icon: <BrainCircuit />, tone: 'text-violet-500' },
  { id: 'psychology', label: 'Psychology', blurb: 'Understand how minds work', icon: <HeartHandshake />, tone: 'text-pink-500' },
  { id: 'quran', label: 'Quran', blurb: 'Read and listen', icon: <BookOpenText />, tone: 'text-teal-500' }
];

export const KnowledgeHub: React.FC = () => {
  const { setActiveTab } = useRanked();
  return <HubTiles title="Knowledge" items={KNOWLEDGE_ITEMS} onPick={id => setActiveTab(id as any)} />;
};
