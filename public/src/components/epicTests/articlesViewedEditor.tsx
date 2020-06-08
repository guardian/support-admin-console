import React from 'react';
import {
  createStyles, FormControl,
  FormControlLabel,
  InputLabel,
  Theme,
  withStyles,
  WithStyles,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import {onFieldValidationChange, ValidationStatus} from "../helpers/validation";
import {ArticlesViewedSettings} from "./epicTestsForm";

const isNumber = (value: string): boolean => !Number.isNaN(Number(value));

export const defaultArticlesViewedSettings: ArticlesViewedSettings = {
  maxViews: null,
  minViews: 5,
  periodInWeeks: 52,
};

const styles = ({ spacing, typography}: Theme) => createStyles({
  button: {
    marginTop: '20px'
  },
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    display: "block",
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: "black"
  },
  radio: {
    paddingTop: "20px",
    marginBottom: "10px"
  },
  articlesViewsContainer: {
    marginTop: '10px',
    marginLeft: '20px'
  }
});

type ArticleViewsFieldName = 'minViews' | 'maxViews' | 'periodInWeeks';

interface Props extends WithStyles<typeof styles> {
  articlesViewedSettings?: ArticlesViewedSettings,
  editMode: boolean,
  onChange: (articlesViewedSettings?: ArticlesViewedSettings) => void,
  onValidationChange: (isValid: boolean) => void
}

interface State {
  validationStatus: ValidationStatus
}

class ArticlesViewedEditor extends React.Component<Props, State> {
  state: State = {
    validationStatus: {}
  };

  buildField = (fieldName: ArticleViewsFieldName, label: string, articlesViewedSettings: ArticlesViewedSettings, isRequired: boolean) => {
    const setting: number | null = articlesViewedSettings[fieldName];

    return (<EditableTextField
      text={ setting ? setting.toString() : ''}
      onSubmit={ (value: string) => {
        if (value === null || isNumber(value)) {
          this.props.onChange(
            {
              ...articlesViewedSettings || defaultArticlesViewedSettings,
              [fieldName]: value !== null ? Number(value) : null,
            }
          )
        }
      }}
      required={isRequired}
      label={label}
      helperText="Must be a number"
      editEnabled={this.props.editMode}
      validation={
        {
          getError: (value: string) => {
            if (isRequired && !value) {
              return 'This field is required'
            }
            else if (!isNumber(value)) {
              return 'Must be a number';
            }
            else return null;
          },
          onChange: onFieldValidationChange(this)(fieldName)
        }
      }
      isNumberField
    />)
  };

  onArticlesViewedEditorSwitchChange = (enabled: boolean) => {
    if (enabled) {
      this.props.onChange(defaultArticlesViewedSettings);
    } else {
      this.props.onChange(undefined);
    }
  }
  render(): React.ReactNode {
    const classes = this.props.classes;

    return (
      <>
        <FormControl
        className={classes.formControl}>
        <InputLabel
          className={classes.selectLabel}
          shrink
          htmlFor="ask-strategy">
          Article Count:
        </InputLabel>

        <RadioGroup
          className={classes.radio}
          value={this.props.articlesViewedSettings ? 'enable' : 'disable'}
          onChange={(event, showArticleCount) => this.onArticlesViewedEditorSwitchChange(showArticleCount === 'enable')}
        >
          <FormControlLabel
            value={'disable'}
            key={'disable'}
            control={<Radio />}
            label={'Do not show user\'s article count'}
            disabled={!this.props.editMode}
          />
          <FormControlLabel
            value={'enable'}
            key={'enable'}
            control={<Radio />}
            label={'Show user\'s article count...'}
            disabled={!this.props.editMode}
          />
        </RadioGroup>
      </FormControl>


        { this.props.articlesViewedSettings &&
          <div className={classes.articlesViewsContainer}>
            {this.buildField('minViews', 'Minimum number of articles viewed', this.props.articlesViewedSettings, false)}
            {this.buildField('maxViews', 'Maximum articles viewed', this.props.articlesViewedSettings, false)}
            {this.buildField('periodInWeeks', 'Time period in weeks', this.props.articlesViewedSettings, true)}
          </div>
        }
      </>

    )
  }
}

export default withStyles(styles)(ArticlesViewedEditor);
