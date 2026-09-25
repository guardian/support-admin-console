import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useForm } from 'react-hook-form';
import useOpenable from '../../../hooks/useOpenable';
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from '../helpers/validation';

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'start',
  border: `1px dashed ${theme.palette.grey[700]}`,
  borderRadius: '4px',
  padding: '12px 16px',
}));

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& > * + *': {
    marginLeft: theme.spacing(1),
  },
}));

const Text = styled(Typography)({
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 1,
  textTransform: 'uppercase',
});

const DialogHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: '8px',
});

const StyledTextField = styled(TextField)({
  '& input': {
    textTransform: 'uppercase !important',
  },
});

const NAME_DEFAULT_HELPER_TEXT = "Format: 'control' or 'v1_name'";

interface FormData {
  name: string;
}

interface BannerTestNewVariantButtonProps {
  existingNames: string[];
  createVariant: (name: string) => void;
  isDisabled: boolean;
}

const NewVariantButton: React.FC<BannerTestNewVariantButtonProps> = ({
  existingNames,
  createVariant,
  isDisabled,
}: BannerTestNewVariantButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = ({ name }: FormData): void => {
    close();
    createVariant(name.toUpperCase());
  };

  return (
    <>
      <StyledButton onClick={open} disabled={isDisabled}>
        <Container>
          <AddIcon />
          <Text>New variant</Text>
        </Container>
      </StyledButton>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="new-variant-dialog-title"
        aria-describedby="new-variant-dialog-description"
        fullWidth
      >
        <DialogHeader>
          <DialogTitle id="new-variant-dialog-title">Create a new variant</DialogTitle>
          <IconButton onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        <DialogContent dividers>
          <StyledTextField
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
            label="Variant name"
            margin="normal"
            variant="outlined"
            autoFocus
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
            color="primary"
          >
            Create variant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewVariantButton;
