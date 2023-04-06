import React from 'react';
import { Button, List, ListItem, makeStyles, Typography } from '@material-ui/core';
import { 
  Territories,
  Territory,
  AmountsTests,
  Regions,
  Countries,
} from '../../utils/models';
import SaveIcon from '@material-ui/icons/Save';
import CreateTestButton from './CreateTestButton';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {},
  saveButton: {},
  saveButtonText: {},
  testButton: {},
  testButtonText: {},
  testSelectedButton: {},
  testSelectedButtonText: {},
  header: {},
  list: {},
}));

interface AmountsTestsListProps {
  tests: AmountsTests;
  selectedTest: Territory | undefined;
  onTargetSelected: (target: Territory) => void;
  save: () => void;
  saving: boolean;
  create: () => void;
  creating: boolean;
}

interface AmountsTestButtonProps {
  target: Territory;
}

const regionLabels = Object.keys(Regions);
const countryLabels = Object.keys(Countries);

const AmountsTestsList: React.FC<AmountsTestsListProps> = ({ 
  tests,
  selectedTest,
  onTargetSelected,
  save,
  saving,
  create,
  creating,
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

  const SaveButton: React.FC = () => (
    <Button
      variant="contained"
      color="primary"
      className={classes.saveButton}
      startIcon={<SaveIcon />}
      onClick={save}
      disabled={saving}
    >
      <Typography className={classes.saveButtonText}>{saving ? 'Saving' : 'Save'}</Typography>
    </Button>
  );

  const AmountsTestButton: React.FC<AmountsTestButtonProps> = ({ target }: AmountsTestButtonProps) => {
    return (
      <ListItem
        className={target === selectedTest ? classes.testSelectedButton : classes.testButton}
        onClick={(): void => onTargetSelected(target)}
        button
      >
        <div className={target === selectedTest ? classes.testSelectedButtonText : classes.testButtonText}>{Territories[target]}</div>
      </ListItem>
    );
  };

  return (
    <div className={classes.root}>
      <SaveButton />
      <Typography className={classes.header}>Region-wide tests</Typography>
      <div>
        <List className={classes.list}>
          {getRegionTests().map(t => <AmountsTestButton target={t} />)}
        </List>
      </div>

      <CreateTestButton 
        candidateTargets={getCountryTestCandidates()}
        create={create}
      />

      <Typography className={classes.header}>Country-specific tests</Typography>
      <div>
        <List className={classes.list}>
          {getExistingCountryTests().map(t => <AmountsTestButton target={t} />)}
        </List>
      </div>
    </div>
  );
};

export default AmountsTestsList;








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

