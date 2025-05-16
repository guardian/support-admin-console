import React, { useState } from 'react';

import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import {
  Typography,
  Button,
  FormLabel,
  FormControl,
  FormControlLabel,
  TextField,
  IconButton,
  List,
  ListItem,
} from '@mui/material';
import SwitchUI from '@mui/material/Switch';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/lab/Alert';

import cloneDeep from 'lodash/cloneDeep';

import {
  SupportFrontendSettingsType,
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
} from '../utils/requests';

import withS3Data, { InnerProps, DataFromServer } from '../hocs/withS3Data';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
} from './channelManagement/helpers/validation';
import { useForm } from 'react-hook-form';
import ListItemText from '@mui/material/ListItemText';

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
  switches: {
    [switchName: string]: Switch;
  };
}

interface SupportFrontendSwitches {
  [groupName: string]: SwitchGroup;
}

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  formControl: {
    marginRight: spacing(4),
    marginBottom: spacing(4),
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    border: `1px solid ${palette.grey['300']}`,
    width: '45%',
  },
  button: {
    marginRight: spacing(2),
  },
  addButton: {
    padding: '0.2em',
    margin: '0.1em 0.2em',
  },
  buttons: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
  form: {
    marginTop: spacing(4),
    marginLeft: spacing(4),
    marginRight: spacing(4),
    marginBottom: spacing(4),
    overflowY: 'auto',
  },
  divider: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
  },
  existingSwitchesHeader: {
    marginBottom: spacing(2),
  },
  newSwitchesHeader: {
    marginBottom: spacing(2),
  },
  textParagraph: {
    marginBottom: spacing(2),
  },
  input: {
    width: '33%',
  },
  inputGroup: {
    marginTop: spacing(2),
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  switchLayout: {
    display: 'flex',
    justifyContent: 'space-between',
    '&:nth-child(even)': {
      backgroundColor: '#e7e7e7',
    },
  },
}));

function sortByDescription<T extends Switch | SwitchGroup>(a: [string, T], b: [string, T]): number {
  return a[1].description > b[1].description ? 1 : -1;
}

const Switchboard: React.FC<InnerProps<SupportFrontendSwitches>> = ({
  data,
  update,
  sendToS3,
  saving,
}: InnerProps<SupportFrontendSwitches>) => {
  const classes = useStyles();

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
    setPendingChanges(prevChanges => [...prevChanges, unsavedChange]);
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
    const isChecked = switchData.state === 'On';

    return (
      <div className={classes.switchLayout}>
        <FormControlLabel
          label={switchData.description}
          checked={switchData.state === 'On'}
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
      </div>
    );
  };

  const createGroupsFromData = (group: [string, SwitchGroup]): JSX.Element => {
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
      <FormControl className={classes.formControl} key={groupId}>
        <FormLabel>
          <strong>{groupData.description} </strong>
        </FormLabel>
        <br />
        {Object.entries(groupData.switches)
          .sort(sortByDescription)
          .map(([switchId, switchData]) =>
            createSwitchesFromGroupData(switchId, switchData, group),
          )}
        <div className={classes.inputGroup}>
          <TextField
            className={classes.input}
            id={groupId + '-add-switch-switch-name'}
            error={errors.switchId !== undefined}
            helperText={errors.switchId ? errors.switchId.message : ''}
            {...register('switchId', {
              required: EMPTY_ERROR_HELPER_TEXT,
              validate: switchId => {
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
            className={classes.input}
            id={groupId + '-add-switch-switch-description'}
            error={errors.description !== undefined}
            helperText={errors.description ? errors.description.message : ''}
            {...register('description', {
              required: EMPTY_ERROR_HELPER_TEXT,
              validate: description => {
                return createDuplicateValidator(
                  Object.values(groupData.switches).map(switchData => switchData.description),
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
          <div className={classes.buttons}>
            <Button
              aria-label="Add switch"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              className={classes.addButton}
              disabled={saving}
            >
              <AddIcon />
            </Button>
          </div>
        </div>
      </FormControl>
    );
  };

  const createSwitchFields = (): JSX.Element => (
    <>
      {Object.entries(data)
        .sort(sortByDescription)
        .map(group => createGroupsFromData(group))}
    </>
  );

  const actionSaveData = (): void => {
    sendToS3();
    setPendingChanges([]);
  };

  const SaveButton = (): JSX.Element => (
    <div className={classes.buttons}>
      <Button
        variant="contained"
        onClick={actionSaveData}
        className={classes.button}
        disabled={saving}
      >
        <SaveIcon />
        Save
      </Button>
    </div>
  );

  const actionRemoveSwitchData = (
    group: [string, SwitchGroup],
    switchId: string,
    description: string,
  ): void => {
    const userConfirmation = confirm(
      `Deleting switch "${description}". If this switch hasn’t been removed from support-frontend yet, this will cause errors! Make sure you delete it there first. Are you sure you want to proceed?`,
    );
    userConfirmation ? confirmRemoveData(group, switchId, description) : '';
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
    <form className={classes.form}>
      <Typography className={classes.existingSwitchesHeader} variant="h6">
        Manage existing switches
      </Typography>

      {displayNeedToSaveDataWarning()}
      <SaveButton />

      {createSwitchFields()}

      {displayNeedToSaveDataWarning()}
      <SaveButton />
    </form>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = (): Promise<any> => {
  return fetchSupportFrontendSettings(SupportFrontendSettingsType.switches);
};

const saveSettings = (data: DataFromServer<SupportFrontendSwitches>): Promise<Response> => {
  return saveSupportFrontendSettings(SupportFrontendSettingsType.switches, data);
};

export default withS3Data<SupportFrontendSwitches>(Switchboard, fetchSettings, saveSettings);
