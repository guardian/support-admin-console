import React from 'react';
import { EpicVariant } from './epicTestsForm';
import { Cta, defaultCta } from '../helpers/shared';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import EditableTextField from '../editableTextField';
import CtaEditor from '../ctaEditor';
import TickerEditor from '../tickerEditor';
import ButtonWithConfirmationPopup from '../buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import { onFieldValidationChange, ValidationStatus } from '../helpers/validation';
import { getInvalidTemplateError } from '../helpers/copyTemplates';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette, spacing, typography }: Theme) =>
  createStyles({
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
  });

interface Props extends WithStyles<typeof styles> {
  variant?: EpicVariant;
  onVariantChange: (updatedVariant: EpicVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

interface State {
  validationStatus: ValidationStatus;
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

class EpicTestVariantEditor extends React.Component<Props, State> {
  state: State = {
    validationStatus: {},
  };

  updateVariant = (update: (variant: EpicVariant) => EpicVariant): void => {
    if (this.props.variant) {
      this.props.onVariantChange(update(this.props.variant));
    }
  };

  onOptionalTextChange = (fieldName: string) => (updatedString: string): void => {
    //For optional fields, an empty string means it's unset
    this.updateVariant(variant => ({
      ...variant,
      [fieldName]: updatedString === '' ? undefined : updatedString,
    }));
  };

  onParagraphsChange = (fieldName: string) => (updatedParagraphs: string): void => {
    this.updateVariant(variant => ({
      ...variant,
      [fieldName]: updatedParagraphs.split('\n'),
    }));
  };

  onVariantSwitchChange = (fieldName: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const updatedBool = event.target.checked;
    this.updateVariant(variant => ({ ...variant, [fieldName]: updatedBool }));
  };

  renderVariantEditor = (variant: EpicVariant): React.ReactNode => {
    const { classes } = this.props;
    return (
      <div className={classes.fieldsContainer}>
        <div className={classes.hook}>
          <EditableTextField
            text={variant.heading || ''}
            onSubmit={this.onOptionalTextChange('heading')}
            label="Hook"
            editEnabled={this.props.editMode}
            helperText="e.g. Since you're here"
            validation={{
              getError: (value: string): string | null => getInvalidTemplateError(value),
              onChange: onFieldValidationChange(this)('heading'),
            }}
            fullWidth
          />
        </div>
        <EditableTextField
          required
          textarea
          height={10}
          text={variant.paragraphs.join('\n')}
          onSubmit={this.onParagraphsChange('paragraphs')}
          label="Body copy"
          editEnabled={this.props.editMode}
          helperText="Main Epic message, including paragraph breaks"
          validation={{
            getError: (value: string): string | null => {
              if (value.trim() === '') {
                return 'Field must not be empty';
              } else {
                return getInvalidTemplateError(value);
              }
            },
            onChange: onFieldValidationChange(this)('paragraphs'),
          }}
          fullWidth
        />
        <EditableTextField
          text={variant.highlightedText || ''}
          onSubmit={this.onOptionalTextChange('highlightedText')}
          label="Highlighted text"
          helperText="Final sentence, highlighted in yellow"
          editEnabled={this.props.editMode}
          validation={{
            getError: (value: string): string | null => getInvalidTemplateError(value),
            onChange: onFieldValidationChange(this)('highlightedText'),
          }}
          fullWidth
        />
        <div className={classes.ctaContainer}>
          <span className={classes.label}>Buttons</span>
          <CtaEditor
            cta={variant.cta}
            update={(cta?: Cta): void => this.updateVariant(variant => ({ ...variant, cta }))}
            editMode={this.props.editMode}
            label="Has a button linking to the landing page"
            defaultText={defaultCta.text}
            defaultBaseUrl={defaultCta.baseUrl}
            manualCampaignCode={false}
          />

          <CtaEditor
            cta={variant.secondaryCta}
            update={(cta?: Cta): void =>
              this.updateVariant(variant => ({
                ...variant,
                secondaryCta: cta,
              }))
            }
            editMode={this.props.editMode}
            label={'Has a secondary button'}
            manualCampaignCode={true}
          />
        </div>
        <div>
          <TickerEditor
            editMode={this.props.editMode}
            tickerSettings={variant.tickerSettings}
            onChange={(tickerSettings): void =>
              this.updateVariant(variant => ({ ...variant, tickerSettings }))
            }
            onValidationChange={onFieldValidationChange(this)('tickerSettings')}
          />
        </div>
        <EditableTextField
          text={variant.backgroundImageUrl || ''}
          onSubmit={this.onOptionalTextChange(VariantFieldNames.backgroundImageUrl)}
          label="Image URL"
          helperText="Image ratio should be 2.5:1. This will appear above everything except a ticker"
          editEnabled={this.props.editMode}
          fullWidth
        />
        <EditableTextField
          text={variant.footer || ''}
          onSubmit={this.onOptionalTextChange('footer')}
          label="Footer"
          helperText="Bold text that appears below the button"
          editEnabled={this.props.editMode}
          fullWidth
        />
        <div className={classes.deleteButton}>
          {this.props.editMode && (
            <ButtonWithConfirmationPopup
              buttonText="Delete variant"
              confirmationText={`Are you sure? This cannot be undone!`}
              onConfirm={(): void => this.props.onDelete()}
              icon={<DeleteSweepIcon />}
            />
          )}
        </div>
      </div>
    );
  };

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {this.props.variant ? (
          this.renderVariantEditor(this.props.variant)
        ) : (
          <div>No variant selected</div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(EpicTestVariantEditor);
