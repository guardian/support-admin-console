import {ThreeTierChoiceCardTiers, ThreeTierDescription} from "../../models/threeTierChoiceCards";
import {makeStyles} from "@mui/styles";
import {Accordion, AccordionDetails, AccordionSummary, TextField, Theme, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import {EMPTY_ERROR_HELPER_TEXT} from "../channelManagement/helpers/validation";
import {useForm} from "react-hook-form";
import {LandingPageProductDescription} from "../../models/supportLandingPage";

const threeTierKeys: (keyof ThreeTierChoiceCardTiers)[] = ['lowerTier', "higherTier", "higherTier"];

const useStyles = makeStyles(({ spacing }: Theme) => ({
  heading: {
    marginBottom: spacing(1),
  },
  accordionDetails: {
    paddingTop: spacing(2),
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  benefitsHeading: {
    fontWeight: 700,
  },
  deleteButton: {
    height: '100%',
  },
}));

interface TierEditorProps {
  editMode: boolean;
  threeTierKeys: keyof ThreeTierChoiceCardTiers;
  threeTier: ThreeTierDescription;
  onThreeTierChange: (updatedThreeTier: ThreeTierDescription) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const ThreeTierEditor: React.FC<TierEditorProps> = ({
  editMode,
  threeTierKeys,
  threeTier,
  onThreeTierChange,
  onValidationChange,
}: TierEditorProps) => {
  const classes = useStyles();

  const { control, handleSubmit, errors, register, reset } = useForm<ThreeTierDescription>(
    {
      mode: 'onChange',
      defaultValues: threeTier,
    },
  );
  return (
    <Accordion key={threeTierKeys}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{threeTierKeys}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <TextField
          inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
          error={!!errors.title}
          helperText={errors?.title?.message}
          label="Heading"
          name="Heading"
          required={true}
          onBlur={handleSubmit(onThreeTierChange)}
          disabled={!editMode}
          fullWidth
        />
      </AccordionDetails>
    </Accordion>
  );
}
