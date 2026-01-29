import React from 'react';
import { Divider } from '@mui/material';
import { AmountsVariantEditorRow } from './AmountsVariantEditorRow';
import {
  ContributionType,
  contributionIds,
  AmountsCardData,
  AmountValuesObject,
} from '../../utils/models';

interface AmountsCardRowsProps {
  variantName: string;
  amountsCardData: AmountsCardData;
  updateAmounts: (label: ContributionType, val: number[]) => void;
  updateChooseAmount: (label: ContributionType, val: boolean) => void;
  updateDefaultAmount: (label: ContributionType, val: number) => void;
  disabled?: boolean;
}

export const AmountsCardRows: React.FC<AmountsCardRowsProps> = ({
  variantName,
  amountsCardData,
  updateAmounts,
  updateChooseAmount,
  updateDefaultAmount,
  disabled = false,
}) => {
  return (
    <div>
      {contributionIds.map((k) => {
        const cardData: AmountValuesObject = amountsCardData[k as ContributionType];
        if (cardData != null) {
          return (
            <div key={`${variantName}_${k}_row`}>
              <Divider />
              <AmountsVariantEditorRow
                label={k as ContributionType}
                amounts={cardData.amounts}
                defaultAmount={cardData.defaultAmount}
                hideChooseYourAmount={cardData.hideChooseYourAmount}
                updateAmounts={updateAmounts}
                updateChooseAmount={updateChooseAmount}
                updateDefaultAmount={updateDefaultAmount}
                disabled={disabled}
              />
            </div>
          );
        } else {
          return <></>;
        }
      })}
    </div>
  );
};
