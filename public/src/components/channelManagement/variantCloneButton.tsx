import React from 'react';
import { Button } from '@material-ui/core';
import { Variant } from './helpers/shared';
import useOpenable from '../../hooks/useOpenable';
import CreateVariantDialog from './createVariantDialog';

interface VariantEditorButtonsEditorProps<V extends Variant> {
  existingNames: string[];
  cloneVariant: (originalVariant: V, clonedVariantName: string) => void;
  currentVariant: V;
  isDisabled: boolean;
}

function VariantEditorButtonsEditor<V extends Variant>({
  existingNames,
  cloneVariant,
  currentVariant,
  isDisabled,
}: VariantEditorButtonsEditorProps<V>): React.ReactElement<VariantEditorButtonsEditorProps<V>> {
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button variant="outlined" onClick={open} disabled={isDisabled}>
        Clone variant
      </Button>
      <CreateVariantDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createVariant={(name: string) => cloneVariant(currentVariant, name)}
        mode={'COPY'}
      />
    </>
  );
}

export default VariantEditorButtonsEditor;
