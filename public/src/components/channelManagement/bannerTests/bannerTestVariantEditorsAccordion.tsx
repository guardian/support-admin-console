import React, { useState } from "react";
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from "@material-ui/core";
import { BannerVariant } from "./bannerTestsForm";
import BannerTestVariantEditor from "./bannerTestVariantEditor";
import TestEditorVariantSummary from "../testEditorVariantSummary";
import VariantDeleteButton from "../variantDeleteButton";
import useValidation from "../hooks/useValidation";

const styles = ({ spacing, palette }: Theme) =>
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
  });

interface BannerTestVariantEditorsAccordionProps
  extends WithStyles<typeof styles> {
  variants: BannerVariant[];
  onVariantsListChange: (variantList: BannerVariant[]) => void;
  testName: string;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const BannerTestVariantEditorsAccordion: React.FC<BannerTestVariantEditorsAccordionProps> = (
  props: BannerTestVariantEditorsAccordionProps
) => {
  const [expandedVariantKey, setExpandedVariantKey] = useState<
    string | undefined
  >(undefined);

  const setValidationStatusForField = useValidation(props.onValidationChange);

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

  const onExpansionPanelChange = (key: string) => (
    event: React.ChangeEvent<{}>
  ) => {
    expandedVariantKey === key
      ? setExpandedVariantKey(undefined)
      : setExpandedVariantKey(key);
  };

  const createVariantKey = (variantName: string): string => {
    return `${props.testName}${variantName}`;
  };

  const { classes } = props;

  return (
    <div className={classes.expansionPanelsContainer}>
      {props.variants.map((variant, index) => {
        const key = createVariantKey(variant.name);

        return (
          <ExpansionPanel
            key={index}
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
                  setValidationStatusForField(variant.name, true);
                }}
                onValidationChange={(isValid: boolean) =>
                  setValidationStatusForField(variant.name, isValid)
                }
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

export default withStyles(styles)(BannerTestVariantEditorsAccordion);
