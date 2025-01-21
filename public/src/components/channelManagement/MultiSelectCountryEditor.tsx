import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';
import { countryNames, Region } from '../../utils/models';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
    borderColor: `2px solid ${{ color: grey[700] }}`,
    borderRadius: '2px',
    padding: spacing(2),
  },
}));

interface Option {
  label: string;
  value: string;
}

const options: Option[] = countryNames.map(id => ({
  label: id[1],
  value: id[0],
}));

interface MultiselectAutocompleteProps {
  disabled: boolean;
  selectedCountries?: string[];
  onCountriesUpdate: (selectedCountries: string[]) => void;
}

const MultiselectAutocomplete: React.FC<MultiselectAutocompleteProps> = ({
  disabled,
  selectedCountries,
  onCountriesUpdate,
}: MultiselectAutocompleteProps) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState<string>('');

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
        getOptionLabel={option => option.label}
        value={selectedCountries?.map(country => {
          const option = options.find(option => option.value === country);
          return option
            ? { label: country, value: option.value }
            : { label: country, value: country };
        })}
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
        renderInput={params => (
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
            onCountriesUpdate(values.map(value => value.label));
            setInputValue('');
          }
        }}
      />
    </div>
  );
};

export default MultiselectAutocomplete;
