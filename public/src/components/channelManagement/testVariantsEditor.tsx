import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { Variant } from './helpers/shared';
import TestNewVariantButton from './testNewVariantButton';
import TestVariantEditorsAccordion from './testVariantEditorsAccordion';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface TestVariantsEditorProps<V extends Variant> {
  variants: V[];
  testName: string;
  editMode: boolean;
  createVariant: (name: string) => void;
  renderVariantEditor: (variant: V) => React.ReactElement;
  onVariantDelete: (variantName: string) => void;
}

function TestVariantsEditor<V extends Variant>({
  variants,
  testName,
  editMode,
  createVariant,
  renderVariantEditor,
  onVariantDelete,
}: TestVariantsEditorProps<V>): React.ReactElement<TestVariantsEditorProps<V>> {
  const classes = useStyles();
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(null);

  // unselect a variant if the test changes
  useEffect(() => {
    setSelectedVariantKey(null);
  }, [testName]);

  const onVariantSelected = (variantKey: string): void =>
    setSelectedVariantKey(variantKey === selectedVariantKey ? null : variantKey);

  const variantKeys = variants.map(variant => `${testName}-${variant.name}`);

  return (
    <div className={classes.container}>
      <TestVariantEditorsAccordion<V>
        variants={variants}
        variantKeys={variantKeys}
        testName={testName}
        editMode={editMode}
        selectedVariantKey={selectedVariantKey}
        onVariantSelected={onVariantSelected}
        renderVariantEditor={renderVariantEditor}
        onVariantDelete={onVariantDelete}
      />

      <TestNewVariantButton
        existingNames={variants.map(variant => variant.name)}
        createVariant={createVariant}
        isDisabled={!editMode}
      />
    </div>
  );
}

export default TestVariantsEditor;
