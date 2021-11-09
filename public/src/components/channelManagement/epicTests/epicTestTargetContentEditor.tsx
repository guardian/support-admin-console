import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Theme, makeStyles, TextField } from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';
import { tagIdData, getTagIdOptions } from './tagIds';
import { getSectionOptions } from './sections';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

type TagIdDataOrEmpty = tagIdData[] | [];
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
    input.forEach(i => output.push(i.tagid));
    return output;
  };

  const prepareSectionsForSubmit = (input: StringDataOrEmpty): StringDataOrEmpty => {
    return input;
  };

  // tagId stuff
  const [tagIdValues, setTagIdValues] = useState<TagIdDataOrEmpty>([]);

  const getInitialTagIds = (vals: string[]): TagIdDataOrEmpty => {

    const res = [];

    for (let t of tagIdValues) {

      if (vals.indexOf(t.tagid) >= 0) {
        res.push(t);
      }
    };
    return res;
  };

  const [tagIdsField, setTagIdsField] = useState<TagIdDataOrEmpty>([]);

  const [excludeTagIdsField, setExcludeTagIdsField] = useState<TagIdDataOrEmpty>([]);
  
  if (!tagIdValues.length) {
    getTagIdOptions()
    .then(res => setTagIdValues(res))
    .catch(e => console.log('tagIdValues fail:', e));
  }

  useEffect(() => {
        setTagIdsField(getInitialTagIds(tagIds));
        setExcludeTagIdsField(getInitialTagIds(excludeTagIds));
  }, [tagIdValues]);

  useEffect(() => setTagIdsField(getInitialTagIds(tagIds)), [tagIds])

  useEffect(() => setExcludeTagIdsField(getInitialTagIds(excludeTagIds)), [excludeTagIds])

  // section stuff
  const [sectionValues, setSectionValues] = useState<StringDataOrEmpty>([]);

  const getInitialSections = (vals: string[]): StringDataOrEmpty => {

    const res = [];

    for (let s of sectionValues) {

      if (vals.indexOf(s) >= 0) {
        res.push(s);
      }
    };
    return res;
  };

  const [sectionsField, setSectionsField] = useState<StringDataOrEmpty>([]);
  
  const [excludeSectionsField, setExcludeSectionsField] = useState<StringDataOrEmpty>([]);

  if (!sectionValues.length) {
    getSectionOptions()
    .then(res => setSectionValues(res))
    .catch(e => console.log('INIT-VALUES tagIdValues fail:', e));
  }

  useEffect(() => {
    setSectionsField(getInitialSections(sections));
    setExcludeSectionsField(getInitialSections(excludeSections));
  }, [sectionValues])

  useEffect(() => setSectionsField(getInitialSections(sections)), [sections])

  useEffect(() => setExcludeSectionsField(getInitialSections(excludeSections)), [excludeSections])


  return (
    <div className={classes.container}>

      <Autocomplete
        multiple
        options={tagIdValues}
        disabled={!editMode}
        groupBy={(opt) => opt.firstword}
        getOptionLabel={(opt) => opt.tagid}
        filterSelectedOptions
        onChange={(event, value) => setTagIdsField(value)}
        value={tagIdsField}
        onBlur={onSubmit}
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
        options={sectionValues}
        disabled={!editMode}
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
        options={tagIdValues}
        disabled={!editMode}
        groupBy={(opt) => opt.firstword}
        getOptionLabel={(opt) => opt.tagid}
        filterSelectedOptions
        onChange={(event, value) => setExcludeTagIdsField(value)}
        value={excludeTagIdsField}
        onBlur={onSubmit}
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
        options={sectionValues}
        disabled={!editMode}
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
