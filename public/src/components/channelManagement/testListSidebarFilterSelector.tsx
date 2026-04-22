import type { SelectChangeEvent } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import type { RegionsAndAll } from '../../utils/models';
import { regionIds, regions } from '../../utils/models';

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
      <InputLabel id="filter-region-select-label" htmlFor="filter-region-select">
        Filter by Region
      </InputLabel>
      <Select
        labelId="filter-region-select-label"
        name="filter-region-select"
        value={regionFilter}
        label="Filter by Region"
        inputProps={{ id: 'filter-region-select' }}
        onChange={(event: SelectChangeEvent): void => handleRegionFilterChange(event.target.value)}
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
