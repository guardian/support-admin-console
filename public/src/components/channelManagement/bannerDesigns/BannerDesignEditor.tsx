import React from 'react';
import { BannerDesign } from '../../../models/BannerDesign';

type Props = {
  bannerDesign: BannerDesign;
};

export default ({ bannerDesign }: Props) => <div>{bannerDesign.name}</div>;
