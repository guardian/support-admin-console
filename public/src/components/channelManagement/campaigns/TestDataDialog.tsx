import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Test } from '../helpers/shared';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  testDataContainer: {
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'pre-wrap',
  },
}));

const testFields = {
  core: {
    name: {
      label: 'Tracking name',
      type: 'string',
      exclude: [],
      optional: false,
    },
    nickname: {
      label: 'Nickname (RRCP)',
      type: 'string',
      exclude: [],
      optional: true,
    },
    channel: {
      label: 'Marketing channel',
      type: 'string',
      exclude: [],
      optional: true,
    },
    status: {
      label: 'Test status',
      type: 'string',
      exclude: [],
      optional: false,
    },
    priority: {
      label: 'Channel priority',
      type: 'number',
      exclude: [],
      optional: true,
    },
    campaignName: {
      label: 'Campaign',
      type: 'string',
      exclude: [],
      optional: true,
    },
    highPriority: {
      label: 'Is high priority (deprecated)',
      type: 'boolean',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
  },

  targeting: {
    userCohort: {
      label: 'User cohort',
      type: 'string',
      exclude: [],
      optional: true,
    },
    locations: {
      label: 'Locations',
      type: 'string-array',
      exclude: [],
      optional: false,
    },
    deviceType: {
      label: 'Device type',
      type: 'string',
      exclude: [],
      optional: true,
    },
    articlesViewedSettings: {
      label: 'Articles viewed settings',
      type: 'object',
      exclude: [],
      optional: true,
    },
    maxViews: {
      label: 'Max Epic views',
      type: 'object',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    alwaysAsk: {
      label: 'Always ask',
      type: 'boolean',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    useLocalViewLog: {
      label: 'Use local view log',
      type: 'boolean',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    minArticlesBeforeShowingBanner: {
      label: 'Min articles before showing banner',
      type: 'number',
      exclude: ['Header', 'Epic', 'EpicLiveblog', 'EpicAppleNews', 'EpicAMP'],
      optional: false,
    },
    sections: {
      label: 'Target sections',
      type: 'string-array',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: false,
    },
    tagIds: {
      label: 'Target tags',
      type: 'string-array',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    excludedSections: {
      label: 'Excluded sections',
      type: 'string-array',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    excludedTagIds: {
      label: 'Excluded tags',
      type: 'string-array',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
  },

  variants: {
    controlProportionSettings: {
      label: 'Control proportion settings (AB tests)',
      type: 'object',
      exclude: [],
      optional: true,
    },
  },
};

const variantFields = {
  core: {
    name: {
      label: 'Tracking name',
      type: 'string',
      exclude: [],
      optional: false,
    },
    template: {
      label: 'Banner template',
      type: 'string',
      exclude: ['Header', 'Epic', 'EpicLiveblog', 'EpicAppleNews', 'EpicAMP'],
      optional: false,
    },
    showSignInLink: {
      label: 'Show sign-in link',
      type: 'boolean',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    separateArticleCount: {
      label: 'Separate article count',
      type: 'object-or-other',
      exclude: ['Header'],
      optional: true,
    },
    showTicker: {
      label: 'Show ticker',
      type: 'boolean',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: false,
    },
    tickerSettings: {
      label: 'Ticker settings',
      type: 'object',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    showChoiceCards: {
      label: 'Show choice cards',
      type: 'boolean',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    defaultChoiceCardFrequency: {
      label: 'Default choice card frequency',
      type: 'object',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
  },

  copy: {
    heading: {
      label: 'Heading',
      type: 'string-block',
      exclude: [],
      optional: true,
    },
    subheading: {
      label: 'Sub-heading',
      type: 'string-block',
      exclude: ['Epic', 'EpicLiveblog', 'EpicAppleNews', 'EpicAMP', 'Banner1', 'Banner2'],
      optional: true,
    },
    paragraphs: {
      label: 'Body copy',
      type: 'string-block-array',
      exclude: ['Header'],
      optional: false,
    },
    highlightedText: {
      label: 'Highlighted text',
      type: 'string-block',
      exclude: ['Header'],
      optional: true,
    },
    footer: {
      label: 'Footer',
      type: 'string-block',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
    cta: {
      label: 'Main CTA',
      type: 'object',
      exclude: ['Header'],
      optional: true,
    },
    primaryCta: {
      label: 'Main CTA',
      type: 'object',
      exclude: ['Epic', 'EpicLiveblog', 'EpicAppleNews', 'EpicAMP', 'Banner1', 'Banner2'],
      optional: true,
    },
    secondaryCta: {
      label: 'Secondary CTA',
      type: 'object',
      exclude: [],
      optional: true,
    },
    image: {
      label: 'Image',
      type: 'object',
      exclude: ['Header', 'Banner1', 'Banner2'],
      optional: true,
    },
  },
};

interface CommonObjectInput {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [index: string]: any;
}

interface TestDataDialogProps {
  isOpen: boolean;
  close: () => void;
  test: Test;
  datetimeStamp: string;
}

const TestDataDialog: React.FC<TestDataDialogProps> = ({
  isOpen,
  close,
  test,
  datetimeStamp,
}: TestDataDialogProps) => {
  const classes = useStyles();

  const parseData = (
    channel: string,
    fields: CommonObjectInput,
    data: CommonObjectInput,
  ): string => {
    const keys = Object.keys(fields);

    let res = '';

    keys.forEach(key => {
      const rule = fields[key];
      const val = data[key];

      if (rule != null && !rule.exclude.includes(channel)) {
        let formatter = rule.type;

        if ('object-or-other' === formatter) {
          formatter = typeof val === 'object' ? 'object' : 'other';
        }

        switch (formatter) {
          case 'string-block':
            res += `${rule.label}:`;
            if (rule.optional) {
              res += `${val != null ? `\n` + val : ' (Not set)'}`;
            } else {
              res += `${val != null ? `\n` + val : ' (Data missing)'}`;
            }
            res += `\n\n`;
            break;

          case 'string-block-array':
            res += `${rule.label}:`;
            if (rule.optional && val == null) {
              res += ' (Not set)';
            } else if (val == null) {
              res += ' (Data missing)';
            } else if (!val.length) {
              res += ' (Empty)';
            } else {
              val.forEach(function(v: string) {
                res += `\n${v}`;
              });
            }
            res += `\n\n`;
            break;

          case 'string-array':
            res += `${rule.label}: `;
            if (rule.optional && val == null) {
              res += '(Not set)';
            } else if (val == null) {
              res += '(Data missing)';
            } else if (!val.length) {
              res += '(Empty)';
            } else {
              res += `${val.join(', ')}`;
            }
            res += `\n`;
            break;

          case 'object':
            res += `${rule.label}:`;
            if (rule.optional && val == null) {
              res += ` (Not set)\n`;
            } else if (val == null) {
              res += ` (Data missing)\n`;
            } else {
              res += `\n`;
              for (const [k, v] of Object.entries(val)) {
                res += `\t${k}: ${v}\n`;
              }
            }
            break;

          default:
            res += `${rule.label}: `;
            if (rule.optional) {
              res += `${val != null ? val : '(Not set)'}`;
            } else {
              res += `${val != null ? val : '(Data missing)'}`;
            }
            res += `\n`;
        }
      }
    });
    return res;
  };

  const parseTestVariantData = (channel: string, variants: CommonObjectInput[]): string => {
    let res = '';

    if (
      channel == null ||
      ![
        'Header',
        'Epic',
        'EpicLiveblog',
        'EpicAppleNews',
        'EpicAMP',
        'Banner1',
        'Banner2',
      ].includes(channel)
    ) {
      res += `WARNING: Test channel not recognised!`;
    } else if (!variants.length) {
      res += `WARNING: no variants have been created for this Test!`;
    } else if (['Header'].includes(channel)) {
      variants.forEach(v => {
        res += `Variant: ${v.name}
---------------------------------------------------------------------
${parseData(channel, variantFields.core, v)}
Copy and CTAs
~~~~~~~~~~~~~~~~~~~~~~~~
${parseData(channel, variantFields.copy, v.content)}`;

        if (v.mobileContent == null) {
          res += `
Mobile copy and CTAs
~~~~~~~~~~~~~~~~~~~~~~~~
(No additional copy for mobile devices defined)

`;
        } else {
          res += `
Mobile copy and CTAs
~~~~~~~~~~~~~~~~~~~~~~~~
${parseData(channel, variantFields.copy, v.mobileContent)}
`;
        }
      });
    } else if (['Epic', 'EpicLiveblog', 'EpicAppleNews', 'EpicAMP'].includes(channel)) {
      variants.forEach(v => {
        res += `Variant: ${v.name}
---------------------------------------------------------------------
${parseData(channel, variantFields.core, v)}
Copy and CTAs
~~~~~~~~~~~~~~~~~~~~~~~~
${parseData(channel, variantFields.copy, v)}
`;
      });
    } else if (['Banner1', 'Banner2'].includes(channel)) {
      variants.forEach(v => {
        res += `Variant: ${v.name}
---------------------------------------------------------------------
${parseData(channel, variantFields.core, v)}
Copy and CTAs
~~~~~~~~~~~~~~~~~~~~~~~~
${parseData(channel, variantFields.copy, v.bannerContent)}
`;

        if (v.mobileBannerContent == null) {
          res += `
Mobile copy and CTAs
~~~~~~~~~~~~~~~~~~~~~~~~
(No additional copy for mobile devices defined)

`;
        } else {
          res += `
Mobile copy and CTAs
~~~~~~~~~~~~~~~~~~~~~~~~
${parseData(channel, variantFields.copy, v.mobileBannerContent)}
`;
        }
      });
    }

    return res;
  };

  const parseTestData = (data: CommonObjectInput): string => {
    const channel = data.channel;

    return `
TEST CORE DETAILS (${datetimeStamp})
=====================================================================
${parseData(channel, testFields.core, data)}

TEST TARGETING
---------------------------------------------------------------------
${parseData(channel, testFields.targeting, data)}

TEST VARIANTS
=====================================================================
${parseData(channel, testFields.variants, data)}
${parseTestVariantData(channel, data.variants)}
`;
  };

  // Parse the test's data
  const parsedTest = parseTestData(test);

  // Copy parsed data to the clipboard
  const onCopyToClipboard = () => {
    navigator.clipboard.writeText(parsedTest);
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-campaign-dialog-title">
          Viewing: {test.nickname ? test.nickname : test.name}
        </DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogActions className={classes.buttonContainer}>
        <Button onClick={onCopyToClipboard} color="primary">
          Copy to clipboard
        </Button>
      </DialogActions>
      <DialogContent className={classes.testDataContainer} dividers>
        {parsedTest}
      </DialogContent>
    </Dialog>
  );
};

export default TestDataDialog;
