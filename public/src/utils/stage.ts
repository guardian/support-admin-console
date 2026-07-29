export type Stage = 'CODE' | 'PROD';

export const getStage = (): Stage => {
  return window.guardian.stage;
};
