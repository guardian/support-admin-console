import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import { Region, RegionsAndAll, getPrettifiedRegionName } from '../../utils/models';
const definedRegions = Object.values(Region);

interface TestListSidebarFilterSelectorProps {
  regionFilter: string;
  handleRegionFilterChange: (event: RegionsAndAll) => void;
}

const TestListSidebarFilterSelector: React.FC<TestListSidebarFilterSelectorProps> = ({
  regionFilter,
  handleRegionFilterChange,
}: TestListSidebarFilterSelectorProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="filter-region-select-label">Filter by Region</InputLabel>
      <Select
        labelId="filter-region-select-label"
        id="filter-region-select"
        value={regionFilter}
        label="Filter by Region"
        onChange={(event: React.ChangeEvent<{ value: unknown }>): void =>
          handleRegionFilterChange(event.target.value as RegionsAndAll)
        }
      >
        <MenuItem key="ALL" value="ALL">
          Show all tests
        </MenuItem>

        {definedRegions.map((region, index) => (
          <MenuItem key={index} value={region}>
            {getPrettifiedRegionName(region)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TestListSidebarFilterSelector;