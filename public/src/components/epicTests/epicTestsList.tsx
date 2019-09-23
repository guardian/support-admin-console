import React from 'react';
import {Button, createStyles, List, ListItem, Theme, Typography, withStyles, WithStyles} from "@material-ui/core";
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import {renderDeleteIcon, renderVisibilityIcons} from './utilities';
import {EpicTest, ModifiedTests, UserCohort} from './epicTestsForm';
import NewNameCreator from './newNameCreator';
import {MaxViewsDefaults} from "./maxViewsEditor";


const styles = ( { typography, spacing }: Theme ) => createStyles({
  root: {
    width: "250px",
  },
  testsList: {
    padding: 0
  },
  test: {
    border: "1px solid #999999",
    borderRadius: "10px",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
    padding: "5px",
    height: "60px",
    "&:hover": {
      background: "#ededed"
    }
  },
  selectedTest: {
    background: "#dcdcdc"
  },
  validTest: {
    boxShadow: "0 0 10px green"
  },
  invalidTest: {
    boxShadow: "0 0 10px red"
  },
  singleButtonContainer: {
    display: "block"
  },
  buttonsContainer: {
    marginRight: "10px",
    minWidth: "20px"
  },
  arrowButton: {
    padding: "2px",
    margin: "2px 0 2px 0",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    minWidth: "20px"
  },
  testText: {
    textAlign: "left",
    minWidth: "160px",
    maxWidth: "160px",
    marginRight: "10px"
  },
  testIndicator: {
    width: "20px",
    height: "20px"
  },
  arrowIcon: {
    height: "20px",
    "flex-shrink": "1"
  },
  deleted: {
    backgroundColor: "#999999"
  },
  deletedLabel: {
    backgroundColor: "red",
    borderRadius: "2px",
    padding: "2px",
    margin: "2px 0 0 0"
  },
  toBeDeleted: {
    fontSize: typography.pxToRem(10),
    fontWeight: typography.fontWeightMedium,
    backgroundColor: "#f44336",
    borderRadius: "2px",
    padding: "2px",
    width: "75px",
    textAlign: "center"
  },
  spacer: {
    minHeight: spacing.unit * 6
  }
});

interface EpicTestListProps extends WithStyles<typeof styles> {
  tests: EpicTest[],
  modifiedTests: ModifiedTests,
  selectedTestName: string | undefined,
  onUpdate: (tests: EpicTest[], modifiedTestName?: string) => void,
  onSelectedTestName: (testName: string) => void,
  editMode: boolean
}

class EpicTestsList extends React.Component<EpicTestListProps> {

  createTest = (newTestName: string) => {
    const newTest: EpicTest = {
      name: newTestName,
      isOn: false,
      locations: [],
      tagIds: [],
      sections: [],
      excludedTagIds: [],
      excludedSections: [],
      alwaysAsk: false,
      maxViews: MaxViewsDefaults,
      userCohort: UserCohort.AllNonSupporters,  // matches the default in dotcom
      isLiveBlog: false,
      hasCountryName: false,
      variants: [],
      highPriority: false,
      useLocalViewLog: false
    }
    const newTestList = [...this.props.tests, newTest];

    this.props.onUpdate(newTestList, newTestName);

    this.props.onSelectedTestName(newTest.name);
  }

  onTestSelected = (testName: string) => (event: React.MouseEvent<HTMLInputElement>): void => {
    this.props.onSelectedTestName(testName);
  };

  moveTestUp = (name: string) => {
    const newTests = [...this.props.tests];
    const indexOfName = newTests.findIndex(test => test.name === name);
    if (indexOfName > 0) {
      const beforeElement = newTests[indexOfName - 1];
      newTests[indexOfName-1] = newTests[indexOfName];
      newTests[indexOfName] = beforeElement;
    }
    this.props.onUpdate(newTests, name);
  }

  moveTestDown = (name: string) => {
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

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.root}>
          {this.props.editMode ? (
            <NewNameCreator
              text="test"
              existingNames={ this.props.tests.map(test => test.name) }
              onValidName={this.createTest}
              editEnabled={this.props.editMode}
            />
          ): (<div className={classes.spacer}>&nbsp;</div>)}

          <List className={classes.testsList} component="nav">
            {this.props.tests.map((test, index) => {

              const testStatus = this.props.modifiedTests[test.name];

              const classNames = [
                classes.test,
                testStatus && testStatus.isValid && !testStatus.isDeleted? classes.validTest : '',
                testStatus && !testStatus.isValid ? classes.invalidTest : '',
                this.props.selectedTestName === test.name ? classes.selectedTest : '',
                testStatus && testStatus.isDeleted ? classes.deleted : ''
              ].join(' ');

              return (
                <ListItem
                  className={classNames}
                  onClick={this.onTestSelected(test.name)}
                  key={index}
                >
                  { this.props.editMode ? this.renderReorderButtons(test.name, index) : <div className={classes.buttonsContainer}></div>}
                  <div className={classes.testText}>
                    <Typography noWrap={true}>{test.name}</Typography>
                    {(testStatus && testStatus.isDeleted) && (<div><Typography className={classes.toBeDeleted}>To be deleted</Typography></div>)}
                  </div>
                  {testStatus && testStatus.isDeleted ? renderDeleteIcon() : renderVisibilityIcons(test.isOn)}
                </ListItem>
              )
            })}
          </List>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(EpicTestsList);
