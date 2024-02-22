import React, { useEffect, useState } from 'react';
import { fetchFrontendSettings, FrontendSettingsType } from '../../utils/requests';
import { Campaign, unassignedCampaign } from './campaigns/CampaignsForm';
import { Test } from './helpers/shared';

import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { makeStyles } from '@mui/styles';

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

  const sortCampaigns = (campaignArray: Campaign[]) => {
    campaignArray.sort((a, b) => {
      const A = a.nickname || a.name;
      const B = b.nickname || b.name;

      if (A < B) {
        return -1;
      }
      if (B < A) {
        return 1;
      }
      return 0;
    });
    return campaignArray;
  };

  const filterCampaigns = (campaignArray: Campaign[]) => {
    return campaignArray.filter(c => {
      if (c.name === unassignedCampaign.name) {
        return false;
      }
      if (c.isActive || c.isActive == null) {
        return true;
      }
      return false;
    });
  };

  const availableCampaigns = sortCampaigns(filterCampaigns(campaigns));

  return (
    <>
      <FormControl className={classes.campaignSelector} size="small">
        <Select
          value={test.campaignName}
          displayEmpty
          renderValue={(campaign): string => {
            return campaign as string;
          }}
          onChange={(event: SelectChangeEvent<string | undefined>): void => {
            setCampaignName(event.target.value);
          }}
          disabled={disabled}
        >
          <MenuItem value={unassignedCampaign.name} key={'campaignName-none'}>
            {unassignedCampaign.nickname}
          </MenuItem>
          {availableCampaigns.map(c => (
            <MenuItem value={c.name} key={`campaign-${c.name}`}>
              {c.nickname || c.name}
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
