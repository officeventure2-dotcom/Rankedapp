import type { MemoryItem } from '../utils/memoryTools';

/**
 * Built-in number sets. The digits were computed (not typed from memory) and
 * are the first 100 digits after the leading figure.
 */
export const MEMORY_LIBRARY: MemoryItem[] = [
  {
    id: 'lib_pi',
    title: 'π (Pi)',
    kind: 'digits',
    prefix: '3.',
    content: '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679',
    note: 'The ratio of a circle’s circumference to its diameter.',
    builtIn: true
  },
  {
    id: 'lib_e',
    title: 'e (Euler’s number)',
    kind: 'digits',
    prefix: '2.',
    content: '7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274',
    note: 'The base of natural logarithms, about 2.718.',
    builtIn: true
  },
  {
    id: 'lib_sqrt2',
    title: '√2 (Pythagoras’ constant)',
    kind: 'digits',
    prefix: '1.',
    content: '4142135623730950488016887242096980785696718753769480731766797379907324784621070388503875343276415727',
    note: 'The diagonal of a unit square, the first known irrational number.',
    builtIn: true
  },
  {
    id: 'lib_phi',
    title: 'φ (Golden ratio)',
    kind: 'digits',
    prefix: '1.',
    content: '6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374',
    note: 'The ratio (1 + √5) / 2 found in geometry, art and nature.',
    builtIn: true
  },
];
