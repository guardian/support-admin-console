import React, { useState, useEffect } from 'react';
import * as emotionReact from '@emotion/react';
import * as emotionReactJsxRuntime from '@emotion/react/jsx-runtime';
import { getStage } from '../utils/stage';
import { withPreviewStyles } from '../components/channelManagement/previewContainer';

const moduleVersion = 3;

const getSdcBaseUrl = (): string => {
  // If override explicitly provided, use it
  if (window.guardian.sdcUrlOverride) {
    return `${window.guardian.sdcUrlOverride}/modules/v${moduleVersion}`;
  }

  // Otherwise, use the stage to determine the base URL
  const stage = getStage();
  return stage === 'PROD'
    ? `https://contributions.guardianapis.com/modules/v${moduleVersion}`
    : `https://contributions.code.dev-guardianapis.com/modules/v${moduleVersion}`;
};

/**
 * Hook for importing a remote module, for live previews.
 */
export const useModule = <T>(path: string, name: string): React.FC<T> | undefined => {
  const [Module, setModule] = useState<React.FC<T>>();

  useEffect(() => {
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionReact,
      emotionReactJsxRuntime,
    };

    const baseUrl = getSdcBaseUrl();

    window.remoteImport(`${baseUrl}/${path}`).then(bannerModule => {
      setModule(() => withPreviewStyles(bannerModule[name]));
    });
  }, [name]);

  return Module;
};
