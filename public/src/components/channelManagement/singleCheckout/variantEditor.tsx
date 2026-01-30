import React from 'react';
import { AmountsSection } from './AmountsSection';
import { SingleCheckoutVariant } from '../../../models/singleCheckout';
import { CopyEditor } from '../../shared/copyEditor';
import TickerEditor from '../tickerEditor';
import { TickerSettings } from '../helpers/shared';

interface VariantEditorProps {
  variant: SingleCheckoutVariant;
  onVariantChange: (update: (current: SingleCheckoutVariant) => SingleCheckoutVariant) => void;
  onDelete: () => void;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  onValidationChange,
}: VariantEditorProps) => {
  return (
    <div>
      <CopyEditor
        copy={{ heading: variant.heading, subheading: variant.subheading }}
        onChange={(updatedCopy) =>
          onVariantChange((current) => ({
            ...current,
            heading: updatedCopy.heading,
            subheading: updatedCopy.subheading,
          }))
        }
        onValidationChange={onValidationChange}
        editMode={editMode}
      />
      <AmountsSection variant={variant} onVariantChange={onVariantChange} editMode={editMode} />
      <TickerEditor
        tickerSettings={variant.tickerSettings}
        updateTickerSettings={(updatedTickerSettings?: TickerSettings): void => {
          onVariantChange((current) => ({ ...current, tickerSettings: updatedTickerSettings }));
        }}
        isDisabled={!editMode}
        onValidationChange={onValidationChange}
      />
    </div>
  );
};

export default VariantEditor;
