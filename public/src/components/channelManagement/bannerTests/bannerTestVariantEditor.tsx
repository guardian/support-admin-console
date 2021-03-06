import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import VariantEditorButtonsEditor from '../variantEditorButtonsEditor';
import { invalidTemplateValidator, EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { Cta } from '../helpers/shared';
import BannerTemplateSelector from './bannerTemplateSelector';
import { BannerContent, BannerTemplate, BannerVariant } from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';
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

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = 'Main banner message, including paragraph breaks';
const HIGHTLIGHTED_TEXT_HELPER_TEXT = 'Final sentence of body copy';

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

interface BannerTestVariantContentEditorProps {
  content: BannerContent;
  template: BannerTemplate;
  onChange: (updatedContent: BannerContent) => void;
  onValidationChange: (isValid: boolean) => void;
  editMode: boolean;
  deviceType: DeviceType;
}

const BannerTestVariantContentEditor: React.FC<BannerTestVariantContentEditorProps> = ({
  content,
  template,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
}: BannerTestVariantContentEditorProps) => {
  const classes = useStyles();

  const defaultValues: BannerContent = {
    heading: content.heading || '',
    messageText: content.messageText,
    highlightedText: content.highlightedText || '',
  };

  const { register, handleSubmit, errors, trigger } = useForm<BannerContent>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.messageText, errors.heading, errors.highlightedText]);

  const onSubmit = ({ heading, messageText, highlightedText }: BannerContent): void => {
    onChange({ ...content, heading, messageText, highlightedText });
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, secondaryCta: updatedCta });
  };

  const labelSuffix = getLabelSuffix(deviceType);

  return (
    <>
      <Typography className={classes.sectionHeader} variant="h4">
        {`Content${labelSuffix}`}
      </Typography>
      <div className={classes.contentContainer}>
        <TextField
          inputRef={register({ validate: invalidTemplateValidator })}
          error={errors.heading !== undefined}
          helperText={errors.heading ? errors.heading.message : HEADER_DEFAULT_HELPER_TEXT}
          onBlur={handleSubmit(onSubmit)}
          name="heading"
          label="Header"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />

        <TextField
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: invalidTemplateValidator,
          })}
          error={errors.messageText !== undefined}
          helperText={errors.messageText ? errors.messageText.message : BODY_DEFAULT_HELPER_TEXT}
          onBlur={handleSubmit(onSubmit)}
          name="messageText"
          label="Body copy"
          margin="normal"
          variant="outlined"
          multiline
          rows={10}
          disabled={!editMode}
          fullWidth
        />

        {template === BannerTemplate.ContributionsBanner && (
          <TextField
            inputRef={register({
              validate: invalidTemplateValidator,
            })}
            error={errors.highlightedText !== undefined}
            helperText={
              errors.highlightedText
                ? errors.highlightedText.message
                : HIGHTLIGHTED_TEXT_HELPER_TEXT
            }
            onBlur={handleSubmit(onSubmit)}
            name="highlightedText"
            label="Highlighted text"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
          />
        )}

        <div className={classes.buttonsContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            {`Buttons${labelSuffix}`}
          </Typography>

          <VariantEditorButtonsEditor
            primaryCta={content.cta}
            secondaryCta={content.secondaryCta}
            updatePrimaryCta={updatePrimaryCta}
            updateSecondaryCta={updateSecondaryCta}
            isDisabled={!editMode}
            onValidationChange={onValidationChange}
            supportSecondaryCta={true}
          />
        </div>
      </div>
    </>
  );
};

interface BannerTestVariantEditorProps {
  variant: BannerVariant;
  onVariantChange: (updatedVariant: BannerVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const BannerTestVariantEditor: React.FC<BannerTestVariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
}: BannerTestVariantEditorProps) => {
  const classes = useStyles();
  const setValidationStatusForField = useValidation(onValidationChange);

  const content: BannerContent = variant.bannerContent || {
    heading: variant.heading,
    messageText: variant.body || '',
    highlightedText: variant.highlightedText,
    cta: variant.cta,
    secondaryCta: variant.secondaryCta,
  };

  const onMobileContentRadioChange = (): void => {
    if (variant.mobileBannerContent === undefined) {
      onVariantChange({
        ...variant,
        mobileBannerContent: getDefaultVariant().bannerContent,
      });
    } else {
      // remove mobile content and clear any validation errors
      setValidationStatusForField('mobileContent', true);
      onVariantChange({
        ...variant,
        mobileBannerContent: undefined,
      });
    }
  };

  return (
    <div>
      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Banner template
        </Typography>
        <BannerTemplateSelector
          variant={variant}
          onVariantChange={onVariantChange}
          editMode={editMode}
        />
      </div>

      <div className={classes.sectionContainer}>
        <BannerTestVariantContentEditor
          content={content}
          template={variant.template}
          onChange={(updatedContent: BannerContent): void =>
            onVariantChange({ ...variant, bannerContent: updatedContent })
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mainContent', isValid)
          }
          editMode={editMode}
          deviceType={variant.mobileBannerContent === undefined ? 'ALL' : 'NOT_MOBILE'}
        />

        <RadioGroup
          value={variant.mobileBannerContent !== undefined ? 'enabled' : 'disabled'}
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
        {variant.mobileBannerContent && (
          <BannerTestVariantContentEditor
            content={variant.mobileBannerContent}
            template={variant.template}
            onChange={(updatedContent: BannerContent): void =>
              onVariantChange({ ...variant, mobileBannerContent: updatedContent })
            }
            onValidationChange={(isValid): void =>
              setValidationStatusForField('mobileContent', isValid)
            }
            editMode={editMode}
            deviceType={'MOBILE'}
          />
        )}
      </div>
    </div>
  );
};

export default BannerTestVariantEditor;
