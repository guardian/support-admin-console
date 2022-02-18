import React from 'react';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import BannerTestVariantEditorCtasEditor from './bannerTestVariantEditorCtasEditor';
import {
  EMPTY_ERROR_HELPER_TEXT,
  MAXLENGTH_ERROR_HELPER_TEXT,
  // templateValidatorForPlatform,
} from '../helpers/validation';
import { Cta, SecondaryCta } from '../helpers/shared';
import BannerTemplateSelector from './bannerTemplateSelector';
import { BannerContent, BannerTemplate, BannerVariant } from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';
import useValidation from '../hooks/useValidation';
import RichTextEditor, { getRteCopyLength } from '../richTextEditor';

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
const BODY_DEFAULT_HELPER_TEXT = 'Main banner message paragraph';
const HIGHTLIGHTED_TEXT_HELPER_TEXT = 'Final sentence of body copy';

const HEADER_COPY_RECOMMENDED_LENGTH = 50;
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

const BannerTestVariantContentEditor: React.FC<BannerTestVariantContentEditorProps> = ({
  content,
  template,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
}: BannerTestVariantContentEditorProps) => {
  const classes = useStyles();

  // Handling MUI TextField updates
  // const templateValidator = templateValidatorForPlatform('DOTCOM');

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: SecondaryCta): void => {
    onChange({ ...content, secondaryCta: updatedCta });
  };

  const labelSuffix = getLabelSuffix(deviceType);

  // Handling RTE Field updates
  const updateHeading = (updatedHeading: string[] | undefined): void => {
    if (updatedHeading != null) {
      onChange({ ...content, heading: updatedHeading.join(' ') });
    } else {
      onChange({ ...content, heading: '' });
    }
  };
  const updateParagraphs = (updatedParagraphs: string[] | undefined): void => {
    if (updatedParagraphs != null) {
      onChange({ ...content, paragraphs: updatedParagraphs });
    } else {
      onChange({ ...content, paragraphs: [] });
    }
  };
  const updateHighlightedText = (updatedHighlightedText: string[] | undefined): void => {
    if (updatedHighlightedText != null) {
      onChange({ ...content, highlightedText: updatedHighlightedText.join(' ') });
    } else {
      onChange({ ...content, highlightedText: '' });
    }
  };

  // RTE field validations
  const checkForHeadingError = () => {
    const paragraphsLength = getRteCopyLength([content.heading || '']);
    if (paragraphsLength > HEADER_COPY_RECOMMENDED_LENGTH) {
      return true;
    }
    return false;
  };

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

  const checkForMessageAndHighlightedTextError = () => {
    const [copyLength, recommendedLength] = getBodyCopyLength();

    if (!copyLength || copyLength > recommendedLength) {
      return true;
    }
    return false;
  };

  const getHeadingHelperText = () => {
    const paragraphsLength = getRteCopyLength([content.heading || '']);

    if (paragraphsLength > HEADER_COPY_RECOMMENDED_LENGTH) {
      return MAXLENGTH_ERROR_HELPER_TEXT;
    }
    return `${HEADER_DEFAULT_HELPER_TEXT} (${HEADER_COPY_RECOMMENDED_LENGTH} chars)`;
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

  const getHighlightedTextHelperText = () => {
    const [copyLength, recommendedLength] = getBodyCopyLength();

    if (!copyLength) {
      return EMPTY_ERROR_HELPER_TEXT;
    }
    if (copyLength > recommendedLength) {
      return MAXLENGTH_ERROR_HELPER_TEXT;
    }
    return HIGHTLIGHTED_TEXT_HELPER_TEXT;
  };

  console.log(content);

  return (
    <>
      <Typography className={classes.sectionHeader} variant="h4">
        {`Content${labelSuffix}`}
      </Typography>

      <div className={classes.contentContainer}>
        {template !== BannerTemplate.EnvironmentMomentBanner && (
          <RichTextEditor
            error={checkForHeadingError()}
            helperText={getHeadingHelperText()}
            copyData={content.heading}
            updateCopy={updateHeading}
            name="heading"
            label="Header"
            disabled={!editMode}
          />
        )}

        <div>
          <RichTextEditor
            error={checkForMessageAndHighlightedTextError()}
            helperText={getParagraphsHelperText()}
            copyData={content.paragraphs || content.messageText}
            updateCopy={updateParagraphs}
            name="paragraphs"
            label="Body copy"
            disabled={!editMode}
          />

          {(template === BannerTemplate.ContributionsBanner ||
            template === BannerTemplate.InvestigationsMomentBanner) && (
            <RichTextEditor
              error={checkForMessageAndHighlightedTextError()}
              helperText={getHighlightedTextHelperText()}
              copyData={content.highlightedText}
              updateCopy={updateHighlightedText}
              name="highlightedText"
              label="Highlighted text"
              disabled={!editMode}
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

  const content: BannerContent = variant.bannerContent || {
    heading: variant.heading,
    paragraphs: variant.body || '',
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
    <div className={classes.container}>
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
