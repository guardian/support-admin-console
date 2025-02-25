import React, { useState, useEffect } from 'react';
import { Theme, TextField, FormControlLabel, Switch, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import StickyTopBar from './StickyCampaignBar';
import { Campaign, unassignedCampaign } from './CampaignsForm';
import { Test } from '../helpers/shared';
import ChannelCard from './ChannelCard';
import { fetchCampaignTests } from '../../../utils/requests';
import { useForm, Controller } from 'react-hook-form';
import { RichTextEditor } from '../richTextEditor/richTextEditor';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  testEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
    borderLeft: `1px solid ${palette.grey[500]}`,
  },
  scrollableContainer: {
    overflowY: 'auto',
    paddingLeft: spacing(3),
    paddingRight: spacing(1),
    paddingTop: spacing(2),
  },
  formContainer: {
    marginBottom: spacing(4),
    borderBottom: '1px solid black',
  },
  notesContainer: {
    marginBottom: spacing(4),
  },
  notesHeaderLine: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  notesHeader: {
    marginBottom: spacing(2),
    fontSize: '18px',
    fontWeight: 500,
  },
  launchLink: {
    padding: '0 8px',
    fontSize: '14px',
    fontWeight: 'normal',
    color: palette.grey[700],
    lineHeight: 1.5,
    marginBottom: spacing(2),
  },
}));

export const testChannelOrder = [
  'Header',
  'Epic',
  'EpicLiveblog',
  'EpicAppleNews',
  'EpicAMP',
  'Banner1',
  'Banner2',
  'GutterLiveblog',
];

export interface TestChannelItem {
  name: string;
  link: string;
}

export interface TestChannelData {
  [index: string]: TestChannelItem;
}

export const testChannelData: TestChannelData = {
  Header: {
    name: 'Header',
    link: 'header-tests',
  },
  Epic: {
    name: 'Epic',
    link: 'epic-tests',
  },
  EpicLiveblog: {
    name: 'Liveblog Epic',
    link: 'liveblog-epic-tests',
  },
  EpicAppleNews: {
    name: 'Apple News Epic',
    link: 'apple-news-epic-tests',
  },
  EpicAMP: {
    name: 'AMP Epic',
    link: 'amp-epic-tests',
  },
  Banner1: {
    name: 'Banner 1',
    link: 'banner-tests',
  },
  Banner2: {
    name: 'Banner 2',
    link: 'banner-tests2',
  },
  GutterLiveblog: {
    name: 'Gutter Liveblog',
    link: 'gutter-liveblog-tests',
  },
};

interface FormData {
  description: string;
  notes: string[];
  isActive: boolean;
}

interface CampaignsEditorProps {
  campaign: Campaign;
  updateCampaign: (data: Campaign) => void;
}

function CampaignsEditor({ campaign, updateCampaign }: CampaignsEditorProps): React.ReactElement {
  const classes = useStyles();

  const [testData, setTestData] = useState<Test[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showArchivedTests, setShowArchivedTests] = useState(false);

  const { name, nickname, description, notes, isActive } = campaign;

  const doDataFetch = (name: string) => {
    fetchCampaignTests(name).then(tests => {
      // sort by test priority; each channel sets its own priority list
      const sortedTests = tests.sort((a: Test, b: Test) => {
        if (a.priority != null && b.priority != null) {
          return a.priority - b.priority;
        }
        return 0;
      });
      setTestData(sortedTests);
    });
  };

  const defaultValues = {
    description: description ?? '',
    notes: notes ?? [],
    isActive: isActive ?? true,
  };

  useEffect(() => {
    doDataFetch(name);
  }, [name]);

  const updatePage = () => doDataFetch(name);

  const { register, handleSubmit, errors, trigger, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  const filterTests = (channel: string) => {
    if (showArchivedTests) {
      return testData.filter(test => test.channel === channel);
    } else {
      const filteredTests = testData.filter(test => test.channel === channel);
      return filteredTests.filter(test => test.status !== 'Archived');
    }
  };

  const onSubmit = ({ description, notes, isActive }: FormData): void => {
    updateCampaign({ ...campaign, description, notes, isActive });
  };

  return (
    <div className={classes.testEditorContainer}>
      <StickyTopBar
        name={name}
        nickname={nickname}
        tests={testData}
        showArchivedTests={showArchivedTests}
        setShowArchivedTests={setShowArchivedTests}
        updatePage={updatePage}
      />
      <div className={classes.scrollableContainer}>
        {name !== unassignedCampaign.name && (
          <div className={classes.formContainer}>
            <div className={classes.notesContainer}>
              <div className={classes.notesHeaderLine}>
                <Typography className={classes.notesHeader}>
                  Campaign metadata and notes:
                </Typography>
                <Button variant="contained" onClick={() => setEditMode(!editMode)}>
                  <Typography>{editMode ? 'Save' : 'Edit'}</Typography>
                </Button>
              </div>

              <TextField
                inputRef={register()}
                error={errors.description !== undefined}
                helperText={errors.description ? errors.description.message : ''}
                onBlur={handleSubmit(onSubmit)}
                name="description"
                label="Description"
                margin="normal"
                variant="outlined"
                disabled={!editMode}
                fullWidth
              />

              <Controller
                name="isActive"
                control={control}
                render={data => (
                  <FormControlLabel
                    control={
                      <Switch
                        inputRef={register()}
                        name="isActive"
                        onChange={e => {
                          data.onChange(e.target.checked);
                          handleSubmit(onSubmit)();
                        }}
                        checked={data.value}
                        disabled={!editMode}
                      />
                    }
                    label={'Include this campaign in Channel Test campaign selectors'}
                  />
                )}
              />

              <Controller
                name="notes"
                control={control}
                render={data => {
                  return (
                    <RichTextEditor
                      error={errors.notes !== undefined}
                      copyData={data.value}
                      updateCopy={pars => {
                        data.onChange(pars);
                        handleSubmit(onSubmit)();
                      }}
                      name="notes"
                      label="Notes and links"
                      disabled={!editMode}
                      rteMenuConstraints={{
                        noCurrencyTemplate: true,
                        noCountryNameTemplate: true,
                        noArticleCountTemplate: true,
                        noPriceTemplates: true,
                        noDateTemplate: true,
                        noDayTemplate: true,
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
        )}
        {testChannelOrder.map(channel => (
          <ChannelCard
            channelData={testChannelData[channel]}
            tests={filterTests(channel)}
            key={channel}
          />
        ))}
      </div>
    </div>
  );
}

export default CampaignsEditor;
