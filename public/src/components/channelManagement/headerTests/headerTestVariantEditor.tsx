// Note: we developed this component expecting that headers would have the ability to display different copy and CTAs on small screens, thus requiring this form to include fields for that content. However it seems like current functionality of the GU frontend is to only show the main copy and CTAs, whatever the screen size may be. Code to include and action mobile-specific fields can be found in earlier commits in this PR: https://github.com/guardian/support-admin-console/pull/259
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Theme, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { makeStyles } from '@mui/styles';
import HeaderTestVariantCtasEditor from './headerTestVariantCtasEditor';
import VariantCopyLengthWarning from '../../tests/variants/variantCopyLengthWarning';
import { templateValidatorForPlatform } from '../helpers/validation';
import { Cta } from '../helpers/shared';
import { HeaderContent, HeaderVariant } from '../../../models/header';
import useValidation from '../hooks/useValidation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(10),

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
    marginLeft: spacing(2),
  },
}));

const HEADING_COPY_RECOMMENDED_LENGTH = 50;
const SUBHEADING_COPY_RECOMMENDED_LENGTH = 50;

type DeviceType = 'ALL' | 'MOBILE' | 'NOT_MOBILE';

const getLabelSuffix = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'MOBILE':
      return ' (mobile only)';
    case 'NOT_MOBILE':
      return ' (tablet + desktop)';
    default:
      return ' (all devices)';
  }
};

interface HeaderTestVariantContentEditorProps {
  content: HeaderContent;
  onChange: (updatedContent: HeaderContent) => void;
  onValidationChange: (isValid: boolean) => void;
  editMode: boolean;
  deviceType: DeviceType;
}

const HeaderTestVariantContentEditor: React.FC<HeaderTestVariantContentEditorProps> = ({
  content,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
}: HeaderTestVariantContentEditorProps) => {
  const classes = useStyles();

  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: HeaderContent = {
    heading: content.heading || '',
    subheading: content.subheading || '',
  };

  const {
    register,
    handleSubmit,
    trigger,

    formState: { errors },
  } = useForm<HeaderContent>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.heading, errors.subheading]);

  const onSubmit = ({ heading, subheading }: HeaderContent): void => {
    onChange({ ...content, heading, subheading });
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, primaryCta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, secondaryCta: updatedCta });
  };

  const labelSuffix = getLabelSuffix(deviceType);

  const headingCopyLength = content.heading?.length ?? 0;
  const subheadingCopyLength = content.subheading?.length ?? 0;

  return (
    <>
      {deviceType !== 'MOBILE' && (
        <>
          <Typography className={classes.sectionHeader} variant="h4">
            {`Content${labelSuffix}`}
          </Typography>

          <div className={classes.contentContainer}>
            <div>
              <TextField
                error={errors.heading !== undefined}
                helperText={errors.heading ? errors.heading.message : ''}
                {...register('heading', { validate: templateValidator })}
                onBlur={handleSubmit(onSubmit)}
                label="Heading"
                margin="normal"
                variant="outlined"
                disabled={!editMode}
                fullWidth
              />

              {headingCopyLength > HEADING_COPY_RECOMMENDED_LENGTH && (
                <VariantCopyLengthWarning charLimit={HEADING_COPY_RECOMMENDED_LENGTH} />
              )}
            </div>
          </div>

          <div className={classes.contentContainer}>
            <div>
              <TextField
                error={errors.subheading !== undefined}
                helperText={errors.subheading ? errors.subheading.message : ''}
                {...register('subheading', { validate: templateValidator })}
                onBlur={handleSubmit(onSubmit)}
                label="Sub-heading"
                margin="normal"
                variant="outlined"
                disabled={!editMode}
                fullWidth
              />

              {subheadingCopyLength > SUBHEADING_COPY_RECOMMENDED_LENGTH && (
                <VariantCopyLengthWarning charLimit={SUBHEADING_COPY_RECOMMENDED_LENGTH} />
              )}
            </div>
          </div>
        </>
      )}

      <Typography className={classes.sectionHeader} variant="h4">
        {`Buttons${labelSuffix}`}
      </Typography>

      <div className={classes.buttonsContainer}>
        <HeaderTestVariantCtasEditor
          primaryCta={content.primaryCta}
          secondaryCta={content.secondaryCta}
          updatePrimaryCta={updatePrimaryCta}
          updateSecondaryCta={updateSecondaryCta}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
          supportSecondaryCta={deviceType !== 'MOBILE'}
        />
      </div>
    </>
  );
};

interface HeaderTestVariantEditorProps {
  variant: HeaderVariant;
  onVariantChange: (updatedVariant: HeaderVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const HeaderTestVariantEditor: React.FC<HeaderTestVariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
}: HeaderTestVariantEditorProps) => {
  const classes = useStyles();
  const setValidationStatusForField = useValidation(onValidationChange);

  const content: HeaderContent = variant.content;

  const onMobileContentRadioChange = (): void => {
    if (variant.mobileContent === undefined) {
      onVariantChange({
        ...variant,
        mobileContent: {
          heading: '',
          subheading: '',
        },
      });
    } else {
      // remove mobile content and clear any validation errors
      setValidationStatusForField('mobileContent', true);
      onVariantChange({
        ...variant,
        mobileContent: undefined,
      });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <HeaderTestVariantContentEditor
          content={content}
          onChange={(updatedContent: HeaderContent): void =>
            onVariantChange({ ...variant, content: updatedContent })
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mainContent', isValid)
          }
          editMode={editMode}
          deviceType={variant.mobileContent === undefined ? 'ALL' : 'NOT_MOBILE'}
        />
      </div>

      <RadioGroup
        value={variant.mobileContent !== undefined ? 'enabled' : 'disabled'}
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
      {variant.mobileContent && (
        <HeaderTestVariantContentEditor
          content={variant.mobileContent}
          onChange={(updatedContent: HeaderContent): void =>
            onVariantChange({ ...variant, mobileContent: updatedContent })
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mobileContent', isValid)
          }
          editMode={editMode}
          deviceType={'MOBILE'}
        />
      )}
    </div>
  );
};

export default HeaderTestVariantEditor;
