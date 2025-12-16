import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  SupportLandingPageCopy,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';
import { CopyEditor } from './copyEditor';
import { ProductsEditor } from './productsEditor';
import DefaultProductSelector from './defaultProductSelector';
import { CountdownSettings, TickerSettings } from '../helpers/shared';
import TickerEditor from '../tickerEditor';
import CountdownEditor from '../countdownEditor';
import URLGenerator from './urlGenerator';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(10),

    '& > * + *': {
      marginTop: spacing(3),
    },
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
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <CopyEditor
          copy={variant.copy}
          onChange={(updatedCopy: SupportLandingPageCopy): void =>
            onVariantChange(current => ({ ...current, copy: updatedCopy }))
          }
          onValidationChange={onValidationChange}
          editMode={editMode}
        />
      </div>
      <DefaultProductSelector
        defaultProductSelection={variant.defaultProductSelection}
        onDefaultProductSelectionChange={updatedDefaultProductSelection =>
          onVariantChange(current => ({
            ...current,
            defaultProductSelection: updatedDefaultProductSelection,
          }))
        }
        editMode={editMode}
      />
      <ProductsEditor
        products={variant.products}
        onProductsChange={updatedProducts =>
          onVariantChange(current => ({ ...current, products: updatedProducts }))
        }
        onValidationChange={onValidationChange}
        editMode={editMode}
      />
      <TickerEditor
        tickerSettings={variant.tickerSettings}
        updateTickerSettings={(updatedTickerSettings?: TickerSettings): void => {
          onVariantChange(current => ({ ...current, tickerSettings: updatedTickerSettings }));
        }}
        isDisabled={!editMode}
        onValidationChange={onValidationChange}
      />
      <CountdownEditor
        countdownSettings={variant.countdownSettings}
        updateCountdownSettings={(updatedCountdownSettings?: CountdownSettings): void => {
          onVariantChange(current => ({ ...current, countdownSettings: updatedCountdownSettings }));
        }}
        isDisabled={!editMode}
        onValidationChange={onValidationChange}
      />
      <div>
        <URLGenerator variant={variant} testName={testName} />
      </div>
    </div>
  );
};

export default VariantEditor;
