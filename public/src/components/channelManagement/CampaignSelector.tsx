import React, { useEffect, useState } from 'react';
import { fetchFrontendSettings, FrontendSettingsType } from '../../utils/requests';
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

  const sortedCampaigns = sortCampaigns(campaigns);
  const filteredCampaigns = sortedCampaigns.filter(c => {
    if (c.name === unassignedCampaignLabel) {
      return false;
    }
    if (c.isActive || c.isActive == null) {
      return true;
    }
    return false;
  });

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
          {filteredCampaigns.map(c => (
            <MenuItem value={c.name} key={`campaign-${c.name}`}>
              {c.name}
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
