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

const BannerTestVariantEditorsAccordion: React.FC<BannerTestVariantEditorsAccordionProps> = ({
  classes,
  variants,
  onVariantsListChange,
  testName,
  editMode,
  onValidationChange,
}: BannerTestVariantEditorsAccordionProps) => {
  const [expandedVariantKey, setExpandedVariantKey] = useState<
    string | undefined
  >(undefined);

  const setValidationStatusForField = useValidation(onValidationChange);

  const onVariantChange = (updatedVariant: BannerVariant): void => {
    const updatedVariantList: BannerVariant[] = variants.map((variant) =>
      variant.name === updatedVariant.name ? updatedVariant : variant
    );
    onVariantsListChange(updatedVariantList);
  };

  const onVariantDelete = (variantName: string): void => {
    const updatedVariantList = variants.filter(
      (variant) => variant.name !== variantName
    );
    onVariantsListChange(updatedVariantList);
  };

  const onExpansionPanelChange = (key: string) => (
    event: React.ChangeEvent<{}>
  ) => {
    expandedVariantKey === key
      ? setExpandedVariantKey(undefined)
      : setExpandedVariantKey(key);
  };

  const createVariantKey = (variantName: string): string => {
    return `${testName}${variantName}`;
  };

  return (
    <div className={classes.expansionPanelsContainer}>
      {variants.map((variant, index) => {
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
                editMode={editMode}
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
              <VariantDeleteButton
                isDisabled={!editMode}
                onConfirm={() => onVariantDelete(variant.name)}
              />
            </ExpansionPanelActions>
          </ExpansionPanel>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantEditorsAccordion);
