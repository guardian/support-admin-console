import { makeStyles } from '@mui/styles';

export const useRichTextEditorV2Styles = makeStyles(() => ({
  remirrorCustom: {
    boxSizing: 'border-box',
    width: '100%',
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
  remirrorEditorWrapper: {
    boxSizing: 'border-box',
    minHeight: 80,
    width: '100%',
    padding: 16,
    overflowY: 'auto',
    borderRadius: 4,
    boxShadow: '0 0 0 1.6px rgba(0 0 0 / 0.25)',
    color: 'rgba(0 0 0 / 0.87)',
    fontSize: 16,
    lineHeight: '24px',
    outline: 'none',
    '& p': {
      margin: '0 0 8px',
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
}));
