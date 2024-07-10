import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { SeparateArticleCount } from '../../../../../models/epic';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

interface FormData {
  copy: string;
}

interface VariantEditorSeparateArticleCountEditorProps {
  separateArticleCount?: SeparateArticleCount;
  updateSeparateArticleCount: (separateArticleCount?: SeparateArticleCount) => void;
  isDisabled: boolean;
}

const SeparateArticleCountEditor: React.FC<VariantEditorSeparateArticleCountEditorProps> = ({
  separateArticleCount,
  updateSeparateArticleCount,
  isDisabled,
}: VariantEditorSeparateArticleCountEditorProps) => {
  const onChange = (): void => {
    updateSeparateArticleCount(Boolean(separateArticleCount) ? undefined : { type: 'above' });
  };

  const defaultValues: FormData = {
    copy: separateArticleCount?.copy ?? '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onChange', defaultValues });

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
        inputRef={register()}
        error={errors.copy !== undefined}
        helperText={errors.copy?.message}
        onBlur={handleSubmit(onSubmit)}
        name="copy"
        label="Article count copy"
        margin="normal"
        variant="outlined"
        disabled={isDisabled || !Boolean(separateArticleCount)}
        fullWidth
      />
    </div>
  );
};

export default SeparateArticleCountEditor;
