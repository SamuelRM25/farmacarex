// Mapeo medId -> ruta de la imagen de referencia.
// Las imágenes viven en /public/medicamentos/ y se sirven en /medicamentos/...
// Catálogo: 48 productos (34 Ascavi + 14 MedicBrand), 42 archivos de imagen
// (DeliSure usa la misma para fresa y vainilla).
const MEDICATION_IMAGES_RAW: Record<string, string> = {
  // Tusicarex (Ascavi)
  tusicarex: '/medicamentos/tusicarex.png',
  tusicarex_antitusivo: '/medicamentos/tusicarex.png',
  tusicarex_antigripal: '/medicamentos/tusicarexantigripal.png',
  tusicarex_antigripal_im: '/medicamentos/tusicarexantigripalim.png',
  tusicarex_flem: '/medicamentos/tusicarexflem.png',

  // Gesikdol (Ascavi)
  gesik_dol_susp: '/medicamentos/gesikdoljarabe.png',
  gesik_dol_gotas: '/medicamentos/gesikdolgotas.png',
  gesikdol_plus: '/medicamentos/gesikdolplus.png',
  gesikdol_forte: '/medicamentos/gesikdolforte.png',

  // Otros Ascavi
  triplex_derm: '/medicamentos/triplexderm.png',
  vendaxol: '/medicamentos/vendaxol.png',
  tabypress_h: '/medicamentos/tabypressh.png',
  gastricarex: '/medicamentos/gastricarex.png',
  gelexil: '/medicamentos/gelexil.png',
  blockdol: '/medicamentos/blockdol.png',
  febrikids_jarabe: '/medicamentos/febrikidsjarabe.png',
  febrikids_gotas: '/medicamentos/febrikidsgotas.png',
  nocicep_tab: '/medicamentos/nocicep.png',
  nocicep_rp_tab: '/medicamentos/nociceprp.png',
  nocicep_rp_sol: '/medicamentos/nociceprpjarabe.png',
  biomicotrin: '/medicamentos/biomicotrin.png',
  evamedyx_susp: '/medicamentos/evamedixg50.png',
  evamedyx_ampolla: '/medicamentos/evamedixg50ab.png',
  fosfomenal_ampolla: '/medicamentos/fosfomenalab.png',
  ginkgo_ginseng_ampolla: '/medicamentos/ginkgoginsengab.png',
  alphavit: '/medicamentos/alphabit.png',
  alphavit_25000: '/medicamentos/alphabit25000.png',
  alphavit_dn: '/medicamentos/alphabitdn.png',
  neurotropas_25000: '/medicamentos/neurotropas.png',
  dolo_neurotropas: '/medicamentos/doloneurotropas.png',
  dexa_neurotropas: '/medicamentos/dexaneurotropas.png',
  mofoxtin: '/medicamentos/mofoxtin.png',
  klavicarex: '/medicamentos/klavicarex.png',

  // MedicBrand
  emox_tab: '/medicamentos/e-moxtableta.png',
  emox_susp: '/medicamentos/e-moxsuspencion.png',
  abencyl_tab: '/medicamentos/abencyltableta.png',
  abencyl_susp: '/medicamentos/abencylsuspencion.png',
  lemudor: '/medicamentos/lemudor.png',
  diclovert: '/medicamentos/diclovert.png',
  celtere: '/medicamentos/celtere.png',
  celtere_500_tab: '/medicamentos/celteretabletas.jpg',
  enaprex: '/medicamentos/enaprex.png',
  virest: '/medicamentos/virest.png',
  glemenex_msm: '/medicamentos/gleminexmsm.jpg',
  penfluz: '/medicamentos/penfluz.jpg',
  delisure_ninos_fresa: '/medicamentos/delisure.png',
  delisure_ninos_vainilla: '/medicamentos/delisure.png',
};

// Convierte el medId (que usa guiones en el data) al formato de este map (con guiones bajos).
function normalizeId(medId: string): string {
  return medId.replace(/-/g, '_');
}

export interface MedImageInfo {
  /** Ruta de la imagen. */
  src: string;
  /** true si la imagen tiene fondo recortado (canal alfa) y flota sobre el color. */
  transparent: boolean;
}

const ALPHA: Record<string, true> = {
  alphavit: true,
  alphavit_25000: true,
  alphavit_dn: true,
  biomicotrin: true,
  blockdol: true,
  dexa_neurotropas: true,
  dolo_neurotropas: true,
  evamedyx_ampolla: true,
  evamedyx_susp: true,
  febrikids_gotas: true,
  febrikids_jarabe: true,
  fosfomenal_ampolla: true,
  gastricarex: true,
  gelexil: true,
  gesik_dol_gotas: true,
  gesik_dol_susp: true,
  gesikdol_forte: true,
  gesikdol_plus: true,
  ginkgo_ginseng_ampolla: true,
  klavicarex: true,
  mofoxtin: true,
  neurotropas_25000: true,
  nocicep_rp_sol: true,
  nocicep_rp_tab: true,
  nocicep_tab: true,
  tabypress_h: true,
  triplex_derm: true,
  tusicarex: true,
  tusicarex_antigripal: true,
  tusicarex_antigripal_im: true,
  tusicarex_antitusivo: true,
  tusicarex_flem: true,
  vendaxol: true,
};

export function getMedImageInfo(medId: string): MedImageInfo | undefined {
  const key = normalizeId(medId);
  const base = MEDICATION_IMAGES_RAW[key];
  if (!base) return undefined;
  if (ALPHA[key]) {
    return {
      src: base.replace('/medicamentos/', '/medicamentos/alpha/').replace(/\.[^.]+$/, '.png'),
      transparent: true,
    };
  }
  return { src: base, transparent: false };
}

export function getMedImage(medId: string): string | undefined {
  return getMedImageInfo(medId)?.src;
}

export const MEDICATION_IMAGES_COUNT = Object.keys(MEDICATION_IMAGES_RAW).length;
