import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TickerCountType, TickerEndType, TickerName, TickerSettings } from './helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  fieldsContainer: {
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface FormData {}

interface LandingPageTierEditorProps {}

const LandingPageTierEditor: React.FC<LandingPageTierEditorProps> = ({}: LandingPageTierEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {};

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
  }, []);

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
  };

  const onSubmit = ({}: FormData): void => {};

  return <div className={classes.container}></div>;
};

export default LandingPageTierEditor;
