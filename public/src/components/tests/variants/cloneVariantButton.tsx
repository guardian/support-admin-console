import React from 'react';
import { Button } from '@mui/material';
import { Variant } from '../../channelManagement/helpers/shared';
import useOpenable from '../../../hooks/useOpenable';
import CreateVariantDialog from '../../channelManagement/createVariantDialog';

interface CloneVariantButtonProps<V extends Variant> {
  existingNames: string[];
  cloneVariant: (originalVariant: V, clonedVariantName: string) => void;
  currentVariant: V;
  isDisabled: boolean;
}

function CloneVariantButtonsEditor<V extends Variant>({
  existingNames,
  cloneVariant,
  currentVariant,
  isDisabled,
}: CloneVariantButtonProps<V>): React.ReactElement<CloneVariantButtonProps<V>> {
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

export default CloneVariantButtonsEditor;
