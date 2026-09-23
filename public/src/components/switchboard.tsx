import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import SwitchUI from '@mui/material/Switch';
import cloneDeep from 'lodash/cloneDeep';
import { JSX } from 'react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import withS3Data, { DataFromServer, InnerProps } from '../hocs/withS3Data';
import {
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
  SupportFrontendSettingsType,
} from '../utils/requests';
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
} from './channelManagement/helpers/validation';

enum SwitchState {
  On = 'On',
  Off = 'Off',
}

interface Switch {
  description: string;
  state: SwitchState;
}

interface SwitchGroup {
  description: string;
  switches: Record<string, Switch>;
}

type SupportFrontendSwitches = Record<string, SwitchGroup>;

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  marginRight: theme.spacing(4),
  marginBottom: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  border: `1px solid ${theme.palette.grey['300']}`,
  width: '45%',
}));
const ButtonStyled = styled(Button)(({ theme }) => ({ marginRight: theme.spacing(2) }));
const AddButton = styled(Button)({
  padding: '0.2em',
  margin: '0.1em 0.2em',
});
const Buttons = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));
const Form = styled('form')(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginLeft: theme.spacing(4),
  marginRight: theme.spacing(4),
  marginBottom: theme.spacing(4),
  overflowY: 'auto',
}));
const ExistingSwitchesHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
const InputGroup = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-evenly',
}));
const SwitchLayout = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  '&:nth-child(even)': {
    backgroundColor: '#e7e7e7',
  },
});

function sortByDescription<T extends Switch | SwitchGroup>(a: [string, T], b: [string, T]): number {
  return a[1].description > b[1].description ? 1 : -1;
}

interface SaveButtonProps {
  saving: boolean;
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ saving, onSave }) => {
  return (
    <Buttons>
      <ButtonStyled variant="contained" onClick={onSave} disabled={saving}>
        <SaveIcon />
        Save
      </ButtonStyled>
    </Buttons>
  );
};

