export const DIRECT_OPAQUE_THRESHOLD = 0.999;

export type CharacterRenderMode = 'direct-opaque' | 'isolated-fade';

export function selectCharacterRenderMode(opacity: number): CharacterRenderMode {
  return opacity >= DIRECT_OPAQUE_THRESHOLD ? 'direct-opaque' : 'isolated-fade';
}
