import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  createStyles,
  withStyles,
  WithStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { notNumberValidator } from './helpers/validation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    text: {
      marginLeft: spacing(1),
      fontSize: 14,
    },
  });

interface FormData {
  minArticles: string;
}

interface TestEditorMinArticlesViewedInputProps extends WithStyles<typeof styles> {
  minArticles: number;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
  onUpdate: (updatedMinArticles: number) => void;
}

const TestEditorMinArticlesViewedInput: React.FC<TestEditorMinArticlesViewedInputProps> = ({
  classes,
  minArticles,
  isDisabled,
  onValidationChange,
  onUpdate,
}: TestEditorMinArticlesViewedInputProps) => {
  const defaultValues: FormData = {
    minArticles: minArticles.toString(),
  };

  const { register, errors, handleSubmit, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues.minArticles]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.minArticles]);

  const onSubmit = ({ minArticles }: FormData): void => {
    onUpdate(parseInt(minArticles));
  };

  return (
    <div className={classes.container}>
      <TextField
        inputRef={register({ validate: notNumberValidator })}
        error={errors.minArticles !== undefined}
        helperText={errors.minArticles?.message}
        onBlur={handleSubmit(onSubmit)}
        name="minArticles"
        label="Show the banner on"
        InputLabelProps={{ shrink: true }}
        variant="filled"
        disabled={isDisabled}
      />
      <Typography className={classes.text}>page views</Typography>
    </div>
  );
};

export default withStyles(styles)(TestEditorMinArticlesViewedInput);
