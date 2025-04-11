import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";
import {ThreeTierChoiceCardVariant} from "../../models/threeTierChoiceCards";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(10),

    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface ChoiceCardVariantEditorProps {
  variant: ThreeTierChoiceCardVariant;
  onVariantChange: (updatedVariant: ThreeTierChoiceCardVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const ChoiceCardVariantEditor: React.FC<ChoiceCardVariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
}: ChoiceCardVariantEditorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        {/* Add your component logic here */}
      </div>
    </div>
  );
}

