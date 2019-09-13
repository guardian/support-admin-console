import React from 'react';

import { Cta } from "./epicTestsForm";
import {createStyles, FormControlLabel, Switch, Theme, withStyles, WithStyles} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"

const styles = ({ palette, spacing, typography }: Theme) => createStyles({
  fields: {
    marginLeft: "20px"
  }
});

const defaultText = "Support The Guardian";
const defaultBaseUrl = "https://support.theguardian.com/contribute";

export const defaultCta = {
  text: defaultText,
  baseUrl: defaultBaseUrl
};

interface Props extends WithStyles<typeof styles> {
  cta?: Cta,
  update: (cta?: Cta) => void,
  editMode: boolean
}

class CtaEditor extends React.Component<Props> {

  renderFields = (cta: Cta) => {
    return (
      <div className={this.props.classes.fields}>
        <EditableTextField
          required
          text={cta.text || defaultText}
          onSubmit={(value) =>
            this.props.update({...cta, text: value})
          }
          label="Button text:"
          editEnabled={this.props.editMode}
        />

        <EditableTextField
          required
          text={cta.baseUrl || defaultBaseUrl}
          onSubmit={(value) =>
            this.props.update({...cta, baseUrl: value})
          }
          label="Button destination:"
          editEnabled={this.props.editMode}
        />
      </div>
    )
  };

  toggleCta = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const ctaEnabled = event.target.checked;
    if (ctaEnabled) {
      this.props.update(defaultCta)
    } else {
      this.props.update(undefined)
    }
  };

  render(): React.ReactNode {
    return (
      <div>
        <FormControlLabel
          control={
            <Switch
              checked={!!this.props.cta}
              onChange={this.toggleCta}
              disabled={!this.props.editMode}
            />
          }
          label="Has CTA button"
        />
        { this.props.cta && this.renderFields(this.props.cta) }
      </div>
    )
  }
}

export default withStyles(styles)(CtaEditor);
