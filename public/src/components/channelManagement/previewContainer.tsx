import React from 'react';

const CDNFontPath = 'https://assets.guim.co.uk/static/frontend';

export const fontFaces = `
    @font-face {
        font-family: "GH Guardian Headline";
        src: url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Light.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Light.woff) format("woff");
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: "GH Guardian Headline";
        src: url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-LightItalic.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-LightItalic.woff) format("woff");
        font-weight: 300;
        font-style: italic;
    }
    @font-face {
        font-family: "GH Guardian Headline";
        src: url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff) format("woff");
        font-weight: 500;
        font-style: normal;
    }
    @font-face {
        font-family: "GH Guardian Headline";
        src: url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff) format("woff");
        font-weight: 500;
        font-style: italic;
    }
    @font-face {
        font-family: "GH Guardian Headline";
        src: url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff) format("woff");
        font-weight: 700;
        font-style: normal;
    }
    @font-face {
        font-family: "GH Guardian Headline";
        src: url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-BoldItalic.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-BoldItalic.woff) format("woff");
        font-weight: 700;
        font-style: italic;
    }
    @font-face {
        font-family: "GuardianTextEgyptian";
        src: url(${CDNFontPath}/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff) format("woff");
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: "GuardianTextEgyptian";
        src: url(${CDNFontPath}/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff) format("woff");
        font-weight: 400;
        font-style: italic;
    }
    @font-face {
        font-family: "GuardianTextEgyptian";
        src: url(${CDNFontPath}/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff) format("woff");
        font-weight: 700;
        font-style: normal;
    }
    @font-face {
        font-family: "GuardianTextSans";
        src: url(${CDNFontPath}/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff) format("woff");
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: "GuardianTextSans";
        src: url(${CDNFontPath}/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-RegularItalic.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-RegularItalic.woff) format("woff");
        font-weight: 400;
        font-style: italic;
    }
    @font-face {
        font-family: "GuardianTextSans";
        src: url(${CDNFontPath}/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff2) format("woff2"),
            url(${CDNFontPath}/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff) format("woff");
        font-weight: 700;
        font-style: normal;
    }
`;

export const cssResets = `
    html {
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
    }
    body {
        margin: 0;
    }
`;

export const previewStyles = `
    .preview {
        margin: 0 auto;
    }
`;

export function withPreviewStyles<Props>(Component: React.FC<Props>): React.FC<Props> {
  const Wrapped: React.FC<Props> = (props) => {
    return (
      <div>
        <style>
          {fontFaces}
          {cssResets}
          {previewStyles}
        </style>
        <div className="preview">
          <Component {...props} />
        </div>
      </div>
    );
  };

  return Wrapped;
}
