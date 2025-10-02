import React from 'react';
import { ListItem, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';
import { PromoCampaign } from './utils/promoModels';
import useHover from '../../hooks/useHover';

const useStyles = makeStyles(() => ({
  listItem: {
    position: 'relative',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '4px',
    padding: '0 12px',
    border: `1px solid ${grey[400]}`,
    marginBottom: '5px',

    '&:hover': {
      background: `${grey[700]}`,
    },
  },
  text: {
    maxWidth: '190px',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '24px',
    textTransform: 'uppercase',
  },
  textInverted: {
    color: '#FFFFFF',
  },
  inverted: {
    background: `${grey[700]}`,
    border: `1px solid ${grey[700]}`,
  },
  whitePencil: {
    color: 'white',
  },
  labelAndNameContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: '4px',
    },
  },
}));

interface Props {
  key: string;
  promoCampaign: PromoCampaign;
  isSelected: boolean;
  onPromoCampaignSelected: (promoCampaignCode: string) => void;
}

export const PromoCampaignsListItem = ({
  key,
  promoCampaign,
  isSelected,
  onPromoCampaignSelected,
}: Props): React.ReactElement => {
  const classes = useStyles();

  const [ref, isHovered] = useHover<HTMLDivElement>();

  const itemContainerClasses = [classes.listItem];
  const shouldInvertColor = isHovered || isSelected;
  if (shouldInvertColor) {
    itemContainerClasses.push(classes.inverted);
  }

  const textClasses = [classes.text];
  if (isSelected) {
    textClasses.push(classes.textInverted);
  }

  console.log(`The promoCode Name is: ${promoCampaign.name} and it is ${isSelected}`);

  return (
    <ListItem
      button={true}
      className={itemContainerClasses.join(' ')}
      key={key}
      onClick={(): void => onPromoCampaignSelected(promoCampaign.campaignCode)}
      ref={ref}
    >
      <div className={classes.labelAndNameContainer}>
        <Typography className={textClasses.join(' ')}>{promoCampaign.name}</Typography>
      </div>
    </ListItem>
  );
};
