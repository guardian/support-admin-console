import React from 'react';
import {EpicVariant, Cta} from "./epicTestsForm";
import {Theme, createStyles, WithStyles, withStyles, Typography} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField";
import CtaEditor from "./ctaEditor";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import {onFieldValidationChange, ValidationStatus} from '../helpers/validation';


const validTemplates = ["%%CURRENCY_SYMBOL%%", "%%COUNTRY_NAME%%", "%%ARTICLE_COUNT%%"];

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
  h5: {
    fontSize: typography.pxToRem(18),
    margin: "20px 0 10px 0"
  },
  deleteButton: {
    marginTop: spacing(2),
    float: "right"
  }
});

interface Props extends WithStyles<typeof styles> {
  variant?: EpicVariant,
  onVariantChange: (updatedVariant: EpicVariant) => void,
  editMode: boolean,
  onDelete: () => void,
  onValidationChange: (isValid: boolean) => void
}

interface State {
  validationStatus: ValidationStatus
}

enum VariantFieldNames {
  name = "name",
  heading = "heading",
  paragraphs = "paragraphs",
  highlightedText = "highlightedText",
  footer = "footer",
  showTicker = "showTicker",
  backgroundImageUrl = "backgroundImageUrl"
}

class EpicTestVariantEditor extends React.Component<Props, State> {

  state: State = {
    validationStatus: {}
  };

  updateVariant = (update: (variant: EpicVariant) => EpicVariant) => {
    if (this.props.variant) {
      this.props.onVariantChange(update(this.props.variant));
    }
  };

  onCtaUpdate = (cta?: Cta): void => {
    this.updateVariant(variant => ({...variant, cta}));
  };

  onOptionalTextChange = (fieldName: string) => (updatedString: string): void => {
    //For optional fields, an empty string means it's unset
    this.updateVariant(variant => ({
      ...variant,
      [fieldName]: updatedString === "" ? undefined : updatedString
    }));
  };

  onParagraphsChange = (fieldName: string) => (updatedParagraphs: string): void => {
    this.updateVariant(variant => ({...variant, [fieldName]: updatedParagraphs.split("\n")}));
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

  renderVariantEditor = (variant: EpicVariant): React.ReactNode => {
    const {classes} = this.props;
    return (
        <>
          <EditableTextField
            text={variant.heading || ""}
            onSubmit={this.onOptionalTextChange("heading")}
            label="Hook:"
            editEnabled={this.props.editMode}
            validation={
              {
                getError: (value: string) => getInvalidTemplateError(value),
                onChange: onFieldValidationChange(this)("heading")
              }
            }
          />

          <EditableTextField
            required
            text={variant.paragraphs.join("\n")}
            textarea={true}
            onSubmit={this.onParagraphsChange("paragraphs")}
            label="Paragraphs:"
            editEnabled={this.props.editMode}
            validation={
              {
                getError: (value: string) => {
                  if (value.trim() === '') return "Field must not be empty";
                  else return getInvalidTemplateError(value);
                },
                onChange: onFieldValidationChange(this)("paragraphs")
              }
            }
          />

          <CtaEditor
            cta={variant.cta}
            update={this.onCtaUpdate}
            editMode={this.props.editMode}
          />

          <EditableTextField
            text={variant.highlightedText || ""}
            onSubmit={this.onOptionalTextChange("highlightedText")}
            label="Highlighted text:"
            helperText="This will appear as the last sentence"
            editEnabled={this.props.editMode}
            validation={
              {
                getError: (value: string) => getInvalidTemplateError(value),
                onChange: onFieldValidationChange(this)("highlightedText")
              }
            }
          />

          <EditableTextField
            text={variant.backgroundImageUrl || ""}
            onSubmit={this.onOptionalTextChange(VariantFieldNames.backgroundImageUrl)}
            label="Image URL:"
            helperText="This will appear above everything except a ticker"
            editEnabled={this.props.editMode}
          />

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={variant.showTicker}
                  onChange={this.onVariantSwitchChange("showTicker")}
                  disabled={!this.props.editMode}
                />
              }
              label={`Ticker is ${variant.showTicker ? "on" : "off"}`}
            />
          </div>

          <EditableTextField
            text={variant.footer || ""}
            onSubmit={this.onOptionalTextChange("footer")}
            label="Footer:"
            helperText="Bold text that appears below the button"
            editEnabled={this.props.editMode}
          />

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

export default withStyles(styles)(EpicTestVariantEditor);
