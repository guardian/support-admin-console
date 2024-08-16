import lzstring from 'lz-string';

/**
 * For the live preview feature we use the DCR storybook to render the component, iframed.
 * Props are passed in the args parameter in the url.
 */

// this is the storybook url for the main branch of DCR
const dcrStorybookUrl = 'https://main--63e251470cfbe61776b0ef19.chromatic.com';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const compressProps = (props: any): string =>
  lzstring.compressToEncodedURIComponent(JSON.stringify(props));

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const buildStorybookUrl = (storyName: string, props: any): string => {
  const compressedProps = compressProps(props);
  return `${dcrStorybookUrl}/iframe.html?id=${storyName}&viewMode=story&shortcuts=false&singleStory=true&args=json:${compressedProps}`;
};

export { buildStorybookUrl };
