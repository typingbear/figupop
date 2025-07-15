export type SpriteEffectOption = {
  frames: number;
  frameTime: number;
  loop: boolean;
};
export type SpritesEffect = {
  [effectName: string]: SpriteEffectOption;
};
