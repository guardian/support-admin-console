import React from 'react';
import { List, ListItem, makeStyles, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { 
  Territories,
  Territory,
  AmountsTests,
  Regions,
  Countries,
  CountryOptions,
} from '../../utils/models';
import { CreateTestButton } from './CreateTestButton';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  header: {
    margin: '12px',
    fontSize: '18px',
  },
  list: {
    marginTop: 0,
    padding: 0,
    '& > * + *': {
      marginTop: '8px',
    },
  },
  testButton: {
    position: 'relative',
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px',
    padding: '0 12px',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
  testNotSelected: {
    border: `1px solid ${palette.grey[700]}`,
    backgroundColor: 'white',
    color: palette.grey[700],
    '&:hover': {
      backgroundColor: palette.grey[300],
    },
  },
  testIsSelected: {
    border: `1px solid ${palette.grey[700]}`,
    color: 'white',
    backgroundColor: palette.grey[700],
    '&:hover': {
      color: palette.grey[700],
      backgroundColor: palette.grey[300],
    },
  },
  liveTestNotSelected: {
    border: `1px solid ${red[500]}`,
    backgroundColor: 'white',
    color: palette.grey[700],
    '&:hover': {
      backgroundColor: palette.grey[300],
    },
  },
  liveTestIsSelected: {
    border: `1px solid ${red[500]}`,
    color: 'white',
    backgroundColor: red[500],
    '&:hover': {
      color: palette.grey[700],
      backgroundColor: palette.grey[300],
    },
  },
}));

interface AmountsTestsListProps {
  tests: AmountsTests;
  selectedTest: Territory | undefined;
  onTargetSelected: (target: Territory) => void;
  create: (selected: CountryOptions) => void;
}

interface AmountsTestButtonProps {
  target: Territory;
}

const regionLabels = Object.keys(Regions);
const countryLabels = Object.keys(Countries);

export const AmountsTestsList: React.FC<AmountsTestsListProps> = ({ 
  tests,
  selectedTest,
  onTargetSelected,
  create,
}: AmountsTestsListProps) => {
  const classes = useStyles();

  const getRegionTests = () => {
    const regionTests = tests.filter(t => regionLabels.includes(t.target as string));
    const regionTestStrings = regionTests.map(t => t.target);
    return regionTestStrings.sort();
  };

  const getExistingCountryTests = () => {
    const countryTests = tests.filter(t => !regionLabels.includes(t.target as string));
    const countryTestStrings = countryTests.map(t => t.target);
    return countryTestStrings.sort();
  };

  const getCountryTestCandidates = () => {
    const existingCountryTests = getExistingCountryTests();
    const potentialTests = countryLabels.filter(l => !existingCountryTests.includes(l));
    return potentialTests.sort();
  };

  const getButtonStyling = (target: Territory) => {
    const myTest = tests.filter(t => target === t.target)[0];
    const res = [classes.testButton];
    if (target === selectedTest) {
      if (myTest.isLive) {
        res.push(classes.liveTestIsSelected);
      }
      else {
        res.push(classes.testIsSelected);
      }
    }
    else {
      if (myTest.isLive) {
        res.push(classes.liveTestNotSelected);
      }
      else {
        res.push(classes.testNotSelected);
      }
    }
    return res.join(' ');
  }

  const AmountsTestButton: React.FC<AmountsTestButtonProps> = ({ target }: AmountsTestButtonProps) => {
    return (
      <ListItem
        className={getButtonStyling(target)}
        onClick={(): void => onTargetSelected(target)}
        button
      >
        {Territories[target]}
      </ListItem>
    );
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Region-wide tests</Typography>
      <div>
        <List className={classes.list}>
          {getRegionTests().map(t => <AmountsTestButton key={t} target={t} />)}
        </List>
      </div>

      <Typography className={classes.header}>Country-specific tests</Typography>

      <CreateTestButton 
        candidateTargets={getCountryTestCandidates()}
        create={create}
      />

      <div>
        <List className={classes.list}>
          {getExistingCountryTests().map(t => <AmountsTestButton key={t} target={t} />)}
        </List>
      </div>
    </div>
  );
};








// import React from 'react';
// import { Button, List, ListItem, makeStyles, Typography } from '@material-ui/core';
// import { Region, getPrettifiedRegionName } from '../../utils/models';
// import SaveIcon from '@material-ui/icons/Save';

// const useStyles = makeStyles(({ palette, spacing }) => ({
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     paddingLeft: '32px',
//   },
//   header: {
//     marginTop: '32px',
//     fontSize: '14px',
//   },
//   list: {
//     '& > * + *': {
//       marginTop: spacing(1),
//     },
//   },
//   test: {
//     position: 'relative',
//     height: '50px',
//     width: '290px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     background: 'white',
//     borderRadius: '4px',
//     padding: '0 12px',
//   },
//   draft: {
//     border: `1px solid ${palette.grey[700]}`,
//   },
//   text: {
//     maxWidth: '190px',
//     fontSize: '12px',
//     fontWeight: 500,
//     lineHeight: '24px',
//     textTransform: 'uppercase',
//   },
//   button: {
//     justifyContent: 'start',
//     height: '48px',
//   },
//   buttonText: {
//     fontSize: '12px',
//     fontWeight: 500,
//     textTransform: 'uppercase',
//     letterSpacing: '1px',
//   },
// }));

// interface SidebarItemProps {
//   region: Region;
// }

// interface SidebarProps {
//   onRegionSelected: (region: Region) => void;
//   save: () => void;
//   saving: boolean;
// }

// const Sidebar: React.FC<SidebarProps> = ({ onRegionSelected, save, saving }: SidebarProps) => {
//   const classes = useStyles();

//   const SidebarSaveButton: React.FC = () => (
//     <Button
//       variant="contained"
//       color="primary"
//       className={classes.button}
//       startIcon={<SaveIcon />}
//       onClick={save}
//       disabled={saving}
//     >
//       <Typography className={classes.buttonText}>{saving ? 'Saving' : 'Save'}</Typography>
//     </Button>
//   );

//   const SidebarItem: React.FC<SidebarItemProps> = ({ region }: SidebarItemProps) => {
//     return (
//       <ListItem
//         className={`${classes.test} ${classes.draft}`}
//         onClick={(): void => onRegionSelected(region)}
//         button
//       >
//         <div className={classes.text}>{getPrettifiedRegionName(region)}</div>
//       </ListItem>
//     );
//   };

//   return (
//     <div className={classes.root}>
//       <SidebarSaveButton />
//       <Typography className={classes.header}>Tests by region</Typography>
//       <div>
//         <List className={classes.list}>
//           <SidebarItem region={Region.GBPCountries} />
//           <SidebarItem region={Region.UnitedStates} />
//           <SidebarItem region={Region.Canada} />
//           <SidebarItem region={Region.EURCountries} />
//           <SidebarItem region={Region.AUDCountries} />
//           <SidebarItem region={Region.NZDCountries} />
//           <SidebarItem region={Region.International} />
//         </List>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

