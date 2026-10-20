// Imágenes con fondo blanco recortado (canal alfa) — generadas por
// scripts/alpha-key.html: flood fill desde bordes + despeckle + crop al bbox.
// 33 de 47 imágenes del catálogo tienen versión recortada; el resto
// son fotos reales (Glemenex, Penfluz, Celtere 500, DeliSure, Abencyl, E-Mox,
// Lemudor, Virest) y se muestran tal cual.
export const ALPHA_IMAGES: Record<string, true> = {
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

export const ALPHA_IMAGE_COUNT = Object.keys(ALPHA_IMAGES).length;