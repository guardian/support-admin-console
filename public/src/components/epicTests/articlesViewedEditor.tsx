import React from 'react';
import {
  createStyles, FormControl,
  FormControlLabel,
  InputLabel,
  Switch,
  Theme, Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import {onFieldValidationChange, ValidationStatus} from "../helpers/validation";
import {ArticlesViewedSettings, EpicTest} from "./epicTestsForm";

const isNumber = (value: string): boolean => !Number.isNaN(Number(value));

export const defaultArticlesViewedSettings: ArticlesViewedSettings = {
  maxViews: null,
  minViews: null,
  periodInWeeks: null, //By initialising this to null we require the user to enter a value before the test can be valid
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
          <FormControlLabel
              control={
                <Switch
                  checked={!!this.props.articlesViewedSettings}
                  disabled={!this.props.editMode}
                  onChange={(event) => {
                    this.onArticlesViewedEditorSwitchChange(event.target.checked);
                  }}
                />
              }
              label={`Enable article count conditions`}
            />
        </FormControl>

        { this.props.articlesViewedSettings &&
          <div className={classes.articlesViewsContainer}>
            {this.buildField('minViews', 'Min articles viewed', this.props.articlesViewedSettings, false)}
            {this.buildField('maxViews', 'Max articles viewed', this.props.articlesViewedSettings, false)}
            {this.buildField('periodInWeeks', 'Time period in weeks', this.props.articlesViewedSettings, true)}
          </div>
        }
      </>
    )
  }
}

export default withStyles(styles)(ArticlesViewedEditor);
