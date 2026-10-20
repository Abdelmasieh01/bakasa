import type { Player } from '../types/game';

export const AVATAR_ICONS = [
  '🦁', '🐯', '🦊', '🐺', '🦝', '🐻', '🐼', '🐨',
  '🦄', '🐸', '🐙', '🦋', '🦁', '🦅', '🐉', '🦩',
  '🤖', '👽', '🧙', '🧝', '🧛', '🧜', '👸', '🤴',
  '🎭', '💀', '👾', '🎃', '🧸', '🎯',
];

export const AVATAR_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC75F', '#8BC34A',
  '#4FC3F7', '#7C4DFF', '#F06292', '#26C6DA',
  '#66BB6A', '#EF5350', '#42A5F5', '#AB47BC',
  '#FF7043', '#29B6F6', '#9CCC65', '#EC407A',
];

export function getDefaultColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function getDefaultIcon(index: number): string {
  return AVATAR_ICONS[index % AVATAR_ICONS.length];
}

export function createPlayer(index: number): Player {
  return {
    id: `player-${Date.now()}-${index}`,
    name: '',
    avatarIcon: getDefaultIcon(index),
    avatarColor: getDefaultColor(index),
    score: 0,
    isImposter: false,
  };
}
