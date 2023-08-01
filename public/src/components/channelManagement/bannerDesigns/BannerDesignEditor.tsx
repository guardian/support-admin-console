import React from 'react';
import { BannerDesign } from '../../../models/BannerDesign';

type Props = {
  bannerDesign: BannerDesign;
};

const BannerDesignEditor: React.FC<Props> = ({ bannerDesign }: Props) => (
  <div>{bannerDesign.name}</div>
);

export default BannerDesignEditor;
