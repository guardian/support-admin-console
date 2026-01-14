import React from 'react';
import { StudentLandingPageVariant } from '../../../models/studentLandingPage';

interface StudentLandingPageVariantEditorProps {
  variant: StudentLandingPageVariant;
  onVariantChange: (
    update: (current: StudentLandingPageVariant) => StudentLandingPageVariant,
  ) => void;
  editMode: boolean;
  onDelete: () => void; // TODO: do we want this?
  onValidationChange: (isValid: boolean) => void;
}

export const VariantEditor: React.FC<StudentLandingPageVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  onValidationChange,
}: StudentLandingPageVariantEditorProps) => {
  return <p>{variant.name}</p>;
};
