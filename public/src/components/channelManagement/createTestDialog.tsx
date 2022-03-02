import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  createStyles,
  IconButton,
  TextField,
  WithStyles,
  withStyles,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from './helpers/validation';
import { Campaign } from './campaigns/CampaignsEditor';
import { fetchFrontendSettings, FrontendSettingsType } from '../../utils/requests';
import { DataFromServer } from '../../hocs/withS3Data';

const styles = createStyles({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
  campaignSelector: {
    marginBottom: '20px',
    minWidth: '200px',
  },
});

type FormData = {
  name: string;
  nickname: string;
};

const NAME_DEFAULT_HELPER_TEXT = 'Date format: YYYY-MM-DD_TEST_NAME';
const NICKNAME_DEFAULT_HELPER_TEXT = "Pick a name for your test that's easy to recognise";

type Mode = 'NEW' | 'COPY';
interface CreateTestDialogProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  existingNicknames: string[];
  mode: Mode;
  testNamePrefix?: string; // set if all tests must have the same prefix
  createTest: (name: string, nickname: string) => void;
}

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  classes,
  isOpen,
  close,
  existingNames,
  existingNicknames,
  mode,
  testNamePrefix,
  createTest,
}: CreateTestDialogProps) => {
  const defaultValues = {
    name: '',
    nickname: '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues,
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignName, setCampaignName] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchFrontendSettings(FrontendSettingsType.campaigns).then((data: DataFromServer<Campaign[]>) =>
      setCampaigns(data.value),
    );
  }, []);

  const buildPrefix = (): string => {
    if (testNamePrefix) {
      return `${testNamePrefix}__`;
    } else if (campaignName) {
      return `${campaignName}__`;
    }
    return '';
  };

  const onSubmit = ({ name, nickname }: FormData): void => {
    createTest(`${buildPrefix()}${name}`.toUpperCase(), nickname.toUpperCase());
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-test-dialog-title">
          {mode === 'NEW' ? 'Create a new test' : 'Name your new test'}
        </DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        {testNamePrefix === undefined && (
          <FormControl className={classes.campaignSelector}>
            <InputLabel id="campaign-selector">Campaign</InputLabel>
            <Select
              value={campaignName}
              displayEmpty
              renderValue={(campaign): string => {
                if (campaign === undefined) {
                  return ''; // triggers the displayEmpty behaviour
                }
                return campaign as string;
              }}
              onChange={(event: React.ChangeEvent<{ value: unknown }>): void => {
                setCampaignName(event.target.value as string | undefined);
              }}
            >
              <MenuItem value={undefined} key={'campaignName-none'}>
                No campaign
              </MenuItem>
              {campaigns.map(campaign => (
                <MenuItem value={campaign.name} key={`campaign-${campaign.name}`}>
                  {campaign.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          className={classes.input}
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            pattern: {
              value: VALID_CHARACTERS_REGEX,
              message: INVALID_CHARACTERS_ERROR_HELPER_TEXT,
            },
            validate: createDuplicateValidator(existingNames, buildPrefix()),
          })}
          error={errors.name !== undefined}
          helperText={errors.name ? errors.name.message : NAME_DEFAULT_HELPER_TEXT}
          name="name"
          label="Full test name"
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">{buildPrefix()}</InputAdornment>,
          }}
          autoFocus
          fullWidth
        />
        <TextField
          className={classes.input}
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: createDuplicateValidator(existingNicknames),
          })}
          error={errors.nickname !== undefined}
          helperText={errors.nickname ? errors.nickname.message : NICKNAME_DEFAULT_HELPER_TEXT}
          name="nickname"
          label="Nickname"
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          {mode === 'NEW' ? 'Create test' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(CreateTestDialog);
