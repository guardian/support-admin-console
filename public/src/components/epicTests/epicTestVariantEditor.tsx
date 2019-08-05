import React from 'react';
import { EpicVariant, EpicTest } from "./epicTestsForm";
import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Select, FormControl, InputLabel, MenuItem, Input, Checkbox, ListItemText
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Region } from '../../utils/models';
import { MenuProps } from 'material-ui';

const styles = ({ palette, spacing }: Theme) => createStyles({
  container: {
    width: "80%",
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
      width: 250,
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

  updateVariant = (fieldName: VariantFieldNames, updatedData: string | string[] | boolean) => {
    if (this.props.variant) {
      const updatedVariant = {
        ...this.props.variant,
        [fieldName]: updatedData
      };
      this.props.onVariantChange(updatedVariant);
    }
  }

  onTestChange = (fieldName: VariantFieldNames) => (updatedString: string): void => {
    this.updateVariant(fieldName, updatedString);
  };

  onParagraphsChange = (fieldName: VariantFieldNames) => (updatedParagraphs: string): void => {
    this.updateVariant(fieldName, updatedParagraphs.split("\n"));
  }


  renderVariantEditor = (variant: EpicVariant): React.ReactNode => {
    const {classes} = this.props;
    return (

        <div>
          <EditableTextField
            text={variant.heading || ""}
            onSubmit={this.onTestChange(VariantFieldNames.heading)}
            label="Heading:"
          />

          <EditableTextField
            text={variant.paragraphs.join("\n") || ""}
            textarea={true}
            onSubmit={this.onParagraphsChange(VariantFieldNames.paragraphs)}
            label="Paragraphs:"
          />

          <EditableTextField
            text={variant.highlightedText || ""}
            onSubmit={this.onTestChange(VariantFieldNames.highlightedText)}
            label="Highlighted text:"
          />

          <EditableTextField
            text={variant.footer || ""}
            onSubmit={this.onTestChange(VariantFieldNames.footer)}
            label="Footer:"
          />

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={variant.showTicker}
                  onChange={(event) => {
                      this.updateVariant(VariantFieldNames.showTicker, event.target.checked)
                    }
                  }
                />
              }
              label="Show ticker"
            />

          </div>

          <EditableTextField
            text={variant.backgroundImageUrl || ""}
            onSubmit={this.onTestChange(VariantFieldNames.backgroundImageUrl)}
            label="Background image URL:"
          />

          <EditableTextField
            text={variant.ctaText || ""}
            onSubmit={this.onTestChange(VariantFieldNames.ctaText)}
            label="CTA text:"
          />

          <EditableTextField
            text={variant.supportBaseURL || ""}
            onSubmit={this.onTestChange(VariantFieldNames.supportBaseURL)}
            label="Support base URL:"
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
