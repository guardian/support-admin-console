import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HeaderContent, HeaderVariant } from '../../../models/header';
import PromoCodesEditor from '../../shared/PromoCodesEditor';
import VariantCopyLengthWarning from '../../tests/variants/variantCopyLengthWarning';
import { Cta } from '../helpers/shared';
import { templateValidatorForPlatform } from '../helpers/validation';
import useValidation from '../hooks/useValidation';
import HeaderTestVariantCtasEditor from './headerTestVariantCtasEditor';

const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(10),

  '& > * + *': {
    marginTop: theme.spacing(3),
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
  '& > * + *': {
    marginTop: theme.spacing(3),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
}));

const HEADING_COPY_RECOMMENDED_LENGTH = 50;
const SUBHEADING_COPY_RECOMMENDED_LENGTH = 50;

type DeviceType = 'ALL' | 'MOBILE' | 'NOT_MOBILE';

const getLabelSuffix = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'MOBILE':
      return ' (mobile only)';
    case 'NOT_MOBILE':
      return ' (tablet + desktop)';
    default:
      return ' (all devices)';
  }
};

interface HeaderTestVariantContentEditorProps {
  content: HeaderContent;
  onChange: (updatedContent: HeaderContent) => void;
  onValidationChange: (isValid: boolean) => void;
  editMode: boolean;
  deviceType: DeviceType;
}

const HeaderTestVariantContentEditor: React.FC<HeaderTestVariantContentEditorProps> = ({
  content,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
}: HeaderTestVariantContentEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: HeaderContent = {
    heading: content.heading ?? '',
    subheading: content.subheading ?? '',
  };

  const {
    register,
    handleSubmit,
    trigger,

    formState: { errors },
  } = useForm<HeaderContent>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    void trigger();
  }, [trigger]);

  useEffect(() => {
    const isValid = errors.heading === undefined && errors.subheading === undefined;
    setValidationStatusForField('copy', isValid);
  }, [errors.heading, errors.subheading, setValidationStatusForField]);

  const onSubmit = ({ heading, subheading }: HeaderContent): void => {
    onChange({ ...content, heading, subheading });
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, primaryCta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, secondaryCta: updatedCta });
  };

  const labelSuffix = getLabelSuffix(deviceType);

  const headingCopyLength = content.heading?.length ?? 0;
  const subheadingCopyLength = content.subheading?.length ?? 0;

  return (
    <>
      {deviceType !== 'MOBILE' && (
        <>
          <SectionHeader variant="h4">{`Content${labelSuffix}`}</SectionHeader>

          <ContentContainer>
            <div>
              <TextField
                error={errors.heading !== undefined}
                helperText={errors.heading ? errors.heading.message : ''}
                {...register('heading', { validate: templateValidator })}
                onBlur={() => void handleSubmit(onSubmit)()}
                label="Heading"
                margin="normal"
                variant="outlined"
                disabled={!editMode}
                fullWidth
              />

              {headingCopyLength > HEADING_COPY_RECOMMENDED_LENGTH && (
                <VariantCopyLengthWarning charLimit={HEADING_COPY_RECOMMENDED_LENGTH} />
              )}
            </div>
          </ContentContainer>

          <ContentContainer>
            <div>
              <TextField
                error={errors.subheading !== undefined}
                helperText={errors.subheading ? errors.subheading.message : ''}
                {...register('subheading', { validate: templateValidator })}
                onBlur={() => void handleSubmit(onSubmit)()}
                label="Sub-heading"
                margin="normal"
                variant="outlined"
                disabled={!editMode}
                fullWidth
              />

              {subheadingCopyLength > SUBHEADING_COPY_RECOMMENDED_LENGTH && (
                <VariantCopyLengthWarning charLimit={SUBHEADING_COPY_RECOMMENDED_LENGTH} />
              )}
            </div>
          </ContentContainer>
        </>
      )}

      <SectionHeader variant="h4">{`Buttons${labelSuffix}`}</SectionHeader>

      <ButtonsContainer>
        <HeaderTestVariantCtasEditor
          primaryCta={content.primaryCta}
          secondaryCta={content.secondaryCta}
          updatePrimaryCta={updatePrimaryCta}
          updateSecondaryCta={updateSecondaryCta}
          isDisabled={!editMode}
          onValidationChange={(isValid) => setValidationStatusForField('cta', isValid)}
          supportSecondaryCta={deviceType !== 'MOBILE'}
        />
      </ButtonsContainer>
    </>
  );
};

interface HeaderTestVariantEditorProps {
  variant: HeaderVariant;
  onVariantChange: (update: (current: HeaderVariant) => HeaderVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const HeaderTestVariantEditor: React.FC<HeaderTestVariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
}: HeaderTestVariantEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  const content: HeaderContent = variant.content;

  const onMobileContentRadioChange = (): void => {
    if (variant.mobileContent === undefined) {
      onVariantChange((current) => ({
        ...current,
        mobileContent: {
          heading: '',
          subheading: '',
        },
      }));
    } else {
      // remove mobile content and clear any validation errors
      setValidationStatusForField('mobileContent', true);
      onVariantChange((current) => ({
        ...current,
        mobileContent: undefined,
      }));
    }
  };

  return (
    <Container>
      <SectionContainer>
        <HeaderTestVariantContentEditor
          content={content}
          onChange={(updatedContent: HeaderContent): void =>
            onVariantChange((current) => ({ ...current, content: updatedContent }))
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mainContent', isValid)
          }
          editMode={editMode}
          deviceType={variant.mobileContent === undefined ? 'ALL' : 'NOT_MOBILE'}
        />
      </SectionContainer>

      <RadioGroup
        value={variant.mobileContent !== undefined ? 'enabled' : 'disabled'}
        onChange={onMobileContentRadioChange}
      >
        <FormControlLabel
          value="disabled"
          key="disabled"
          control={<Radio />}
          label="Show the same copy across devices"
          disabled={!editMode}
        />
        <FormControlLabel
          value="enabled"
          key="enabled"
          control={<Radio />}
          label="Show different copy on mobile"
          disabled={!editMode}
        />
      </RadioGroup>
      {variant.mobileContent && (
        <HeaderTestVariantContentEditor
          content={variant.mobileContent}
          onChange={(updatedContent: HeaderContent): void =>
            onVariantChange((current) => ({ ...current, mobileContent: updatedContent }))
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mobileContent', isValid)
          }
          editMode={editMode}
          deviceType={'MOBILE'}
        />
      )}

      <PromoCodesEditor
        promoCodes={variant.promoCodes ?? []}
        updatePromoCodes={(promoCodes) => {
          onVariantChange((current) => ({ ...current, promoCodes }));
        }}
        isDisabled={!editMode}
      />
    </Container>
  );
};

export default HeaderTestVariantEditor;
