import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
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
    <Typography color={'textSecondary'}>(Visible to readers at <a href="https://www.theguardian.com">theguardian.com</a>)</Typography>
    :
    <Typography color={'textSecondary'}>(Only visible at <a href="https://www.theguardian.com">theguardian.com</a> if you add <em>#show-draft-epics</em> at the end of the url)</Typography>
  );
};

export const renderDeleteIcon = () => {
  return (
    <DeleteForeverIcon color={'error'} />
  )
};
