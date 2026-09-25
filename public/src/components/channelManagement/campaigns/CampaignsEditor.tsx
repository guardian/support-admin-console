import { Box, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fetchCampaignTests } from '../../../utils/requests';
import { Test } from '../helpers/shared';
import { RichTextEditor } from '../richTextEditor/richTextEditor';
import {
  Campaign,
  testChannelData,
  TestChannelItem,
  testChannelOrder,
  unassignedCampaign,
} from './CampaignsTypes';
import ChannelCard from './ChannelCard';
import StickyTopBar from './StickyCampaignBar';

export type { TestChannelItem };

const TestEditorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: theme.palette.background.paper, // #FFFFFF
  borderLeft: `1px solid ${theme.palette.grey[500]}`,
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(2),
}));

const FormContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderBottom: '1px solid black',
}));

const NotesContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const NotesHeaderLine = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

const NotesHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '18px',
  fontWeight: 500,
}));

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
  const [testData, setTestData] = useState<Test[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showArchivedTests, setShowArchivedTests] = useState(false);

  const { name, nickname, description, notes, isActive } = campaign;

  const doDataFetch = (name: string) => {
    fetchCampaignTests(name)
      .then((tests) => {
        // sort by test priority; each channel sets its own priority list
        const sortedTests = tests.sort((a: Test, b: Test) => {
          if (a.priority != null && b.priority != null) {
            return a.priority - b.priority;
          }
          return 0;
        });
        setTestData(sortedTests);
      })
      .catch((error) => {
        console.error('Failed to fetch campaign tests:', error);
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

  const {
    register,
    handleSubmit,
    trigger,
    control,

    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    void trigger();
  }, [trigger]);

  const filterTests = (channel: string) => {
    if (showArchivedTests) {
      return testData.filter((test) => test.channel === channel);
    } else {
      const filteredTests = testData.filter((test) => test.channel === channel);
      return filteredTests.filter((test) => test.status !== 'Archived');
    }
  };

  const onSubmit = ({ description, notes, isActive }: FormData): void => {
    updateCampaign({ ...campaign, description, notes, isActive });
  };

  return (
    <TestEditorContainer>
      <StickyTopBar
        name={name}
        nickname={nickname}
        tests={testData}
        showArchivedTests={showArchivedTests}
        setShowArchivedTests={setShowArchivedTests}
        updatePage={updatePage}
      />
      <ScrollableContainer>
        {name !== unassignedCampaign.name && (
          <FormContainer>
            <NotesContainer>
              <NotesHeaderLine>
                <NotesHeader>Campaign metadata and notes:</NotesHeader>
                <Button variant="contained" onClick={() => setEditMode(!editMode)}>
                  <Typography>{editMode ? 'Save' : 'Edit'}</Typography>
                </Button>
              </NotesHeaderLine>

              <TextField
                error={errors.description !== undefined}
                helperText={errors.description ? errors.description.message : ''}
                {...register('description')}
                onBlur={() => void handleSubmit(onSubmit)()}
                label="Description"
                margin="normal"
                variant="outlined"
                disabled={!editMode}
                fullWidth
              />

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...register('isActive')}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          void handleSubmit(onSubmit)();
                        }}
                        checked={field.value}
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
                render={({ field }) => {
                  return (
                    <RichTextEditor
                      error={errors.notes !== undefined}
                      copyData={field.value}
                      updateCopy={(pars) => {
                        field.onChange(pars);
                        void handleSubmit(onSubmit)();
                      }}
                      name="notes"
                      label="Notes and links"
                      disabled={!editMode}
                      rteMenuConstraints={{
                        enableHtml: true,
                        enableBold: true,
                        enableItalic: true,
                        enableCopyTemplates: true,
                        enableLink: true,
                      }}
                    />
                  );
                }}
              />
            </NotesContainer>
          </FormContainer>
        )}
        {testChannelOrder.map((channel) => (
          <ChannelCard
            channelData={testChannelData[channel]}
            tests={filterTests(channel)}
            key={channel}
          />
        ))}
      </ScrollableContainer>
    </TestEditorContainer>
  );
}

export default CampaignsEditor;