const Switchboard: React.FC<InnerProps<SupportFrontendSwitches>> = ({
  data,
  update,
  sendToS3,
  saving,
}: InnerProps<SupportFrontendSwitches>) => {
  const [pendingChanges, setPendingChanges] = useState<string[]>([]);

  const displayNeedToSaveDataWarning = (): JSX.Element | false => {
    return (
      pendingChanges.length > 0 && (
        <Alert severity="warning">
          Switch settings have been changed. Changes need to be saved before they take effect!
          Refresh the page to undo the changes.
          <List>
            {pendingChanges.map((change, index) => (
              <ListItem key={index}>
                <ListItemText primary={change} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )
    );
  };

  const setPendingChange = (changeName: string, description: string, groupId: string): void => {
    const unsavedChange = `${changeName} “${description}” in “${groupId}”`;
    // Add the changeName to the list of pendingChanges
    setPendingChanges((prevChanges) => [...prevChanges, unsavedChange]);
  };

  const updateSwitchSetting = (
    switchId: string,
    switchData: Switch,
    group: [string, SwitchGroup],
    isChecked: boolean,
  ): void => {
    const updatedState = cloneDeep(data);
    const [groupId, groupData] = group;
    updatedState[groupId].switches[switchId].state = isChecked ? SwitchState.On : SwitchState.Off;
    const currentSwitchState = updatedState[groupId].switches[switchId].state;
    update(updatedState);
    setPendingChange(
      'Turned ' + currentSwitchState + ':',
      switchData.description,
      groupData.description,
    );
  };

  const createSwitchesFromGroupData = (
    switchId: string,
    switchData: Switch,
    group: [string, SwitchGroup],
  ): JSX.Element => {
    const isChecked = switchData.state === SwitchState.On;

    return (
      <SwitchLayout key={switchId}>
        <FormControlLabel
          label={switchData.description}
          checked={switchData.state === SwitchState.On}
          control={<SwitchUI />}
          onChange={(): void => updateSwitchSetting(switchId, switchData, group, !isChecked)}
          value={switchId}
          key={switchId}
        />
        <IconButton
          onClick={(): void => actionRemoveSwitchData(group, switchId, switchData.description)}
          aria-label="Remove Switch"
        >
          <DeleteIcon />
        </IconButton>
      </SwitchLayout>
    );
  };

  const SwitchGroupForm: React.FC<{ group: [string, SwitchGroup] }> = ({ group }) => {
    const [groupId, groupData] = group;
    type FormData = {
      switchId: string;
      description: string;
    };
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>();

    const onSubmit = ({ switchId, description }: FormData): void => {
      const updatedState = cloneDeep(data);

      updatedState[groupId].switches[switchId] = {
        description: description,
        state: SwitchState.Off,
      };
      update(updatedState);
      setPendingChange('Added', description, groupData.description);
    };

    return (
      <FormControlStyled key={groupId}>
        <FormLabel>
          <strong>{groupData.description} </strong>
        </FormLabel>
        <br />
        {Object.entries(groupData.switches)
          .sort(sortByDescription)
          .map(([switchId, switchData]) =>
            createSwitchesFromGroupData(switchId, switchData, group),
          )}
        <InputGroup>
          <TextField
            sx={{ width: '33%' }}
            id={groupId + '-add-switch-switch-name'}
            error={errors.switchId !== undefined}
            helperText={errors.switchId ? errors.switchId.message : ''}
            {...register('switchId', {
              required: EMPTY_ERROR_HELPER_TEXT,
              validate: (switchId) => {
                return createDuplicateValidator(Object.keys(groupData.switches))(switchId);
              },
            })}
            label="Switch name"
            margin="normal"
            variant="outlined"
            autoFocus
            fullWidth
          />
          <span />
          <TextField
            sx={{ width: '33%' }}
            id={groupId + '-add-switch-switch-description'}
            error={errors.description !== undefined}
            helperText={errors.description ? errors.description.message : ''}
            {...register('description', {
              required: EMPTY_ERROR_HELPER_TEXT,
              validate: (description) => {
                return createDuplicateValidator(
                  Object.values(groupData.switches).map((switchData) => switchData.description),
                )(description);
              },
            })}
            label="Description"
            margin="normal"
            variant="outlined"
            autoFocus
            fullWidth
          />
          <span />
          <Buttons>
            <AddButton
              aria-label="Add switch"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)(e);
              }}
              disabled={saving}
            >
              <AddIcon />
            </AddButton>
          </Buttons>
        </InputGroup>
      </FormControlStyled>
    );
  };

  const createSwitchFields = (): JSX.Element => (
    <>
      {Object.entries(data)
        .sort(sortByDescription)
        .map((group) => (
          <SwitchGroupForm key={group[0]} group={group} />
        ))}
    </>
  );

  const actionSaveData = (): void => {
    sendToS3();
    setPendingChanges([]);
  };

  const actionRemoveSwitchData = (
    group: [string, SwitchGroup],
    switchId: string,
    description: string,
  ): void => {
    const userConfirmation = confirm(
      `Deleting switch "${description}". If this switch hasn’t been removed from support-frontend yet, this will cause errors! Make sure you delete it there first. Are you sure you want to proceed?`,
    );
    if (userConfirmation) {
      confirmRemoveData(group, switchId, description);
    }
  };

  const confirmRemoveData = (
    group: [string, SwitchGroup],
    switchId: string,
    description: string,
  ): void => {
    const [groupId, groupData] = group;
    const updatedState = cloneDeep(data);
    delete updatedState[groupId].switches[switchId];
    update(updatedState);
    setPendingChange('Removed', description, groupData.description);
  };

  return (
    <Form>
      <ExistingSwitchesHeader variant="h6">Manage existing switches</ExistingSwitchesHeader>

      {displayNeedToSaveDataWarning()}
      <SaveButton saving={saving} onSave={actionSaveData} />

      {createSwitchFields()}

      {displayNeedToSaveDataWarning()}
      <SaveButton saving={saving} onSave={actionSaveData} />
    </Form>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response type
const fetchSettings = (): Promise<any> => {
  return fetchSupportFrontendSettings(SupportFrontendSettingsType.Switches);
};

const saveSettings = (data: DataFromServer<SupportFrontendSwitches>): Promise<Response> => {
  return saveSupportFrontendSettings(SupportFrontendSettingsType.Switches, data);
};

export default withS3Data<SupportFrontendSwitches>(Switchboard, fetchSettings, saveSettings);
