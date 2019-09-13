import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Typography } from "@material-ui/core";

export const renderVisibilityIcons = (isOn: boolean) => {
  return (
    isOn ?
      <VisibilityIcon color={'action'} />
      :
      <VisibilityOffIcon color={'disabled'} />
  );
};

export const renderVisibilityHelpText = (isOn: boolean) => {
  return (
    isOn ?
    <Typography color={'textSecondary'}>(Visible at <a href="https://www.theguardian.com/">theguardian.com</a>)</Typography>
    :
    <Typography color={'textSecondary'}>(Visible at <a href="https://www.theguardian.com#show-draft-epics">theguardian.com#show-draft-epics</a>)</Typography>
  );
}
