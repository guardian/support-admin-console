import React from 'react';

import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Typography, Button
} from "@material-ui/core";
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { EpicTest } from './epicTestsForm';
import EpicTestEditor from './epicTestEditor';
import NewNameCreator from './newNameCreator';


const styles = ({ palette }: Theme) => createStyles({
  testsList: {
    minWidth: "20%",
    borderRight: `2px solid ${palette.grey['300']}`,
    borderTop: `2px solid ${palette.grey['300']}`,
    padding: 0,
  },
  test: {
    borderBottom: `1px solid ${palette.grey['300']}`,
    minWidth: "100%"
  },
  selectedTest: {
    backgroundColor: palette.grey['400'],
    fontWeight: 'bold'
  },
  testListAndEditor: {
    display: "flex"
  },
  arrowButton: {
    padding: "2px",
    margin: "2px 0 2px 0",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    minWidth: "20px"
  },
  singleButtonContainer: {
    display: "block"
  },
  buttonsContainer: {
    marginRight: "10px",
    width: "20px",
  }
});

interface EpicTestListProps extends WithStyles<typeof styles> {
  tests: EpicTest[],
  onUpdate: (tests: EpicTest[]) => void
}

interface EpicTestsListState {
  selectedTestName?: string
}

class EpicTestsList extends React.Component<EpicTestListProps, EpicTestsListState> {

  state: EpicTestsListState = {}

  onTestSelected = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.setState({
      selectedTestName: event.currentTarget.innerText
    })
  };

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

    this.setState({
      selectedTestName: newTest.name
    })
  }

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
              const classNames = this.state.selectedTestName === test.name ?
                `${classes.test} ${classes.selectedTest}`
                : classes.test;

              return (
                <ListItem
                  className={classNames}
                  button
                  onClick={this.onTestSelected}
                  key={test.name}
                >
                  <div className={classes.buttonsContainer}>
                    <div className={classes.singleButtonContainer}>
                      {index > 0 ? <Button color={'default'} className={classes.arrowButton} variant={'contained'} onClick={() => this.moveTestUp(test.name)}><ArrowUpward /></Button> : null}
                    </div>
                    <div className={classes.singleButtonContainer}>
                      {index <  this.props.tests.length - 1 ? <Button color={'default'} className={classes.arrowButton} variant={'contained'} onClick={() => this.moveTestDown(test.name)}><ArrowDownward /></Button> : null}
                    </div>
                  </div>
                  <div>
                    <Typography>{test.name}</Typography>
                  </div>


                </ListItem>
              )
            })}
          </List>

          <EpicTestEditor
            test={this.state.selectedTestName ? this.props.tests.find(test => test.name === this.state.selectedTestName) : undefined}
            onChange={this.onTestChange}
          />
        </div>
      </>
    )
  }
}

export default withStyles(styles)(EpicTestsList);
