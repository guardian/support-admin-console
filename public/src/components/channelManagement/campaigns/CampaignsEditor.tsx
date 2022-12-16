import React, { useState, useEffect } from 'react';
import {
  Theme,
  // Typography,
  makeStyles,
  TextField,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import StickyTopBar from './StickyCampaignBar';
import { Campaign } from './CampaignsForm';
import { Test } from '../helpers/shared';
import ChannelCard from './ChannelCard';
import { fetchCampaignTests } from '../../../utils/requests';
import { useForm } from 'react-hook-form';
// import { useForm, Controller } from 'react-hook-form';
// import { RichTextEditor } from '../richTextEditor/richTextEditor';
import { unassignedCampaignLabel } from '../CampaignSelector';

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
  'EpicHoldback',
  'EpicLiveblog',
  'EpicAppleNews',
  'EpicAMP',
  'Banner1',
  'Banner2',
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
  EpicHoldback: {
    name: 'Epic Holdback',
    link: 'epic-holdback-tests',
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
  // const [editMode, setEditMode] = useState(true);
  const editMode = true;
  const [showArchivedTests, setShowArchivedTests] = useState(false);

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

  const { name, nickname, description, notes, isActive } = campaign;

  const defaultValues = {
    description: description ?? '',
    notes: notes ?? [],
    isActive: isActive ?? true,
  };

  useEffect(() => doDataFetch(name), [campaign]);

  const updatePage = () => doDataFetch(name);

  const { register, handleSubmit, errors, trigger } = useForm<FormData>({
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

  const updateDescription = ({ description }: FormData): void => {
    updateCampaign({ ...campaign, description });
  };

  // const updateNotes = ({ notes }: FormData): void => {
  //   updateCampaign({ ...campaign, notes });
  // };

  const updateIsActive = ({ isActive }: FormData): void => {
    console.log('isActive', isActive);
    updateCampaign({ ...campaign, isActive });
  };

  console.log('campaign', campaign);
  console.log('defaultValues', defaultValues);
  console.log(name, nickname, description, isActive, notes);

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
        {name !== unassignedCampaignLabel && (
          <div className={classes.formContainer}>
            <div className={classes.notesContainer}>
              <div className={classes.notesHeader}>Campaign metadata and notes:</div>
              <TextField
                inputRef={register()}
                error={errors.description !== undefined}
                helperText={errors.description ? errors.description.message : ''}
                onBlur={handleSubmit(updateDescription)}
                name="description"
                label="Description"
                margin="normal"
                variant="outlined"
                disabled={!editMode}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    inputRef={register()}
                    name="isActive"
                    checked={isActive ?? true}
                    onChange={handleSubmit(updateIsActive)}
                    disabled={!editMode}
                  />
                }
                label={'Include this campaign in Channel Test campaign selectors'}
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
