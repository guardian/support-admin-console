import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import { Variant } from '../../channelManagement/helpers/shared';
import NewVariantButton from './newVariantButton';
import VariantEditorsAccordion from './variantEditorsAccordion';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
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
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(null);
  const previousTestNameRef = useRef<string | undefined>(testName);

  // unselect a variant if the test changes
  useEffect(() => {
    if (previousTestNameRef.current !== testName) {
      previousTestNameRef.current = testName;
      requestAnimationFrame(() => setSelectedVariantKey(null));
    }
  }, [testName]);

  const onVariantSelected = (variantKey: string): void =>
    setSelectedVariantKey(variantKey === selectedVariantKey ? null : variantKey);

  const variantKeys = variants.map((variant) => `${testName}-${variant.name}`);

  const variantNames = variants.map((variant) => variant.name);

  return (
    <Container>
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
    </Container>
  );
}

export default VariantsEditor;
