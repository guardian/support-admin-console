import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import { regions, regionIds, RegionsAndAll } from '../../../utils/models';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '8px',
  },
}));

interface TestListSidebarFilterSelectorProps {
  regionFilter: string;
  handleRegionFilterChange: (event: RegionsAndAll) => void;
}

const TestListSidebarFilterSelector: React.FC<TestListSidebarFilterSelectorProps> = ({
  regionFilter,
  handleRegionFilterChange,
}: TestListSidebarFilterSelectorProps) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.container} fullWidth>
      <InputLabel id="filter-region-select-label">Filter by Region</InputLabel>
      <Select
        labelId="filter-region-select-label"
        id="filter-region-select"
        value={regionFilter}
        label="Filter by Region"
        onChange={(event: SelectChangeEvent<RegionsAndAll>): void =>
          handleRegionFilterChange(event.target.value)
        }
      >
        <MenuItem key="ALL" value="ALL">
          Show all tests
        </MenuItem>

        {regionIds.map((region, index) => (
          <MenuItem key={index} value={region}>
            {regions[region]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TestListSidebarFilterSelector;
