import React from 'react';
import {Theme, createStyles, WithStyles, withStyles} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import {onFieldValidationChange, ValidationStatus} from '../helpers/validation';
import {BannerVariant} from "./bannerTestsForm";
import CtaEditor from "../epicTests/ctaEditor";
import {Cta} from "../epicTests/epicTestsForm";


const currencyTemplate = "%%CURRENCY_SYMBOL%%";
export const countryNameTemplate = "%%COUNTRY_NAME%%";
export const articleCountTemplate = "%%ARTICLE_COUNT%%";
const validTemplates = [currencyTemplate, countryNameTemplate, articleCountTemplate];

export const getInvalidTemplateError = (text: string): string | null => {
  const templates: string[] | null = text.match(/%%[A-Z_]*%%/g);

  if (templates !== null) {
    const invalidTemplate: string | undefined =
      templates.find(template => !validTemplates.includes(template));
    if (invalidTemplate) return `Invalid template: ${invalidTemplate}`;
    else return null;
  } else {
    return null
  }
};

export const defaultCta = {
  text: "Support The Guardian",
  baseUrl: "https://support.theguardian.com/contribute"
};

const styles = ({ palette, spacing, typography }: Theme) => createStyles({
  container: {
    width: "100%",
    borderTop: `2px solid ${palette.grey['300']}`,
    marginLeft: "15px"
  },
  variant: {
    display: "flex",
    "& span": {
      marginLeft: "4px",
      marginRight: "4px"
    }
  },
  variantName: {
    width: "10%"
  },
  variantHeading: {
    width: "20%"
  },
  variantListHeading: {
    fontWeight: "bold"
  },
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    minWidth: "60%",
    maxWidth: "100%",
    display: "block",
  },
  deleteButton: {
    marginTop: spacing(2),
    float: "right"
  },
  label: {
    fontSize: typography.pxToRem(16),
    fontWeight: typography.fontWeightMedium,
    color: "black"
  },
  ctaContainer: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  hook: {
    maxWidth: '400px'
  }
});

interface Props extends WithStyles<typeof styles> {
  variant?: BannerVariant,
  onVariantChange: (updatedVariant: BannerVariant) => void,
  editMode: boolean,
  onDelete: () => void,
  onValidationChange: (isValid: boolean) => void
}

interface State {
  validationStatus: ValidationStatus
}

enum VariantFieldNames {
  name = "name",
  headline = "headline",
  body = "body",
  highlightedText = "highlightedText",
  footer = "footer",
  showTicker = "showTicker",
  backgroundImageUrl = "backgroundImageUrl"
}

class BannerTestVariantEditor extends React.Component<Props, State> {

  state: State = {
    validationStatus: {}
  };

  updateVariant = (update: (variant: BannerVariant) => BannerVariant) => {
    if (this.props.variant) {
      this.props.onVariantChange(update(this.props.variant));
    }
  };

  onOptionalTextChange = (fieldName: string) => (updatedString: string): void => {
    //For optional fields, an empty string means it's unset
    this.updateVariant(variant => ({
      ...variant,
      [fieldName]: updatedString === "" ? undefined : updatedString
    }));
  };

  onBodyChange = (fieldName: string) => (updatedBody: string): void => {
    this.updateVariant(variant => ({...variant, [fieldName]: updatedBody}));
  };

  onVariantSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>):void =>  {
    const updatedBool = event.target.checked;
    this.updateVariant(variant => ({...variant, [fieldName]: updatedBool}))
  };

  renderDeleteVariantButton = (variantName: string) => {
    return this.props.editMode && (
      <ButtonWithConfirmationPopup
        buttonText="Delete variant"
        confirmationText={`Are you sure? This cannot be undone!`}
        onConfirm={() => this.props.onDelete()}
        icon={<DeleteSweepIcon />}
      />
    );
  }

  renderVariantEditor = (variant: BannerVariant): React.ReactNode => {
    const {classes} = this.props;
    return (
        <>
          <div className={classes.hook}>
            <EditableTextField
              text={variant.headline || ''}
              onSubmit={this.onOptionalTextChange('headline')}
              label="Hook"
              editEnabled={this.props.editMode}
              helperText="e.g. Since you're here"
              validation={
                {
                  getError: (value: string) => getInvalidTemplateError(value),
                  onChange: onFieldValidationChange(this)("headline")
                }
              }
            />
          </div>

          <EditableTextField
            required
            textarea
            height={10}
            text={variant.body}
            onSubmit={this.onBodyChange("body")}
            label="Body copy"
            editEnabled={this.props.editMode}
            helperText="Main Banner message, including paragraph breaks"
            validation={
              {
                getError: (value: string) => {
                  if (value.trim() === '') return "Field must not be empty";
                  else return getInvalidTemplateError(value);
                },
                onChange: onFieldValidationChange(this)("body")
              }
            }
          />

          <EditableTextField
            text={variant.highlightedText || ""}
            onSubmit={this.onOptionalTextChange("highlightedText")}
            label="Highlighted text"
            helperText="Final sentence, highlighted in yellow"
            editEnabled={this.props.editMode}
            validation={
              {
                getError: (value: string) => getInvalidTemplateError(value),
                onChange: onFieldValidationChange(this)("highlightedText")
              }
            }
          />


          <div className={classes.ctaContainer}>
            <span className={classes.label}>Buttons</span>
            <CtaEditor
              cta={variant.cta}
              update={(cta?: Cta) =>
                this.updateVariant(variant => ({...variant, cta}))
              }
              editMode={this.props.editMode}
              label="Has a button linking to the landing page"
              defaultText={defaultCta.text}
              defaultBaseUrl={defaultCta.baseUrl}
              manualCampaignCode={false}
            />

            <CtaEditor
              cta={variant.secondaryCta}
              update={(cta?: Cta) =>
                this.updateVariant(variant => ({...variant, secondaryCta: cta}))
              }
              editMode={this.props.editMode}
              label={"Has a secondary button"}
              manualCampaignCode={true}
            />
          </div>

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={variant.hasTicker}
                  onChange={this.onVariantSwitchChange("showTicker")}
                  disabled={!this.props.editMode}
                />
              }
              label={`Ticker is ${variant.hasTicker ? "on" : "off"}`}
            />
          </div>

          <div className={classes.deleteButton}>{this.renderDeleteVariantButton(variant.name)}</div>

        </>
    )
  };

  render(): React.ReactNode {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        {this.props.variant ? this.renderVariantEditor(this.props.variant) : <div>No variant selected</div>}
      </div>
    )
  }
}

export default withStyles(styles)(BannerTestVariantEditor);
