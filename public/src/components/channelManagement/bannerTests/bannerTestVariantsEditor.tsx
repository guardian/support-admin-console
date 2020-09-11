import React, { useEffect, useState } from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import { BannerTemplate, BannerVariant } from './bannerTestsForm';
import BannerTestVariantEditorsAccordion from './bannerTestVariantEditorsAccordion';
import BannerTestNewVariantButton from './bannerTestNewVariantButton';
import { defaultCta } from '../helpers/shared';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      '& > * + *': {
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
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(null);

  // unselect a variant if the test changes
  useEffect(() => {
    setSelectedVariantKey(null);
  }, [testName]);

  const onVariantSelected = (variantKey: string): void =>
    setSelectedVariantKey(variantKey === selectedVariantKey ? null : variantKey);

  const createVariant = (name: string): void => {
    const newVariant: BannerVariant = {
      name: name,
      template: BannerTemplate.ContributionsBanner,
      heading: undefined,
      body: '',
      highlightedText:
        'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.',
      cta: defaultCta,
    };

    onVariantsListChange([...variants, newVariant]);
    onVariantSelected(`${testName}-${name}`);
  };

  const variantKeys = variants.map(variant => `${testName}-${variant.name}`);

  return (
    <div className={classes.container}>
      <BannerTestVariantEditorsAccordion
        variants={variants}
        variantKeys={variantKeys}
        onVariantsListChange={onVariantsListChange}
        testName={testName}
        editMode={editMode}
        onValidationChange={onValidationChange}
        selectedVariantKey={selectedVariantKey}
        onVariantSelected={onVariantSelected}
      />

      <BannerTestNewVariantButton
        existingNames={variants.map(variant => variant.name)}
        createVariant={createVariant}
        isDisabled={!editMode}
      />
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantsEditor);
