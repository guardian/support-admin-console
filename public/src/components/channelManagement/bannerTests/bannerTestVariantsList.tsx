import React, { useState } from "react";
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from "@material-ui/core";
import {
  onFieldValidationChange,
  ValidationStatus,
} from "../helpers/validation";
import { BannerVariant } from "./bannerTestsForm";
import BannerTestVariantEditor from "./bannerTestVariantEditor";
import NewNameCreator from "../newNameCreator";
import { defaultCta } from "../helpers/shared";
import TestEditorVariantSummary from "../testEditorVariantSummary";
import VariantDeleteButton from "../variantDeleteButton";

const styles = ({ typography, spacing, palette }: Theme) =>
  createStyles({
    expansionPanelsContainer: {
      "& > * + *": {
        marginTop: spacing(1),
      },
    },
    expansionPanel: {
      border: `1px solid ${palette.grey[700]}`,
      borderRadius: 4,
      boxShadow: "none",
    },
    h4: {
      fontSize: typography.pxToRem(20),
      fontWeight: typography.fontWeightMedium,
    },
    error: {
      border: "2px solid red",
    },
    heading: {
      fontSize: typography.pxToRem(14),
      fontWeight: "normal",
      fontStyle: "italic",
    },
    newVariantButton: {
      marginTop: spacing(2),
    },
  });

interface BannerTestVariantsListProps extends WithStyles<typeof styles> {
  variants: BannerVariant[];
  onVariantsListChange: (variantList: BannerVariant[]) => void;
  testName: string;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const BannerTestVariantsList: React.FC<BannerTestVariantsListProps> = (
  props: BannerTestVariantsListProps
) => {
  const [expandedVariantKey, setExpandedVariantKey] = useState(-1);

  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(
    {}
  );

  const onVariantSelected = (key: number): void => {
    setExpandedVariantKey(key);
  };

  const onVariantChange = (updatedVariant: BannerVariant): void => {
    const updatedVariantList: BannerVariant[] = props.variants.map((variant) =>
      variant.name === updatedVariant.name ? updatedVariant : variant
    );
    props.onVariantsListChange(updatedVariantList);
  };

  const onVariantDelete = (variantName: string): void => {
    const updatedVariantList = props.variants.filter(
      (variant) => variant.name !== variantName
    );
    props.onVariantsListChange(updatedVariantList);
  };

  // const onVariantNameCreation = (name: string) => {
  //   createVariant(name, "");
  // };

  const onExpansionPanelChange = (key: number) => (
    event: React.ChangeEvent<{}>
  ) => {
    expandedVariantKey === key
      ? setExpandedVariantKey(-1)
      : setExpandedVariantKey(key);
  };

  const createVariantKey = (variantName: string): string => {
    return `${props.testName}${variantName}`;
  };

  const createVariant = (newVariantName: string, nickname: string) => {
    const newVariant: BannerVariant = {
      name: newVariantName,
      heading: undefined,
      body: "",
      highlightedText:
        "Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.",
      cta: defaultCta,
    };

    props.onVariantsListChange([...props.variants, newVariant]);

    // const key = createVariantKey(newVariant.name);

    // onVariantSelected(key);
  };

  // renderNewVariantButton = (): React.ReactNode => {
  //   const { classes } = this.props;
  //   return this.props.editMode ? (
  //     <div className={classes.newVariantButton}>
  //       <NewNameCreator
  //         type="variant"
  //         action="New"
  //         existingNames={this.props.variants.map((variant) => variant.name)}
  //         existingNicknames={[]}
  //         onValidName={this.createVariant}
  //         editEnabled={this.props.editMode}
  //       />
  //     </div>
  //   ) : null;
  // };

  const { classes } = props;

  return (
    <div className={classes.expansionPanelsContainer}>
      {props.variants.map((variant, index) => {
        // const key = createVariantKey(variant.name);
        const key = index;

        return (
          <ExpansionPanel
            key={key}
            expanded={expandedVariantKey === key}
            onChange={onExpansionPanelChange(key)}
            className={classes.expansionPanel}
          >
            <TestEditorVariantSummary name={variant.name} />
            <ExpansionPanelDetails>
              <BannerTestVariantEditor
                variant={variant}
                onVariantChange={onVariantChange}
                editMode={props.editMode}
                onDelete={() => {
                  onVariantDelete(variant.name);
                  // onFieldValidationChange(this)(variant.name)(true);
                }}
                // onValidationChange={onFieldValidationChange(this)(
                //   variant.name
                // )}
                onValidationChange={(b: boolean) => null}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <VariantDeleteButton isDisabled={!props.editMode} />
            </ExpansionPanelActions>
          </ExpansionPanel>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantsList);
