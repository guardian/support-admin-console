import React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {onFieldValidationChange, ValidationStatus} from './helpers/validation';
import NewNameCreator from "./newNameCreator";
import {Variant} from "./helpers/shared";

const styles = ({ typography, spacing }: Theme) => createStyles({
  h4: {
    fontSize: typography.pxToRem(20),
    fontWeight: typography.fontWeightMedium,
  },
  error: {
    border: "2px solid red"
  },
  heading: {
    fontSize: typography.pxToRem(14),
    fontWeight: 'normal',
    fontStyle: 'italic'
  },
  newVariantButton: {
    marginTop: spacing(2)
  }
});

// The inner component's props must extend this type
export interface InnerComponentProps<V extends Variant> {
  variant?: V,
  onVariantChange: (updatedVariant: V) => void,
  editMode: boolean,
  onDelete: () => void,
  onValidationChange: (isValid: boolean) => void
}

interface TestVariantsListProps<V extends Variant> {
  variants: V[],
  onVariantsListChange: (variantList: V[]) => void,
  testName: string,
  editMode: boolean,
  onValidationChange: (isValid: boolean) => void,
  createDefaultVariant: (variantName: string) => V
}

type TestVariantsListState = {
  expandedVariantKey?: string,
  validationStatus: ValidationStatus
}

// TODO - this breaks when it renders InnerComponent with:
// Uncaught Invariant Violation: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
const TestVariantsList = <V extends Variant>(
  InnerComponent: React.ComponentType<InnerComponentProps<V>>,
) => class extends React.Component<TestVariantsListProps<V> & WithStyles<typeof styles>, TestVariantsListState> {

  state: TestVariantsListState = {
    expandedVariantKey: undefined,
    validationStatus: {}
  };

  onVariantSelected = (key: string): void => {
    this.setState({
      expandedVariantKey: key
    })
  };

  onVariantChange = (updatedVariant: V): void => {
    const updatedVariantList: V[] = this.props.variants.map(variant => variant.name === updatedVariant.name ? updatedVariant : variant);
    this.props.onVariantsListChange(updatedVariantList);
  };

  onVariantDelete = (variantName: string): void => {
    const updatedVariantList = this.props.variants.filter(variant => variant.name !== variantName);
    this.props.onVariantsListChange(updatedVariantList);
  };

  onVariantNameCreation = (name: string) => {
    this.createVariant(name, "");
  };

  onExpansionPanelChange = (key: string) => (event: React.ChangeEvent<{}>) => {
    this.state.expandedVariantKey === key ? this.setState({
        expandedVariantKey: undefined
      })
      :
      this.setState({
        expandedVariantKey: key
      })
  };

  createVariantKey = (variantName: string): string => {
    return `${this.props.testName}${variantName}`
  };

  createVariant = (newVariantName: string, nickname: string) => {
    const newVariant = this.props.createDefaultVariant(newVariantName);

    this.props.onVariantsListChange([...this.props.variants, newVariant]);

    const key = this.createVariantKey(newVariant.name);

    this.onVariantSelected(key);
  };

  renderNoVariantMessage = (): React.ReactNode => {
    return this.props.editMode ? <Typography variant={'subtitle1'} color={'textPrimary'}>Create the first variant for this test (each test must have at least one variant)<sup>*</sup></Typography> : <Typography>No variants yet.</Typography>
  };

  renderNewVariantButton = (): React.ReactNode => {
    const {classes} = this.props;
    return this.props.editMode ? (
      <div className={classes.newVariantButton}>
        <NewNameCreator
          type="variant"
          action="New"
          existingNames={this.props.variants.map(variant => variant.name)}
          existingNicknames={[]}
          onValidName={this.createVariant}
          editEnabled={this.props.editMode}
        />
      </div>
    ) : null;
  };

  renderVariantsList = (): React.ReactNode => {
    const { classes } = this.props;

    return (
      <>
        {this.props.variants.map(variant => {
          const key = this.createVariantKey(variant.name);

          return (
            <ExpansionPanel
              key={key}
              expanded={this.state.expandedVariantKey === key}
              onChange={this.onExpansionPanelChange(key)}
              className={
                this.state.validationStatus[variant.name] === false ? classes.error : ''
              }
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="variant-control"
                id="variant-header"
              >
                <Typography variant={'h4'} className={classes.h4}>
                  {variant.name} {variant.heading && <span className={classes.heading}>- "{variant.heading}"</span>}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <InnerComponent
                  variant={variant}
                  onVariantChange={this.onVariantChange}
                  editMode={this.props.editMode}
                  onDelete={() => {
                    this.onVariantDelete(variant.name);
                    onFieldValidationChange(this)(variant.name)(true)
                  }}
                  onValidationChange={onFieldValidationChange(this)(variant.name)}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </>
    );
  };

  render(): React.ReactNode {
    return(
      <>
        {this.props.variants.length > 0 && this.renderVariantsList()}

        {this.props.variants.length < 1 && this.renderNoVariantMessage()}

        {this.renderNewVariantButton()}
      </>
    )
  };
};

// Hack to work around material UI breaking type checking when class has type parameters - https://stackoverflow.com/q/52567697
const WrappedTestVariantsList =
  <V extends Variant>(InnerComponent: React.ComponentType<InnerComponentProps<V>>) =>
  <V extends Variant>(props: TestVariantsListProps<V>): React.ReactElement<TestVariantsListProps<V>> => {
  const wrapper = withStyles(styles)(
    TestVariantsList(InnerComponent)
  ) as any;

  return React.createElement(wrapper, props);
};

export default WrappedTestVariantsList;
