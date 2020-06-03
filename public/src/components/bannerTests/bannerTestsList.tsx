import React from 'react';
import {createStyles, List, ListItem, Theme, Typography, withStyles, WithStyles, Tooltip, createMuiTheme, MuiThemeProvider} from "@material-ui/core";

import { BannerTest } from './bannerTestsForm';
import NewNameCreator from '.././epicTests/newNameCreator';
import { MaxEpicViewsDefaults } from './maxEpicViewsEditor';


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
  bannerTests: BannerTest[],
  // modifiedTests: ModifiedTests,
  selectedTestName: string | undefined,
  onUpdate: (tests: BannerTest[], modifiedTestName?: string) => void,
  onSelectedTestName: (testName: string) => void,
  // editMode: boolean
}
class BannerTestsList extends React.Component<BannerTestListProps> {

  createTest = (newBannerTestName: string, newBannerTestNickname: string) => {
    const newTest: BannerTest = {
      name: newBannerTestName,
      nickname: newBannerTestNickname,
      isOn: false,
      minArticlesBeforeShowingBanner: 0,
      userCohort: UserCohort.AllNonSupporters,
      products: undefined,
      locations: [],
      variants: [],
      articlesViewedSettings: undefined,
    }
    const newBannerTestList = [...this.props.bannerTests, newTest];

    this.props.onUpdate(newBannerTestList, newBannerTestName);

  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
        <div className={classes.root}>
          {/* {this.props.editMode ? ( */}
            <NewNameCreator
              type="test"
              action="New"
              existingNames={this.props.tests.map(test => test.name)}
              existingNicknames={
                this.props.tests
                  .map(test => test.nickname)
                  .filter(nickname => !!nickname) as string[]
              }
              onValidName={this.createTest}
              editEnabled={this.props.editMode}
            />
          </div>
          );
  }
}

export default withStyles(styles)(EpicTestsList);
