import React, { useEffect, useState } from 'react';
import { fetchFrontendSettings, FrontendSettingsType } from '../../utils/requests';
import { DataFromServer } from '../../hocs/withS3Data';
import { Campaign } from './campaigns/CampaignsForm';
import { Test } from './helpers/shared';

import { Select, MenuItem, FormControl, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
  campaignSelector: {
    marginBottom: '8px',
    marginRight: '12px',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
  },
  warning: {
    color: '#555',
    marginLeft: '24px',
  },
}));

interface CampaignSelectorProps {
  onCampaignChange: (campaign?: string) => void;
  test: Test;
  disabled: boolean;
}

export const unassignedCampaignLabel = 'NOT_IN_CAMPAIGN';

const CampaignSelector: React.FC<CampaignSelectorProps> = ({
  onCampaignChange,
  test,
  disabled,
}: CampaignSelectorProps) => {
  const classes = useStyles();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetchFrontendSettings(FrontendSettingsType.campaigns).then(setCampaigns);
  }, []);

  const setCampaignName = (campaign?: string) => onCampaignChange(campaign);

  return (
    <>
      <FormControl className={classes.campaignSelector} size="small">
        <Select
          value={test.campaignName}
          displayEmpty
          renderValue={(campaign): string => {
            return campaign as string;
          }}
          onChange={(event: React.ChangeEvent<{ value: unknown }>): void => {
            setCampaignName(event.target.value as string | undefined);
          }}
          disabled={disabled}
        >
          <MenuItem value={unassignedCampaignLabel} key={'campaignName-none'}>
            {unassignedCampaignLabel}
          </MenuItem>
          {campaigns.map(campaign => (
            <MenuItem value={campaign.name} key={`campaign-${campaign.name}`}>
              {campaign.name}
            </MenuItem>
          ))}
        </Select>
        <div className={classes.warning}>
          If you want to use this Test in a new or different campaign, please consider copying the
          test rather than changing its campaign value.
        </div>
      </FormControl>
    </>
  );
};

export default CampaignSelector;
