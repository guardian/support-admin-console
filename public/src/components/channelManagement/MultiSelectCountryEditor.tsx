import Autocomplete from '@mui/material/Autocomplete';
import { grey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { countries } from '../../utils/models';
import { RegionTargeting } from './helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
    borderColor: `2px solid ${grey[700]}`,
    borderRadius: '2px',
    padding: spacing(2),
  },
}));

interface Option {
  label: string;
  value: string;
}

const options: Option[] = Object.entries(countries).map(([value, label]) => ({
  value,
  label,
}));

const getCountryOptions = (countryCodes: string[] | undefined): Option[] => {
  if (!countryCodes || !Array.isArray(countryCodes)) {
    return [];
  }
  return countryCodes.map((country) => {
    const option = options.find((opt) => opt.value === country);
    return option ?? { label: country, value: country };
  });
};

interface MultiselectAutocompleteProps {
  disabled: boolean;
  regionTargeting?: RegionTargeting;
  onRegionTargetingUpdate: (regionTargeting: RegionTargeting) => void;
}

const MultiselectAutocomplete: React.FC<MultiselectAutocompleteProps> = ({
  disabled,
  regionTargeting,
  onRegionTargetingUpdate,
}: MultiselectAutocompleteProps) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState<string>('');

  // Guard against undefined regionTargeting during test switching
  const safeRegionTargeting = regionTargeting ?? {
    targetedCountryGroups: [],
    targetedCountryCodes: [],
  };

  return (
    <div className={classes.container}>
      <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>
        Additionally if you want to target by countries select from the list
      </span>
      <Autocomplete
        id={'multi-select-country'}
        multiple
        disabled={disabled}
        options={options}
        getOptionLabel={(option) => option.label}
        value={getCountryOptions(safeRegionTargeting.targetedCountryCodes)}
        inputValue={inputValue}
        componentsProps={{
          popper: {
            modifiers: [
              {
                name: 'flip',
                enabled: false,
              },
              {
                name: 'preventOverflow',
                enabled: false,
              },
            ],
          },
        }}
        onInputChange={(event, newInputValue, reason): void => {
          if (reason === 'input') {
            setInputValue(newInputValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Choose options"
            placeholder="Select multiple options "
          />
        )}
        renderOption={(props, option): JSX.Element => {
          return <li {...props}>{option.label ? option.label : option.value}</li>;
        }}
        onChange={(event, values: Option[], reason): void => {
          if (reason === 'selectOption' || reason === 'removeOption') {
            onRegionTargetingUpdate({
              ...safeRegionTargeting,
              targetedCountryCodes: values.map((value) => value.value),
            });
            setInputValue('');
          }
        }}
      />
    </div>
  );
};

export default MultiselectAutocomplete;
