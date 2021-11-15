import { Autocomplete } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { TextField } from "@material-ui/core";

interface Section {
  id: string;
  name?: string;
}

interface SectionEditorProps {
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
  label,
  disabled,
  ids,
  onUpdate,
}) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState<Section[]>([]);

  useEffect(() => {
    fetch(`/capi/sections`)
      .then(response => response.json())
      .then(data => {
        setOptions(data.response.results.map((section: { id: string, webTitle: string }) => ({
          id: section.id,
          name: section.webTitle
        })));
      })
  }, []);

  return (
    <Autocomplete
      id={'capi-sections'}
      disabled={disabled}
      multiple
      getOptionLabel={option => option.name || option.id}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={ids.map<Section>(id => ({id}))}
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
      onChange={(event, values: Section[], reason) => {
        if (reason === 'select-option' || reason === 'remove-option') {
          onUpdate(values.map(value => value.id));
          setInputValue('');
        }
      }}
    />
  )
}
