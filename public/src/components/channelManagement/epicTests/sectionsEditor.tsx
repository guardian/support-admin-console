import { Autocomplete } from '@mui/material';
import React, { useEffect } from 'react';
import { TextField } from '@mui/material';

interface Section {
  id: string;
  name?: string;
}

interface SectionEditorProps {
  id?: string;
  label: string;
  disabled: boolean;
  ids: string[];
  onUpdate: (ids: string[]) => void;
}

/**
 * Multiselect component for sections from CAPI.
 * Fetches all sections on mount.
 */
export const SectionsEditor: React.FC<SectionEditorProps> = ({
  id = 'capi-sections',
  label,
  disabled,
  ids,
  onUpdate,
}: SectionEditorProps) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState<Section[]>([]);

  useEffect(() => {
    fetch(`/capi/sections`)
      .then(response => response.json())
      .then(data => {
        const processedOptions = data.response.results.map(
          (section: { id: string; webTitle: string }) => ({
            id: section.id,
            name: section.webTitle,
          }),
        );

        processedOptions.sort((a: Section, b: Section) => {
          if (a.name != null && b.name != null && a.name > b.name) {
            return 1;
          }
          return -1;
        });

        setOptions(processedOptions);
      });
  }, []);

  return (
    <Autocomplete
      id={id}
      disabled={disabled}
      multiple
      getOptionLabel={(option): string => option.name || option.id}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={ids.map<Section>(id => ({ id }))}
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
        return <li {...props}>{option.name ? option.name : option.id}</li>;
      }}
      onChange={(event, values: Section[], reason): void => {
        if (reason === 'selectOption' || reason === 'removeOption') {
          onUpdate(values.map(value => value.id));
          setInputValue('');
        }
      }}
    />
  );
};
