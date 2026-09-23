import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Institution, StudentLandingPageVariant } from '../../../models/studentLandingPage';
import { EMPTY_ERROR_HELPER_TEXT, noHtmlValidator } from '../helpers/validation';

const Container = styled('div')(({ theme }) => ({
  width: '98%',
  paddingTop: 0,
  paddingLeft: 0,
  paddingRight: 0,

  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));
const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
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
    shouldFocusError: false,
    defaultValues,
  });

  useEffect(() => {
    void trigger();
  }, [trigger]);

  const handleValidationChange = useCallback(
    (isValid: boolean) => {
      onValidationChange(isValid);
    },
    [onValidationChange],
  );

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    handleValidationChange(isValid);
  }, [errors, handleValidationChange]);

  const update = (institution: Institution): void => {
    updateInstitutionDetails(institution);
  };

  const ACRONYM_MAX_LENGTH = 4;
  const INSTITUTION_MAX_LENGTH = 150;
  const LOGO_URL_MAX_LENGTH = 150;
  const LOGO_HELPER_TEXT =
    'Image dimensions should be 61px wide by 27px high, with a transparent background and the foreground colour needs to be white';

  return (
    <Container>
      <SectionHeader variant={'h4'}>Institution Details</SectionHeader>
      <Container>
        <TextField
          {...register('name', {
            required: EMPTY_ERROR_HELPER_TEXT,
            maxLength: INSTITUTION_MAX_LENGTH,
            validate: (name) => {
              return noHtmlValidator(name);
            },
          })}
          error={errors.name !== undefined}
          helperText={errors.name ? (errors.name.message ?? errors.name.type) : ''}
          onBlur={() => void handleSubmit(update)()}
          label="Name of Institution"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />

        <TextField
          error={errors.acronym !== undefined}
          helperText={errors.acronym ? (errors.acronym.message ?? errors.acronym.type) : ''}
          {...register('acronym', {
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: (acronym) => {
              if (acronym.length > ACRONYM_MAX_LENGTH) {
                return `max length is ${ACRONYM_MAX_LENGTH}`;
              }
              const htmlCheck = noHtmlValidator(acronym);
              if (htmlCheck) {
                return htmlCheck;
              }
              return true;
            },
          })}
          onBlur={() => void handleSubmit(update)()}
          label="Acronym for Institution"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />

        <TextField
          {...register('logoUrl', {
            required: `${EMPTY_ERROR_HELPER_TEXT} - ${LOGO_HELPER_TEXT}`,
            maxLength: LOGO_URL_MAX_LENGTH,
            validate: (name) => {
              return noHtmlValidator(name);
            },
          })}
          error={errors.logoUrl !== undefined}
          helperText={errors.logoUrl?.message ?? LOGO_HELPER_TEXT}
          onBlur={() => void handleSubmit(update)()}
          label="Logo for Institution"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      </Container>
    </Container>
  );
};
