import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { ChoiceCardsSettings } from '../../models/choiceCards';
import { ChoiceCardEditor } from '../channelManagement/choiceCards/ChoiceCardEditor';
import { useStyles } from './styles';
import { countDefaultCards, FormData, sanitizeChoiceCardsSettings } from './utils';

interface ProfileEditorProps {
  label: string;
  idPrefix: string;
  settings: ChoiceCardsSettings;
  disabled: boolean;
  onChange: (settings: ChoiceCardsSettings) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  label,
  idPrefix,
  settings,
  disabled,
  onChange,
  onValidationChange,
}) => {
  const classes = useStyles();
  const formMethods = useForm<FormData>({
    defaultValues: {
      choiceCards: settings.choiceCards,
      hasOneDefault: countDefaultCards(settings.choiceCards) === 1,
    },
    mode: 'onChange',
  });
  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'choiceCards',
  });
  const watchedChoiceCards = useWatch({
    control: formMethods.control,
    name: 'choiceCards',
  });
  const defaultCardCount = countDefaultCards(watchedChoiceCards);

  React.useEffect(() => {
    if (watchedChoiceCards.length === 0) {
      formMethods.clearErrors('hasOneDefault');
      onValidationChange(true);
      return;
    }

    if (defaultCardCount !== 1) {
      formMethods.setError('hasOneDefault', {
        type: 'custom',
        message:
          defaultCardCount === 0
            ? 'One card must be set as the default'
            : 'Only one card can be set as the default',
      });
      onValidationChange(false);
      return;
    }

    formMethods.clearErrors('hasOneDefault');
    onValidationChange(Object.keys(formMethods.formState.errors).length === 0);
  }, [
    watchedChoiceCards.length,
    defaultCardCount,
    formMethods,
    formMethods.formState.errors,
    onValidationChange,
  ]);

  const handleFieldChange = () => {
    onChange(sanitizeChoiceCardsSettings(formMethods.getValues()));
  };

  return (
    <Card className={classes.profileCard} variant="outlined">
      <CardContent className={classes.profileContent}>
        <div>
          <Typography variant="h6">{label}</Typography>
          {label !== 'Default fallback' && (
            <Typography variant="body2" className={classes.helperText}>
              Leave this profile empty to continue using fallback settings for this region.
            </Typography>
          )}
        </div>
        {formMethods.formState.errors.hasOneDefault && (
          <Alert severity="error">{formMethods.formState.errors.hasOneDefault.message}</Alert>
        )}
        {fields.map((choiceCard, idx) => (
          <div className={classes.choiceCardContainer} key={choiceCard.id}>
            <ChoiceCardEditor
              choiceCard={choiceCard}
              onChange={(updatedCard) => {
                formMethods.setValue(`choiceCards.${idx}`, updatedCard, { shouldValidate: true });
                handleFieldChange();
              }}
              isDisabled={disabled}
              index={idx}
              formMethods={formMethods}
              hideDestination={true}
              idPrefix={`${idPrefix}-`}
            />
            <Button
              className={classes.deleteButton}
              onClick={() => {
                remove(idx);
                handleFieldChange();
              }}
              disabled={disabled}
              variant="outlined"
              size="small"
              startIcon={<CloseIcon />}
            >
              Delete
            </Button>
          </div>
        ))}
        <Button
          className={classes.addButton}
          onClick={() => {
            append({
              product: { supportTier: 'Contribution', ratePlan: 'Monthly' },
              label: '',
              benefits: [],
              isDefault: false,
            });
            handleFieldChange();
          }}
          disabled={disabled || fields.length >= 3}
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
        >
          Add choice card
        </Button>
      </CardContent>
    </Card>
  );
};
