import React from 'react';
import { EpicVariant, EpicTest } from "./epicTestsForm";
import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Select, FormControl, InputLabel, MenuItem, Input, Checkbox, ListItemText, Typography
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = ({ palette, spacing }: Theme) => createStyles({
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
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit,
    minWidth: "60%",
    maxWidth: "100%",
    display: "block",
  }
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 500,
    },
  },
};
interface Props extends WithStyles<typeof styles> {
  variant?: EpicVariant,
  onVariantChange: (updatedVariant: EpicVariant) => void
}

enum VariantFieldNames {
  name = "name",
  heading = "heading",
  paragraphs = "paragraphs",
  highlightedText = "highlightedText",
  footer = "footer",
  showTicker = "showTicker",
  backgroundImageUrl = "backgroundImageUrl",
  ctaText = "ctaText",
  supportBaseURL = "supportBaseURL"
}
class EpicTestVariantEditor extends React.Component<Props, any> {

  updateVariant = (update: (variant: EpicVariant) => EpicVariant) => {
    if (this.props.variant) {
      this.props.onVariantChange(update(this.props.variant));
    }
  }

  onTextChange = (fieldName: string) => (updatedString: string): void => {
    this.updateVariant(variant => ({...variant, [fieldName]: updatedString}));
  };

  onParagraphsChange = (fieldName: string) => (updatedParagraphs: string): void => {
    this.updateVariant(variant => ({...variant, [fieldName]: updatedParagraphs.split("\n")}));
  }

  onSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>):void =>  {
    const updatedBool = event.target.checked;
    this.updateVariant(variant => ({...variant, [fieldName]: updatedBool}))
  };

  renderVariantEditor = (variant: EpicVariant): React.ReactNode => {
    const {classes} = this.props;
    return (
        <div>

          <Typography variant={'h6'}>Required</Typography>
          <Typography>Fill out each field before publishing your test</Typography>

          <EditableTextField
            text={variant.heading || "Since you're here..."}
            onSubmit={this.onTextChange("heading")}
            label="Hook:"
          />

          <EditableTextField
            text={variant.paragraphs.join("\n") || "... I’m the second half of your opening line."}
            textarea={true}
            onSubmit={this.onParagraphsChange("paragraphs")}
            label="Paragraphs:"
          />

          <EditableTextField
            text={variant.ctaText || "Support The Guardian"}
            onSubmit={this.onTextChange(VariantFieldNames.ctaText)}
            label="Button text:"
          />

          <EditableTextField
            text={variant.supportBaseURL || "https://support.theguardian.com/contribute"}
            onSubmit={this.onTextChange(VariantFieldNames.supportBaseURL)}
            label="Button destination:"
          />

          <Typography variant={'h6'}>Optional</Typography>
          <Typography>Extra fields to add or remove, often during campaigns</Typography>

          <EditableTextField
            text={variant.highlightedText || "Support The Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you."}
            onSubmit={this.onTextChange("highlightedText")}
            label="Highlighted text"
          />

          <EditableTextField
            text={variant.backgroundImageUrl || ""}
            onSubmit={this.onTextChange(VariantFieldNames.backgroundImageUrl)}
            label="Image URL"
          />

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={variant.showTicker}
                  onChange={this.onSwitchChange("showTicker")}
                />
              }
              label="Ticker is on"
            />
          </div>

          <EditableTextField
            text={variant.footer || ""}
            onSubmit={this.onTextChange("footer")}
            label="Footer:"
          />





        </div>

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
