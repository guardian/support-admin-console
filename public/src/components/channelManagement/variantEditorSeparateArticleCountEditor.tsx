import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { SeparateArticleCount } from '../../models/epic';

interface VariantEditorSeparateArticleCountEditorProps {
  separateArticleCount?: SeparateArticleCount;
  updateSeparateArticleCount: (separateArticleCount?: SeparateArticleCount) => void;
  isDisabled: boolean;
}

const VariantEditorSeparateArticleCountEditor: React.FC<VariantEditorSeparateArticleCountEditorProps> = ({
  separateArticleCount,
  updateSeparateArticleCount,
  isDisabled,
}: VariantEditorSeparateArticleCountEditorProps) => {
  const onChange = (): void => {
    updateSeparateArticleCount(Boolean(separateArticleCount) ? undefined : { type: 'above' });
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
    </div>
  );
};

export default VariantEditorSeparateArticleCountEditor;
