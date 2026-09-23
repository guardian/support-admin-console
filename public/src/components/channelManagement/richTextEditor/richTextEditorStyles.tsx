import { alpha, styled, Theme } from '@mui/material/styles';

export const FieldLabel = styled('span')({
  display: 'inline-block',
  fontSize: '85%',
  color: 'rgba(0 0 0 / 0.6)',
  margin: '0 1.5em',
});
export const FieldLabelPrices = styled('div')({
  display: 'inline-block',
  fontSize: '85%',
  color: 'rgba(0 0 0 / 0.6)',
  margin: '0 1.5em',
  paddingLeft: '10em',
});
export const HelperText = styled('p')({
  fontSize: '85%',
  color: 'rgba(0 0 0 / 0.6)',
  margin: '0.5em 0 0 1.5em',
});
export const ErrorText = styled('p')({
  color: 'rgba(0 0 0 / 1)',
  backgroundColor: 'rgba(255 255 0 / 1)',
  margin: '0.5em 0 0 1.5em',
});
export const ButtonSpacer = styled('span')({
  paddingLeft: '1em',
});
export const MenuContainer = styled('div')(({ theme }) => ({
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
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
  },
  '& .button:focus-visible': {
    outline: '2px solid rgba(25 118 210 / 0.5)',
    outlineOffset: 1,
  },
  '& .button-active': {
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.9),
  },
}));
export const DropdownMenu = styled('div')({ display: 'inline' });
export const DropdownMenuToggle = styled('button')({});
export const DropdownMenuContent = styled('menu')({
  display: 'inline',
});
export const DropdownMenuContentHidden = styled('menu')({
  margin: '0',
  padding: '0',
  height: '0',
  overflowY: 'hidden',
});
export const LinkPopover = styled('div')({
  display: 'flex',
  gap: '0.25em',
  padding: '0.5em',
  backgroundColor: 'rgba(255 255 255 / 1)',
  border: '1px solid rgba(0 0 0 / 0.23)',
  borderRadius: 4,
  boxShadow: '0 2px 8px rgba(0 0 0 / 0.2)',
});
export const buttonSx = (theme: Theme) => ({
  border: '1px solid rgba(0 0 0 / 0.23)',
  borderRadius: 4,
  backgroundColor: 'rgba(255 255 255 / 1)',
  color: 'rgba(0 0 0 / 0.87)',
  cursor: 'pointer',
  font: 'inherit',
  lineHeight: 1.5,
  padding: '0.375em 0.75em',
  '&:hover': {
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
  },
});
export const Button = styled('button')(({ theme }) => ({
  ...buttonSx(theme),
}));
export const LinkInput = styled('input')({
  minWidth: 180,
  padding: '0.375em 0.5em',
  border: '1px solid rgba(0 0 0 / 0.23)',
  borderRadius: 4,
});
export const ProsekitCustom = styled('div')({
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
});
export const EditorWrapper = styled('div')({
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
});
