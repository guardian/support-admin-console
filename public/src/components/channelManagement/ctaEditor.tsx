import React from 'react';

import { Cta } from "./helpers/shared";
import {createStyles, FormControlLabel, Switch, Theme, withStyles, WithStyles} from "@material-ui/core";
import EditableTextField from "./editableTextField"

const styles = ({ palette, spacing, typography }: Theme) => createStyles({
  fields: {
    marginLeft: "20px"
  }
});

interface Props extends WithStyles<typeof styles> {
  cta?: Cta,
  update: (cta?: Cta) => void,
  editMode: boolean,
  label: string,
  defaultText?: string,
  defaultBaseUrl?: string,
  manualCampaignCode: boolean
}

class CtaEditor extends React.Component<Props> {

  renderFields = (cta: Cta) => {
    return (
      <div className={this.props.classes.fields}>
        <EditableTextField
          required
          text={cta.text || this.props.defaultText || ""}
          onSubmit={(value) =>
            this.props.update({...cta, text: value})
          }
          label="Button text:"
          editEnabled={this.props.editMode}
        />

        <EditableTextField
          required
          text={cta.baseUrl || this.props.defaultBaseUrl || ""}
          onSubmit={(value) =>
            this.props.update({...cta, baseUrl: value})
          }
          label="Button destination:"
          editEnabled={this.props.editMode}
          helperText={ this.props.manualCampaignCode ?
            'Note - if this is not a support.theguardian.com url then tracking code must be added manually, e.g. theguardian.com/article?INTCMP=my-campaign-code' :
            undefined
          }
        />
      </div>
    )
  };

  toggleCta = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const ctaEnabled = event.target.checked;
    if (ctaEnabled) {
      this.props.update({
        text: this.props.defaultText || "",
        baseUrl: this.props.defaultBaseUrl || ""
      })
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
          label={this.props.label}
        />
        { this.props.cta && this.renderFields(this.props.cta) }
      </div>
    )
  }
}

export default withStyles(styles)(CtaEditor);
