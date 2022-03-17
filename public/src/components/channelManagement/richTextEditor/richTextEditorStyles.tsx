import { makeStyles } from '@material-ui/core';

export const useRTEStyles = makeStyles(() => ({
  fieldLabel: {
    display: 'inline-block',
    fontSize: '85%',
    color: 'rgba(0 0 0 / 0.6)',
    margin: '0 1.5em',
  },
  helperText: {
    fontSize: '85%',
    color: 'rgba(0 0 0 / 0.6)',
    margin: '0.5em 0 0 1.5em',
  },
  errorText: {
    color: 'rgba(0 0 0 / 1)',
    backgroundColor: 'rgba(255 255 0 / 1)',
    margin: '0.5em 0 0 1.5em',
  },
  remirrorButtonSpacer: {
    paddingLeft: '1em',
  },

  // extra css to style remirror components in RRCP:
  remirrorCustom: {
    marginBottom: '2em',
    '& > .remirror-theme .ProseMirror p': {
      marginBottom: '0.5em',
    },
    '& > .editor-disabled': {
      whiteSpace: 'pre-wrap',
    },
    '& > .editor-disabled p, & > .editor-disabled a': {
      opacity: 0.65,
    },
    '& > .remirror-theme .remirror-editor-wrapper': {
      paddingTop: 0,
    },
    '& > .remirror-theme .ProseMirror': {
      minHeight: '80px',
    },
  },
}));
