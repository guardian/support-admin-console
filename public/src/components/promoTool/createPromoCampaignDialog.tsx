import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from '../channelManagement/helpers/validation';
import { Products } from './utils/promoModels';

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
  // campaignCode: String, // id? UUID? - allow them to create?  needs to be unique
  // product: PromoProduct, // drop down of the PromoProducts.
  // created: String // stringified today's date?
}

interface CreatePromoCampaignDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  createPromoCampaign: (data: FormData) => void;
}
const CreatePromoCampaignDialog: React.FC<CreatePromoCampaignDialogProps> = ({
  isOpen,
  close,
  existingNames,
  createPromoCampaign,
}: CreatePromoCampaignDialogProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    // TODO: make sure these reflect our campaign fields.
    name: '',
    // campaignCode: String,
    // product: PromoProduct,
    // created: String // stringified today's date?
    // description: '',
  };

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = (vals: FormData): void => {
    createPromoCampaign({
      name: vals.name.toUpperCase(),
      // description: vals.description,
    });
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
        <TextField
          className={classes.input}
          error={errors.name !== undefined}
          helperText={errors.name ? errors.name.message : ''}
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
        <Select
          labelId="promo-campaign-product-label"
          id="promo-campaign-product"
          label="Product"
          value="SupporterPlus"
          margin="dense"
          variant="outlined"
          fullWidth
          // onChange={handleChange}
        >
          {Products.map(c => (
            <MenuItem value={c.code} key={`product-${c.code}`}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Create Promo Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePromoCampaignDialog;

// TODO: carry on with this next
