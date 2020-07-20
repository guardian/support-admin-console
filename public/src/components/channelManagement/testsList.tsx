import React from 'react';
import {Button, createStyles, List, ListItem, Theme, Typography, withStyles, WithStyles, Tooltip, createMuiTheme, MuiThemeProvider} from "@material-ui/core";

import NewNameCreator from './newNameCreator';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArchiveIcon from '@material-ui/icons/Archive';
import { renderVisibilityIcons } from './helpers/utilities';
import { ModifiedTests, TestStatus } from './helpers/shared';
import {Test} from "./helpers/shared";

const styles = ( { typography, spacing }: Theme ) => createStyles({
  root: {
    width: "300px",
  },
  testsList: {
    padding: 0
  },
  test: {
    border: '1px solid #999999',
    borderRadius: '10px',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px',
    height: '60px',
    '&:hover': {
      background: '#ededed'
    }
  },
  selectedTest: {
    background: '#dcdcdc'
  },
  validTest: {
    boxShadow: '0 0 10px green'
  },
  invalidTest: {
    boxShadow: '0 0 10px red'
  },
  singleButtonContainer: {
    display: 'block'
  },
  buttonsContainer: {
    marginRight: '10px',
    minWidth: '20px'
  },
  arrowButton: {
    padding: '2px',
    margin: '2px 0 2px 0',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    minWidth: '20px'
  },
  testText: {
    textAlign: "left",
    minWidth: "200px",
    maxWidth: "200px",
    marginRight: "10px"
  },
  testIndicator: {
    width: '20px',
    height: '20px'
  },
  arrowIcon: {
    height: '20px',
    'flex-shrink': '1'
  },
  deleted: {
    backgroundColor: '#dcdcdc',
    '&:hover': {
      backgroundColor: '#999999'
    }
  },
  toBeDeleted: {
    fontSize: typography.pxToRem(10),
    fontWeight: typography.fontWeightMedium,
    backgroundColor: '#ab0613',
    borderRadius: '2px',
    padding: '2px',
    width: '75px',
    textAlign: 'center',
    color: 'white'
  },
  deletedIcon: {
    color: '#ab0613'
  },
  archived: {
    backgroundColor: '#e7d4b9',
    '&:hover': {
      backgroundColor: '#eacca0'
    }
  },
  toBeArchived: {
    fontSize: typography.pxToRem(10),
    fontWeight: typography.fontWeightMedium,
    backgroundColor: '#a1845c',
    borderRadius: '2px',
    padding: '2px',
    width: '75px',
    textAlign: 'center',
    color: 'white'
  },
  archiveIcon: {
    color: '#a1845c'
  },
  spacer: {
    minHeight: spacing(6)
  },
  testName: {
    fontSize: '0.875rem'
  }
});

const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#333333'
      }
    }
  }
});

interface TestListProps<T extends Test>  {
  tests: T[],
  modifiedTests: ModifiedTests,
  selectedTestName?: string,
  onUpdate: (tests: T[], modifiedTestName?: string) => void,
  createDefaultTest: (newTestName: string, newTestNickname: string) => T,
  onSelectedTestName: (testName: string) => void,
  editMode: boolean
}

