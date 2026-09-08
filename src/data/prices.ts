import type { PriceTierInfo } from '../types';

export const PRICES: Record<string, PriceTierInfo> = {
  // ===== GRIPE Y TOS =====
  'tusicarex-antigripal-im': { venta: 42.50, farmacia: 34.00, tresANueve: 22.67, diezOMas: 20.40, medico: 15.00 },
  'tusicarex-antitusivo': { venta: 116.70, farmacia: 93.36, tresANueve: 62.24, diezOMas: 56.02, medico: 48.68 },
  'tusicarex-flem': { venta: 65.89, farmacia: 52.71, tresANueve: 35.14, diezOMas: 31.63, medico: 28.36 },
  'tusicarex-antigripal': { venta: 70.82, farmacia: 56.66, tresANueve: 37.77, diezOMas: 33.99, medico: 30.33 },

  // ===== ANTIPARASITARIO / ANTIMICÓTICO =====
  'triplex-derm': { venta: 110.00, farmacia: 88.00, tresANueve: 58.67, diezOMas: 52.80, medico: 46.00 },
  'vendaxol': { venta: 36.78, farmacia: 29.42, tresANueve: 19.62, diezOMas: 17.65, medico: 15.71 },

  // ===== CRÓNICOS / GÁSTRICOS =====
  'tabypress-h': { venta: 280.00, farmacia: 224.00, tresANueve: 149.33, diezOMas: 134.40, medico: 100.00 },
  'gastricarex': { venta: 220.00, farmacia: 176.00, tresANueve: 117.33, diezOMas: 105.60, medico: 91.00 },
  'gastricarex-1plus1': { venta: 375.00, farmacia: 300.00, tresANueve: 200.00, diezOMas: 180.00, medico: 156.00 },
  'gelexil': { venta: 67.23, farmacia: 53.78, tresANueve: 35.86, diezOMas: 32.27, medico: 32.00 },

  // ===== ANTIBIÓTICOS =====
  'mofoxtin': { venta: 400.00, farmacia: 320.00, tresANueve: 213.33, diezOMas: 192.00, medico: 162.00 },
  'klavicarex': { venta: 162.80, farmacia: 130.24, tresANueve: 86.83, diezOMas: 78.14, medico: 70.00 },

  // ===== DOLOR =====
  'blockdol': { venta: 270.00, farmacia: 216.00, tresANueve: 144.00, diezOMas: 129.60, medico: 105.00 },
  'gesikdol-plus': { venta: 90.00, farmacia: 72.00, tresANueve: 48.00, diezOMas: 43.20, medico: 39.00 },
  'gesikdol-forte': { venta: 90.00, farmacia: 72.00, tresANueve: 48.00, diezOMas: 43.20, medico: 39.00 },
  'gesik-dol-susp': { venta: 47.15, farmacia: 37.72, tresANueve: 25.15, diezOMas: 22.63, medico: 20.86 },
  'gesik-dol-gotas': { venta: 48.87, farmacia: 39.10, tresANueve: 26.06, diezOMas: 23.46, medico: 21.55 },
  'febrikids-jarabe': { venta: 46.04, farmacia: 36.83, tresANueve: 24.55, diezOMas: 22.10, medico: 20.42 },
  'febrikids-gotas': { venta: 48.87, farmacia: 39.10, tresANueve: 26.06, diezOMas: 23.46, medico: 21.55 },
  'diclovert': { venta: 90.00, farmacia: 72.00, tresANueve: 48.00, diezOMas: 43.20, medico: 40.13 },
  'celtere': { venta: 105.00, farmacia: 84.00, tresANueve: 56.00, diezOMas: 50.40, medico: 46.30 },

  // ===== ANTIHISTAMÍNICOS =====
  'nocicep-tab': { venta: 54.63, farmacia: 43.70, tresANueve: 29.14, diezOMas: 26.22, medico: 23.85 },
  'nocicep-rp-tab': { venta: 138.00, farmacia: 110.40, tresANueve: 73.60, diezOMas: 66.24, medico: 57.40 },
  'nocicep-rp-sol': { venta: 180.00, farmacia: 144.00, tresANueve: 96.00, diezOMas: 86.40, medico: 61.00 },

  // ===== GINECOLÓGICO =====
  'biomicotrin': { venta: 320.00, farmacia: 256.00, tresANueve: 170.67, diezOMas: 153.60, medico: 107.00 },

  // ===== VITAMINAS / SUPLEMENTOS =====
  'evamedyx-susp': { venta: 59.87, farmacia: 47.90, tresANueve: 31.93, diezOMas: 28.74, medico: 28.15 },
  'evamedyx-ampolla': { venta: 235.13, farmacia: 188.10, tresANueve: 125.40, diezOMas: 112.86, medico: 96.05 },
  'fosfomenal-ampolla': { venta: 235.13, farmacia: 188.10, tresANueve: 125.40, diezOMas: 112.86, medico: 99.00 },
  'ginkgo-ginseng-ampolla': { venta: 235.13, farmacia: 188.10, tresANueve: 125.40, diezOMas: 112.86, medico: 99.00 },
  'alphavit': { venta: 122.82, farmacia: 98.26, tresANueve: 65.50, diezOMas: 58.95, medico: 51.13 },
  'alphavit-25000': { venta: 55.73, farmacia: 44.58, tresANueve: 29.72, diezOMas: 26.75, medico: 24.29, condicion: '100+15' },
  'alphavit-dn': { venta: 61.80, farmacia: 49.44, tresANueve: 32.96, diezOMas: 29.66, medico: 26.72, condicion: '100+15' },
  'neurotropas-25000': { venta: 61.74, farmacia: 16.50, medico: 13.50, condicion: 'En la compra de 1000 unidades' },
  'dolo-neurotropas': { venta: 73.17, farmacia: 17.95, medico: 14.50, condicion: 'En la compra de 1000 unidades' },
  'dexa-neurotropas': { venta: 73.70, farmacia: 18.50, medico: 15.00, condicion: 'En la compra de 1000 unidades' },
  'glutamax': { venta: 91.17, farmacia: 72.94, tresANueve: 48.62, diezOMas: 43.76, medico: 38.47 },

  // ===== OTROS FARMACÉUTICOS =====
  'dayfem-hcg-test': { venta: 25.00, farmacia: 15.00, diezOMas: 13.64, medico: 13.64, condicion: 'En la compra de 1000 unidades' },
  'dayfem-hcg-midstream': { venta: 45.00, farmacia: 35.00, diezOMas: 31.81, medico: 31.81, condicion: 'En la compra de 50 unidades' },
  'delisure-ninos': { venta: 143.00, medico: 105.00 },
  'abencyl-susp': { venta: 140.00, farmacia: 112.00, tresANueve: 74.67, diezOMas: 67.20, medico: 60.19 },
  'abencyl-tab': { venta: 150.00, farmacia: 120.00, tresANueve: 80.00, diezOMas: 72.00, medico: 64.73 },
  'enaprex': { venta: 80.00, farmacia: 64.00, tresANueve: 42.67, diezOMas: 38.40, medico: 34.53 },
  'lemudor': { venta: 125.00, farmacia: 100.00, tresANueve: 66.67, diezOMas: 60.00, medico: 54.86 },
  'emox-susp': { venta: 175.00, farmacia: 140.00, tresANueve: 93.33, diezOMas: 84.00, medico: 77.29 },
  'virest': { venta: 100.00, farmacia: 80.00, tresANueve: 53.33, diezOMas: 48.00, medico: 43.41 },
  'emox-tab': { venta: 300.00, farmacia: 240.00, tresANueve: 160.00, diezOMas: 144.00, medico: 132.96 },

  // ===== CUIDADO DEL BEBÉ =====
  'aspirador-nasal': { venta: 22.00, medico: 12.20 },
  'biberon-60': { venta: 19.92, medico: 12.45 },
  'biberon-150': { venta: 24.06, medico: 19.25 },
  'biberon-300': { venta: 30.31, medico: 24.25 },
  'mamon-grande': { venta: 10.00, medico: 6.43 },
  'cepillo-lava-biberon': { venta: 30.00, medico: 14.23 },
  'set-corta-unas': { venta: 25.00, medico: 15.97 },
  'extractor-leche': { venta: 28.00, medico: 15.50 },
  'cepillo-bebe': { venta: 15.00, medico: 6.23 },
  'vajilla-bambu': { venta: 79.50, medico: 65.00 },
  'pijama-chiquititos': { venta: 70.00, medico: 20.00 },

  // ===== DISPOSITIVOS Y OTROS =====
  'preservativo-seguro-carex': { venta: 62.50, medico: 50.00 },
  'frasco-muestra-cp': { venta: 1.58, medico: 1.28 },
  'frasco-muestra-sp': { venta: 1.52, medico: 1.22 },
  'corta-unas-farmacarex': { venta: 48.75, medico: 39.24 },
  'medidor-presion-muneca': { venta: 225.00, medico: 165.00 },
  'medidor-presion-antebrazo': { venta: 175.00, medico: 130.00 },
  'termometro-infrarrojo': { venta: 125.00, medico: 90.00 },
  'termometro-digital': { venta: 30.00, medico: 20.00 },
  'termometro-animalitos': { venta: 30.00, medico: 20.00 },
};

export function getPrice(medId: string, tier: 'venta' | 'farmacia' | 'tresANueve' | 'diezOMas' | 'medico'): number | undefined {
  const p = PRICES[medId];
  if (!p) return undefined;
  return p[tier];
}

export function getMedicoPrice(medId: string): number {
  const p = PRICES[medId];
  if (!p) return 0;
  return p.medico;
}
