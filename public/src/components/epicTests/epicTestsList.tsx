import React from 'react';

import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles
} from "@material-ui/core";
import { EpicTest } from './epicTestsForm';
import EpicTestEditor from './epicTestEditor';
import NewNameCreator from './newNameCreator';


const styles = ({ palette }: Theme) => createStyles({
  testsList: {
    width: "20%",
    borderRight: `2px solid ${palette.grey['300']}`,
    borderTop: `2px solid ${palette.grey['300']}`,
    padding: 0
  },
  test: {
    borderBottom: `1px solid ${palette.grey['300']}`,
  },
  selectedTest: {
    backgroundColor: palette.grey['400'],
    fontWeight: 'bold'
  },
  testListAndEditor: {
    display: "flex"
  }
});

interface Props extends WithStyles<typeof styles> {
  tests: EpicTest[],
  onUpdate: (tests: EpicTest[]) => void
}

interface EpicTestsListState {
  selectedTestName?: string
}

class EpicTestsList extends React.Component<Props, EpicTestsListState> {

  state: EpicTestsListState = {}

  onTestSelected = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.setState({
      selectedTestName: event.currentTarget.innerText
    })
  };

  onTestChange = (updatedTest: EpicTest): void => {
    console.log('onTestChange called in epicTestList', updatedTest);
    const updatedTests = this.props.tests.map(test => test.name === updatedTest.name ? updatedTest : test);
    this.props.onUpdate(updatedTests);
  };

  createTest = (newTestName: string) => {
    console.log('createTest called from epicTestList with testName', newTestName);
    const newTest: EpicTest = {
      name: newTestName,
      isOn: false,
      locations: [],
      tagIds: [],
      sections: [],
      excludedTagIds: [],
      excludedSections: [],
      alwaysAsk: false,
      userCohort: undefined,
      isLiveBlog: false,
      hasCountryName: false,
      variants: []
    }
    console.log('new test created', newTest);
    const newTestList = [...this.props.tests, newTest];
    this.props.onUpdate(newTestList);
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <NewNameCreator text="New test" existingNames={ this.props.tests.map(test => test.name) } onValidName={this.createTest}/>

        <div className={classes.testListAndEditor}>
          <List className={classes.testsList} component="nav">
            {this.props.tests.map(test => {
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
                  {test.name}
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
