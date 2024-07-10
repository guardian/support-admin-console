import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';

import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from '../../helpers/validation';
import { Campaign } from '../../campaigns/CampaignsForm';
import { fetchFrontendSettings, FrontendSettingsType } from '../../../../utils/requests';
import FormControlLabel from '@mui/material/FormControlLabel';

const useStyles = makeStyles(() => ({
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
    marginRight: '12px',
    minWidth: '200px',
  },
  campaignSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

type FormData = {
  name: string;
  nickname: string;
};

const NAME_DEFAULT_HELPER_TEXT = 'Date format: YYYY-MM-DD_TEST_NAME';
const NICKNAME_DEFAULT_HELPER_TEXT = "Pick a name for your test that's easy to recognise";

type Mode = 'NEW' | 'COPY';
interface CreateTestDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  sourceName?: string | void;
  existingNicknames: string[];
  sourceNickname?: string | void;
  mode: Mode;
  testNamePrefix?: string; // set if all tests must have the same prefix
  createTest: (name: string, nickname: string, campaignName?: string) => void;
}

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  isOpen,
  close,
  existingNames,
  sourceName,
  existingNicknames,
  sourceNickname,
  mode,
  testNamePrefix,
  createTest,
}: CreateTestDialogProps) => {
  const classes = useStyles();

  const defaultValues = {
    name: sourceName || '',
    nickname: sourceNickname || '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues,
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignName, setCampaignName] = useState<string | undefined>(undefined);
  const [campaignNamePrefix, setCampaignNamePrefix] = useState<boolean>(false);

  useEffect(() => {
    fetchFrontendSettings(FrontendSettingsType.campaigns).then(setCampaigns);
  }, []);

  const buildPrefix = (): string => {
    if (testNamePrefix) {
      return `${testNamePrefix}__`;
    } else if (campaignName && campaignNamePrefix) {
      return `${campaignName}__`;
    }
    return '';
  };

  const addPrefix = (name: string): string => `${buildPrefix()}${name}`;

  // There should only be one instance of a double-underscore, as this is used by the AB tests dashboard to group together tests with a common prefix
  const doubleUnderscoresValidator = (s: string): string | undefined => {
    const count = (s.match(/__/g) || []).length;
    if (count < 2) {
      return undefined;
    } else {
      return `Name can only include one double-underscore, but has ${count}`;
    }
  };

  const onSubmit = ({ name, nickname }: FormData): void => {
    createTest(addPrefix(name).toUpperCase(), nickname.toUpperCase(), campaignName);
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
          <div className={classes.campaignSelectorContainer}>
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
                onChange={(event: SelectChangeEvent<string | undefined>): void => {
                  setCampaignName(event.target.value);
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignNamePrefix}
                  onChange={() => setCampaignNamePrefix(!campaignNamePrefix)}
                  color="primary"
                  disabled={!campaignName}
                />
              }
              label="Prefix test name"
            />
          </div>
        )}
        <TextField
          className={classes.input}
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            pattern: {
              value: VALID_CHARACTERS_REGEX,
              message: INVALID_CHARACTERS_ERROR_HELPER_TEXT,
            },
            validate: name => {
              const withPrefix = addPrefix(name);
              return (
                doubleUnderscoresValidator(withPrefix) ??
                createDuplicateValidator(existingNames)(withPrefix)
              );
            },
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

export default CreateTestDialog;
