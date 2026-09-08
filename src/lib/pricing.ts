import type { PriceTier, PriceTierInfo, TierOption } from '../types';

export function tiersFor(price: PriceTierInfo | undefined): TierOption[] {
  if (!price) return [];
  const tiers: TierOption[] = [];

  if (price.tresANueve !== undefined && price.tresANueve > 0) {
    tiers.push({
      key: 'tresANueve',
      label: 'De 3 a 9 unidades',
      shortLabel: '3 a 9',
      price: price.tresANueve,
      color: 'blue',
    });
  }

  if (price.diezOMas !== undefined && price.diezOMas > 0) {
    tiers.push({
      key: 'diezOMas',
      label: 'De 10 o más unidades',
      shortLabel: '10+',
      price: price.diezOMas,
      color: 'indigo',
    });
  }

  tiers.push({
    key: 'medico',
    label: 'Precio Médico',
    shortLabel: 'Médico',
    price: price.medico,
    color: 'red',
  });

  if (price.condicion) {
    tiers.push({
      key: 'volumen',
      label: 'Por volumen / condición',
      shortLabel: 'Volumen',
      price: price.medico,
      condicion: price.condicion,
      color: 'amber',
    });
  }

  return tiers;
}

export function defaultTier(price: PriceTierInfo | undefined): PriceTier {
  const tiers = tiersFor(price);
  if (tiers.length === 0) return 'medico';
  const first = tiers[0];
  return first.key;
}

export function unitPriceForTier(price: PriceTierInfo | undefined, tier: PriceTier): number {
  if (!price) return 0;
  const tiers = tiersFor(price);
  const match = tiers.find((t) => t.key === tier);
  return match?.price ?? price.medico;
}

export function tierLabel(tier: PriceTier): string {
  switch (tier) {
    case 'tresANueve':
      return '3 a 9';
    case 'diezOMas':
      return '10+';
    case 'medico':
      return 'Médico';
    case 'volumen':
      return 'Volumen';
    default:
      return '—';
  }
}
