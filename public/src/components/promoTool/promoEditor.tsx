import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Promo } from './utils/promoModels';
import { countries } from '../../utils/models';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  root: {
    padding: spacing(3),
    maxWidth: 800,
    margin: '0 auto',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  section: {
    marginBottom: spacing(3),
  },
  sectionTitle: {
    marginBottom: spacing(2),
    fontWeight: 600,
  },
  formField: {
    marginBottom: spacing(2),
  },
  buttonGroup: {
    display: 'flex',
    gap: spacing(1),
    marginTop: spacing(2),
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white',
    padding: spacing(2),
    borderTop: '1px solid #ddd',
    marginLeft: -spacing(3),
    marginRight: -spacing(3),
    marginBottom: -spacing(3),
  },
  lockBanner: {
    padding: spacing(2),
    marginBottom: spacing(2),
    backgroundColor: palette.warning.light,
    borderRadius: 4,
  },
  countriesContainer: {
    maxHeight: 300,
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: 4,
    padding: spacing(2),
  },
  countrySearch: {
    marginBottom: spacing(2),
  },
}));

interface PromoEditorProps {
  promo: Promo | null;
  isEditing: boolean;
  onSave: (promo: Promo) => void;
  onCancel: () => void;
  onLock: (force: boolean) => void;
  userEmail?: string;
}

const PromoEditor = ({
  promo,
  isEditing,
  onSave,
  onCancel,
  onLock,
  userEmail,
}: PromoEditorProps): React.ReactElement => {
  const classes = useStyles();
  const [editedPromo, setEditedPromo] = useState<Promo | null>(promo);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    setEditedPromo(promo);
    if (promo) {
      setSelectedCountries(promo.appliesTo.countries || []);
    } else {
      setSelectedCountries([]);
    }
  }, [promo]);

  if (!promo) {
    return (
      <Box className={classes.root}>
        <Typography variant="h6" color="textSecondary">
          Select a promo code to view details
        </Typography>
      </Box>
    );
  }

  const handleFieldChange = (field: keyof Promo, value: string) => {
    if (editedPromo) {
      setEditedPromo({
        ...editedPromo,
        [field]: value,
      });
    }
  };

  const handleDateChange = (field: 'startTimestamp' | 'endTimestamp', value: string) => {
    if (editedPromo && value) {
      const isoDate = new Date(value).toISOString();
      setEditedPromo({
        ...editedPromo,
        [field]: isoDate,
      });
    }
  };

  const formatDateForInput = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isEditing) {
      setEditedPromo(prevPromo => {
        if (!prevPromo || !e.target.value) {
          return prevPromo;
        }
        return {
          ...prevPromo,
          discount: {
            ...prevPromo.discount,
            [e.target.name]: Number(e.target.value),
          },
        };
      });
    }
  };

  const updateCountries = (newCountries: string[]) => {
    setSelectedCountries(newCountries);
    if (editedPromo) {
      setEditedPromo({
        ...editedPromo,
        appliesTo: {
          ...editedPromo.appliesTo,
          countries: newCountries,
        },
      });
    }
  };

  const handleCountryToggle = (countryCode: string) => {
    const newCountries = selectedCountries.includes(countryCode)
      ? selectedCountries.filter(c => c !== countryCode)
      : [...selectedCountries, countryCode];
    updateCountries(newCountries);
  };

  const handleSelectAll = () => {
    const allCountryCodes = Object.keys(countries);
    const filteredCountryCodes = allCountryCodes.filter(
      code =>
        countries[code].toLowerCase().includes(countryFilter.toLowerCase()) ||
        code.toLowerCase().includes(countryFilter.toLowerCase()),
    );

    let newCountries: string[];
    if (selectAll) {
      // Deselect all filtered countries
      newCountries = selectedCountries.filter(c => !filteredCountryCodes.includes(c));
    } else {
      // Select all filtered countries
      newCountries = [...new Set([...selectedCountries, ...filteredCountryCodes])];
    }

    updateCountries(newCountries);
    setSelectAll(!selectAll);
  };

  const filteredCountries = Object.entries(countries).filter(
    ([code, name]) =>
      name.toLowerCase().includes(countryFilter.toLowerCase()) ||
      code.toLowerCase().includes(countryFilter.toLowerCase()),
  );

  const handleSave = () => {
    if (editedPromo) {
      onSave(editedPromo);
    }
  };

  const isLockedByOther = promo.lockStatus?.locked && promo.lockStatus?.email !== userEmail;
  const isLockedByUser = promo.lockStatus?.locked && promo.lockStatus?.email === userEmail;

  const lockMessage = isLockedByUser
    ? 'This promo is currently locked by you'
    : `This promo is currently locked by ${promo.lockStatus?.email}`;

  return (
    <Paper className={classes.root}>
      {(isLockedByOther || isLockedByUser) && (
        <Box className={classes.lockBanner}>
          <Typography variant="body2">{lockMessage}</Typography>
          {isLockedByOther && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onLock(true)}
              style={{ marginTop: 8 }}
            >
              Take Control
            </Button>
          )}
        </Box>
      )}

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Basic Information</Typography>
        <TextField
          className={classes.formField}
          fullWidth
          label="Name"
          value={editedPromo?.name || ''}
          onChange={e => handleFieldChange('name', e.target.value)}
          disabled={!isEditing}
        />
        <TextField
          className={classes.formField}
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={editedPromo?.description || ''}
          onChange={e => handleFieldChange('description', e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Duration</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="datetime-local"
              value={editedPromo ? formatDateForInput(editedPromo.startTimestamp) : ''}
              onChange={e => handleDateChange('startTimestamp', e.target.value)}
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date"
              type="datetime-local"
              value={editedPromo ? formatDateForInput(editedPromo.endTimestamp) : ''}
              onChange={e => handleDateChange('endTimestamp', e.target.value)}
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Discount</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {' '}
            <TextField
              name="durationMonths"
              label="Duration (months)"
              value={editedPromo?.discount?.durationMonths || ''}
              onChange={e => handleDiscountChange(e)}
              select
              fullWidth
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="amount"
              label="Amount (%)"
              value={editedPromo?.discount?.amount || ''}
              onChange={e => handleDiscountChange(e)}
              fullWidth
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Availability</Typography>
        <Typography variant="subtitle2" gutterBottom>
          Countries
        </Typography>
        <TextField
          className={classes.countrySearch}
          fullWidth
          size="small"
          placeholder="Search countries..."
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
          disabled={!isEditing}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              disabled={!isEditing}
              indeterminate={
                selectedCountries.length > 0 &&
                selectedCountries.length <
                  filteredCountries.filter(([code]) => selectedCountries.includes(code)).length
              }
            />
          }
          label="Select All"
        />
        <Box className={classes.countriesContainer}>
          <FormGroup>
            {filteredCountries.map(([code, name]) => (
              <FormControlLabel
                key={code}
                control={
                  <Checkbox
                    checked={selectedCountries.includes(code)}
                    onChange={() => handleCountryToggle(code)}
                    disabled={!isEditing}
                  />
                }
                label={`${name} (${code})`}
              />
            ))}
          </FormGroup>
        </Box>
      </div>

      {isEditing && (
        <div className={classes.buttonGroup}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </Paper>
  );
};

export default PromoEditor;
