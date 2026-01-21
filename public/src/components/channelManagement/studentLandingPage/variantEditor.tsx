// TODO: fix the unused variables then delete the line below.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { StudentLandingPageVariant } from '../../../models/studentLandingPage';

interface StudentLandingPageVariantEditorProps {
  variant: StudentLandingPageVariant;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
}

export const VariantEditor: React.FC<StudentLandingPageVariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
}: StudentLandingPageVariantEditorProps) => {
  return <p>{variant.name}</p>;
};
