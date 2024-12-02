import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Radio, RadioGroup, Theme, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { templateValidatorForPlatform } from '../helpers/validation';
import {
  SupportLandingPageContent,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';
import { BannerContent } from '../../../models/banner';
import { VariantContentEditor } from './variantEditor';
import useValidation from '../hooks/useValidation';
import { getDefaultVariant } from '../bannerTests/utils/defaults';
import LandingPageTierEditor from "../landingPageTierEditor";
import TickerEditor from "../tickerEditor";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(10),
    paddingBottom: spacing(4),

    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  hook: {
    maxWidth: '400px',
  },
  sectionHeader: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  sectionContainer: {
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    borderBottom: `1px solid ${palette.grey[500]}`,
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  contentContainer: {
    marginLeft: spacing(2),
  },
  buttonsContainer: {
    marginTop: spacing(2),
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
  switchLabel: {
    fontSize: '14px',
    fontWeight: 500,
  },
}));

interface CheckboxOption {
  label: string;
  action: () => void;
}

type DeviceType = 'ALL' | 'MOBILE' | 'NOT_MOBILE';

interface ConfigureComponentsEditorProps {
  variant: SupportLandingPageVariant;
  onVariantChange: (updatedVariant: SupportLandingPageVariant) => void;
  content?: SupportLandingPageContent;
  onChange?: (updatedContent: SupportLandingPageContent) => void;
  onValidationChange?: (isValid: boolean) => void;
  editMode: boolean;
  deviceType?: DeviceType;
}

const ConfigureComponentsEditor: React.FC<ConfigureComponentsEditorProps> = ({
  variant,
  onVariantChange,
  content,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
}: ConfigureComponentsEditorProps) => {
  const classes = useStyles();

  const templateValidator = templateValidatorForPlatform('DOTCOM');


  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options: CheckboxOption[] = [
    {
      label: 'Configure Header Copy',
      action: () => {
        console.log('Header selected!', showHeader);
        setShowHeader(!showHeader);
      },
    },
    {
      label: 'Configure Body Copy',
      action: () => {
        console.log(' Body Copy selected!');
        setShowBody(!showBody);
      },
    },
    {
      label: 'Configure Tabs',
      action: () => {
        console.log('Tabs selected!');
      },
    },
    {
      label: 'Configure Benefits',
      action: () => {
        console.log('Benefits selected!');
      },
    },
    {
      label: 'Configure Pills',
      action: () => {
        console.log('Pills selected!');
      },
    },
    {
      label: 'Configure Single Contributions',
      action: () => {
        console.log('Single Contribution selected!');
      },
    },
  ];

  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [showBody, setShowBody] = useState<boolean>(false);

  const handleCheckboxChange = (option: CheckboxOption) => {
    if (selectedOptions.includes(option.label)) {
      option.action();
      setSelectedOptions(selectedOptions.filter(item => item !== option.label);
    } else {
      setSelectedOptions([...selectedOptions, option.label]);
      option.action();
    }
  };


  const setValidationStatusForField = useValidation(onValidationChange);

  const onMobileContentRadioChange = (): void => {
    if (variant.mobileLandingPageContent === undefined) {
      onVariantChange({
        ...variant,
        mobileLandingPageContent: getDefaultVariant().bannerContent,
      });
    } else {
      // remove mobile content and clear any validation errors
      setValidationStatusForField('mobileContent', true);
      onVariantChange({
        ...variant,
        mobileLandingPageContent: undefined,
      });
    }
  };

  return (
    <>

      <div className={classes.contentContainer}>
        {options.map(option => (
          <div key={option.label}>
            <FormControlLabel
              control={
                <Checkbox
                  id={option.label}
                  checked={selectedOptions.includes(option.label)}
                  onChange={() => handleCheckboxChange(option)}
                  color="primary"
                  disabled={!editMode}
                />
              }
            label ={option.label}
            />
          </div>
        ))}
      </div>


      <VariantContentEditor
        content={variant.landingPageContent}
        onChange={(updatedContent: BannerContent): void =>
          onVariantChange({ ...variant, landingPageContent: updatedContent })
        }
        onValidationChange={(isValid): void => setValidationStatusForField('mainContent', isValid)}
        editMode={editMode}
        deviceType={variant.mobileLandingPageContent === undefined ? 'ALL' : 'NOT_MOBILE'}
        showHeader={showHeader}
        showBody={showBody}
      />
      <RadioGroup
        value={variant.mobileLandingPageContent !== undefined ? 'enabled' : 'disabled'}
        onChange={onMobileContentRadioChange}
      >
        <FormControlLabel
          value="disabled"
          key="disabled"
          control={<Radio />}
          label="Show the same copy across devices"
          disabled={!editMode}
        />
        <FormControlLabel
          value="enabled"
          key="enabled"
          control={<Radio />}
          label="Show different copy on mobile"
          disabled={!editMode}
        />
      </RadioGroup>
      {variant.mobileLandingPageContent && (
        <VariantContentEditor
          content={variant.mobileLandingPageContent}
          onChange={(updatedContent: SupportLandingPageContent): void =>
            onVariantChange({ ...variant, mobileLandingPageContent: updatedContent })
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mobileContent', isValid)
          }
          editMode={editMode}
          deviceType={'MOBILE'}
          showHeader={showHeader}
          showBody={showBody}
        />
      )}

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Select Tiers
        </Typography>

        <LandingPageTierEditor />
      </div>

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Ticker
        </Typography>

        <TickerEditor
          tickerSettings={variant.tickerSettings}
          updateTickerSettings={tickerSettings =>
            onVariantChange({
              ...variant,
              tickerSettings,
            })
          }
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
        />
      </div>

    </>
  );
};

export default ConfigureComponentsEditor;
