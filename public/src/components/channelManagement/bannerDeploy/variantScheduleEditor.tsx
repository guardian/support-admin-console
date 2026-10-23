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
import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../../utils/requests';
import type { VariantBannerDeployScheduleFromServer } from './bannerDeployTypes';
import type { BannerDeployRegionName, BannersToRedeploy } from './bannerDeployTypes';
import VariantRedeployRegionsTable from './variantRedeployRegionsTable';
import { toggleWeekday, weekdays } from './variantScheduleUtils';

const defaultDaysOfWeek = weekdays.map(({ day }) => day);
const noRegionsSelected: BannersToRedeploy = {
  Australia: false,
  EuropeanUnion: false,
  RestOfWorld: false,
  UnitedStates: false,
  UnitedKingdom: false,
};

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
  const [selectedRegions, setSelectedRegions] = useState<BannersToRedeploy>(noRegionsSelected);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDataFromServer = useCallback(
    (preserveSelectedDays = false): Promise<void> =>
      fetchFrontendSettings<VariantBannerDeployScheduleFromServer>(settingsType)
        .then((data) => {
          setDataFromServer(data);
          if (!preserveSelectedDays) {
            setSelectedDays(data.value.daysOfWeek);
          }
        })
        .catch((err) => alert(String(err))),
    [settingsType],
  );

  useEffect(() => {
    void fetchDataFromServer();
  }, [fetchDataFromServer]);

  const onWeekdayChange = (day: number, isSelected: boolean): void => {
    setSelectedDays((currentDays) => toggleWeekday(currentDays, day, isSelected));
  };

  const onRegionChange = (region: BannerDeployRegionName, isSelected: boolean): void => {
    setSelectedRegions((currentRegions) => ({ ...currentRegions, [region]: isSelected }));
  };

  const onAllRegionsChange = (shouldRedeploy: boolean): void => {
    setSelectedRegions({
      Australia: shouldRedeploy,
      EuropeanUnion: shouldRedeploy,
      RestOfWorld: shouldRedeploy,
      UnitedStates: shouldRedeploy,
      UnitedKingdom: shouldRedeploy,
    });
  };

  const saveSchedule = (): void => {
    if (!dataFromServer) {
      return;
    }

    setIsSaving(true);
    saveFrontendSettings(settingsType, {
      value: { ...dataFromServer.value, daysOfWeek: selectedDays },
      version: dataFromServer.version,
    })
      .then(() => fetchDataFromServer())
      .catch((err) => alert(String(err)))
      .finally(() => setIsSaving(false));
  };

  const redeployVariantBanner = (): void => {
    if (!dataFromServer || isSaving || !Object.values(selectedRegions).some(Boolean)) {
      return;
    }

    setIsSaving(true);
    const timestamp = Date.now();
    const manualRedeploysByRegion = { ...dataFromServer.value.manualRedeploysByRegion };
    Object.entries(selectedRegions).forEach(([region, shouldRedeploy]) => {
      if (shouldRedeploy) {
        manualRedeploysByRegion[region as BannerDeployRegionName] = {
          timestamp,
          email: dataFromServer.email,
        };
      }
    });

    saveFrontendSettings(settingsType, {
      value: {
        ...dataFromServer.value,
        manualRedeploysByRegion,
      },
      version: dataFromServer.version,
    })
      .then(() => fetchDataFromServer(true))
      .then(() => setSelectedRegions(noRegionsSelected))
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
          Reset dismissed Banner 1 for consented Variant users at 9am on selected days.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A redeploy makes dismissed Banner 1 eligible for consented Variant users in the selected
          regions within five minutes. Auxia still decides whether to show the banner. The channel 1
          Redeploy button remains for Control and unconsented users.
        </Typography>
        <FormControl component="fieldset" disabled={!dataFromServer || isSaving}>
          <FormLabel component="legend">Reset days</FormLabel>
          <FormGroup row sx={{ flexWrap: 'wrap' }}>
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
        <Typography variant="subtitle1" component="h3">
          Redeploy regions
        </Typography>
        <VariantRedeployRegionsTable
          selectedRegions={selectedRegions}
          manualRedeploysByRegion={dataFromServer?.value.manualRedeploysByRegion}
          lastManualRedeployTimestamp={dataFromServer?.value.lastManualRedeployTimestamp}
          onSelectAll={onAllRegionsChange}
          onSelectRegion={onRegionChange}
        />
        <Button
          onClick={saveSchedule}
          color="primary"
          variant="contained"
          disabled={!dataFromServer || isSaving}
        >
          Save variant schedule
        </Button>
        <Button
          onClick={redeployVariantBanner}
          color="primary"
          variant="outlined"
          disabled={!dataFromServer || isSaving || !Object.values(selectedRegions).some(Boolean)}
        >
          Redeploy Variant Banner 1 in selected regions
        </Button>
      </ScheduleContent>
    </ScheduleCard>
  );
};

export default VariantScheduleEditor;
