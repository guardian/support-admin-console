// TODO: fix the unused variables then delete the line below.
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import {
  StudentLandingPageTest,
  StudentLandingPageVariant,
} from '../../../models/studentLandingPage';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { Typography } from '@mui/material';
import { useStyles } from '../helpers/testEditorStyles'; // TODO: is this appropriate (shared)
import { VariantEditor } from './variantEditor';
import TestEditorTargetRegionsSelector from '../testEditorTargetRegionsSelector';
import { RegionTargeting } from '../helpers/shared';
import { Region, regions } from '../../../utils/models';

export const StudentLandingPageTestEditor: React.FC<
  ValidatedTestEditorProps<StudentLandingPageTest>
> = ({ test, userHasTestLocked, onTestChange, setValidationStatusForField }) => {
  const classes = useStyles();

  // const [region, setRegion] = useState<Region>();

  // useEffect(() => {
  //   test.variants[0].region = region;
  // }, [region]);

  const updateTest = (
    update: (current: StudentLandingPageTest) => StudentLandingPageTest,
  ): void => {
    onTestChange((current) => {
      const updatedTest = update(current);
      return {
        ...updatedTest,
      };
    });
  };

  const onTargetingChange = (updatedTargeting: RegionTargeting): void => {
    // setRegion(updatedTargeting.targetedCountryGroups[0]);
    onTestChange((current) => ({
      ...current,
      regionTargeting: updatedTargeting,
    }));
  };

  const onVariantsChange = (
    update: (current: StudentLandingPageVariant[]) => StudentLandingPageVariant[],
  ): void => {
    updateTest((current) => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange =
    (variantName: string) =>
    (update: (current: StudentLandingPageVariant) => StudentLandingPageVariant): void => {
      onVariantsChange((current) =>
        current.map((variant) => {
          if (variant.name === variantName) {
            return update(variant);
          }
          return variant;
        }),
      );
    };

  return (
    <>
      <div className={classes.sectionContainer} key={test.name}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Offer
        </Typography>

        <div>
          <VariantEditor
            key={test.variants[0].name}
            variant={test.variants[0]}
            editMode={userHasTestLocked}
            onVariantChange={onVariantChange(test.variants[0].name)}
            onValidationChange={(isValid: boolean): void =>
              setValidationStatusForField(test.variants[0].name, isValid)
            }
          />
        </div>
      </div>

      {/* If you need to update the supportedRegions, note that you will also need to adjust the route in support-frontend too */}
      <TestEditorTargetRegionsSelector
        regionTargeting={test.regionTargeting}
        supportedRegions={['AUDCountries', 'NZDCountries']}
        onRegionTargetingUpdate={onTargetingChange}
        isDisabled={!userHasTestLocked}
      />
    </>
  );
};
