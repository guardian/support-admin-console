import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';

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

const options: Option[] = [
  'environment/climate-change',
  'environment/climate-crisis',
  'environment/environment',
  'science/science',
  'politics/politics',
  'us-news/us-politics',
  'australia-news/australian-politics',
  'world/world',
  'world/europe-news',
  'world/russia',
  'books/books',
  'culture/culture',
  'world/coronavirus-outbreak',
  'world/race',
  'inequality/inequality',
  'technology/technology',
  'business/business',
  'tone/recipes',
].map(id => ({
  label: id,
  value: id,
}));

interface MultiselectAutocompleteProps {
  disabled: boolean;
  tagIds: string[] | null;
  onUpdate: (tagIds: string[]) => void;
}

const MultiselectAutocomplete: React.FC<MultiselectAutocompleteProps> = ({
  disabled,
  tagIds,
  onUpdate,
}: MultiselectAutocompleteProps) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState<string>('');

  return (
    <div className={classes.container}>
      <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Filter article count by tag</span>
      <Autocomplete
        id={'multi-seelect-tag'}
        multiple
        disabled={disabled}
        options={options}
        getOptionLabel={option => option.label}
        value={tagIds?.map<Option>(tag => ({ label: tag, value: tag }))}
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
            onUpdate(values.map(value => value.label));
            setInputValue('');
          }
        }}
      />
    </div>
  );
};

export default MultiselectAutocomplete;
