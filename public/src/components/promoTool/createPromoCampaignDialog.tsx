import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ProductSelector } from './productSelector';
import { PromoProduct } from './utils/promoModels';
import { useForm } from 'react-hook-form';
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from '../channelManagement/helpers/validation';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
}));

interface FormData {
  name: string;
}

const NAME_DEFAULT_HELPER_TEXT = 'Format: TBC'; // TODO: should there be formatting advice?

interface CreatePromoCampaignDialogProps {
  isOpen: boolean;
  close: () => void;
  createPromoCampaign: (name: string, product: PromoProduct) => void;
  existingNames: string[];
}
const CreatePromoCampaignDialog: React.FC<CreatePromoCampaignDialogProps> = ({
  isOpen,
  close,
  createPromoCampaign,
  existingNames,
}: CreatePromoCampaignDialogProps) => {
  const classes = useStyles();
  const [selectedProduct, setSelectedProduct] = useState<PromoProduct>('SupporterPlus');

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = ({ name }: FormData): void => {
    createPromoCampaign(name, selectedProduct as PromoProduct);
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-promo-campaign-dialog-title">
          Create a new promo campaign
        </DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <ProductSelector
          selectedValue={selectedProduct.toString()}
          handleSelectedValue={setSelectedProduct}
        />
        <TextField
          className={classes.input}
          error={errors.name !== undefined}
          helperText={errors.name ? errors.name.message : NAME_DEFAULT_HELPER_TEXT}
          {...register('name', {
            required: EMPTY_ERROR_HELPER_TEXT,
            pattern: {
              value: VALID_CHARACTERS_REGEX,
              message: INVALID_CHARACTERS_ERROR_HELPER_TEXT,
            },
            validate: createDuplicateValidator(existingNames),
          })}
          label="Promo Campaign name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSubmit(onSubmit)}>
          Create Promo Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePromoCampaignDialog;
