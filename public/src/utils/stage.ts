type Stage = 'DEV' | 'CODE' | 'PROD';

export const getStage = (): Stage => {
  return window.guardian.stage;
};
