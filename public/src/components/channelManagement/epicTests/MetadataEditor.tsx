import { Autocomplete } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { TextField } from "@material-ui/core";

interface MetaData {
  id: string;
  name: string;
}

interface MetadataEditorProps {
  type: 'tags' | 'sections';
  ids: string[];
  onUpdate: (ids: string[]) => void;
}

/**
 * Multiselect component for tags/sections from CAPI
 */
export const MetadataEditor: React.FC<MetadataEditorProps> = ({
  type,
  ids,
  onUpdate,
}) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState<MetaData[]>([]);

  // TODO - better section search?
  const queryParamName = type === 'tags' ? 'web-title' : 'q';

  useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return undefined;
    } else if (inputValue.length > 2) {
      fetch(`/capi/${type}?${queryParamName}=${inputValue}&page-size=100`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setOptions(data.response.results.map((tag: { id: string, webTitle: string }) => ({
            id: tag.id,
            name: tag.webTitle
          })));
        })
    }
  }, [inputValue]);

  return (
    <Autocomplete
      id={`capi-metadata-${type}`}
      multiple
      getOptionLabel={option => option.name}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={ids.map<MetaData>(id => ({id, name: id}))} //hack!
      inputValue={inputValue}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'input') {
          setInputValue(newInputValue);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label={`Find ${type}`} fullWidth />
      )}
      renderOption={(option) => {
        return <div>{`${option.name} (${option.id})`}</div>
      }}
      onChange={(event, values: MetaData[], reason) => {
        if (reason === 'select-option' || reason === 'remove-option') {
          onUpdate(values.map(value => value.id));
          setInputValue('');
        }
      }}
    />
  )
}
