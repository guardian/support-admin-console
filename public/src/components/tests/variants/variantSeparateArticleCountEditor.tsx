import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { SeparateArticleCount } from '../../../models/epic';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

interface FormData {
  copy: string;
}

interface VariantSeparateArticleCountEditorProps {
  separateArticleCount?: SeparateArticleCount;
  updateSeparateArticleCount: (separateArticleCount?: SeparateArticleCount) => void;
  isDisabled: boolean;
}

const VariantSeparateArticleCountEditor: React.FC<VariantSeparateArticleCountEditorProps> = ({
  separateArticleCount,
  updateSeparateArticleCount,
  isDisabled,
}: VariantSeparateArticleCountEditorProps) => {
  const onChange = (): void => {
    updateSeparateArticleCount(Boolean(separateArticleCount) ? undefined : { type: 'above' });
  };

  const defaultValues: FormData = {
    copy: separateArticleCount?.copy ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange', defaultValues });

  const onSubmit = ({ copy }: FormData): void => {
    updateSeparateArticleCount(
      separateArticleCount
        ? { ...separateArticleCount, copy: copy === '' ? undefined : copy }
        : undefined,
    );
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(separateArticleCount)}
            onChange={onChange}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Above"
      />
      <TextField
        error={errors.copy !== undefined}
        helperText={errors.copy?.message}
        {...register('copy')}
        onBlur={handleSubmit(onSubmit)}
        label="Article count copy"
        margin="normal"
        variant="outlined"
        disabled={isDisabled || !Boolean(separateArticleCount)}
        fullWidth
      />
    </div>
  );
};

export default VariantSeparateArticleCountEditor;
