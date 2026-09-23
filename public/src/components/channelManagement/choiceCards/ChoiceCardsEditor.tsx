import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Radio, RadioGroup } from '@mui/material';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { DataFromServer } from '../../../hocs/withS3Data';
import { ChoiceCard, ChoiceCardsSettings } from '../../../models/choiceCards';
import { DefaultChoiceCardsSettings } from '../../../models/defaultChoiceCards';
import { ChannelKey } from '../../../utils/defaultChoiceCards';
import { fetchFrontendSettings, FrontendSettingsType } from '../../../utils/requests';
import { ChoiceCardEditor } from './ChoiceCardEditor';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ChoiceCardContainer = styled(Box)({
  display: 'flex',
});

const DeleteButton = styled(Button)(({ theme }) => ({
  height: '100%',
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  marginLeft: theme.spacing(1),
}));
const AddChoiceCardButton = styled(Button)({
  alignSelf: 'flex-start',
});

type ChoiceCardsSelection = 'NoChoiceCards' | 'DefaultChoiceCards' | 'CustomChoiceCards';
const getChoiceCardsSelection = (
  showChoiceCards: boolean,
  choiceCardsSettings?: ChoiceCardsSettings,
): ChoiceCardsSelection => {
  if (showChoiceCards) {
    if (choiceCardsSettings) {
      return 'CustomChoiceCards';
    } else {
      return 'DefaultChoiceCards';
    }
  } else {
    return 'NoChoiceCards';
  }
};

const countDefaultCards = (choiceCards: ChoiceCard[]): number =>
  choiceCards.filter((card) => card.isDefault).length;

let defaultChoiceCardsSettingsRequest: Promise<DefaultChoiceCardsSettings> | undefined;

const fetchDefaultChoiceCardsSettings = (): Promise<DefaultChoiceCardsSettings> => {
  defaultChoiceCardsSettingsRequest ??= fetchFrontendSettings<
    DataFromServer<DefaultChoiceCardsSettings>
  >(FrontendSettingsType.DefaultChoiceCards).then((response) => response.value);

  return defaultChoiceCardsSettingsRequest;
};

interface ChoiceCardsEditorProps {
  showChoiceCards: boolean;
  channel: ChannelKey;
  allowNoChoiceCards: boolean;
  choiceCardsSettings?: ChoiceCardsSettings;
  updateChoiceCardsSettings: (
    showChoiceCards: boolean,
    choiceCardSettings?: ChoiceCardsSettings,
  ) => void;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const ChoiceCardsEditor: React.FC<ChoiceCardsEditorProps> = ({
  showChoiceCards,
  channel,
  choiceCardsSettings,
  updateChoiceCardsSettings,
  allowNoChoiceCards,
  isDisabled,
  onValidationChange,
}: ChoiceCardsEditorProps) => {
  const [defaultChoiceCardsSettings, setDefaultChoiceCardsSettings] =
    React.useState<ChoiceCardsSettings>();

  const formMethods = useForm<ChoiceCardsSettings & { hasOneDefault: boolean }>({
    defaultValues: {
      choiceCards: choiceCardsSettings?.choiceCards ?? [],
      hasOneDefault: countDefaultCards(choiceCardsSettings?.choiceCards ?? []) === 1,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'choiceCards',
  });

  // Watch the choiceCards array for updates in order to update the hasOneDefault field
  const choiceCards = useWatch({
    control: formMethods.control,
    name: 'choiceCards',
  });

  const choiceCardsSelection = getChoiceCardsSelection(showChoiceCards, choiceCardsSettings);
  const defaultCardCount = countDefaultCards(choiceCards);

  React.useEffect(() => {
    void fetchDefaultChoiceCardsSettings().then((settings) =>
      setDefaultChoiceCardsSettings(settings[channel].Default),
    );
  }, [channel]);

  React.useEffect(() => {
    if (choiceCardsSelection === 'CustomChoiceCards') {
      if (defaultCardCount !== 1) {
        formMethods.setError('hasOneDefault', {
          type: 'custom',
          message:
            defaultCardCount === 0
              ? 'One card must be set as the default'
              : 'Only one card can be set as the default',
        });
        onValidationChange(false);
      } else {
        formMethods.clearErrors('hasOneDefault');
        onValidationChange(true);
      }
    } else {
      onValidationChange(true);
    }
  }, [fields, choiceCardsSelection, formMethods, defaultCardCount, onValidationChange]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'DefaultChoiceCards') {
      updateChoiceCardsSettings(true);
    } else if (event.target.value === 'CustomChoiceCards') {
      const defaultChoiceCards = defaultChoiceCardsSettings?.choiceCards ?? [];
      updateChoiceCardsSettings(true, {
        choiceCards: defaultChoiceCards,
      });
      formMethods.setValue('choiceCards', defaultChoiceCards);
    } else {
      updateChoiceCardsSettings(false);
      formMethods.setValue('choiceCards', []);
    }
  };

  const handleFieldChange = formMethods.handleSubmit((updatedSettings) => {
    // special handling of pill field, because react-hook-form may give us an undefined nested copy field - `pill: { copy: undefined }`
    const choiceCards = updatedSettings.choiceCards.map((card) => ({
      ...card,
      pill: card.pill?.copy ? card.pill : undefined,
      destinationTest:
        card.destinationTest?.testName || card.destinationTest?.variantName
          ? card.destinationTest
          : undefined,
    }));

    updateChoiceCardsSettings(showChoiceCards, { choiceCards });
  });

  return (
    <Container>
      <RadioGroup value={choiceCardsSelection} onChange={onRadioGroupChange}>
        {allowNoChoiceCards && (
          <FormControlLabel
            value="NoChoiceCards"
            key="NoChoiceCards"
            control={<Radio />}
            label="No choice cards"
            disabled={isDisabled}
          />
        )}
        <FormControlLabel
          value="DefaultChoiceCards"
          key="DefaultChoiceCards"
          control={<Radio />}
          label="Choice cards with default settings"
          disabled={isDisabled}
        />
        <FormControlLabel
          value="CustomChoiceCards"
          key="CustomChoiceCards"
          control={<Radio />}
          label="Choice cards with custom settings"
          disabled={isDisabled}
        />
      </RadioGroup>
      {choiceCardsSelection === 'CustomChoiceCards' && (
        <>
          {formMethods.formState.errors.hasOneDefault && (
            <Alert severity="error">{formMethods.formState.errors.hasOneDefault.message}</Alert>
          )}
          {fields.map((choiceCard, idx) => (
            <ChoiceCardContainer key={choiceCard.id}>
              <ChoiceCardEditor
                choiceCard={choiceCard}
                onChange={(updatedCard) => {
                  formMethods.setValue(`choiceCards.${idx}`, updatedCard);
                  void handleFieldChange();
                }}
                isDisabled={isDisabled}
                index={idx}
                formMethods={formMethods}
              />
              <DeleteButton
                onClick={() => remove(idx)}
                disabled={isDisabled}
                variant="outlined"
                size="small"
                startIcon={<CloseIcon />}
              >
                Delete
              </DeleteButton>
            </ChoiceCardContainer>
          ))}
          <AddChoiceCardButton
            onClick={() => {
              append({
                product: { supportTier: 'Contribution', ratePlan: 'Monthly' },
                label: '',
                benefits: [],
                isDefault: false,
              });
              void handleFieldChange();
            }}
            disabled={isDisabled || fields.length >= 3}
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
          >
            Create new choice card
          </AddChoiceCardButton>
        </>
      )}
    </Container>
  );
};

export default ChoiceCardsEditor;
