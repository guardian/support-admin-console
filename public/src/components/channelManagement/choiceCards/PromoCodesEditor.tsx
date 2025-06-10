import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { TextField, Theme } from '@mui/material';
import { parsePromoInput } from '../../../utils/parsePromoInput';

interface PromoCodesEditorProps {
  promoCodes: string[];
  updatePromoCodes: (promoCodes: string[]) => void;
  isDisabled: boolean;
  maxPromoCodes?: number;
}

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  fieldContainer: {
    marginBottom: spacing(1),
  },
  helperText: {
    marginTop: spacing(1),
  },
}));

const PromoCodesEditor: React.FC<PromoCodesEditorProps> = ({
  promoCodes,
  updatePromoCodes,
  isDisabled,
}) => {
  const classes = useStyles();
  const [promoCodesString, setPromoCodesString] = useState<string>(promoCodes.join(', '));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPromoCodesString(inputValue);
    updatePromoCodes(parsePromoInput(inputValue));
  };

  return (
    <div className={classes.container}>
      <div className={classes.fieldContainer}>
        <TextField
          label="Promo Codes (comma separated)"
          fullWidth
          value={promoCodesString}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="e.g. PROMO1, PROMO2, PROMO3"
        />
      </div>
    </div>
  );
};

export default PromoCodesEditor;
