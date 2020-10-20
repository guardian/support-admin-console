import React from 'react';
import { EpicVariant } from './epicTestsForm';
import { Cta, defaultCta } from '../helpers/shared';
import { Theme, makeStyles } from '@material-ui/core';
import EditableTextField from '../editableTextField';
import CtaEditor from '../ctaEditor';
import TickerEditor from '../tickerEditor';
import ButtonWithConfirmationPopup from '../buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import { getInvalidTemplateError } from '../helpers/copyTemplates';

const useStyles = makeStyles(({ palette, spacing, typography }: Theme) => ({
  container: {
    width: '100%',
    borderTop: `2px solid ${palette.grey['300']}`,
    marginLeft: '15px',
  },
  fieldsContainer: {
    '& > *': {
      marginTop: spacing(3),
    },
  },
  variant: {
    display: 'flex',
    '& span': {
      marginLeft: '4px',
      marginRight: '4px',
    },
  },
  variantName: {
    width: '10%',
  },
  variantHeading: {
    width: '20%',
  },
  variantListHeading: {
    fontWeight: 'bold',
  },
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    minWidth: '60%',
    maxWidth: '100%',
    display: 'block',
  },
  deleteButton: {
    marginTop: spacing(2),
    float: 'right',
  },
  label: {
    fontSize: typography.pxToRem(16),
    fontWeight: typography.fontWeightMedium,
    color: 'black',
  },
  ctaContainer: {
    marginTop: '15px',
    marginBottom: '15px',
  },
  hook: {
    maxWidth: '400px',
  },
}));

interface EpicTestVariantEditorProps {
  variant: EpicVariant;
  onVariantChange: (updatedVariant: EpicVariant) => void;
  editMode: boolean;
  isLiveblog: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

enum VariantFieldNames {
  name = 'name',
  heading = 'heading',
  paragraphs = 'paragraphs',
  highlightedText = 'highlightedText',
  footer = 'footer',
  showTicker = 'showTicker',
  backgroundImageUrl = 'backgroundImageUrl',
}

const EpicTestVariantEditor: React.FC<EpicTestVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  isLiveblog,
  onDelete,
}: EpicTestVariantEditorProps) => {
  const classes = useStyles();

  const updateVariant = (update: (variant: EpicVariant) => EpicVariant): void => {
    if (variant) {
      onVariantChange(update(variant));
    }
  };

  const onOptionalTextChange = (fieldName: string) => (updatedString: string): void => {
    //For optional fields, an empty string means it's unset
    updateVariant(variant => ({
      ...variant,
      [fieldName]: updatedString === '' ? undefined : updatedString,
    }));
  };

  const onParagraphsChange = (fieldName: string) => (updatedParagraphs: string): void => {
    updateVariant(variant => ({
      ...variant,
      [fieldName]: updatedParagraphs.split('\n'),
    }));
  };

  return (
    <div className={classes.container}>
      <div className={classes.fieldsContainer}>
        {!isLiveblog && (
          <div className={classes.hook}>
            <EditableTextField
              text={variant.heading || ''}
              onSubmit={onOptionalTextChange('heading')}
              label="Hook"
              editEnabled={editMode}
              helperText="e.g. Since you're here"
              validation={{
                getError: (value: string): string | null => getInvalidTemplateError(value),
                onChange: isValid => console.log(isValid),
              }}
              fullWidth
            />
          </div>
        )}
        <EditableTextField
          required
          textarea
          height={10}
          text={variant.paragraphs.join('\n')}
          onSubmit={onParagraphsChange('paragraphs')}
          label="Body copy"
          editEnabled={editMode}
          helperText="Main Epic message, including paragraph breaks"
          validation={{
            getError: (value: string): string | null => {
              if (value.trim() === '') {
                return 'Field must not be empty';
              } else {
                return getInvalidTemplateError(value);
              }
            },
            onChange: isValid => console.log(isValid),
          }}
          fullWidth
        />

        {!isLiveblog && (
          <EditableTextField
            text={variant.highlightedText || ''}
            onSubmit={onOptionalTextChange('highlightedText')}
            label="Highlighted text"
            helperText="Final sentence, highlighted in yellow"
            editEnabled={editMode}
            validation={{
              getError: (value: string): string | null => getInvalidTemplateError(value),
              onChange: isValid => console.log(isValid),
            }}
            fullWidth
          />
        )}
        <div className={classes.ctaContainer}>
          <span className={classes.label}>Buttons</span>
          <CtaEditor
            cta={variant.cta}
            update={(cta?: Cta): void => updateVariant(variant => ({ ...variant, cta }))}
            editMode={editMode}
            label="Has a button linking to the landing page"
            defaultText={defaultCta.text}
            defaultBaseUrl={defaultCta.baseUrl}
            manualCampaignCode={false}
          />

          {!isLiveblog && (
            <CtaEditor
              cta={variant.secondaryCta}
              update={(cta?: Cta): void =>
                updateVariant(variant => ({
                  ...variant,
                  secondaryCta: cta,
                }))
              }
              editMode={editMode}
              label={'Has a secondary button'}
              manualCampaignCode={true}
            />
          )}
        </div>
        {!isLiveblog && (
          <div>
            <TickerEditor
              editMode={editMode}
              tickerSettings={variant.tickerSettings}
              onChange={(tickerSettings): void =>
                updateVariant(variant => ({ ...variant, tickerSettings }))
              }
              onValidationChange={isValid => console.log(isValid)}
            />
          </div>
        )}
        {!isLiveblog && (
          <EditableTextField
            text={variant.backgroundImageUrl || ''}
            onSubmit={onOptionalTextChange(VariantFieldNames.backgroundImageUrl)}
            label="Image URL"
            helperText="Image ratio should be 2.5:1. This will appear above everything except a ticker"
            editEnabled={editMode}
            fullWidth
          />
        )}
        {!isLiveblog && (
          <EditableTextField
            text={variant.footer || ''}
            onSubmit={onOptionalTextChange('footer')}
            label="Footer"
            helperText="Bold text that appears below the button"
            editEnabled={editMode}
            fullWidth
          />
        )}
        <div className={classes.deleteButton}>
          {editMode && (
            <ButtonWithConfirmationPopup
              buttonText="Delete variant"
              confirmationText={`Are you sure? This cannot be undone!`}
              onConfirm={(): void => onDelete()}
              icon={<DeleteSweepIcon />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EpicTestVariantEditor;
