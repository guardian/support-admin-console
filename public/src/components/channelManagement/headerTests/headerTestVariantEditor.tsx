// Note: we developed this component expecting that headers would have the ability to display different copy and CTAs on small screens, thus requiring this form to include fields for that content. However it seems like current functionality of the GU frontend is to only show the main copy and CTAs, whatever the screen size may be. Code to include and action mobile-specific fields can be found in earlier commits in this PR: https://github.com/guardian/support-admin-console/pull/259
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Theme, Typography, makeStyles } from '@material-ui/core';
import HeaderTestVariantEditorCtasEditor from './headerTestVariantEditorCtasEditor';
import VariantEditorCopyLengthWarning from '../variantEditorCopyLengthWarning';
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
  },
}));

const HEADING_DEFAULT_HELPER_TEXT = 'Heading assitive text';
const SUBHEADING_DEFAULT_HELPER_TEXT = 'Subheading assitive text';

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

  const { register, handleSubmit, errors, trigger } = useForm<HeaderContent>({
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
      <Typography className={classes.sectionHeader} variant="h4">
        {`Content${labelSuffix}`}
      </Typography>

      <div className={classes.contentContainer}>
        <div>
          <TextField
            inputRef={register({ validate: templateValidator })}
            error={errors.heading !== undefined}
            helperText={errors.heading ? errors.heading.message : HEADING_DEFAULT_HELPER_TEXT}
            onBlur={handleSubmit(onSubmit)}
            name="heading"
            label="Heading"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
          />

          {headingCopyLength > HEADING_COPY_RECOMMENDED_LENGTH && (
            <VariantEditorCopyLengthWarning charLimit={HEADING_COPY_RECOMMENDED_LENGTH} />
          )}
        </div>
      </div>

      <div className={classes.contentContainer}>
        <div>
          <TextField
            inputRef={register({ validate: templateValidator })}
            error={errors.heading !== undefined}
            helperText={errors.heading ? errors.heading.message : SUBHEADING_DEFAULT_HELPER_TEXT}
            onBlur={handleSubmit(onSubmit)}
            name="subheading"
            label="Sub-heading"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
          />

          {subheadingCopyLength > SUBHEADING_COPY_RECOMMENDED_LENGTH && (
            <VariantEditorCopyLengthWarning charLimit={SUBHEADING_COPY_RECOMMENDED_LENGTH} />
          )}
        </div>
      </div>

      <div className={classes.buttonsContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          {`Buttons${labelSuffix}`}
        </Typography>

        <HeaderTestVariantEditorCtasEditor
          primaryCta={content.primaryCta}
          secondaryCta={content.secondaryCta}
          updatePrimaryCta={updatePrimaryCta}
          updateSecondaryCta={updateSecondaryCta}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
          supportSecondaryCta={true}
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
    </div>
  );
};

export default HeaderTestVariantEditor;
