import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import {
  DefaultProductSelection,
  Products,
  SupportLandingPageCopy,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';
import { CopyEditor } from '../../shared/copyEditor';
import CountdownEditor from '../countdownEditor';
import { CountdownSettings, TickerSettings } from '../helpers/shared';
import useValidation from '../hooks/useValidation';
import TickerEditor from '../tickerEditor';
import DefaultProductSelector from './defaultProductSelector';
import { ProductsEditor } from './productsEditor';
import URLGenerator from './urlGenerator';

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(10),

  '& > * + *': {
    marginTop: theme.spacing(3),
  },
}));

interface VariantEditorProps {
  variant: SupportLandingPageVariant;
  onVariantChange: (
    update: (current: SupportLandingPageVariant) => SupportLandingPageVariant,
  ) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
  testName: string;
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
  testName,
}: VariantEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  // Memoize callbacks to prevent infinite render loops in child components
  const onCopyChange = useCallback(
    (updatedCopy: SupportLandingPageCopy): void =>
      onVariantChange((current) => ({ ...current, copy: updatedCopy })),
    [onVariantChange],
  );

  const onDefaultProductSelectionChange = useCallback(
    (updatedDefaultProductSelection: DefaultProductSelection | undefined) =>
      onVariantChange((current) => ({
        ...current,
        defaultProductSelection: updatedDefaultProductSelection,
      })),
    [onVariantChange],
  );

  const onProductsChange = useCallback(
    (updatedProducts: Products) =>
      onVariantChange((current) => ({ ...current, products: updatedProducts })),
    [onVariantChange],
  );

  const updateTickerSettings = useCallback(
    (updatedTickerSettings?: TickerSettings): void => {
      onVariantChange((current) => ({ ...current, tickerSettings: updatedTickerSettings }));
    },
    [onVariantChange],
  );

  const updateCountdownSettings = useCallback(
    (updatedCountdownSettings?: CountdownSettings): void => {
      onVariantChange((current) => ({
        ...current,
        countdownSettings: updatedCountdownSettings,
      }));
    },
    [onVariantChange],
  );

  return (
    <Container>
      <div>
        <CopyEditor
          copy={variant.copy}
          onChange={onCopyChange}
          onValidationChange={(isValid) => setValidationStatusForField('copy', isValid)}
          editMode={editMode}
        />
      </div>
      <DefaultProductSelector
        defaultProductSelection={variant.defaultProductSelection}
        onDefaultProductSelectionChange={onDefaultProductSelectionChange}
        editMode={editMode}
      />
      <ProductsEditor
        products={variant.products}
        onProductsChange={onProductsChange}
        onValidationChange={(isValid) => setValidationStatusForField('products', isValid)}
        editMode={editMode}
      />
      <TickerEditor
        tickerSettings={variant.tickerSettings}
        updateTickerSettings={updateTickerSettings}
        isDisabled={!editMode}
        onValidationChange={(isValid) => setValidationStatusForField('ticker', isValid)}
      />
      <CountdownEditor
        countdownSettings={variant.countdownSettings}
        updateCountdownSettings={updateCountdownSettings}
        isDisabled={!editMode}
        onValidationChange={(isValid) => setValidationStatusForField('countdown', isValid)}
      />
      <div>
        <URLGenerator variant={variant} testName={testName} />
      </div>
    </Container>
  );
};

export default VariantEditor;
