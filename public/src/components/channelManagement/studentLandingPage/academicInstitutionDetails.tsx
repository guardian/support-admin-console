import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Institution, StudentLandingPageVariant } from '../../../models/studentLandingPage';
import { EMPTY_ERROR_HELPER_TEXT, noHtmlValidator } from '../helpers/validation';
import { TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: (props: { shouldAddPadding: boolean }) => ({
    width: '98%',
    paddingTop: props.shouldAddPadding ? spacing(2) : 0,
    paddingLeft: props.shouldAddPadding ? spacing(4) : 0,
    paddingRight: props.shouldAddPadding ? spacing(10) : 0,

    '& > * + *': {
      marginTop: spacing(1),
    },
  }),
  sectionHeader: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  sectionContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(2),

    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  choiceCardContainer: {
    display: 'flex',
  },
}));

interface FormData {
  acronym: string;
  name: string;
  logoUrl: string;
}

interface AcademicInstituteDetailEditorProps {
  variant: StudentLandingPageVariant;
  editMode: boolean;
  updateInstitutionDetails: (institution: Institution) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const AcademicInstitutionDetailEditor: React.FC<AcademicInstituteDetailEditorProps> = ({
  variant,
  editMode,
  updateInstitutionDetails,
  onValidationChange,
}) => {
  const classes = useStyles({ shouldAddPadding: false });

  const defaultValues: FormData = {
    acronym: variant.institution.acronym,
    name: variant.institution.name,
    logoUrl: variant.institution.logoUrl,
  };

  const {
    register,
    handleSubmit,
    trigger,

    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.logoUrl, errors.acronym, errors.name]);

  const update = (institution: Institution): void => {
    updateInstitutionDetails(institution);
  };

  const ACRONYM_MAX_LENGTH = 4;
  const INSTITUTION_MAX_LENGTH = 150;
  const LOGO_URL_MAX_LENGTH = 150;

  return (
    <div className={classes.container}>
      <Typography variant={'h4'} className={classes.sectionHeader}>
        Institution Details
      </Typography>
      <div className={classes.container}>
        <TextField
          {...register('name', {
            required: EMPTY_ERROR_HELPER_TEXT,
            maxLength: INSTITUTION_MAX_LENGTH,
            validate: (name) => {
              return noHtmlValidator(name);
            },
          })}
          error={errors.name !== undefined}
          helperText={errors.name ? errors.name.message || errors.name.type : ''}
          onBlur={handleSubmit(update)}
          label="Name of Institution"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />

        <TextField
          error={errors.acronym !== undefined}
          helperText={errors.acronym ? errors.acronym.message || errors.acronym.type : ''}
          {...register('acronym', {
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: (acronym) => {
              if (acronym.length > ACRONYM_MAX_LENGTH) {
                return `max length is ${ACRONYM_MAX_LENGTH}`;
              }
              const htmlCheck = noHtmlValidator(acronym);
              if (!!htmlCheck) {
                return htmlCheck;
              }
              return true;
            },
          })}
          onBlur={handleSubmit(update)}
          label="Acronym for Institution"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />

        <TextField
          {...register('logoUrl', {
            required: EMPTY_ERROR_HELPER_TEXT,
            maxLength: LOGO_URL_MAX_LENGTH,
            validate: (name) => {
              return noHtmlValidator(name);
            },
          })}
          error={errors.logoUrl !== undefined}
          helperText={
            errors?.logoUrl?.message ??
            'Image dimensions should be 61 wide by 27 high, with a transparent background and the foreground colour needs to be white'
          }
          onBlur={handleSubmit(update)}
          label="Logo for Institution"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      </div>
    </div>
  );
};