const TestsList = <T extends Test>(props: TestListProps<T> & WithStyles<typeof styles>) => {
  const { classes } = props;

  const createTest = (newTestName: string, newTestNickname: string) => {
    const newTest = props.createDefaultTest(newTestName, newTestNickname);
    const newTestList = [...props.tests, newTest];

    props.onUpdate(newTestList, newTestName);
  };

  const onTestSelected = (testName: string) => (event: React.MouseEvent<HTMLInputElement>): void => {
    props.onSelectedTestName(testName);
  };

  const moveTestUp = (name: string): void => {
    const newTests = [...props.tests];
    const indexOfName = newTests.findIndex(test => test.name === name);
    if (indexOfName > 0) {
      const beforeElement = newTests[indexOfName - 1];
      newTests[indexOfName-1] = newTests[indexOfName];
      newTests[indexOfName] = beforeElement;
    }
    props.onUpdate(newTests, name);
  };

  const moveTestDown = (name: string): void => {
    const newTests = [...props.tests];
    const indexOfName = newTests.findIndex(test => test.name === name);
    if (indexOfName < newTests.length - 1) {
      const afterElement = newTests[indexOfName + 1];
      newTests[indexOfName + 1] = newTests[indexOfName];
      newTests[indexOfName] = afterElement;
    }
    props.onUpdate(newTests, name);
  };

  const renderReorderButtons = (testName: string, index: number) => {
    return (
      <div className={props.classes.buttonsContainer}>
        <div className={props.classes.singleButtonContainer}>
          {index > 0 &&
          <Button
            color={'default'}
            className={props.classes.arrowButton}
            variant={'contained'}
            onClick={() => moveTestUp(testName)}>
            <ArrowUpward className={props.classes.arrowIcon}/>
          </Button>
          }
        </div>
        <div className={props.classes.singleButtonContainer}>
          {index < props.tests.length - 1 &&
          <Button
            color={'default'}
            className={props.classes.arrowButton}
            variant={'contained'}
            onClick={() => moveTestDown(testName)}>
            <ArrowDownward className={props.classes.arrowIcon}/>
          </Button>
          }
        </div>
      </div>
    )
  };

  const renderDeletedOrArchivedIcon = (testStatus: TestStatus): React.ReactNode => {
    const { classes } = props;
    if (testStatus.isDeleted) {
      return <DeleteForeverIcon className={classes.deletedIcon} />;
    }
    else if (testStatus.isArchived) {
      return <ArchiveIcon className={classes.archiveIcon} />;
    }
    return null;
  };

  return (
    <>
      <div className={classes.root}>
        {props.editMode ? (
          <NewNameCreator
            type="test"
            action="Create a new"
            existingNames={props.tests.map(test => test.name)}
            existingNicknames={
              props.tests
                .map(test => test.nickname)
                .filter(nickname => !!nickname) as string[]
            }
            onValidName={createTest}
            editEnabled={props.editMode}
          />
        ): (<div className={classes.spacer}>&nbsp;</div>)}

        <List className={classes.testsList} component="nav">
          {props.tests.map((test, index) => {

            const testStatus = props.modifiedTests[test.name];
            const toStrip = /^\d{4}-\d{2}-\d{2}_(contribs*_|moment_)*/;

            const classNames = [
              classes.test,
              testStatus && testStatus.isValid && !testStatus.isDeleted && !testStatus.isArchived ? classes.validTest : '',
              testStatus && !testStatus.isValid ? classes.invalidTest : '',
              props.selectedTestName === test.name ? classes.selectedTest : '',
              testStatus && testStatus.isDeleted ? classes.deleted : '',
              testStatus && testStatus.isArchived ? classes.archived : ''
            ].join(' ');

            return (
              <MuiThemeProvider
                theme={theme}
                key={index}
              >
                <Tooltip
                  title={test.name}
                  aria-label="test name"
                  placement="right"
                >
                  <ListItem
                    className={classNames}
                    onClick={onTestSelected(test.name)}
                    button={true}
                  >
                    { props.editMode ? renderReorderButtons(test.name, index) : <div className={classes.buttonsContainer}/>}
                    <div className={classes.testText}>
                      <Typography
                        className={classes.testName}
                        noWrap={true}>
                        {test.nickname ? test.nickname : test.name.replace(toStrip, '')}
                      </Typography>

                      {(testStatus && testStatus.isDeleted) && (<div><Typography className={classes.toBeDeleted}>To be deleted</Typography></div>)}

                      {(testStatus && testStatus.isArchived) && (<div><Typography className={classes.toBeArchived}>To be archived</Typography></div>)}
                    </div>
                    {testStatus && (testStatus.isDeleted || testStatus.isArchived) ? renderDeletedOrArchivedIcon(testStatus) : renderVisibilityIcons(test.isOn)}
                  </ListItem>
                </Tooltip>
              </MuiThemeProvider>
            )
          })}
        </List>
      </div>
    </>
  )
};

// Hack to work around material UI breaking type checking when class has type parameters - https://stackoverflow.com/q/52567697
export default function WrappedTestsList<T extends Test>(props: TestListProps<T>): React.ReactElement<TestListProps<T>> {
  const wrapper = withStyles(styles)(
    TestsList
  ) as any;

  return React.createElement(wrapper, props);
}
