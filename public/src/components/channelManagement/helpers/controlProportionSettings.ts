import { Variant } from './shared';

export interface ControlProportionSettings {
  proportion: number;
  offset: number;
}

export function hasControl(variants: Variant[]): boolean {
  return variants.findIndex(v => v.name.toLowerCase() === 'control') > -1;
}

export function hasNonControlVariant(variants: Variant[]): boolean {
  return variants.filter(v => v.name !== 'control').length > 0;
}

export function canHaveCustomVariantSplit(variants: Variant[]): boolean {
  return hasControl(variants) && hasNonControlVariant(variants);
}
