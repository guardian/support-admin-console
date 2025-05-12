import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  SupportLandingPageCopy,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';
import { CopyEditor } from './copyEditor';
import { ProductsEditor } from './productsEditor';
import { CountDownSettings, TickerSettings } from '../helpers/shared';
import TickerEditor from '../tickerEditor';
import CountDownEditor from '../countDownEditor';

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
  onVariantChange: (updatedVariant: SupportLandingPageVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
}: VariantEditorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <CopyEditor
          copy={variant.copy}
          onChange={(updatedCopy: SupportLandingPageCopy): void =>
            onVariantChange({ ...variant, copy: updatedCopy })
          }
          onValidationChange={onValidationChange}
          editMode={editMode}
        />
      </div>
      <ProductsEditor
        products={variant.products}
        onProductsChange={updatedProducts =>
          onVariantChange({ ...variant, products: updatedProducts })
        }
        onValidationChange={onValidationChange}
        editMode={editMode}
      />
      <TickerEditor
        tickerSettings={variant.tickerSettings}
        updateTickerSettings={(updatedTickerSettings?: TickerSettings): void => {
          onVariantChange({ ...variant, tickerSettings: updatedTickerSettings });
        }}
        isDisabled={!editMode}
        onValidationChange={onValidationChange}
      />
      <CountDownEditor
        countDownSettings={variant.countDownSettings}
        updateCountDownSettings={(updatedCountDownSettings?: CountDownSettings): void => {
          onVariantChange({ ...variant, countDownSettings: updatedCountDownSettings });
        }}
        isDisabled={!editMode}
        onValidationChange={onValidationChange}
      />
    </div>
  );
};

export default VariantEditor;
