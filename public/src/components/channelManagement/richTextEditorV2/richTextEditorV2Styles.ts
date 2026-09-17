import { alpha, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useRichTextEditorV2Styles = makeStyles(({ palette }: Theme) => ({
  prosekitCustom: {
    boxSizing: 'border-box',
    width: '100%',
    marginBottom: '2em',
    '& > .prosekit-theme .ProseMirror p': {
      marginBottom: '0.5em',
    },
    '& > .editor-disabled': {
      whiteSpace: 'pre-wrap',
    },
    '& > .editor-disabled p, & > .editor-disabled a': {
      opacity: 0.65,
    },
    '& > .prosekit-theme .ProseMirror': {
      minHeight: '80px',
    },
  },
  fieldLabel: {
    display: 'inline-block',
    fontSize: '85%',
    color: 'rgba(0 0 0 / 0.6)',
    margin: '0 1.5em',
  },
  buttonSpacer: {
    paddingLeft: '1em',
  },
  fieldLabelPrices: {
    display: 'inline-block',
    fontSize: '85%',
    color: 'rgba(0 0 0 / 0.6)',
    margin: '0 1.5em',
    paddingLeft: '10em',
  },
  menuContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& .button': {
      border: '1px solid rgba(0 0 0 / 0.23)',
      borderRadius: 4,
      backgroundColor: 'rgba(255 255 255 / 1)',
      color: 'rgba(0 0 0 / 0.87)',
      cursor: 'pointer',
      font: 'inherit',
      lineHeight: 1.5,
      padding: '0.375em 0.75em',
    },
    '& .button:hover': {
      color: palette.primary.contrastText,
      borderColor: palette.primary.main,
      backgroundColor: palette.primary.main,
    },
    '& .button:focus-visible': {
      outline: '2px solid rgba(25 118 210 / 0.5)',
      outlineOffset: 1,
    },
    '& .button-active': {
      color: palette.primary.contrastText,
      borderColor: palette.primary.main,
      backgroundColor: alpha(palette.primary.main, 0.9),
    },
  },
  dropdownMenu: {
    display: 'inline',
  },
  dropdownMenuToggle: {},
  dropdownMenuContent: {
    margin: '0.5em 0 0',
    padding: '0',
  },
  dropdownMenuContentHidden: {
    margin: '0',
    padding: '0',
    height: '0',
    overflowY: 'hidden',
  },
  dropdownMenuItem: {},
  linkPopover: {
    display: 'flex',
    gap: '0.25em',
    padding: '0.5em',
    backgroundColor: 'rgba(255 255 255 / 1)',
    border: '1px solid rgba(0 0 0 / 0.23)',
    borderRadius: 4,
    boxShadow: '0 2px 8px rgba(0 0 0 / 0.2)',
  },
  button: {
    border: '1px solid rgba(0 0 0 / 0.23)',
    borderRadius: 4,
    backgroundColor: 'rgba(255 255 255 / 1)',
    color: 'rgba(0 0 0 / 0.87)',
    cursor: 'pointer',
    font: 'inherit',
    lineHeight: 1.5,
    padding: '0.375em 0.75em',
    '&:hover': {
      color: palette.primary.contrastText,
      borderColor: palette.primary.main,
      backgroundColor: palette.primary.main,
    },
  },
  linkInput: {
    minWidth: 180,
    padding: '0.375em 0.5em',
    border: '1px solid rgba(0 0 0 / 0.23)',
    borderRadius: 4,
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
  editorWrapper: {
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
