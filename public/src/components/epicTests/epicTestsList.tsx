import React from 'react';

import {
  List, ListItem, createStyles, WithStyles, withStyles, Typography, Button
} from "@material-ui/core";
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { EpicTest } from './epicTestsForm';
import EpicTestEditor from './epicTestEditor';
import NewNameCreator from './newNameCreator';


const styles = () => createStyles({
  testListAndEditor: {
    display: "flex"
  },
  testsList: {
    minWidth: "250px",
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
  singleButtonContainer: {
    display: "block"
  },
  buttonsContainer: {
    marginRight: "10px",
    width: "20px",
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
    width: "200px",
    marginRight: "10px"
  },
  testIndicator: {
    width: "20px",
    height: "20px"
  },
  testIsOn: {
    backgroundColor: "#ffe500",
    borderRadius: "50%"
  },
  arrowIcon: {
    height: "20px",
    "flex-shrink": "1"
  }
});

interface EpicTestListProps extends WithStyles<typeof styles> {
  tests: EpicTest[],
  selectedTestName: string | undefined,
  onUpdate: (tests: EpicTest[]) => void,
  onSelectedTestName: (testName: string) => void
}

class EpicTestsList extends React.Component<EpicTestListProps> {


  onTestChange = (updatedTest: EpicTest): void => {
    const updatedTests = this.props.tests.map(test => test.name === updatedTest.name ? updatedTest : test);
    this.props.onUpdate(updatedTests);
  };

  createTest = (newTestName: string) => {
    const newTest: EpicTest = {
      name: newTestName,
      isOn: false,
      locations: [],
      tagIds: [],
      sections: [],
      excludedTagIds: [],
      excludedSections: [],
      alwaysAsk: true,
      userCohort: undefined,
      isLiveBlog: false,
      hasCountryName: false,
      variants: []
    }
    const newTestList = [...this.props.tests, newTest];

    this.props.onUpdate(newTestList);

    this.props.onSelectedTestName(newTest.name);
  }

  onTestSelected = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.props.onSelectedTestName(event.currentTarget.innerText)
  };

  moveTestUp = (name: string) => {
    const newTests = [...this.props.tests];
    const indexOfName = newTests.findIndex(test => test.name === name);
    if (indexOfName > 0) {
      const beforeElement = newTests[indexOfName - 1]
      newTests[indexOfName-1] = newTests[indexOfName];
      newTests[indexOfName] = beforeElement;
    }
    this.props.onUpdate(newTests);
  }

  moveTestDown = (name: string) => {
    const newTests = [...this.props.tests];
    const indexOfName = newTests.findIndex(test => test.name === name);
    if (indexOfName < newTests.length - 1) {
      const afterElement = newTests[indexOfName + 1]
      newTests[indexOfName + 1] = newTests[indexOfName];
      newTests[indexOfName] = afterElement;
    }
    this.props.onUpdate(newTests);
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <NewNameCreator text="test" existingNames={ this.props.tests.map(test => test.name) } onValidName={this.createTest}/>

        <div className={classes.testListAndEditor}>
          <List className={classes.testsList} component="nav">
            {this.props.tests.map((test, index) => {
              const classNames = this.props.selectedTestName === test.name ? `${classes.test} ${classes.selectedTest}` :
                `${classes.test}`;

              return (
                <ListItem
                  className={classNames}
                  onClick={this.onTestSelected}
                  key={index}
                >
                  <div className={classes.buttonsContainer}>
                    <div className={classes.singleButtonContainer}>
                      {index > 0 ? <Button color={'default'} className={classes.arrowButton} variant={'contained'} onClick={() => this.moveTestUp(test.name)}><ArrowUpward className={classes.arrowIcon} /></Button> : null}
                    </div>
                    <div className={classes.singleButtonContainer}>
                      {index <  this.props.tests.length - 1 ? <Button color={'default'} className={classes.arrowButton} variant={'contained'} onClick={() => this.moveTestDown(test.name)}><ArrowDownward className={classes.arrowIcon} /></Button> : null}
                    </div>
                  </div>
                  <div className={classes.testText}>
                    <Typography>{test.name}</Typography>
                  </div>
                  <div className={ `${classes.testIndicator} ${test.isOn ? classes.testIsOn : null}` }></div>

                </ListItem>
              )
            })}
          </List>

          <EpicTestEditor
            test={this.props.selectedTestName ? this.props.tests.find(test => test.name === this.props.selectedTestName) : undefined}
            onChange={this.onTestChange}
          />
        </div>
      </>
    )
  }
}

export default withStyles(styles)(EpicTestsList);
