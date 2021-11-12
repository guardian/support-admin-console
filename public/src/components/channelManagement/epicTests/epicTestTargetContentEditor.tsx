import React, { useEffect, useState, ChangeEvent } from 'react';
import { Theme, makeStyles, TextField } from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

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

interface TagIdData {
  id: string;
  display: string;
  section: string;
}

interface SectionData {
  id: string;
  display: string;
}

interface RawTagIdData {
  id?: string;
  type?: string;
  sectionId?: string;
  sectionName?: string;
  webTitle?: string;
  webUrl?: string;
  apiUrl?: string;
  description?: string;
  internalName?: string;
}

interface RawSectionsEditionData {
  id?: string;
  webTitle: string;
  webUrl?: string;
  apiUrl?: string;
  code?: string;
}

interface RawSectionData {
  id?: string;
  webTitle: string;
  webUrl?: string;
  apiUrl?: string;
  code?: string;
  editions?: RawSectionsEditionData[];
}

type SectionDataOrEmpty = SectionData[] | [];
type TagIdDataOrEmpty = TagIdData[] | [];
type StringDataOrEmpty = string[] | [];

const EpicTestTargetContentEditor: React.FC<EpicTestTargetContentEditorProps> = ({
  tagIds,
  sections,
  excludeTagIds,
  excludeSections,
  editMode,
  updateTargetContent,
}: EpicTestTargetContentEditorProps) => {
  const classes = useStyles();

  // Infrastructure for tagId selectors
  const [tagIdsOptions, setTagIdsOptions] = useState<TagIdDataOrEmpty>([]);
  const [tagIdsField, setTagIdsField] = useState<TagIdDataOrEmpty>([]);
  const [excludeTagIdsField, setExcludeTagIdsField] = useState<TagIdDataOrEmpty>([]);

  const getInitialTagIds = (vals: string[]): TagIdDataOrEmpty => {
    const res = [];

    for (const t of tagIdsOptions) {
      if (vals.indexOf(t.id) >= 0) {
        res.push(t);
      }
    }
    return res;
  };

  useEffect(() => {
    console.log('tagIdsOptions length', tagIdsOptions.length);
    setTagIdsField(getInitialTagIds(tagIds));
    setExcludeTagIdsField(getInitialTagIds(excludeTagIds));
  }, [tagIdsOptions]);

  useEffect(() => setTagIdsField(getInitialTagIds(tagIds)), [tagIds]);

  useEffect(() => setExcludeTagIdsField(getInitialTagIds(excludeTagIds)), [excludeTagIds]);

  // Infrastructure for sections selectors
  const [sectionsOptions, setSectionsOptions] = useState<SectionDataOrEmpty>([]);
  const [sectionsField, setSectionsField] = useState<SectionDataOrEmpty>([]);
  const [excludeSectionsField, setExcludeSectionsField] = useState<SectionDataOrEmpty>([]);

  const getInitialSections = (vals: string[]): SectionDataOrEmpty => {
    const res = [];

    for (const s of sectionsOptions) {
      if (vals.indexOf(s.id) >= 0) {
        res.push(s);
      }
    }
    return res;
  };

  useEffect(() => {
    console.log('sectionsOptions length', sectionsOptions.length);
    setSectionsField(getInitialSections(sections));
    setExcludeSectionsField(getInitialSections(excludeSections));
  }, [sectionsOptions]);

  useEffect(() => setSectionsField(getInitialSections(sections)), [sections]);

  useEffect(() => setExcludeSectionsField(getInitialSections(excludeSections)), [excludeSections]);

  // Processing required to update tagId/section data immediately before submission
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

  const onSubmit = (): void => {
    updateTargetContent(
      prepareTagIdsForSubmit(tagIdsField),
      prepareSectionsForSubmit(sectionsField),
      prepareTagIdsForSubmit(excludeTagIdsField),
      prepareSectionsForSubmit(excludeSectionsField),
    );
  };

  // Fetch data from CAPI
  const [capiFlag, setCapiFlag] = useState(false);

  const rawTagIdResults: RawTagIdData[] = []; // Not stateful

  const processTagIdResults = (data: RawTagIdData[] = []): void => {
    const res: TagIdData[] = [];

    if (data.length) {
      data.forEach(item => {
        const { id, webTitle, sectionName } = item;

        if (id && webTitle && sectionName) {
          const obj: TagIdData = {
            id: id,
            display: `${webTitle} [${id}]`,
            section: sectionName.toUpperCase(),
          };
          res.push(obj);
        }
      });

      res.sort((a, b) => {
        if (a.section > b.section) {
          return 1;
        } else if (a.section < b.section) {
          return -1;
        } else {
          if (a.display > b.display) {
            return 1;
          }
          return -1;
        }
      });
    }
    setTagIdsOptions(res);
  };

  const processSectionResults = (data: RawSectionData[] = []): void => {
    const res: SectionData[] = [];

    if (data.length) {
      data.forEach(item => {
        const { id, webTitle } = item;

        if (id && webTitle) {
          const obj: SectionData = {
            id: id,
            display: webTitle,
          };
          res.push(obj);
        }
      });

      res.sort((a, b) => {
        if (a.display > b.display) {
          return 1;
        }
        return -1;
      });
    }
    setSectionsOptions(res);
  };

  const generateFetchPromise = (
    url: string,
    promises: Promise<RawTagIdData | RawSectionData>[],
  ): Promise<RawTagIdData | RawSectionData> => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(res => {
          if (res && res.response) {
            const response = res.response;

            if (response.currentPage < response.pages) {
              url = url.replace(`&page=${response.currentPage}`, '');
              url += `&page=${response.currentPage + 1}`;
              promises.push(generateFetchPromise(url, promises));
            }

            if (response.results && response.results.length) {
              rawTagIdResults.push(...response.results);
            }
          }
          resolve(res);
        })
        .catch(e => reject(e));
    });
  };

  const callCAPI = (): void => {
    if (!capiFlag) {
      console.log('Starting CAPI fetch');

      setCapiFlag(true);

      const sectionUrl = `${window.location.origin}/capi/sections?page-size=200`;

      fetch(sectionUrl)
        .then(res => res.json())
        .then(packet => {
          const response = packet.response;

          if (response && response.status === 'ok') {
            const data = response.results;

            if (data && data.length) {
              processSectionResults(data);
              return data;
            }
          }
          return false;
        })
        .then(data => {
          const promises: Promise<RawTagIdData | RawSectionData>[] = [];

          if (data) {
            const sectionIds: string[] = data.map((d: RawSectionData) => {
              return d.id;
            });

            let negativeSections = '';

            sectionIds.forEach(s => {
              const tagIdUrl = `${window.location.origin}/capi/tags?page-size=1000&section=${s}`;
              negativeSections += `-${s},`;
              promises.push(generateFetchPromise(tagIdUrl, promises));
            });

            // Attempt to capture tags with no set section value
            const noSectionsUrl = `${
              window.location.origin
            }/capi/tags?page-size=1000&section=${negativeSections.slice(0, -1)}`;
            promises.push(generateFetchPromise(noSectionsUrl, promises));
          }

          Promise.allSettled(promises)
            .then(() => {
              // Delay by a second
              // - to capture returns from multi-paged results which take time to settle
              setTimeout(() => {
                processTagIdResults(rawTagIdResults);
                console.log(`CAPI fetch completed!`);
              }, 2000);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    } else {
      console.log('CAPI fetch either underway or completed');
    }
  };

  callCAPI();

  // To suppress opening the tagId selectors until the user has typed in 3+ characters
  const [inputValueForTagId, setInputValueForTagId] = React.useState('');
  const [openForTagId, setOpenForTagId] = React.useState(false);
  const handleOpenForTagId = (): void => {
    if (inputValueForTagId.length > 2) {
      setOpenForTagId(true);
    }
  };
  const handleInputChangeForTagId = (event: ChangeEvent<{}>, newInputValue: string): void => {
    setInputValueForTagId(newInputValue);
    if (newInputValue.length > 2) {
      setOpenForTagId(true);
    } else {
      setOpenForTagId(false);
    }
  };

  const [inputValueForExcludeTagId, setInputValueForExcludeTagId] = React.useState('');
  const [openForExcludeTagId, setOpenForExcludeTagId] = React.useState(false);
  const handleOpenForExcludeTagId = (): void => {
    if (inputValueForExcludeTagId.length > 2) {
      setOpenForExcludeTagId(true);
    }
  };
  const handleInputChangeForExcludeTagId = (
    event: ChangeEvent<{}>,
    newInputValue: string,
  ): void => {
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
        options={tagIdsOptions}
        disabled={!editMode}
        groupBy={(opt): string => opt.section}
        getOptionLabel={(opt): string => opt.display}
        filterSelectedOptions
        onChange={(event, value): void => setTagIdsField(value)}
        value={tagIdsField}
        onBlur={onSubmit}
        open={openForTagId}
        onOpen={handleOpenForTagId}
        onClose={(): void => setOpenForTagId(false)}
        inputValue={inputValueForTagId}
        onInputChange={handleInputChangeForTagId}
        // freeSolo
        renderInput={(params): JSX.Element => (
          <TextField {...params} name="tagIds" variant="outlined" label="Target tags" />
        )}
      />

      <Autocomplete
        multiple
        options={sectionsOptions}
        disabled={!editMode}
        getOptionLabel={(opt): string => opt.display}
        filterSelectedOptions
        onChange={(event, value): void => setSectionsField(value)}
        value={sectionsField}
        onBlur={onSubmit}
        renderInput={(params): JSX.Element => (
          <TextField {...params} name="sections" variant="outlined" label="Target sections" />
        )}
      />

      <Autocomplete
        multiple
        options={tagIdsOptions}
        disabled={!editMode}
        groupBy={(opt): string => opt.section}
        getOptionLabel={(opt): string => opt.display}
        filterSelectedOptions
        onChange={(event, value): void => setExcludeTagIdsField(value)}
        value={excludeTagIdsField}
        onBlur={onSubmit}
        open={openForExcludeTagId}
        onOpen={handleOpenForExcludeTagId}
        onClose={(): void => setOpenForExcludeTagId(false)}
        inputValue={inputValueForExcludeTagId}
        onInputChange={handleInputChangeForExcludeTagId}
        // freeSolo
        renderInput={(params): JSX.Element => (
          <TextField {...params} name="excludeTagIds" variant="outlined" label="Excluded tags" />
        )}
      />

      <Autocomplete
        multiple
        options={sectionsOptions}
        disabled={!editMode}
        getOptionLabel={(opt): string => opt.display}
        filterSelectedOptions
        onChange={(event, value): void => setExcludeSectionsField(value)}
        value={excludeSectionsField}
        onBlur={onSubmit}
        renderInput={(params): JSX.Element => (
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
