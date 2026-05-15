import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface Tag {
  id: string;
  name?: string;
  section?: string;
}

interface TagEditorProps {
  id?: string;
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
  id = 'capi-tags',
  label,
  disabled,
  ids,
  onUpdate,
}: TagEditorProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [rawOptions, setRawOptions] = useState<Tag[]>([]);

  const options = inputValue === '' ? [] : rawOptions;

  const fetchTags = useCallback((value: string): void => {
    fetch(`/capi/tags?web-title=${value}&page-size=1000`)
      .then(
        (response) =>
          response.json() as Promise<{
            response: {
              results: Array<{ id: string; webTitle: string; sectionId: string | null }>;
            };
          }>,
      )
      .then((data) => {
        const newOptions = data.response.results.map((tag) => ({
          id: tag.id,
          name: tag.webTitle,
          section: tag.sectionId != null ? tag.sectionId.toUpperCase() : '[no section]',
        }));

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

        const inputValueOption: Tag = { id: value };

        const combinedOptions: Tag[] = [inputValueOption, ...newOptions];

        setRawOptions(combinedOptions);
      })
      .catch(() => {
        // Ignore errors - tags search is non-critical
      });
  }, []);

  // Throttle requests as the user types
  const throttledFetchTags = useMemo(() => throttle(fetchTags, 1000), [fetchTags]);

  useEffect(() => {
    if (inputValue.length > 2) {
      throttledFetchTags(inputValue);
    }
  }, [inputValue, throttledFetchTags]);

  return (
    <Autocomplete
      id={id}
      disabled={disabled}
      multiple
      getOptionLabel={(option): string => option.name ?? option.id}
      noOptionsText={'Search for tags...'}
      filterOptions={(x): Tag[] => x}
      groupBy={(option): string => option.section ?? ''}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={ids.map<Tag>((id) => ({ id }))}
      inputValue={inputValue}
      onInputChange={(event, newInputValue, reason): void => {
        if (reason === 'input') {
          setInputValue(newInputValue);
        }
      }}
      renderInput={(params): JSX.Element => (
        <TextField {...params} variant="outlined" label={label} />
      )}
      renderOption={(props, option): JSX.Element => {
        return <li {...props}>{option.name ? `${option.name} (${option.id})` : option.id}</li>;
      }}
      onChange={(event, values: Tag[], reason): void => {
        if (reason === 'selectOption' || reason === 'removeOption') {
          onUpdate(values.map((value) => value.id));
          setInputValue('');
        }
      }}
    />
  );
};
