import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../../utils/requests';
import type { VariantBannerDeployScheduleFromServer } from './bannerDeployTypes';
import { toggleWeekday, weekdays } from './variantScheduleUtils';

const defaultDaysOfWeek = weekdays.map(({ day }) => day);

const ScheduleCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: theme.spacing(2),
}));

const ScheduleContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(0, 3),
}));

const VariantScheduleEditor: React.FC = () => {
  const settingsType = FrontendSettingsType.BannerDeploySchedule;
  const [dataFromServer, setDataFromServer] =
    useState<VariantBannerDeployScheduleFromServer | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>(defaultDaysOfWeek);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDataFromServer = (): void => {
    fetchFrontendSettings<VariantBannerDeployScheduleFromServer>(settingsType)
      .then((data) => {
        setDataFromServer(data);
        setSelectedDays(data.value.daysOfWeek);
      })
      .catch((err) => alert(String(err)));
  };

  useEffect(fetchDataFromServer, [settingsType]);

  const onWeekdayChange = (day: number, isSelected: boolean): void => {
    setSelectedDays((currentDays) => toggleWeekday(currentDays, day, isSelected));
  };

  const saveSchedule = (): void => {
    if (!dataFromServer) {
      return;
    }

    setIsSaving(true);
    saveFrontendSettings(settingsType, {
      value: { daysOfWeek: selectedDays },
      version: dataFromServer.version,
    })
      .then(fetchDataFromServer)
      .catch((err) => alert(String(err)))
      .finally(() => setIsSaving(false));
  };

  return (
    <ScheduleCard>
      <Toolbar>
        <Typography variant="h6" component="h2">
          Variant schedule
        </Typography>
      </Toolbar>
      <ScheduleContent>
        <Typography>
          Reset dismissed banners for Banner 1 and Banner 2 at 9am on selected days.
        </Typography>
        <FormControl component="fieldset" disabled={!dataFromServer || isSaving}>
          <FormLabel component="legend">Reset days</FormLabel>
          <FormGroup>
            {weekdays.map(({ day, label }) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onChange={(event) => onWeekdayChange(day, event.target.checked)}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>
        {selectedDays.length === 0 && (
          <Alert severity="info">Automatic Variant resets are disabled.</Alert>
        )}
        <Button
          onClick={saveSchedule}
          color="primary"
          variant="contained"
          disabled={!dataFromServer || isSaving}
        >
          Save variant schedule
        </Button>
      </ScheduleContent>
    </ScheduleCard>
  );
};

export default VariantScheduleEditor;
