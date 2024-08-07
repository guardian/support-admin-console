import React, { useEffect, useState } from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Variant } from '../../channelManagement/helpers/shared';
import VariantEditorsAccordion from './variantEditorsAccordion';
import NewVariantButton from './newVariantButton';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface VariantsEditorProps<V extends Variant> {
  variants: V[];
  testName: string;
  editMode: boolean;
  createVariant: (name: string) => void;
  renderVariantEditor: (variant: V) => React.ReactElement;
  renderVariantSummary: (variant: V) => React.ReactElement;
  onVariantDelete: (variantName: string) => void;
  onVariantClone: (originalVariant: V, variantName: string) => void;
}

function VariantsEditor<V extends Variant>({
  variants,
  testName,
  editMode,
  createVariant,
  renderVariantEditor,
  renderVariantSummary,
  onVariantDelete,
  onVariantClone,
}: VariantsEditorProps<V>): React.ReactElement<VariantsEditorProps<V>> {
  const classes = useStyles();
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(null);

  // unselect a variant if the test changes
  useEffect(() => {
    setSelectedVariantKey(null);
  }, [testName]);

  const onVariantSelected = (variantKey: string): void =>
    setSelectedVariantKey(variantKey === selectedVariantKey ? null : variantKey);

  const variantKeys = variants.map(variant => `${testName}-${variant.name}`);

  const variantNames = variants.map(variant => variant.name);

  return (
    <div className={classes.container}>
      <VariantEditorsAccordion<V>
        variants={variants}
        variantKeys={variantKeys}
        existingNames={variantNames}
        editMode={editMode}
        selectedVariantKey={selectedVariantKey}
        onVariantSelected={onVariantSelected}
        renderVariantEditor={renderVariantEditor}
        renderVariantSummary={renderVariantSummary}
        onVariantDelete={onVariantDelete}
        onVariantClone={onVariantClone}
      />

      <NewVariantButton
        existingNames={variantNames}
        createVariant={createVariant}
        isDisabled={!editMode}
      />
    </div>
  );
}

export default VariantsEditor;
