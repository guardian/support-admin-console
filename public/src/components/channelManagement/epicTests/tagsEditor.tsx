import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useCallback } from 'react';
import { TextField } from '@material-ui/core';
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
export const TagsEditor: React.FC<TagEditorProps> = ({ label, disabled, ids, onUpdate }) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState<Tag[]>([]);

  const fetchTags = (value: string): Promise<void> =>
    fetch(`/capi/tags?web-title=${value}&page-size=1000`)
      .then(response => response.json())
      .then(data => {
        const newOptions = data.response.results.map(
          (tag: { id: string; webTitle: string; sectionId: string }) => ({
            id: tag.id,
            name: tag.webTitle,
            section: tag.sectionId != null ? tag.sectionId.toUpperCase() : '[no section]',
          }),
        );

        newOptions.sort((a: Tag, b: Tag) => {
          if (a.section != null && b.section != null) {
            if (a.section > b.section) {
              return 1;
            } else if (a.section < b.section) {
              return -1;
            }
          }

          if (a.name != null && b.name != null && a.name > b.name) {
            return 1;
          }

          return -1;
        });

        // Make the raw input an option, in case user is pasting in tags
        const inputValueOption = { id: value };

        const combinedOptions = [inputValueOption].concat(newOptions);

        setOptions(combinedOptions);
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
      getOptionLabel={(option): string => option.name || option.id}
      noOptionsText={'Search for tags...'}
      filterOptions={(x): Tag[] => x}
      groupBy={(option): string => option.section || ''}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={ids.map<Tag>(id => ({ id }))}
      inputValue={inputValue}
      onInputChange={(event, newInputValue, reason): void => {
        if (reason === 'input') {
          setInputValue(newInputValue);
        }
      }}
      renderInput={(params): JSX.Element => (
        <TextField {...params} variant="outlined" label={label} />
      )}
      renderOption={(option): JSX.Element => {
        return <div>{option.name ? `${option.name} (${option.id})` : option.id}</div>;
      }}
      onChange={(event, values: Tag[], reason): void => {
        if (reason === 'select-option' || reason === 'remove-option') {
          onUpdate(values.map(value => value.id));
          setInputValue('');
        }
      }}
    />
  );
};
