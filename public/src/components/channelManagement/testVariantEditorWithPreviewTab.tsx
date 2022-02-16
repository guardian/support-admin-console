import React, { useState } from 'react';
import { Tabs, Tab, Theme, makeStyles } from '@material-ui/core';
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

interface TestVariantEditorProps {
  variantEditor: React.ReactElement;
  variantPreview: React.ReactElement;
}

function TestVariantEditorWithPreviewTab({
  variantEditor,
  variantPreview,
}: TestVariantEditorProps): React.ReactElement<TestVariantEditorProps> {
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
        <Tab label="Preview" />
      </Tabs>

      <div>
        {value === 0 && variantEditor}
        {value === 1 && variantPreview}
      </div>
    </div>
  );
}

export default TestVariantEditorWithPreviewTab;
