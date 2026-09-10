// Mapeo medId -> ruta de la imagen de referencia.
// Las imágenes viven en /public/medicamentos/ y se sirven en /medicamentos/...
// Total: 42 imágenes (2.5 MB). El resto de medicamentos (~25) muestran un
// placeholder con icono Pill del brand.
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
  enaprex: '/medicamentos/enaprex.png',
  virest: '/medicamentos/virest.png',
  delisure_ninos_fresa: '/medicamentos/delisure.png',
  delisure_ninos_vainilla: '/medicamentos/delisure.png',
};

// Convierte el medId (que usa guiones en el data) al formato de este map (con guiones bajos).
function normalizeId(medId: string): string {
  return medId.replace(/-/g, '_');
}

export function getMedImage(medId: string): string | undefined {
  return MEDICATION_IMAGES_RAW[normalizeId(medId)];
}

export const MEDICATION_IMAGES_COUNT = Object.keys(MEDICATION_IMAGES_RAW).length;
