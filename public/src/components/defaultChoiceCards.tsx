import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Theme,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import withS3Data, { DataFromServer, InnerProps } from '../hocs/withS3Data';
import { ChoiceCard, ChoiceCardsSettings } from '../models/choiceCards';
import {
  ChoiceCardsDefaultsProfile,
  DefaultChoiceCardsSettings,
} from '../models/defaultChoiceCards';
import { regionIds, regions } from '../utils/models';
import { hasPermission } from '../utils/permissions';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../utils/requests';
import { ChoiceCardEditor } from './channelManagement/choiceCards/ChoiceCardEditor';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 1440,
    padding: spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(4),
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: spacing(2),
    alignItems: 'start',
  },
  profileCard: {
    height: '100%',
  },
  profileContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
  },
  choiceCardContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  deleteButton: {
    marginLeft: spacing(1),
    marginTop: spacing(1),
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  helperText: {
    color: palette.text.secondary,
  },
}));

type ChannelKey = 'epic' | 'banner';
type FormData = ChoiceCardsSettings & { hasOneDefault: boolean };

const PROFILE_ORDER: ChoiceCardsDefaultsProfile[] = ['Default', ...regionIds];
const EMPTY_SETTINGS: ChoiceCardsSettings = { choiceCards: [] };

const countDefaultCards = (choiceCards: ChoiceCard[]): number =>
  choiceCards.filter((card) => card.isDefault).length;

const sanitizeChoiceCardsSettings = (
  updatedSettings: ChoiceCardsSettings,
): ChoiceCardsSettings => ({
  choiceCards: updatedSettings.choiceCards.map((card) => ({
    ...card,
    pill: card.pill?.copy ? card.pill : undefined,
    destinationTest:
      card.destinationTest?.testName || card.destinationTest?.variantName
        ? card.destinationTest
        : undefined,
  })),
});

const buildDefaultData = (
  settings?: Partial<Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>>,
): Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings> =>
  PROFILE_ORDER.reduce(
    (acc, profile) => ({
      ...acc,
      [profile]: settings?.[profile] ?? EMPTY_SETTINGS,
    }),
    {} as Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>,
  );

const normalizeSettings = (data: DefaultChoiceCardsSettings): DefaultChoiceCardsSettings => ({
  epic: buildDefaultData(data.epic),
  banner: buildDefaultData(data.banner),
});

const buildLabel = (profile: ChoiceCardsDefaultsProfile): string =>
  profile === 'Default' ? 'Default fallback' : regions[profile];

interface ProfileEditorProps {
  label: string;
  idPrefix: string;
  settings: ChoiceCardsSettings;
  disabled: boolean;
  onChange: (settings: ChoiceCardsSettings) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  label,
  idPrefix,
  settings,
  disabled,
  onChange,
  onValidationChange,
}: ProfileEditorProps) => {
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
          <Typography variant="body2" className={classes.helperText}>
            Leave this profile empty to continue using fallback settings for this region.
          </Typography>
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

interface SectionProps {
  channel: ChannelKey;
  data: DefaultChoiceCardsSettings;
  disabled: boolean;
  onChange: (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsProfile,
    settings: ChoiceCardsSettings,
  ) => void;
  onValidationChange: (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsProfile,
    isValid: boolean,
  ) => void;
}

const Section: React.FC<SectionProps> = ({
  channel,
  data,
  disabled,
  onChange,
  onValidationChange,
}: SectionProps) => {
  const classes = useStyles();
  const channelSettings = data[channel] as Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>;

  return (
    <section className={classes.section}>
      <div>
        <Typography variant="h4">
          {channel === 'epic' ? 'Epic defaults' : 'Banner defaults'}
        </Typography>
        <Typography variant="body2" className={classes.helperText}>
          {channel === 'epic'
            ? 'Manage default choice cards for epic variants that do not define custom choice cards.'
            : 'Manage default choice cards for banner variants that do not define custom choice cards.'}
        </Typography>
      </div>
      <div className={classes.sectionGrid}>
        {PROFILE_ORDER.map((profile) => (
          <ProfileEditor
            key={`${channel}-${profile}`}
            label={buildLabel(profile)}
            idPrefix={`${channel}-${profile}`}
            settings={channelSettings[profile]}
            disabled={disabled}
            onChange={(settings) => onChange(channel, profile, settings)}
            onValidationChange={(isValid) => onValidationChange(channel, profile, isValid)}
          />
        ))}
      </div>
    </section>
  );
};

const canEdit = hasPermission(FrontendSettingsType.DefaultChoiceCards, 'Write');

const DefaultChoiceCards: React.FC<InnerProps<DefaultChoiceCardsSettings>> = ({
  data,
  update,
  sendToS3,
  saving,
}) => {
  const classes = useStyles();
  const normalizedData = React.useMemo(() => normalizeSettings(data), [data]);
  const [validationState, setValidationState] = React.useState<Record<string, boolean>>({});

  const handleProfileChange = (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsProfile,
    settings: ChoiceCardsSettings,
  ) => {
    update({
      ...normalizedData,
      [channel]: {
        ...normalizedData[channel],
        [profile]: settings,
      },
    });
  };

  const handleValidationChange = (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsProfile,
    isValid: boolean,
  ) => {
    setValidationState((current) => ({
      ...current,
      [`${channel}-${profile}`]: isValid,
    }));
  };

  const hasInvalidProfile = Object.values(validationState).some((isValid) => !isValid);

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.intro}>
          <Typography variant="body1">
            Configure global default choice cards. Variant-level custom settings still have higher
            priority.
          </Typography>
          <Typography variant="body2" className={classes.helperText}>
            This tool has separate sections for Epics and Banners.
          </Typography>
          {!canEdit && (
            <Alert severity="info">
              You have read-only access. Contact an administrator to request write permission for
              Default Choice Cards.
            </Alert>
          )}
        </div>
        <div className={classes.actions}>
          <Button
            onClick={sendToS3}
            disabled={!canEdit || saving || hasInvalidProfile}
            variant="contained"
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save changes'}
          </Button>
        </div>
        <Section
          channel="epic"
          data={normalizedData}
          disabled={!canEdit || saving}
          onChange={handleProfileChange}
          onValidationChange={handleValidationChange}
        />
        <Section
          channel="banner"
          data={normalizedData}
          disabled={!canEdit || saving}
          onChange={handleProfileChange}
          onValidationChange={handleValidationChange}
        />
      </div>
    </div>
  );
};

const fetchSettings = (): Promise<DataFromServer<DefaultChoiceCardsSettings>> => {
  return fetchFrontendSettings<DataFromServer<DefaultChoiceCardsSettings>>(
    FrontendSettingsType.DefaultChoiceCards,
  );
};

const saveSettings = (data: DataFromServer<DefaultChoiceCardsSettings>): Promise<Response> => {
  return saveFrontendSettings(FrontendSettingsType.DefaultChoiceCards, data);
};

export default withS3Data<DefaultChoiceCardsSettings>(
  DefaultChoiceCards,
  fetchSettings,
  saveSettings,
);
