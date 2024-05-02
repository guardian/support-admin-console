// MultiselectAutocomplete.tsx
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));



interface Option {
  label: string;
  value: string;
}

const options: Option[] = [
  { label: 'environment/climate-change', value: 'environment/climate-change' },
  { label: 'environment/climate-crisis', value: 'environment/climate-crisis' },
  { label: 'environment/environment' , value: 'environment/environment' },
  { label: 'science/science', value: 'science/science' },
  { label: 'politics/politics', value: 'politics/politics' },
  { label: 'us-news/us-politics', value: 'us-news/us-politics' },
  { label: 'australia-news/australian-politics', value: 'australia-news/australian-politics' },
  { label: 'world/world', value: 'world/world' },
  { label: 'world/europe-news', value: 'world/europe-news' },
  { label: 'world/russia', value: 'world/russia' },
  { label: 'books/books', value: 'books/books' },
  { label: 'culture/culture', value: 'culture/culture' },
  { label: 'world/coronavirus-outbreak', value: 'world/coronavirus-outbreak' },
  { label: 'world/race', value: 'world/race' },
  { label: 'inequality/inequality', value: 'inequality/inequality' },
  { label: 'technology/technology', value: 'technology/technology' },
  { label: 'business/business', value: 'business/business' },
  { label: 'tone/recipes', value: 'tone/recipes' },
];

interface MultiselectAutocompleteProps {
  disabled: boolean;
  tags: string[] | null;
  onUpdate: (tags: string[]) => void;
}

const MultiselectAutocomplete: React.FC<MultiselectAutocompleteProps>= ({disabled,tags, onUpdate}: MultiselectAutocompleteProps) => {

  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState<string>('');


  return (
    <div className={classes.container}>
      <h4 id="multiple-select-label">Tag for content tagged article</h4>
      <Autocomplete
        id={"multi-seelect-tag"}
        multiple
        disabled={disabled}
        options={options}
        getOptionLabel={(option) => option.label}
        value={tags?.map<Option>(tag => ({ label: tag, value: tag }))}
        inputValue={inputValue}
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
            onUpdate(values.map(value => value.label));
            setInputValue('');
          }
        }}
      />
    </div>
  );
};

export default MultiselectAutocomplete;
