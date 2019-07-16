import React from 'react';
import update from 'immutability-helper';
import {EpicTest, EpicVariant} from "./epicTestsForm";
import TextField from '@material-ui/core/TextField';
import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EditableTextField from "../helpers/editableTextField"

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  container: {
    width: "80%",
    borderTop: `2px solid ${palette.grey['300']}`
  },
  variant: {
    display: "flex",
    "& span": {
      marginLeft: "4px",
      marginRight: "4px"
    }
  },
  variantName: {
    width: "10%"
  },
  variantHeading: {
    width: "20%"
  },
  variantListHeading: {
    fontWeight: "bold"
  }
});

interface Props extends WithStyles<typeof styles> {
  test?: EpicTest,
  onChange: (updatedTest: EpicTest) => void
}

class EpicTestsEditor extends React.Component<Props, any> {

  constructor(props: Props) {
    super(props);
  }

  onTagsChange = (updatedTags: string): void => {
    if (this.props.test) {
      const updatedTest = update(this.props.test, {
        tagIds: {$set: updatedTags.split(",")}
      });
      this.props.onChange(updatedTest)
    }
  };

  renderVariant = (variant: EpicVariant): React.ReactNode => {
    const {classes} = this.props;
    return (
      <ListItem className={classes.variant}>
        <span className={classes.variantName}>{variant.name}</span>
        <span className={classes.variantHeading}>{variant.heading}</span>
      </ListItem>
    )
  };

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;
    return (
      <div>
        <div>
          <EditableTextField
            text={test.tagIds.join(",")}
            onSubmit={this.onTagsChange}
            label="Tags"
          />
        </div>
        <List>
          <ListItem className={`${classes.variant} ${classes.variantListHeading}`}>
            <span className={classes.variantName}>Name</span>
            <span className={classes.variantHeading}>Heading</span>
          </ListItem>
          {test.variants.map(this.renderVariant)}
        </List>
      </div>
    )
  };

  render(): React.ReactNode {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        {this.props.test ? this.renderEditor(this.props.test) : <div>No test selected</div>}
      </div>
    )
  }
}

export default withStyles(styles)(EpicTestsEditor);
