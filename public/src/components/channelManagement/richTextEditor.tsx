// import 'remirror/styles/all.css';

import React from 'react';
import { BoldExtension } from 'remirror/extensions';
import { EditorComponent, Remirror, useRemirror, useChainedCommands, useActive } from '@remirror/react';

import { createStyles, WithStyles, withStyles } from '@material-ui/core';

const styles = createStyles({
  container: {
    backgroundColor: 'beige',
  },
  menuButton: {
    backgroundColor: 'aliceblue',
  }
});

interface RichTextEditorProps extends WithStyles<typeof styles> {
  // draftTests: Test[];
  // onBatchTestDelete: (batchTestNames: string[]) => void;
  // onBatchTestArchive: (batchTestNames: string[]) => void;
}

interface RichTextMenuProps extends WithStyles<typeof styles> {
  // draftTests: Test[];
  // onBatchTestDelete: (batchTestNames: string[]) => void;
  // onBatchTestArchive: (batchTestNames: string[]) => void;
}




const RichTextMenu: React.FC<RichTextMenuProps> = ({
  classes,
}: RichTextMenuProps) => {
  const chain = useChainedCommands();
  const active = useActive();

  return (
    <button
      className={classes.menuButton}
      onClick={() => {
        chain
          .toggleBold()
          .focus()
          .run();
      }}
      style={{ fontWeight: active.bold() ? 'bold' : undefined }}
    >
      BoldMe
    </button>
  );
};


const RichTextEditor: React.FC<RichTextEditorProps> = ({
  classes,
  // draftTests,
  // onBatchTestDelete,
  // onBatchTestArchive,
}: RichTextEditorProps) => {
  const { manager, state } = useRemirror({
    extensions: () => [new BoldExtension()],
    content: '<p>I love <b>Remirror</b>. This is a test to see if Remirror loves me.</p>',
    selection: 'start',
    stringHandler: 'html',
  });

  return (
    <div className={classes.container}>
      <Remirror manager={manager} initialContent={state}>
        <RichTextMenu classes={classes} />
        <EditorComponent />
      </Remirror>
    </div>
  );
};

export default withStyles(styles)(RichTextEditor);
