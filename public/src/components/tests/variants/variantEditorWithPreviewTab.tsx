import React, { useState } from 'react';
import { Tabs, Tab, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingLeft: spacing(4),
    paddingRight: spacing(4),

    '& > * + *': { marginTop: spacing(2) },
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitContent: {
    width: 'calc(50% - 16px)',
  },
}));

interface VariantEditorProps {
  variantEditor: React.ReactElement;
  variantPreview?: React.ReactElement;
}

function VariantEditorWithPreviewTab({
  variantEditor,
  variantPreview,
}: VariantEditorProps): React.ReactElement<VariantEditorProps> {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <div className={classes.container}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Form" />
        {variantPreview && <Tab label="Preview" />}
      </Tabs>

      <div>
        {value === 0 && variantEditor}
        {value === 1 && variantPreview && variantPreview}
      </div>
    </div>
  );
}

export default VariantEditorWithPreviewTab;
