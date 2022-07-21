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

interface CommonObjectInput {
  [index: string]: any;
}

interface TestDataDialogProps {
  isOpen: boolean;
  close: () => void;
  campaign: string;
  test: Test;
}

const TestDataDialog: React.FC<TestDataDialogProps> = ({
  isOpen,
  close,
  campaign,
  test,
}: TestDataDialogProps) => {
  const classes = useStyles();

  // Helper function to display a nested object
  const getPrettyParseObject = (obj: CommonObjectInput) => {
    let res = '\n';

    for (const [key, value] of Object.entries(obj)) {
      res += `\t${key}: ${value}\n`;
    }
    return res.substring(0, res.length - 2);
  };

  // Priority is common to all tests
  const getPriority = () => {
    if (test.status != null && test.status !== 'Archived' && test.priority != null) {
      return test.priority;
    }
    return '(Not applicable)';
  };

  // AB testing proportions - common to all tests
  const getControlProportions = (obj: CommonObjectInput | undefined) => {
    if (obj != null) {
      return `Control proportion settings: ${getPrettyParseObject(obj)}`;
    }
    return 'Control proportion settings: (Not set)';
  };

  // Article views fields (Epic only)
  const getViewsValue = (key: string, val: CommonObjectInput | boolean | undefined) => {
    if (test.channel && ['Banner1', 'Banner2', 'Header'].includes(test.channel)) {
      return '(Not applicable)';
    }
    if (['highPriority', 'useLocalViewLog'].includes(key)) {
      if (val != null) {
        return val;
      }
      return '(Not set)';
    }
    if (['articlesViewedSettings', 'maxViews'].includes(key)) {
      if (val != null && val.toString() === '[object Object]') {
        return getPrettyParseObject(val as CommonObjectInput);
      }
      return '(Not set)';
    }
    return '(Not applicable)';
  };

  // Article views field (Banner only)
  const getPageViewsValue = (val: number | undefined) => {
    if (test.channel && ['Banner1', 'Banner2'].includes(test.channel)) {
      return val != null ? val : '(Not set)';
    }
    return '(Not applicable)';
  };

  // Targeting by section/tag currently used in Epics, but may expand to other channels
  const getTagTargetWords = (arr: string[] | undefined, copy: string) => {
    if (Array.isArray(arr) && arr.length) {
      return arr.join(', ');
    }
    if (test.channel && ['Banner1', 'Banner2', 'Header'].includes(test.channel)) {
      return '(Not applicable)';
    }
    return copy;
  };

  const getVariantTargetingData = (variant: CommonObjectInput) => {};

  const getVariantCtas = (val: CommonObjectInput | undefined) => {};

  // Process a single text field (which may be an array of strings)
  const getVariantCopy = (key: string, val: string | string[] | undefined) => {

    key = key[0].toUpperCase() + key.substring(1);

    if (val == null) {
      return `${key}: (Not set)\n\n`;
    }
    if (Array.isArray(val)) {
      let res = `${key}:\n`;
      val.forEach(p => res += `\t${p}\n`);
      return `${res}\n`;
    }
    return `${key}:\n\t${val}\n\n`;
  };

  // Batch process a set of text fields
  const getVariantContent = (fields: string[], content: CommonObjectInput) => {
    let res = '';
    fields.forEach(f => res += getVariantCopy(f, content[f]));
    return res;
  };

  // Templates for test channel variants
  const getVariantData = (variant: CommonObjectInput) => {
    // Header test variant template
    if (test.channel != null && ['Header'].includes(test.channel)) {
      return `
Variant: ${variant.name}
------------------------------------------------------------------

Targeting
~~~~~~~~~~~~~~~~~~~~~~~
(Not applicable)

Content copy
~~~~~~~~~~~~~~~~~~~~~~~
${getVariantContent(['heading', 'subheading'], variant.content)}

Content CTAs
~~~~~~~~~~~~~~~~~~~~~~~
(Not applicable)

Mobile content copy
~~~~~~~~~~~~~~~~~~~~~~~
${variant.mobileContent ? getVariantContent(['heading', 'subheading'], variant.mobileContent) : '(Not set)'}

Mobile content CTAs
~~~~~~~~~~~~~~~~~~~~~~~
(Not applicable)
`;
    }

    // Banner test variant template
    if (test.channel != null && ['Banner1', 'Banner2'].includes(test.channel)) {
      return `
Variant: ${variant.name}
------------------------------------------------------------------

Targeting
~~~~~~~~~~~~~~~~~~~~~~~
(Not applicable)

Content copy
~~~~~~~~~~~~~~~~~~~~~~~
${getVariantContent(['heading', 'paragraphs', 'highlightedText'], variant.bannerContent)}

Content CTAs
~~~~~~~~~~~~~~~~~~~~~~~
(Not applicable)
`;
    }

    // Epic test variant template
    if (test.channel != null) {
      return `
Variant: ${variant.name}
------------------------------------------------------------------

Targeting
~~~~~~~~~~~~~~~~~~~~~~~
(Not applicable)

Content copy
~~~~~~~~~~~~~~~~~~~~~~~
${getVariantContent(['heading', 'paragraphs', 'highlightedText'], variant)}

Content CTAs
~~~~~~~~~~~~~~~~~~~~~~~
(Not applicable)
`;
    }

    // Something went wrong - return an empty string
    return '';
  };

  // Function to collate and set out all variants in a test
  const getAllVariants = (variants: CommonObjectInput[] | undefined) => {
    if (Array.isArray(variants)) {
      if (variants.length) {
        let res = '';
        variants.forEach(v => res += getVariantData(v));
        return res;
      }
      return 'No variants defined for this test';
    }
    return 'No variants defined for this test';
  };

  // The template displayed in the modal, prints out the test data
  // I'm doing it this way so that users can export the data to the clipboard and paste it into a Google doc (or any text editor) without needing to do much formatting to the data afterwards
  const parseTestData = (test: CommonObjectInput): string => {
    console.log(test);

    // keyDetails layout
    const keyDetails = `
KEY DETAILS
==================================================================
Test (tracking) name: ${test.name && test.name}
Display name: ${test.nickname ? test.nickname : '(not set)'}

Channel: ${test.channel && test.channel}
Status: ${test.status && test.status}
Priority: ${getPriority()}

Campaign: ${campaign}
`;

    // testTargeting layout
    const testTargeting = `
Test Targeting
------------------------------------------------------------------
User cohort: ${test.userCohort ? test.userCohort : '(Not set)'}

Device type: ${test.deviceType ? test.deviceType : '(Not set)'}

Locations: ${(test.locations && Array.isArray(test.locations) && test.locations.length) ? test.locations.join(', ') : 'No locations selected'}

High priority: ${getViewsValue('highPriority', test.highPriority)}

Use local view log: ${getViewsValue('useLocalViewLog', test.useLocalViewLog)}
Articles viewed settings: ${getViewsValue('articlesViewedSettings', test.articlesViewedSettings)}
Max views: ${getViewsValue('maxViews', test.maxViews)}

Page views: ${getPageViewsValue(test.minArticlesBeforeShowingBanner)}

Targeted sections: ${getTagTargetWords(test.sections, 'No sections selected')}
Targeted tags: ${getTagTargetWords(test.tagId, 'No tags selected')}
Excluded sections: ${getTagTargetWords(test.excludedSections, 'No sections excluded')}
Targeted tags: ${getTagTargetWords(test.excludedTagIds, 'No tags excluded')}
`;

    // variantsData layout
    const variantsData = `

VARIANTS
==================================================================
${getControlProportions(test.controlProportionSettings)}

${getAllVariants(test.variants)}
`;

    // parseTestData() returns here
    return `${keyDetails}
${testTargeting}
${variantsData}
`;
  };

  // Parse the test's data
  let parsedTest = parseTestData(test);

  // Copy parsed data to the clipboard
  const onCopyToClipboard = () => {
    navigator.clipboard.writeText(parsedTest);
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-campaign-dialog-title">Viewing: {test.nickname ? test.nickname : test.name}</DialogTitle>
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
