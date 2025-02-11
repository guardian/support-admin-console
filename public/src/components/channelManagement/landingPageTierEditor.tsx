import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

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

  const { reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, []);

  return <div className={classes.container}></div>;
};

export default LandingPageTierEditor;
