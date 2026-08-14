import { Alert, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import withS3Data, { DataFromServer, InnerProps } from '../hocs/withS3Data';
import { ChoiceCardsSettings } from '../models/choiceCards';
import {
  ChoiceCardsDefaultsProfile,
  DefaultChoiceCardsSettings,
} from '../models/defaultChoiceCards';
import { hasPermission } from '../utils/permissions';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../utils/requests';
import { Section } from './defaultChoiceCards/Section';
import { useStyles } from './defaultChoiceCards/styles';
import { ChannelKey, normalizeSettings } from './defaultChoiceCards/utils';

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
