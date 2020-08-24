import React from "react";
import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { BannerVariant } from "./bannerTestsForm";
import BannerTestVariantEditorsAccordion from "./bannerTestVariantEditorsAccordion";
import BannerTestNewVariantButton from "./bannerTestNewVariantButton";
import { defaultCta } from "../helpers/shared";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      "& > * + *": {
        marginTop: spacing(1),
      },
    },
  });

interface BannerTestVariantsEditorProps extends WithStyles<typeof styles> {
  variants: BannerVariant[];
  onVariantsListChange: (variantList: BannerVariant[]) => void;
  testName: string;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const BannerTestVariantsEditor: React.FC<BannerTestVariantsEditorProps> = ({
  classes,
  variants,
  onVariantsListChange,
  testName,
  editMode,
  onValidationChange,
}: BannerTestVariantsEditorProps) => {
  const createVariant = (name: string) => {
    const newVariant: BannerVariant = {
      name: name,
      heading: undefined,
      body: "",
      highlightedText:
        "Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.",
      cta: defaultCta,
    };

    onVariantsListChange([...variants, newVariant]);
  };

  return (
    <div className={classes.container}>
      <BannerTestVariantEditorsAccordion
        variants={variants}
        onVariantsListChange={onVariantsListChange}
        testName={testName}
        editMode={editMode}
        onValidationChange={onValidationChange}
      />

      <BannerTestNewVariantButton
        existingNames={variants.map((variant) => variant.name)}
        createVariant={createVariant}
      />
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantsEditor);
