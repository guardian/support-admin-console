import React from 'react';
import { EpicVariant } from './epicTestsForm';
import { Cta } from '../helpers/shared';
import { Theme, Typography, makeStyles, TextField } from '@material-ui/core';
import VariantEditorButtonsEditor from '../variantEditorButtonsEditor';
import TickerEditor from '../tickerEditor';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(10),

    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  sectionHeader: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  sectionContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(2),
    borderBottom: `1px solid ${palette.grey[500]}`,
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = 'Maximum 500 characters';
const HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT = 'Final sentence of body copy';
const IMAGE_URL_DEFAULT_HELPER_TEXT =
  'Image ratio should be 2.5:1. This will appear above everything except a ticker';
const FOOTER_DEFAULT_HELPER_TEXT = 'Bold text that appears below the button';

interface EpicTestVariantEditorProps {
  variant: EpicVariant;
  onVariantChange: (updatedVariant: EpicVariant) => void;
  editMode: boolean;
  isLiveblog: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const EpicTestVariantEditor: React.FC<EpicTestVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  isLiveblog,
  onValidationChange,
}: EpicTestVariantEditorProps) => {
  const classes = useStyles();

  const updateVariant = (update: (variant: EpicVariant) => EpicVariant): void => {
    if (variant) {
      onVariantChange(update(variant));
    }
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, secondaryCta: updatedCta });
  };

  return (
    <div className={classes.container}>
      {!isLiveblog && (
        <TextField
          helperText={HEADER_DEFAULT_HELPER_TEXT}
          name="heading"
          label="Header"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      )}

      <TextField
        helperText={BODY_DEFAULT_HELPER_TEXT}
        name="body"
        label="Body copy"
        margin="normal"
        variant="outlined"
        multiline
        rows={10}
        disabled={!editMode}
        fullWidth
      />

      {!isLiveblog && (
        <TextField
          helperText={HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT}
          name="highlightedText"
          label="Hightlighted text"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      )}

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Buttons
        </Typography>

        <VariantEditorButtonsEditor
          primaryCta={variant.cta}
          secondaryCta={variant.secondaryCta}
          updatePrimaryCta={updatePrimaryCta}
          updateSecondaryCta={updateSecondaryCta}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
        />
      </div>

      {!isLiveblog && (
        <div>
          <TickerEditor
            editMode={editMode}
            tickerSettings={variant.tickerSettings}
            onChange={(tickerSettings): void =>
              updateVariant(variant => ({ ...variant, tickerSettings }))
            }
            onValidationChange={isValid => console.log(isValid)}
          />
        </div>
      )}
      {!isLiveblog && (
        <TextField
          helperText={IMAGE_URL_DEFAULT_HELPER_TEXT}
          name="imageUrl"
          label="Image URL"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      )}
      {!isLiveblog && (
        <TextField
          helperText={FOOTER_DEFAULT_HELPER_TEXT}
          name="footer"
          label="Footer"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      )}
    </div>
  );
};

export default EpicTestVariantEditor;
