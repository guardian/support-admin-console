import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useCallback } from 'react';
import { TextField } from "@material-ui/core";
import throttle from 'lodash/throttle';

interface Tag {
  id: string;
  name?: string;
  section?: string;
}

interface TagEditorProps {
  label: string;
  disabled: boolean;
  ids: string[];
  onUpdate: (ids: string[]) => void;
}

/**
 * Multiselect component for tags from CAPI.
 * Searches for tags based on the user's input.
 */
export const TagsEditor: React.FC<TagEditorProps> = ({
  label,
  disabled,
  ids,
  onUpdate,
}) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState<Tag[]>([]);

  const fetchTags = (value: string) => fetch(`/capi/tags?web-title=${value}&page-size=200`)
    .then(response => response.json())
    .then(data => {
      const newOptions = data.response.results.map((tag: { id: string, webTitle: string, sectionId: string }) => ({
        id: tag.id,
        name: tag.webTitle,
        section: tag.sectionId?.toUpperCase(),
      }));
      const inputValueOption = {id: value};  // Make the raw input an option, in case user is pasting in tags

      setOptions([inputValueOption].concat(newOptions));
    });

  // Throttle requests as the user types
  const throttledFetchTags = useCallback(throttle(fetchTags, 1000), []);

  useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return undefined;
    } else if (inputValue.length > 2) {
      throttledFetchTags(inputValue);
    }
  }, [inputValue]);

  return (
    <Autocomplete
      id={'capi-tags'}
      disabled={disabled}
      multiple
      getOptionLabel={option => option.name || option.id}
      noOptionsText={"Search for tags..."}
      filterOptions={(x) => x}
      groupBy={option => option.section || ''}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={ids.map<Tag>(id => ({id}))}
      inputValue={inputValue}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'input') {
          setInputValue(newInputValue);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={label} />
      )}
      renderOption={(option) => {
        return <div>{option.name ? `${option.name} (${option.id})` : option.id}</div>
      }}
      onChange={(event, values: Tag[], reason) => {
        if (reason === 'select-option' || reason === 'remove-option') {
          onUpdate(values.map(value => value.id));
          setInputValue('');
        }
      }}
    />
  )
}
