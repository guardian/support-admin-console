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

function TestVariantEditor({
  variantEditor,
  variantPreview,
}: TestVariantEditorProps): React.ReactElement<TestVariantEditorProps> {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
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
        <Tab label="Split" />
      </Tabs>

      <div>
        {value === 0 && variantEditor}
        {value === 1 && variantPreview}
        {value === 2 && (
          <div className={classes.splitContainer}>
            <div className={classes.splitContent}>{variantEditor}</div>
            <div className={classes.splitContent}>{variantPreview}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestVariantEditor;
