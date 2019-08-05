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
  // onChange: (updatedTest: EpicTest) => void
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

    onListChange = (fieldName: VariantFieldNames) => (updatedString: string): void => {
    console.log("variant updated. fieldname: " + fieldName + ", data: " + updatedString);
  };

  renderVariantEditor = (variant: EpicVariant): React.ReactNode => {
    const {classes} = this.props;
    return (

        <div>
          <EditableTextField
            text={variant.name}
            onSubmit={this.onListChange(VariantFieldNames.name)}
            label="Name:"
          />

          <EditableTextField
            text={variant.heading || ""}
            onSubmit={this.onListChange(VariantFieldNames.heading)}
            label="Heading:"
          />

          <EditableTextField
            text={variant.paragraphs[0] || ""}
            textarea={true}
            onSubmit={this.onListChange(VariantFieldNames.paragraphs)}
            label="Paragraphs:"
          />

          <EditableTextField
            text={variant.highlightedText || ""}
            onSubmit={this.onListChange(VariantFieldNames.highlightedText)}
            label="Highlighted text:"
          />

          <EditableTextField
            text={variant.footer || ""}
            onSubmit={this.onListChange(VariantFieldNames.footer)}
            label="Footer:"
          />

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={variant.showTicker}
                  onChange={(event) => {
                    if (this.props.variant) {
                      const updatedVariant = {
                        ...this.props.variant,
                        showTicker: event.target.checked
                      };
                      // this.props.onChange(updatedVariant)
                    }
                  }}
                />
              }
              label="Show ticker"
            />

          </div>

          <EditableTextField
            text={variant.backgroundImageUrl || ""}
            onSubmit={this.onListChange(VariantFieldNames.backgroundImageUrl)}
            label="Background image URL:"
          />

          <EditableTextField
            text={variant.ctaText || ""}
            onSubmit={this.onListChange(VariantFieldNames.ctaText)}
            label="CTA text:"
          />

          <EditableTextField
            text={variant.supportBaseURL || ""}
            onSubmit={this.onListChange(VariantFieldNames.supportBaseURL)}
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
