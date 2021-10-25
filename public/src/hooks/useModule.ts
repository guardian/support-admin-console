import React, { useState, useEffect } from 'react';
import * as emotionReact from '@emotion/react';
import * as emotionReactJsxRuntime from '@emotion/react/jsx-runtime';
import { getStage } from '../utils/stage';
import { withPreviewStyles } from '../components/channelManagement/previewContainer';

const moduleVersion = 2;

/**
 * Hook for importing a remote module, for live previews.
 */
export const useModule = <T>(path: string, name: string): React.FC<T> => {
  const [Module, setModule] = useState<React.FC<T>>();

  useEffect(() => {
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionReact,
      emotionReactJsxRuntime,
    };

    const stage = getStage();

    const baseUrl =
      stage === 'PROD'
        ? `https://contributions.guardianapis.com/modules/${moduleVersion}`
        : `https://contributions.code.dev-guardianapis.com/modules/${moduleVersion}`;

    window.remoteImport(`${baseUrl}/${path}`).then(bannerModule => {
      setModule(() => withPreviewStyles(bannerModule[name]));
    });
  }, []);

  return Module;
};
