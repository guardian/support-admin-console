import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme,
  Typography,
  makeStyles,
  Switch,
} from '@material-ui/core';
import BannerTestVariantEditorCtasEditor from './bannerTestVariantEditorCtasEditor';
import {
  EMPTY_ERROR_HELPER_TEXT,
  MAXLENGTH_ERROR_HELPER_TEXT,
  templateValidatorForPlatform,
} from '../helpers/validation';
import { Cta, SecondaryCta } from '../helpers/shared';
import BannerTemplateSelector from './bannerTemplateSelector';
import { BannerContent, BannerTemplate, BannerVariant } from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';
import useValidation from '../hooks/useValidation';
import { RichTextEditor, RichTextEditorSingleLine, getRteCopyLength } from '../richTextEditor';

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

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = 'Main banner message paragraph';
const HIGHTLIGHTED_TEXT_HELPER_TEXT = 'Final sentence of body copy';

const BODY_COPY_WITHOUT_SECONDARY_CTA_RECOMMENDED_LENGTH = 525;
const BODY_COPY_WITH_SECONDARY_CTA_RECOMMENDED_LENGTH = 390;

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

interface FormData {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
}

// Temporary, while we migrate from messageText to paragraphs
const getParagraphsOrMessageText = (
  paras: string[] | undefined,
  text: string | undefined,
): string[] => {
  const bodyCopy = [];

  if (paras != null) {
    bodyCopy.push(...paras);
  } else if (text != null) {
    bodyCopy.push(text);
  }
  return bodyCopy;
};

const BannerTestVariantContentEditor: React.FC<BannerTestVariantContentEditorProps> = ({
  content,
  template,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
}: BannerTestVariantContentEditorProps) => {
  const classes = useStyles();

  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: FormData = {
    heading: content.heading || '',
    paragraphs: getParagraphsOrMessageText(content.paragraphs, content.messageText),
    highlightedText: content.highlightedText || '',
  };

  const { handleSubmit, control, errors, trigger } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.heading, errors.paragraphs, errors.highlightedText]);

  const onSubmit = ({ heading, paragraphs, highlightedText }: FormData): void => {
    onChange({ ...content, heading, paragraphs, highlightedText });
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: SecondaryCta): void => {
    onChange({ ...content, secondaryCta: updatedCta });
  };

  const labelSuffix = getLabelSuffix(deviceType);

  const getBodyCopyLength = () => {
    const bodyCopyRecommendedLength = content.secondaryCta
      ? BODY_COPY_WITH_SECONDARY_CTA_RECOMMENDED_LENGTH
      : BODY_COPY_WITHOUT_SECONDARY_CTA_RECOMMENDED_LENGTH;

    if (content.paragraphs != null) {
      return [
        getRteCopyLength([...content.paragraphs, content.highlightedText || '']),
        bodyCopyRecommendedLength,
      ];
    }
    return [
      getRteCopyLength([content.messageText || '', content.highlightedText || '']),
      bodyCopyRecommendedLength,
    ];
  };

  const getParagraphsHelperText = () => {
    const [copyLength, recommendedLength] = getBodyCopyLength();

    if (!copyLength) {
      return EMPTY_ERROR_HELPER_TEXT;
    }
    if (copyLength > recommendedLength) {
      return MAXLENGTH_ERROR_HELPER_TEXT;
    }
    return `${BODY_DEFAULT_HELPER_TEXT} (${recommendedLength} chars)`;
  };

  return (
    <>
      <Typography className={classes.sectionHeader} variant="h4">
        {`Content${labelSuffix}`}
      </Typography>

      <div className={classes.contentContainer}>
        {template !== BannerTemplate.EnvironmentMomentBanner && (
          <Controller
            name="heading"
            control={control}
            rules={{
              validate: templateValidator,
            }}
            render={data => {
              return (
                <RichTextEditorSingleLine
                  error={errors.heading !== undefined}
                  helperText={errors.heading ? errors.heading.message : HEADER_DEFAULT_HELPER_TEXT}
                  copyData={data.value}
                  updateCopy={pars => {
                    data.onChange(pars);
                    handleSubmit(onSubmit)();
                  }}
                  name="heading"
                  label="Header"
                  disabled={!editMode}
                />
              );
            }}
          />
        )}

        <div>
          <Controller
            name="paragraphs"
            control={control}
            rules={{
              required: true,
              validate: (pars: string[]) =>
                pars.map(templateValidator).find(result => result !== true),
            }}
            render={data => {
              return (
                <RichTextEditor
                  error={errors.paragraphs !== undefined}
                  helperText={
                    errors.paragraphs
                      ? // @ts-ignore -- react-hook-form doesn't believe it has a message field
                        errors.paragraphs.message
                      : getParagraphsHelperText()
                  }
                  copyData={data.value}
                  updateCopy={pars => {
                    data.onChange(pars);
                    handleSubmit(onSubmit)();
                  }}
                  name="paragraphs"
                  label="Body copy"
                  disabled={!editMode}
                />
              );
            }}
          />

          {(template === BannerTemplate.ContributionsBanner ||
            template === BannerTemplate.InvestigationsMomentBanner) && (
            <Controller
              name="highlightedText"
              control={control}
              rules={{
                validate: templateValidator,
              }}
              render={data => {
                return (
                  <RichTextEditorSingleLine
                    error={errors.highlightedText !== undefined}
                    helperText={
                      errors.highlightedText
                        ? errors.highlightedText.message
                        : HIGHTLIGHTED_TEXT_HELPER_TEXT
                    }
                    copyData={data.value}
                    updateCopy={pars => {
                      data.onChange(pars);
                      handleSubmit(onSubmit)();
                    }}
                    name="highlightedText"
                    label="Highlighted text"
                    disabled={!editMode}
                  />
                );
              }}
            />
          )}
        </div>

        <div className={classes.buttonsContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            {`Buttons${labelSuffix}`}
          </Typography>

          <BannerTestVariantEditorCtasEditor
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
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Banner template
        </Typography>
        <BannerTemplateSelector
          template={variant.template}
          onTemplateChange={(template): void =>
            onVariantChange({
              ...variant,
              template,
            })
          }
          editMode={editMode}
        />
      </div>

      <div className={classes.sectionContainer}>
        <BannerTestVariantContentEditor
          content={variant.bannerContent}
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
      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Separate article count (displayed only for users with at least 5 article views)
        </Typography>

        <div className={classes.switchContainer}>
          <Typography className={classes.switchLabel}>Disabled</Typography>
          <Switch
            checked={!!variant.separateArticleCount}
            onChange={(e): void =>
              onVariantChange({ ...variant, separateArticleCount: e.target.checked })
            }
            disabled={!editMode}
          />
          <Typography className={classes.switchLabel}>Enabled</Typography>
        </div>
      </div>
    </div>
  );
};

export default BannerTestVariantEditor;
