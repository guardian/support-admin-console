type Stage = 'DEV' | 'CODE' | 'PROD';

declare global {
  interface Window {
    guardian: { stage: Stage };
  }
}

export const getStage = (): Stage => {
  return window.guardian.stage;
};
