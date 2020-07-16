import React from 'react';
import {Button, createStyles, List, ListItem, Theme, Typography, withStyles, WithStyles, Tooltip, createMuiTheme, MuiThemeProvider} from "@material-ui/core";

import { BannerTest } from './bannerTestsForm';
import NewNameCreator from '../newNameCreator';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArchiveIcon from '@material-ui/icons/Archive';
import { renderVisibilityIcons } from '../helpers/utilities';
import { ModifiedTests, UserCohort, TestStatus } from '../helpers/shared';

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

interface BannerTestListProps extends WithStyles<typeof styles> {
  tests: BannerTest[],
  modifiedTests: ModifiedTests,
  selectedTestName: string | undefined,
  onUpdate: (tests: BannerTest[], modifiedTestName?: string) => void,
  onSelectedTestName: (testName: string) => void,
  editMode: boolean
}
class BannerTestsList extends React.Component<BannerTestListProps> {

  createTest = (newBannerTestName: string, newBannerTestNickname: string) => {
    const newTest: BannerTest = {
      name: newBannerTestName,
      nickname: newBannerTestNickname,
      isOn: false,
      minArticlesBeforeShowingBanner: 0,
      userCohort: UserCohort.AllNonSupporters,
      locations: [],
      variants: [],
      articlesViewedSettings: undefined,
    }
    const newBannerTestList = [...this.props.tests, newTest];

    this.props.onUpdate(newBannerTestList, newBannerTestName);

  }

  onTestSelected = (testName: string) => (event: React.MouseEvent<HTMLInputElement>): void => {
    this.props.onSelectedTestName(testName);
  };

  moveTestUp = (name: string): void => {
    const newTests = [...this.props.tests];
    const indexOfName = newTests.findIndex(test => test.name === name);
    if (indexOfName > 0) {
      const beforeElement = newTests[indexOfName - 1];
      newTests[indexOfName-1] = newTests[indexOfName];
      newTests[indexOfName] = beforeElement;
    }
    this.props.onUpdate(newTests, name);
  }

  moveTestDown = (name: string): void => {
    const newTests = [...this.props.tests];
    const indexOfName = newTests.findIndex(test => test.name === name);
    if (indexOfName < newTests.length - 1) {
      const afterElement = newTests[indexOfName + 1];
      newTests[indexOfName + 1] = newTests[indexOfName];
      newTests[indexOfName] = afterElement;
    }
    this.props.onUpdate(newTests, name);
  }

  renderReorderButtons = (testName: string, index: number) => {
    return (
      <div className={this.props.classes.buttonsContainer}>
        <div className={this.props.classes.singleButtonContainer}>
          {index > 0 &&
            <Button
              color={'default'}
              className={this.props.classes.arrowButton}
              variant={'contained'}
              onClick={() => this.moveTestUp(testName)}>
              <ArrowUpward className={this.props.classes.arrowIcon}/>
            </Button>
          }
        </div>
        <div className={this.props.classes.singleButtonContainer}>
          {index < this.props.tests.length - 1 &&
            <Button
              color={'default'}
              className={this.props.classes.arrowButton}
              variant={'contained'}
              onClick={() => this.moveTestDown(testName)}>
                <ArrowDownward className={this.props.classes.arrowIcon}/>
            </Button>
          }
        </div>
      </div>
    )
  }

  renderDeletedOrArchivedIcon = (testStatus: TestStatus): React.ReactNode => {
    const { classes } = this.props;
    if (testStatus.isDeleted) {
      return <DeleteForeverIcon className={classes.deletedIcon} />;
    }
    else if (testStatus.isArchived) {
      return <ArchiveIcon className={classes.archiveIcon} />;
    }
    return null;
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.root}>
          {this.props.editMode ? (
            <NewNameCreator
              type="test"
              action="Create a new"
              existingNames={this.props.tests.map(test => test.name)}
              existingNicknames={
                this.props.tests
                  .map(test => test.nickname)
                  .filter(nickname => !!nickname) as string[]
              }
              onValidName={this.createTest}
              editEnabled={this.props.editMode}
            />
          ): (<div className={classes.spacer}>&nbsp;</div>)}

          <List className={classes.testsList} component="nav">
            {this.props.tests.map((test, index) => {

              const testStatus = this.props.modifiedTests[test.name];
              const toStrip = /^\d{4}-\d{2}-\d{2}_(contribs*_|moment_)*/;

              const classNames = [
                classes.test,
                testStatus && testStatus.isValid && !testStatus.isDeleted && !testStatus.isArchived ? classes.validTest : '',
                testStatus && !testStatus.isValid ? classes.invalidTest : '',
                this.props.selectedTestName === test.name ? classes.selectedTest : '',
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
                      onClick={this.onTestSelected(test.name)}
                      button={true}
                    >
                      { this.props.editMode ? this.renderReorderButtons(test.name, index) : <div className={classes.buttonsContainer}></div>}
                      <div className={classes.testText}>
                        <Typography
                          className={classes.testName}
                          noWrap={true}>
                            {test.nickname ? test.nickname : test.name.replace(toStrip, '')}
                        </Typography>

                        {(testStatus && testStatus.isDeleted) && (<div><Typography className={classes.toBeDeleted}>To be deleted</Typography></div>)}

                        {(testStatus && testStatus.isArchived) && (<div><Typography className={classes.toBeArchived}>To be archived</Typography></div>)}
                      </div>
                      {testStatus && (testStatus.isDeleted || testStatus.isArchived) ? this.renderDeletedOrArchivedIcon(testStatus) : renderVisibilityIcons(test.isOn)}
                    </ListItem>
                  </Tooltip>
                </MuiThemeProvider>
              )
            })}
          </List>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(BannerTestsList);
