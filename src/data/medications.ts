import type { Medication } from '../types';

export const MEDICATIONS: Medication[] = [
  // ===== GRIPE Y TOS =====
  {
    id: 'tusicarex-antigripal-im',
    nombreComercial: 'Tusicarex Antigripal I.M.',
    nombreGenerico: 'Eucaliptol + Guayacol',
    categoria: 'gripe-tos',
    presentacion: 'Ampolla 2 mL',
    formula: [
      { componente: 'Eucaliptol', cantidad: '120.00 mg' },
      { componente: 'Guayacol', cantidad: '50.00 mL' },
      { componente: 'Excipientes c.s.p.', cantidad: '2.00 mL' },
    ],
    indicaciones:
      'Antigripal inyectable con propiedades expectorantes y antisépticas de las vías respiratorias. Alivia síntomas de gripe, resfriado común y bronquitis.',
    posologia:
      'Adultos y adolescentes mayores de 12 años: 1 ampolla (2 mL) cada 24 horas por vía intramuscular profunda. Hasta cada 12 horas en casos severos bajo supervisión médica. Tratamiento máximo 5–7 días sin reevaluación.',
    seguridad:
      'Contraindicado en hipersensibilidad a los componentes, niños menores de 12 años, embarazo/lactancia y antecedentes de convulsiones. Evitar vía intravenosa. Reacciones adversas: dolor en el sitio de inyección, mareos o náuseas.',
  },
  {
    id: 'tusicarex-antitusivo',
    nombreComercial: 'Tusicarex',
    nombreGenerico: 'Dextrometorfano + Clorfeniramina + Cloruro de Amonio',
    categoria: 'gripe-tos',
    presentacion: 'Frasco 120 mL',
    formula: [
      { componente: 'Dextrometorfano Bromhidrato', cantidad: '15 mg / 5 mL' },
      { componente: 'Clorfeniramina Maleato', cantidad: '2 mg / 5 mL' },
      { componente: 'Cloruro de Amonio', cantidad: '125 mg / 5 mL' },
    ],
    indicaciones:
      'Antitusivo, antihistamínico y expectorante salino. Para tos irritativa no productiva y tos con secreciones asociadas a procesos alérgicos o infecciosos.',
    posologia:
      'Adultos: 5–10 mL cada 6–8 h. Niños 6–12 años: 2.5–5 mL cada 8 h. Niños 2–6 años: 1.25–2.5 mL cada 8 h, bajo indicación médica.',
    seguridad:
      'Causa somnolencia significativa. Contraindicado con IMAOs, glaucoma de ángulo cerrado o hipertrofia prostática. El alcohol potencia el efecto sedante.',
  },
  {
    id: 'tusicarex-flem',
    nombreComercial: 'Tusicarex Flem',
    nombreGenerico: 'Ambroxol HCl + Clenbuterol HCl',
    categoria: 'gripe-tos',
    presentacion: 'Frasco 120 mL (sabor tutti-frutti)',
    formula: [
      { componente: 'Ambroxol HCl', cantidad: '7.50 mg / 5 mL' },
      { componente: 'Clenbuterol HCl', cantidad: '0.005 mg / 5 mL' },
    ],
    indicaciones:
      'Broncodilatador y expectorante. Para asma bronquial y bronquitis asmatiforme con broncoespasmo y dificultad para eliminar secreciones.',
    posologia:
      'Adultos: 15–20 mL cada 12 h. Niños 6–12 años: 10–15 mL. Niños 2–6 años: 5–10 mL, divididos en dos tomas diarias.',
    seguridad:
      'El clenbuterol puede causar temblor fino, palpitaciones e inquietud. Contraindicado en tirotoxicosis, taquiarritmias y primer trimestre del embarazo.',
  },
  {
    id: 'tusicarex-antigripal',
    nombreComercial: 'Tusicarex Antigripal',
    nombreGenerico: 'Acetaminofén + Dextrometorfano + Clorfeniramina + Fenilefrina',
    categoria: 'gripe-tos',
    presentacion: 'Frasco 120 mL (sabor naranja)',
    formula: [
      { componente: 'Acetaminofén', cantidad: '160 mg / 5 mL' },
      { componente: 'Fenilefrina HCl', cantidad: '5 mg / 5 mL' },
      { componente: 'Dextrometorfano HBr', cantidad: '7.5 mg / 5 mL' },
      { componente: 'Clorfeniramina Maleato', cantidad: '2 mg / 5 mL' },
    ],
    indicaciones:
      'Analgésico, antipirético, antitusivo, antihistamínico y descongestionante nasal. Alivio integral de los síntomas de gripe y resfriado común.',
    posologia:
      'Adultos: 10 mL cada 6–8 h. Niños 6–12 años: 5 mL cada 6–8 h. Niños 2–6 años: 2.5 mL cada 8 h.',
    seguridad:
      'Riesgo de hepatotoxicidad por acetaminofén. Contraindicado en hipertensión arterial severa o enfermedad coronaria. No combinar con otros productos con acetaminofén ni con alcohol.',
  },

  // ===== ANTIPARASITARIO / ANTIMICÓTICO =====
  {
    id: 'triplex-derm',
    nombreComercial: 'Triplex Derm',
    nombreGenerico: 'Betametasona + Clotrimazol + Gentamicina',
    categoria: 'antiparasitario',
    presentacion: 'Tubo 15 g (aroma avellana)',
    formula: [
      { componente: 'Betametasona (como Dipropionato)', cantidad: '0.5 mg / g' },
      { componente: 'Clotrimazol', cantidad: '10 mg / g' },
      { componente: 'Gentamicina (como Sulfato)', cantidad: '1 mg / g' },
    ],
    indicaciones:
      'Antiinflamatorio, antimicótico y antibacteriano tópico. Para dermatosis inflamatorias complicadas con infecciones bacterianas o fúngicas: eccema, dermatitis por contacto y tiñas.',
    posologia:
      'Aplicar capa delgada sobre la zona afectada 2 veces al día. No prolongar más de 14 días.',
    seguridad:
      'Uso externo únicamente. No aplicar en ojos, mucosas ni heridas abiertas. Contraindicado en lesiones virales activas (herpes, varicela) y rosácea.',
  },
  {
    id: 'vendaxol',
    nombreComercial: 'Vendaxol',
    nombreGenerico: 'Albendazol 400 mg/20 mL',
    categoria: 'antiparasitario',
    presentacion: 'Frasco 20 mL (pediátrico)',
    formula: [
      { componente: 'Albendazol', cantidad: '400 mg / 5 mL' },
    ],
    indicaciones:
      'Antihelmíntico de amplio espectro para Ascariasis, Enterobiasis, Trichuriasis, Ancylostomiasis, Necatoriasis y giardiasis en niños.',
    posologia:
      'Adultos y niños mayores de 2 años: 400 mg (5 mL) dosis única. En estrongiloidiasis o teniasis: 400 mg/día por 3 días. Niños 1–2 años: 200 mg (2.5 mL) dosis única.',
    seguridad:
      'Contraindicado en embarazo (teratogénico) y en hipersensibilidad a benzimidazoles. Reacciones adversas leves: dolor abdominal, náuseas, cefalea.',
  },

  // ===== CRÓNICOS / GÁSTRICOS =====
  {
    id: 'tabypress-h',
    nombreComercial: 'Tabypress H',
    nombreGenerico: 'Losartán potásico + Hidroclorotiazida',
    categoria: 'gastro',
    presentacion: 'Caja 30 tabletas recubiertas',
    formula: [
      { componente: 'Losartán potásico', cantidad: '50 mg / Tab' },
      { componente: 'Hidroclorotiazida', cantidad: '12.5 mg / Tab' },
    ],
    indicaciones:
      'Antihipertensivo combinado (ARA II + tiazídico). Para hipertensión arterial esencial no controlada con monoterapia.',
    posologia:
      '1 tableta una vez al día, a la misma hora, preferiblemente por la mañana. Con o sin alimentos.',
    seguridad:
      'Contraindicación absoluta en embarazo (toxicidad renal fetal). Precaución en insuficiencia renal o hepática y desequilibrios electrolíticos. Monitorear potasio y función renal.',
  },
  {
    id: 'gastricarex',
    nombreComercial: 'Gastricarex 40 mg',
    nombreGenerico: 'Esomeprazol (como magnesio trihidrato) 40 mg',
    categoria: 'gastro',
    presentacion: 'Caja 15 cápsulas con gránulos con recubrimiento entérico',
    formula: [
      { componente: 'Esomeprazol', cantidad: '40 mg / Cáps' },
    ],
    indicaciones:
      'Inhibidor de la bomba de protones (IBP). Para ERGE, esofagitis erosiva, úlcera gástrica y duodenal, y erradicación de Helicobacter pylori (en combinación con antibióticos).',
    posologia:
      '40 mg una vez al día durante 4–8 semanas. Tomar 30–60 minutos antes del desayuno. Tragar enteras, sin masticar ni triturar.',
    seguridad:
      'Uso prolongado (más de 1 año) puede asociarse a fracturas óseas, hipomagnesemia y deficiencia de B12. Interactúa con ketoconazol y reduce eficacia de clopidogrel.',
  },
  {
    id: 'gastricarex-1plus1',
    nombreComercial: 'Gastricarex 40 mg — Pack 1+1',
    nombreGenerico: 'Esomeprazol 40 mg (atado 1+1)',
    categoria: 'gastro',
    presentacion: 'Caja 30 cápsulas (atado promocional 1+1)',
    indicaciones:
      'Misma composición de Gastricarex 40 mg en presentación de pack 1+1 (2 cajas).',
  },
  {
    id: 'gelexil',
    nombreComercial: 'Gelexil',
    nombreGenerico: 'Hidróxido de Aluminio + Hidróxido de Magnesio + Simeticona',
    categoria: 'gastro',
    presentacion: 'Frasco 360 mL (sabor menta, sin azúcar)',
    formula: [
      { componente: 'Hidróxido de aluminio', cantidad: '600 mg / 15 mL' },
      { componente: 'Hidróxido de magnesio', cantidad: '600 mg / 15 mL' },
      { componente: 'Dimetilpolisiloxano (Simeticona)', cantidad: '60 mg / 15 mL' },
    ],
    indicaciones:
      'Antiácido no sistémico y antiespumante. Alivio rápido de acidez estomacal, indigestión ácida, gastritis, reflujo gastroesofágico y distensión abdominal por gases.',
    posologia:
      'Adultos: 15 mL (1 cucharada) 3–4 veces al día, 30–60 minutos después de las comidas y antes de acostarse. Agitar antes de usar.',
    seguridad:
      'No usar en insuficiencia renal grave. Puede causar estreñimiento (aluminio) o diarrea (magnesio). Espaciar 2 horas con tetraciclinas o hierro.',
  },

  // ===== ANTIBIÓTICOS =====
  {
    id: 'mofoxtin',
    nombreComercial: 'Mofoxtin',
    nombreGenerico: 'Moxifloxacino (como clorhidrato) 400 mg',
    categoria: 'antibiotico',
    presentacion: 'Caja 10 tabletas',
    formula: [
      { componente: 'Moxifloxacino', cantidad: '400 mg / Tab' },
    ],
    indicaciones:
      'Fluoroquinolona de cuarta generación. Para sinusitis aguda, exacerbaciones de bronquitis crónica, neumonía adquirida en la comunidad e infecciones complicadas de piel y tejidos blandos.',
    posologia:
      '1 tableta (400 mg) una vez al día, durante 5–10 días según la infección. Tomar con abundante líquido.',
    seguridad:
      'Riesgo de tendinitis y ruptura de tendones (especialmente en ancianos). Puede prolongar el intervalo QT. Contraindicado en niños, embarazadas y lactantes. Evitar exposición solar excesiva.',
  },
  {
    id: 'klavicarex',
    nombreComercial: 'Klavicarex',
    nombreGenerico: 'Amoxicilina + Ácido Clavulánico',
    categoria: 'antibiotico',
    presentacion: 'Polvo para suspensión oral 70 mL (400 mg + 57 mg/5 mL)',
    formula: [
      { componente: 'Amoxicilina (como trihidrato)', cantidad: '400 mg / 5 mL' },
      { componente: 'Ác. Clavulánico (como clavulanato de potasio)', cantidad: '57 mg / 5 mL' },
    ],
    indicaciones:
      'Antibiótico betalactámico + inhibidor de betalactamasas. Para otitis media aguda, sinusitis, infecciones del tracto respiratorio inferior y de piel y tejidos blandos en pediatría.',
    posologia:
      '25–45 mg/kg/día (basado en amoxicilina), dividido en 2 tomas cada 12 h. Infecciones severas: 80–90 mg/kg/día.',
    seguridad:
      'Contraindicado en alergia a penicilinas o cefalosporinas. Efecto adverso más común: diarrea (administrar al inicio de una comida). Tras reconstitución, refrigerar y descartar a los 7–10 días.',
  },

  // ===== DOLOR =====
  {
    id: 'blockdol',
    nombreComercial: 'Blockdol',
    nombreGenerico: 'Dexketoprofeno + Vitaminas B1, B6, B12',
    categoria: 'dolor',
    presentacion: 'Caja 20 tabletas recubiertas',
    formula: [
      { componente: 'Dexketoprofeno Trometamol', cantidad: '25 mg / Tab' },
      { componente: 'Tiamina HCl (B1)', cantidad: '50 mg / Tab' },
      { componente: 'Piridoxina HCl (B6)', cantidad: '50 mg / Tab' },
      { componente: 'Cianocobalamina (B12)', cantidad: '1,000 mcg / Tab' },
    ],
    indicaciones:
      'AINE + complejo B neurotrópico. Para dolor agudo moderado-severo con componente inflamatorio o neuropático: lumbalgias, ciática, cervicalgias, dolor postraumático y postoperatorio.',
    posologia:
      '1 tableta cada 8 h. Máximo 3 tabletas (75 mg de dexketoprofeno) en 24 h.',
    seguridad:
      'Contraindicado en úlcera péptica activa, insuficiencia renal o hepática grave, y embarazo/lactancia. Precaución en antecedentes gastrointestinales y combinación con anticoagulantes.',
  },
  {
    id: 'gesikdol-plus',
    nombreComercial: 'Gesikdol Plus',
    nombreGenerico: 'Acetaminofén + Tramadol HCl',
    categoria: 'dolor',
    presentacion: 'Caja 10 tabletas recubiertas',
    formula: [
      { componente: 'Acetaminofén', cantidad: '325 mg / Tab' },
      { componente: 'Tramadol HCl', cantidad: '37.5 mg / Tab' },
    ],
    indicaciones:
      'Analgésico combinado (opioide + no opioide) para dolor moderado a severo, agudo o crónico, que no responde a analgésicos convencionales.',
    posologia:
      '1–2 tabletas cada 6–8 h según intensidad del dolor. Máximo 8 tabletas al día.',
    seguridad:
      'Puede causar depresión respiratoria y tiene potencial de dependencia. No combinar con alcohol ni otros depresores del SNC. Contraindicado con IMAOs y en intoxicaciones agudas.',
  },
  {
    id: 'gesikdol-forte',
    nombreComercial: 'Gesikdol Forte',
    nombreGenerico: 'Acetaminofén + Naproxeno Sódico',
    categoria: 'dolor',
    presentacion: 'Caja 10 tabletas recubiertas',
    formula: [
      { componente: 'Acetaminofén', cantidad: '300 mg / Tab' },
      { componente: 'Naproxeno Sódico', cantidad: '275 mg / Tab' },
    ],
    indicaciones:
      'Analgésico y antiinflamatorio combinado. Para dolor inflamatorio moderado: dolores musculares, articulares, dismenorrea, odontalgias y estados febriles con inflamación.',
    posologia:
      'Adultos: 1 tableta cada 8–12 h, con alimentos o leche.',
    seguridad:
      'Contraindicado en úlcera gástrica, sangrado GI activo o hipersensibilidad. El naproxeno puede elevar la presión arterial en hipertensos. No usar por tiempo prolongado sin vigilancia renal.',
  },
  {
    id: 'gesik-dol-susp',
    nombreComercial: 'Gesik-dol Suspensión',
    nombreGenerico: 'Diclofenaco potásico 9 mg/5 mL',
    categoria: 'dolor',
    presentacion: 'Frasco 120 mL (sabor tutti-frutti)',
    formula: [
      { componente: 'Diclofenaco potásico (como resinato)', cantidad: '9.00 mg / 5 mL' },
    ],
    indicaciones:
      'AINE pediátrico de rápida absorción. Para estados inflamatorios dolorosos postraumáticos y postoperatorios, y cuadros febriles y dolorosos asociados a infecciones de oído, nariz o garganta.',
    posologia:
      'Niños mayores de 1 año: 0.5–2 mg/kg/día, repartidos en 2–3 tomas. Máximo 5 días sin supervisión médica.',
    seguridad:
      'Contraindicado en úlcera péptica activa, insuficiencia renal o hepática grave, y antecedente de asma o alergia a AINEs/aspirina. Administrar preferiblemente con alimentos.',
  },
  {
    id: 'gesik-dol-gotas',
    nombreComercial: 'Gesik-dol Gotas',
    nombreGenerico: 'Diclofenaco resinato (15 mg/mL equivalente)',
    categoria: 'dolor',
    presentacion: 'Frasco gotero 30 mL',
    formula: [
      { componente: 'Diclofenaco resinato', cantidad: '46.44 mg / mL (equiv. 15 mg potásico)' },
    ],
    indicaciones:
      'AINE concentrado para lactantes y niños pequeños. Alivio del dolor e inflamación en otitis, amigdalitis y post procedimientos dentales.',
    posologia:
      '1 gota por kilogramo de peso, 2–3 veces al día. Ejemplo: lactante de 8 kg = 8 gotas cada 8–12 h.',
    seguridad:
      'No usar en menores de 1 año salvo estricta indicación médica. Riesgo de sangrado GI en uso prolongado. Vigilar función renal en tratamientos largos.',
  },
  {
    id: 'febrikids-jarabe',
    nombreComercial: 'Febrikids Jarabe',
    nombreGenerico: 'Acetaminofén 125 mg/5 mL',
    categoria: 'dolor',
    presentacion: 'Frasco 120 mL (sabor fresa)',
    formula: [
      { componente: 'Acetaminofén', cantidad: '125 mg / 5 mL' },
    ],
    indicaciones:
      'Analgésico y antipirético de primera elección para fiebre y dolor leve a moderado en pediatría.',
    posologia:
      '10–15 mg/kg/dosis cada 4–6 h. 2–3 años (11–16 kg): 5 mL; 4–5 años (16–21 kg): 7.5 mL; 6–8 años (21–27 kg): 10 mL.',
    seguridad:
      'No exceder 5 dosis en 24 h ni 60 mg/kg/día. Riesgo de daño hepático grave en sobredosis. No combinar con otros productos con acetaminofén.',
  },
  {
    id: 'febrikids-gotas',
    nombreComercial: 'Febrikids Gotas',
    nombreGenerico: 'Acetaminofén 100 mg/mL',
    categoria: 'dolor',
    presentacion: 'Frasco gotero 30 mL (sabor fresa)',
    formula: [
      { componente: 'Acetaminofén', cantidad: '100 mg / mL' },
    ],
    indicaciones:
      'Analgésico y antipirético concentrado para lactantes, con dosificación precisa por gotas.',
    posologia:
      '2 gotas por kilogramo de peso cada 4–6 h. Ejemplo: bebé de 5 kg = 10 gotas cada 6 h. Solo con gotero del envase.',
    seguridad:
      'Crítico: mantener fuera del alcance de los niños. La sobredosis es una emergencia médica aunque los síntomas iniciales pueden ser leves. Antídoto: N-acetilcisteína.',
  },

  // ===== ANTIHISTAMÍNICOS =====
  {
    id: 'nocicep-tab',
    nombreComercial: 'Nocicep (Clorfeniramina)',
    nombreGenerico: 'Clorfeniramina Maleato 2 mg/5 mL',
    categoria: 'alergia',
    presentacion: 'Frasco 120 mL',
    formula: [
      { componente: 'Clorfeniramina Maleato', cantidad: '2 mg / 5 mL' },
    ],
    indicaciones:
      'Antihistamínico H1 de primera generación. Para rinitis alérgica, conjuntivitis alérgica, urticaria, angioedema, reacciones alérgicas a medicamentos o alimentos, y prurito por picaduras o varicela.',
    posologia:
      'Adultos y niños > 12 años: 10 mL cada 4–6 h, máximo 60 mL/día. Niños 6–12 años: 5 mL cada 4–6 h. Niños 2–6 años: 2.5 mL cada 4–6 h.',
    seguridad:
      'Causa somnolencia marcada. Contraindicado en glaucoma de ángulo cerrado, hipertrofia prostática sintomática y crisis asmáticas. El alcohol potencia el efecto sedante.',
  },
  {
    id: 'nocicep-rp-tab',
    nombreComercial: 'Nocicep RP Tabletas',
    nombreGenerico: 'Rupatadina (como fumarato) 10 mg',
    categoria: 'alergia',
    presentacion: 'Caja 10 tabletas recubiertas',
    formula: [
      { componente: 'Rupatadina', cantidad: '10 mg / Tab' },
    ],
    indicaciones:
      'Antihistamínico H1 de segunda generación + antagonista del PAF. Para rinitis alérgica estacional/perenne y urticaria crónica idiopática en adultos y adolescentes.',
    posologia:
      '1 tableta (10 mg) una vez al día. Evitar consumo de jugo de toronja.',
    seguridad:
      'Bajo potencial de somnolencia pero observar reacción individual antes de conducir. Precaución en insuficiencia renal o hepática y condiciones proarrítmicas.',
  },
  {
    id: 'nocicep-rp-sol',
    nombreComercial: 'Nocicep RP Solución',
    nombreGenerico: 'Rupatadina 1 mg/mL',
    categoria: 'alergia',
    presentacion: 'Frasco 120 mL',
    formula: [
      { componente: 'Rupatadina', cantidad: '1 mg / mL' },
    ],
    indicaciones:
      'Misma indicación que Nocicep RP Tabletas, en formulación pediátrica jarabe para niños de 2 a 11 años.',
    posologia:
      'Niños con peso ≥ 25 kg: 5 mL una vez al día. Niños 10–25 kg: 2.5 mL una vez al día.',
    seguridad:
      'No recomendado en menores de 2 años por falta de datos de seguridad. Generalmente bien tolerado (cefalea o somnolencia leve).',
  },

  // ===== GINECOLÓGICO =====
  {
    id: 'biomicotrin',
    nombreComercial: 'Biomicotrin',
    nombreGenerico: 'Ketoconazol + Clindamicina',
    categoria: 'ginecologia',
    presentacion: 'Caja 7 óvulos vaginales',
    formula: [
      { componente: 'Ketoconazol', cantidad: '400 mg / Óvulo' },
      { componente: 'Clindamicina', cantidad: '100 mg / Óvulo' },
    ],
    indicaciones:
      'Antimicótico y antibacteriano vaginal para vaginosis bacteriana, candidiasis vulvovaginal e infecciones mixtas con flujo, prurito, ardor e inflamación.',
    posologia:
      '1 óvulo por vía vaginal una vez al día, preferiblemente al acostarse, durante 7 días consecutivos.',
    seguridad:
      'No usar en el primer trimestre del embarazo. Evitar alcohol durante el tratamiento (efecto tipo disulfiram con azoles). Lavar bien las manos antes y después.',
  },

  // ===== VITAMINAS / SUPLEMENTOS =====
  {
    id: 'evamedyx-susp',
    nombreComercial: 'Evamedyx G50+ Suspensión',
    nombreGenerico: 'Suplemento dietético',
    categoria: 'vitaminas',
    presentacion: 'Frasco 120 mL',
    formula: [
      { componente: 'Extracto de Angélica' },
      { componente: 'Vitamina E Oleosa' },
      { componente: 'Extracto de Jengibre' },
      { componente: 'Extracto de Damiana' },
      { componente: 'Extracto de Polen de abeja' },
      { componente: 'Vehículo c.s.p.' },
    ],
    indicaciones:
      'Suplemento para síntomas del climaterio y menopausia: sofocos, sudoración nocturna, irritabilidad, fatiga y sequedad de la piel.',
    posologia:
      '15 mL (1 cucharada) 1–2 veces al día, solo o mezclado con agua o jugo.',
    seguridad:
      'No sustituye terapia de reemplazo hormonal. No usar en personas alérgicas a productos de la colmena.',
  },
  {
    id: 'evamedyx-ampolla',
    nombreComercial: 'Evamedyx G50+ Ampollas',
    nombreGenerico: 'Tónico revitalizante (extractos botánicos)',
    categoria: 'vitaminas',
    presentacion: 'Caja 15 ampollas bebibles 10 mL',
    formula: [
      { componente: 'Extracto de Angélica' },
      { componente: 'Extracto de Jengibre' },
      { componente: 'Extracto de Damiana' },
      { componente: 'Extracto de Polen' },
      { componente: 'Vitamina E' },
    ],
    indicaciones:
      'Tónico revitalizante sin azúcar para fatiga intensa y control de síntomas del climaterio.',
    posologia:
      '1 ampolla al día por la mañana, sola o diluida en medio vaso de agua.',
    seguridad:
      'Mantener fuera del alcance de los niños. Precaución en alergias a extractos vegetales.',
  },
  {
    id: 'fosfomenal-ampolla',
    nombreComercial: 'Fosfomenal Ampollas',
    nombreGenerico: 'Glutamato + Fosfato + Complejo B + Pantotenato',
    categoria: 'vitaminas',
    presentacion: 'Caja 15 ampollas bebibles 10 mL',
    formula: [
      { componente: 'Glutamato de sodio', cantidad: '200 mg / 10 mL' },
      { componente: 'Fosfato monosódico', cantidad: '20 mg / 10 mL' },
      { componente: 'Vitamina B1 (Tiamina HCl)', cantidad: '10 mg / 10 mL' },
      { componente: 'Vitamina B6 (Piridoxina HCl)', cantidad: '10 mg / 10 mL' },
      { componente: 'Vitamina B12 (Cianocobalamina)', cantidad: '25 mcg / 10 mL' },
      { componente: 'Pantotenato de calcio', cantidad: '5 mg / 10 mL' },
    ],
    indicaciones:
      'Coadyuvante para el tratamiento del cansancio físico y mental. Mejora la concentración, memoria y reduce agotamiento y estrés.',
    posologia:
      '1 ampolla al día, preferiblemente después del desayuno. En alta demanda, hasta 2 ampollas (mañana y tarde).',
    seguridad:
      'No usar en insuficiencia renal grave (por fosfatos). Precaución en personas sensibles al glutamato.',
  },
  {
    id: 'ginkgo-ginseng-ampolla',
    nombreComercial: 'Ginkgo Ginseng Ampollas',
    nombreGenerico: 'Ginseng + Ginkgo Biloba',
    categoria: 'vitaminas',
    presentacion: 'Caja 15 ampollas bebibles 10 mL',
    formula: [
      { componente: 'Extracto de Ginseng', cantidad: '200 mg / 10 mL' },
      { componente: 'Extracto de Ginkgo Biloba', cantidad: '200 mg / 10 mL' },
    ],
    indicaciones:
      'Tónico revitalizante energizante y oxigenante cerebral. Para fatiga crónica, falta de concentración, pérdida de memoria leve y mejora de la circulación periférica.',
    posologia:
      '1 ampolla al día, preferiblemente por la mañana con el desayuno. Agitar antes de abrir.',
    seguridad:
      'Precaución en hipertensos (ginseng) y pacientes con anticoagulantes/antiagregantes (ginkgo, riesgo de sangrado). No usar en niños ni durante el embarazo.',
  },
  {
    id: 'alphavit',
    nombreComercial: 'Alphavit Multivitamínico',
    nombreGenerico: 'Vitaminas A, C, D, E, Complejo B + Minerales',
    categoria: 'vitaminas',
    presentacion: 'Frasco 30 tabletas recubiertas',
    formula: [
      { componente: 'Vitamina A', cantidad: '400 U.I.' },
      { componente: 'Vitamina D', cantidad: '400 U.I.' },
      { componente: 'Vitamina E', cantidad: '10 mg' },
      { componente: 'Vitamina C', cantidad: '60 mg' },
      { componente: 'Ácido Fólico', cantidad: '400 mcg' },
      { componente: 'Vitamina B1', cantidad: '5 mg' },
      { componente: 'Vitamina B2', cantidad: '2.5 mg' },
      { componente: 'Vitamina B6', cantidad: '2 mg' },
      { componente: 'Vitamina B12', cantidad: '3 mcg' },
      { componente: 'Pantotenato de calcio', cantidad: '5.5 mg' },
      { componente: 'Calcio', cantidad: '100 mg' },
      { componente: 'Hierro', cantidad: '30 mg' },
      { componente: 'Magnesio', cantidad: '35 mg' },
      { componente: 'Zinc', cantidad: '4.5 mg' },
    ],
    indicaciones:
      'Suplemento nutricional multivitamínico con minerales para prevención y tratamiento de deficiencias nutricionales.',
    posologia:
      '1 tableta al día con la comida principal.',
    seguridad:
      'El hierro puede causar heces oscuras (normal). Mantener fuera del alcance de los niños por riesgo de intoxicación accidental.',
  },
  {
    id: 'alphavit-25000',
    nombreComercial: 'Alphavit 25,000',
    nombreGenerico: 'Vitaminas B1 + B6 + B12 + Lidocaína',
    categoria: 'vitaminas',
    presentacion: 'Ampolla 2 mL I.M.',
    formula: [
      { componente: 'Tiamina HCl (B1)', cantidad: '100 mg / 2 mL' },
      { componente: 'Piridoxina HCl (B6)', cantidad: '100 mg / 2 mL' },
      { componente: 'Cianocobalamina (B12)', cantidad: '25,000 mcg / 2 mL' },
      { componente: 'Lidocaína HCl', cantidad: '20 mg / 2 mL' },
    ],
    indicaciones:
      'Antineurítico y antianémico de alta potencia. Para neuropatías, neuralgias (ciática, trigémino), neuritis, parálisis facial y deficiencia severa de B12.',
    posologia:
      '1 ampolla por vía intramuscular profunda, 1–2 veces por semana.',
    seguridad:
      'Contraindicado en hipersensibilidad a lidocaína o complejo B y en enfermedad de Leber. La lidocaína reduce el dolor de la inyección.',
  },
  {
    id: 'alphavit-dn',
    nombreComercial: 'Alphavit DN',
    nombreGenerico: 'Diclofenaco + Complejo B',
    categoria: 'vitaminas',
    presentacion: 'Ampolla 2 mL + 1 mL I.M. (Dolor y Nervios)',
    formula: [
      { componente: 'Ampolla 1', cantidad: '1 mL' },
      { componente: '  Cianocobalamina (B12)', cantidad: '5,000 mcg' },
      { componente: '  Tiamina (B1)', cantidad: '100 mg' },
      { componente: '  Piridoxina (B6)', cantidad: '100 mg' },
      { componente: 'Ampolla 2', cantidad: '2 mL' },
      { componente: '  Diclofenaco Sódico', cantidad: '75 mg' },
    ],
    indicaciones:
      'Combinación de complejo B con diclofenaco para dolor intenso con componente inflamatorio y neuropático.',
    posologia:
      'Mezclar al momento de aplicar, 1 aplicación al día por vía intramuscular profunda.',
    seguridad:
      'Igual que Alphavit 25,000 + precauciones de diclofenaco (gástricas y renales).',
  },
  {
    id: 'neurotropas-25000',
    nombreComercial: 'Neurotropas 25,000',
    nombreGenerico: 'Complejo B concentrado',
    categoria: 'vitaminas',
    presentacion: 'Ampolla 3 mL',
    formula: [
      { componente: 'Cianocobalamina (B12)', cantidad: '25,000 mcg / 3 mL' },
      { componente: 'Tiamina Clorhidrato (B1)', cantidad: '100 mg / 3 mL' },
      { componente: 'Piridoxina Clorhidrato (B6)', cantidad: '100 mg / 3 mL' },
    ],
    indicaciones:
      'Reconstituyente neurotópico de alta concentración. Para deficiencias vitamínicas intensivas y trastornos neurológicos dolorosos crónicos.',
    posologia:
      '1 ampolla IM cada 2–4 días en fase aguda, luego espaciar según respuesta clínica.',
    seguridad:
      'Sin lidocaína, la inyección puede ser más dolorosa. Aplicar lentamente.',
  },
  {
    id: 'dolo-neurotropas',
    nombreComercial: 'Dolo Neurotropas Carex',
    nombreGenerico: 'Diclofenaco + Complejo B',
    categoria: 'vitaminas',
    presentacion: 'Kit 2 ampollas: Diclofenaco 2 mL + Neurotropas 1 mL',
    formula: [
      { componente: 'Ampolla 1 (Neurotropas)', cantidad: '1 mL' },
      { componente: '  Cianocobalamina (B12)', cantidad: '5,000 mcg' },
      { componente: '  Tiamina (B1)', cantidad: '100 mg' },
      { componente: '  Piridoxina (B6)', cantidad: '100 mg' },
      { componente: 'Ampolla 2 (Diclofenaco)', cantidad: '2 mL' },
      { componente: '  Diclofenaco Sódico', cantidad: '75 mg' },
    ],
    indicaciones:
      'Alivio del dolor neuropático con inflamación en cuadros agudos.',
    posologia:
      'Mezclar ambas ampollas al momento de aplicar, vía IM profunda.',
    seguridad:
      'Mismas precauciones del diclofenaco y neurotropas (gástricas, renales).',
  },
  {
    id: 'dexa-neurotropas',
    nombreComercial: 'Dexa Neurotropas',
    nombreGenerico: 'Dexametasona + Complejo B',
    categoria: 'vitaminas',
    presentacion: 'Kit 2 ampollas: Neurotropas 1 mL + Dexametasona 2 mL',
    formula: [
      { componente: 'Ampolla 1 (Neurotropas)', cantidad: '1 mL' },
      { componente: '  Cianocobalamina (B12)', cantidad: '5,000 mcg' },
      { componente: '  Tiamina (B1)', cantidad: '100 mg' },
      { componente: '  Piridoxina (B6)', cantidad: '100 mg' },
      { componente: 'Ampolla 2 (Dexametasona)', cantidad: '2 mL' },
      { componente: '  Dexametasona (como fosfato)', cantidad: '4 mg' },
    ],
    indicaciones:
      'Antiinflamatorio esteroideo + reconstituyente neurotropico para procesos dolorosos agudos severos: radiculopatías, crisis de artritis, neuritis aguda, postquirúrgicos.',
    posologia:
      'Mezclar ambas ampollas al momento, 1 aplicación diaria IM profunda, máximo 3–5 días.',
    seguridad:
      'La dexametasona puede elevar glucosa y presión arterial. Contraindicada en infecciones fúngicas sistémicas y virales activas. Evitar uso prolongado de corticoides.',
  },
  {
    id: 'glutamax',
    nombreComercial: 'Glutamax',
    nombreGenerico: 'Glutatión reducido',
    categoria: 'vitaminas',
    presentacion: 'Caja 30 cápsulas',
    indicaciones:
      'Suplemento antioxidante.',
  },

  // ===== OTROS FARMACÉUTICOS =====
  {
    id: 'dayfem-hcg-test',
    nombreComercial: 'Dayfem HCG Test',
    nombreGenerico: 'Prueba rápida de embarazo (HGC en orina)',
    categoria: 'dispositivo',
    presentacion: 'Tira reactiva',
    indicaciones: 'Detección rápida de embarazo en orina.',
  },
  {
    id: 'dayfem-hcg-midstream',
    nombreComercial: 'Dayfem HCG Test (midstream)',
    nombreGenerico: 'Prueba rápida de embarazo (cassette)',
    categoria: 'dispositivo',
    presentacion: 'Cassette con gotero',
    indicaciones: 'Detección rápida de embarazo en orina, formato midstream.',
  },
  {
    id: 'delisure-ninos',
    nombreComercial: 'Delisure Niños 400g Fresa',
    nombreGenerico: 'Suplemento nutricional infantil',
    categoria: 'cuidado-bebe',
    presentacion: 'Lata 400 g (sabor fresa)',
  },
  {
    id: 'abencyl-susp',
    nombreComercial: 'Abencyl 100 mg/5 mL',
    nombreGenerico: 'Antibiótico suspensión 60 mL',
    categoria: 'antibiotico',
    presentacion: 'Frasco 60 mL',
  },
  {
    id: 'abencyl-tab',
    nombreComercial: 'Abencyl 500 mg Tabletas',
    nombreGenerico: 'Antibiótico 500 mg',
    categoria: 'antibiotico',
    presentacion: 'Caja 6 tabletas',
  },
  {
    id: 'diclovert',
    nombreComercial: 'Diclovert 100 mg Tabletas',
    nombreGenerico: 'Diclofenaco 100 mg',
    categoria: 'dolor',
    presentacion: 'Caja 10 tabletas',
  },
  {
    id: 'enaprex',
    nombreComercial: 'Enaprex 20 mg Tabletas',
    nombreGenerico: 'Enalapril 20 mg',
    categoria: 'gastro',
    presentacion: 'Caja 30 tabletas',
  },
  {
    id: 'lemudor',
    nombreComercial: 'Lemudor 500 mg Tabletas',
    nombreGenerico: 'Linezolid 500 mg',
    categoria: 'antibiotico',
    presentacion: 'Caja 10 tabletas',
  },
  {
    id: 'emox-susp',
    nombreComercial: 'E-Mox 400 mg + 57 mg/5 mL',
    nombreGenerico: 'Amoxicilina + Ác. Clavulánico',
    categoria: 'antibiotico',
    presentacion: 'Frasco 70 mL',
  },
  {
    id: 'virest',
    nombreComercial: 'Virest 250 mg/5 mL',
    nombreGenerico: 'Aciclovir suspensión',
    categoria: 'antibiotico',
    presentacion: 'Frasco 60 mL',
  },
  {
    id: 'celtere',
    nombreComercial: 'Celtere 200 mg/5 mL',
    nombreGenerico: 'Celecoxib suspensión',
    categoria: 'dolor',
    presentacion: 'Frasco 15 mL',
  },
  {
    id: 'emox-tab',
    nombreComercial: 'E-Mox 875 mg + 125 mg',
    nombreGenerico: 'Amoxicilina + Ác. Clavulánico',
    categoria: 'antibiotico',
    presentacion: 'Caja 14 tabletas',
  },

  // ===== CUIDADO DEL BEBÉ (Chiquititos) =====
  {
    id: 'aspirador-nasal',
    nombreComercial: 'Aspirador nasal Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad',
  },
  {
    id: 'biberon-60',
    nombreComercial: 'Biberón Chiquititos 60 mL / 2 oz',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad 60 mL',
  },
  {
    id: 'biberon-150',
    nombreComercial: 'Biberón Chiquititos 150 mL / 5 oz',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad 150 mL',
  },
  {
    id: 'biberon-300',
    nombreComercial: 'Biberón Chiquititos 300 mL / 10 oz',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad 300 mL',
  },
  {
    id: 'mamon-grande',
    nombreComercial: 'Mamón Grande Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad',
  },
  {
    id: 'cepillo-lava-biberon',
    nombreComercial: 'Cepillo Lava biberón Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad',
  },
  {
    id: 'set-corta-unas',
    nombreComercial: 'Set corta uñas Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Set',
  },
  {
    id: 'extractor-leche',
    nombreComercial: 'Extractor de leche materna Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad',
  },
  {
    id: 'cepillo-bebe',
    nombreComercial: 'Cepillo dental bebé Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad',
  },
  {
    id: 'vajilla-bambu',
    nombreComercial: 'Vajilla Infantil bambú Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Set',
  },
  {
    id: 'pijama-chiquititos',
    nombreComercial: 'Pijama Chiquititos',
    categoria: 'cuidado-bebe',
    presentacion: 'Unidad',
  },

  // ===== DISPOSITIVOS Y OTROS =====
  {
    id: 'preservativo-seguro-carex',
    nombreComercial: 'Preservativo Seguro Carex x 3',
    categoria: 'dispositivo',
    presentacion: 'Caja 3 unidades',
  },
  {
    id: 'frasco-muestra-cp',
    nombreComercial: 'Frasco para muestra C/P 60 mL',
    categoria: 'dispositivo',
    presentacion: 'Frasco 60 mL con tapa',
  },
  {
    id: 'frasco-muestra-sp',
    nombreComercial: 'Frasco para muestra S/P 60 mL',
    categoria: 'dispositivo',
    presentacion: 'Frasco 60 mL sin tapa',
  },
  {
    id: 'corta-unas-farmacarex',
    nombreComercial: 'Corta uñas Farma Carex',
    categoria: 'dispositivo',
    presentacion: 'Unidad',
  },
  {
    id: 'medidor-presion-muneca',
    nombreComercial: 'Medidor de presión muñeca',
    categoria: 'dispositivo',
    presentacion: 'Tensiómetro digital de muñeca',
  },
  {
    id: 'medidor-presion-antebrazo',
    nombreComercial: 'Medidor de presión antebrazo',
    categoria: 'dispositivo',
    presentacion: 'Tensiómetro digital de antebrazo',
  },
  {
    id: 'termometro-infrarrojo',
    nombreComercial: 'Termómetro infrarrojo',
    categoria: 'dispositivo',
    presentacion: 'Unidad',
  },
  {
    id: 'termometro-digital',
    nombreComercial: 'Termómetro digital',
    categoria: 'dispositivo',
    presentacion: 'Unidad',
  },
  {
    id: 'termometro-animalitos',
    nombreComercial: 'Termómetro digital de animalitos',
    categoria: 'dispositivo',
    presentacion: 'Unidad (diseño infantil)',
  },
];

export const MEDICATION_BY_ID: Record<string, Medication> = MEDICATIONS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, Medication>
);
