import React, { useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import {
  Divider,
  Typography,
  Button,
  FormLabel,
  FormControl,
  FormControlLabel, TextField, IconButton,
} from '@material-ui/core';
import SwitchUI from '@material-ui/core/Switch';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';

import cloneDeep from 'lodash/cloneDeep';

import {
  SupportFrontendSettingsType,
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
} from '../utils/requests';

import withS3Data, { InnerProps, DataFromServer } from '../hocs/withS3Data';
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
} from "./channelManagement/helpers/validation";
import {useForm} from "react-hook-form";

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
  },
  button: {
    marginRight: spacing(2),
  },
  addButton: {
    padding: "0.2em",
    margin: "0.1em 0.2em",
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
    display: "inline-block",
    width:"33%",
    float: "left",
    padding: "0.2em",
    margin: "0.1em 0.2em",
  },
  inputSpacing: {
    padding: '10px 12px',
    float: "left",
  },
}));

function sortByDescription<T extends Switch | SwitchGroup>(a: [string, T], b: [string, T]): number {
  return a[1].description > b[1].description ? 1 : -1;
}

const Switchboard: React.FC<InnerProps<SupportFrontendSwitches>> = ({
  data,
  setData,
  saveData,
  saving,
}: InnerProps<SupportFrontendSwitches>) => {
  const classes = useStyles();

  const [needToSaveDataWarning, setNeedToSaveDataWarning] = useState(false);
  type FormData = {
    switchId: string;
    description: string;
  };


  const displayNeedToSaveDataWarning = (): JSX.Element | false => {
    return (
      needToSaveDataWarning && (
        <Alert severity="warning">
          Switch settings have been changed. Changes need to be saved before they take effect!
        </Alert>
      )
    );
  };

  const updateSwitchSetting = (
    switchId: string,
    switchData: Switch,
    groupId: string,
    isChecked: boolean,
  ): void => {
    const updatedState = cloneDeep(data);

    updatedState[groupId].switches[switchId].state = isChecked ? SwitchState.On : SwitchState.Off;

    setData(updatedState);
    setNeedToSaveDataWarning(true);
  };

  const createSwitchesFromGroupData = (
    switchId: string,
    switchData: Switch,
    groupId: string,
  ): JSX.Element => {
    const isChecked = switchData.state === 'On';

    return (
      <div>
      <FormControlLabel
        label={switchData.description}
        checked={switchData.state === 'On'}
        control={<SwitchUI />}
        onChange={(): void => updateSwitchSetting(switchId, switchData, groupId, !isChecked)}
        value={switchId}
        key={switchId}
      />
        <IconButton onClick={(): void => actionRemoveSwitchData(groupId,switchId,switchData.description)} aria-label="removeSwitch">
          <DeleteIcon />
        </IconButton>

  </div>
    );
  };

  const createGroupsFromData = (group: [string, SwitchGroup]): JSX.Element => {
    const [groupId, groupData] = group;
    const { register, handleSubmit, errors } = useForm<FormData>();

    const onSubmit = ({ switchId,description }: FormData): void => {
      const updatedState = cloneDeep(data);

      updatedState[groupId].switches[switchId] = { description: description, state: SwitchState.Off };
      setData(updatedState);
      setNeedToSaveDataWarning(true);
    };

    return (

      <FormControl className={classes.formControl} key={groupId}>
        <FormLabel  >{groupData.description}</FormLabel>
        {Object.entries(groupData.switches)
          .sort(sortByDescription)
          .map(([switchId, switchData]) =>
            createSwitchesFromGroupData(switchId, switchData, groupId),
          )}
        <div>
        <TextField
          className={classes.input}
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: switchId => {
              return (
                createDuplicateValidator(Object.entries(groupData.switches).map(([switchId, switchData])=>switchId))(switchId)
              );
            },
          })}
          error={errors.switchId !== undefined}
          helperText={errors.switchId ? errors.switchId.message : ""}
          name="switchId"
          label="Switch name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
          <span  className={classes.inputSpacing}/>
        <TextField
          className={classes.input}
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: description => {
              return undefined
            },
          })}
          error={errors.description !== undefined}
          helperText={errors.description ? errors.description.message : ""}
          name="description"
          label="Description"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
          <span className={classes.inputSpacing}/>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              className={classes.addButton}
              disabled={saving}
            >
              <AddIcon/>
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
    saveData();
    setNeedToSaveDataWarning(false);
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

  const actionRemoveSwitchData = ( groupId: string,
                                   switchId: string,
                                   description: string,
  ): void => {
    const userConfirmation=confirm(`Deleting switch "${description}". If this switch hasn’t been removed from support-frontend yet, this will cause errors! Make sure you delete it there first. Are you sure you want to proceed?`)
    console.log("UserConfirm",userConfirmation)
    userConfirmation ? confirmRemoveData(groupId,switchId,description) :   ""
  };

  const confirmRemoveData = (groupId: string,switchId:string,description:string): void  => {
    const updatedState = cloneDeep(data);
    delete updatedState[groupId].switches[switchId]
    setData(updatedState);
    setNeedToSaveDataWarning(true);
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

      <Divider variant="fullWidth" className={classes.divider} />

      <Typography className={classes.newSwitchesHeader} variant="h6">
        Create new switches
      </Typography>
      <Typography className={classes.textParagraph} variant="body1">
        Currently, to create a new switch, update the JSON file in AWS S3 to include details of the
        switch, then refresh this page so that the switch status can be viewed and updated. Also,
        you need to add the new switch to{' '}
        <a href="https://github.com/guardian/support-frontend/blob/main/support-frontend/app/admin/settings/Switches.scala">
          support-frontend.
        </a>
      </Typography>
      <Typography className={classes.textParagraph} variant="body1">
        If there is a demand for it, we can add functionality to create new switches (and new switch
        groups) to this page in due course.
      </Typography>
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
