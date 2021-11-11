import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Theme, makeStyles, TextField } from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';
import { SectionDataOrEmpty, TagIdDataOrEmpty, tagIdOptions, sectionOptions, callCAPI } from './fetchDataFromCapi';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

type StringDataOrEmpty = string[] | [];

interface FormData {
  tagIds: string[];
  sections: string[];
  excludeTagIds: string[];
  excludeSections: string[];
}

interface EpicTestTargetContentEditorProps {
  tagIds: string[];
  sections: string[];
  excludeTagIds: string[];
  excludeSections: string[];
  editMode: boolean;
  updateTargetContent: (
    tagIds: string[],
    sections: string[],
    excludeTagIds: string[],
    excludeSections: string[],
  ) => void;
}

const EpicTestTargetContentEditor: React.FC<EpicTestTargetContentEditorProps> = ({
  tagIds,
  sections,
  excludeTagIds,
  excludeSections,
  editMode,
  updateTargetContent,
}: EpicTestTargetContentEditorProps) => {

  callCAPI();

  const classes = useStyles();

  const onSubmit = (): void => {

    updateTargetContent(
      prepareTagIdsForSubmit(tagIdsField),
      prepareSectionsForSubmit(sectionsField),
      prepareTagIdsForSubmit(excludeTagIdsField),
      prepareSectionsForSubmit(excludeSectionsField),
    );
  };

  const prepareTagIdsForSubmit = (input: TagIdDataOrEmpty): StringDataOrEmpty => {
    const output: string[] = [];
    input.forEach(i => output.push(i.id));
    return output;
  };

  const prepareSectionsForSubmit = (input: SectionDataOrEmpty): StringDataOrEmpty => {
    const output: string[] = [];
    input.forEach(i => output.push(i.id));
    return output;
  };

  // tagId stuff
  const getInitialTagIds = (vals: string[]): TagIdDataOrEmpty => {

    const res = [];

    for (let t of tagIdOptions) {

      if (vals.indexOf(t.id) >= 0) {
        res.push(t);
      }
    };
    return res;
  };

  const [tagIdsField, setTagIdsField] = useState<TagIdDataOrEmpty>([]);

  const [excludeTagIdsField, setExcludeTagIdsField] = useState<TagIdDataOrEmpty>([]);
  
  useEffect(() => {
    setTagIdsField(getInitialTagIds(tagIds));
    setExcludeTagIdsField(getInitialTagIds(excludeTagIds));
  }, [tagIdOptions]);

  useEffect(() => setTagIdsField(getInitialTagIds(tagIds)), [tagIds]);

  useEffect(() => setExcludeTagIdsField(getInitialTagIds(excludeTagIds)), [excludeTagIds]);

  // section stuff
  const getInitialSections = (vals: string[]): SectionDataOrEmpty => {

    const res = [];

    for (let s of sectionOptions) {

      if (vals.indexOf(s.id) >= 0) {
        res.push(s);
      }
    };
    return res;
  };

  const [sectionsField, setSectionsField] = useState<SectionDataOrEmpty>([]);
  
  const [excludeSectionsField, setExcludeSectionsField] = useState<SectionDataOrEmpty>([]);

  useEffect(() => {
    setSectionsField(getInitialSections(sections));
    setExcludeSectionsField(getInitialSections(excludeSections));
  }, [sectionOptions])

  useEffect(() => setSectionsField(getInitialSections(sections)), [sections]);

  useEffect(() => setExcludeSectionsField(getInitialSections(excludeSections)), [excludeSections]);

  const [inputValueForTagId, setInputValueForTagId] = React.useState('');
  const [openForTagId, setOpenForTagId] = React.useState(false);
  const handleOpenForTagId = () => {
    if (inputValueForTagId.length > 2) {
      setOpenForTagId(true);
    }
  };
  const handleInputChangeForTagId = (event:any, newInputValue:string) => {
    setInputValueForTagId(newInputValue);
    if (newInputValue.length > 2) {
      setOpenForTagId(true);
    } else {
      setOpenForTagId(false);
    }
  };

  const [inputValueForExcludeTagId, setInputValueForExcludeTagId] = React.useState('');
  const [openForExcludeTagId, setOpenForExcludeTagId] = React.useState(false);
  const handleOpenForExcludeTagId = () => {
    if (inputValueForExcludeTagId.length > 2) {
      setOpenForExcludeTagId(true);
    }
  };
  const handleInputChangeForExcludeTagId = (event:any, newInputValue:string) => {
    setInputValueForExcludeTagId(newInputValue);
    if (newInputValue.length > 2) {
      setOpenForExcludeTagId(true);
    } else {
      setOpenForExcludeTagId(false);
    }
  };

  return (
    <div className={classes.container}>

      <Autocomplete
        multiple
        options={tagIdOptions}
        disabled={!editMode}
        groupBy={(opt) => opt.section}
        getOptionLabel={(opt) => opt.display}
        filterSelectedOptions
        onChange={(event, value) => setTagIdsField(value)}
        value={tagIdsField}
        onBlur={onSubmit}
        open={openForTagId}
        onOpen={handleOpenForTagId}
        onClose={() => setOpenForTagId(false)}
        inputValue={inputValueForTagId}
        onInputChange={handleInputChangeForTagId}
        renderInput={(params) => (
          <TextField
            {...params}
            name="tagIds"
            variant="outlined"
            label="Target tags"
          />
        )}
      />

      <Autocomplete
        multiple
        options={sectionOptions}
        disabled={!editMode}
        getOptionLabel={(opt) => opt.display}
        filterSelectedOptions
        onChange={(event, value) => setSectionsField(value)}
        value={sectionsField}
        onBlur={onSubmit}
        renderInput={(params) => (
          <TextField
            {...params}
            name="sections"
            variant="outlined"
            label="Target sections"
          />
        )}
      />

      <Autocomplete
        multiple
        options={tagIdOptions}
        disabled={!editMode}
        groupBy={(opt) => opt.section}
        getOptionLabel={(opt) => opt.display}
        filterSelectedOptions
        onChange={(event, value) => setExcludeTagIdsField(value)}
        value={excludeTagIdsField}
        onBlur={onSubmit}
        open={openForExcludeTagId}
        onOpen={handleOpenForExcludeTagId}
        onClose={() => setOpenForExcludeTagId(false)}
        inputValue={inputValueForExcludeTagId}
        onInputChange={handleInputChangeForExcludeTagId}
        renderInput={(params) => (
          <TextField
            {...params}
            name="excludeTagIds"
            variant="outlined"
            label="Excluded tags"
          />
        )}
      />

      <Autocomplete
        multiple
        options={sectionOptions}
        disabled={!editMode}
        getOptionLabel={(opt) => opt.display}
        filterSelectedOptions
        onChange={(event, value) => setExcludeSectionsField(value)}
        value={excludeSectionsField}
        onBlur={onSubmit}
        renderInput={(params) => (
          <TextField
            {...params}
            name="excludeSections"
            variant="outlined"
            label="Excluded sections"
          />
        )}
      />
    </div>
  );
};

export default EpicTestTargetContentEditor;
