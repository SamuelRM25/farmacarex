import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pill } from 'lucide-react';
import { MEDICATION_BY_ID } from '../data/medications';
import { MARCAS, CATEGORIAS } from '../types';
import { getMedImage } from '../data/medicationImages';

export default function Ad() {
  const { medId } = useParams<{ medId: string }>();
  const med = medId ? MEDICATION_BY_ID[medId] : undefined;

  // Forzar viewport exacto al montar (evita el responsive en la captura).
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  if (!med) {
    return (
      <div className="ad-canvas ad-canvas--error">
        <p className="text-3xl font-bold text-slate-700">Producto no encontrado</p>
        <p className="text-slate-500 mt-2">ID: {medId}</p>
        <p className="text-sm text-slate-400 mt-4">FarmaCarex · Droguería</p>
      </div>
    );
  }

  const cat = CATEGORIAS[med.categoria];
  const brand = MARCAS[med.marca];
  const imgSrc = getMedImage(med.id);
  const isAscavi = med.marca === 'ascavi';
  const isMedic = med.marca === 'medicbrand';

  // Acento principal por marca: Ascavi = azul, MedicBrand = rojo, FarmaCarex = gris.
  const accent = isAscavi
    ? '#1E4D8B'
    : isMedic
      ? '#E63946'
      : '#475569';

  return (
    <div
      className="ad-canvas"
      style={{ '--accent': accent } as React.CSSProperties}
    >
      {/* HEADER */}
      <header className="ad-header" style={{ background: accent }}>
        <div className="ad-header__brand">FarmaCarex · Droguería</div>
        <div className="ad-header__contact">
          <span className="font-bold">+502 2433-5641</span>
        </div>
      </header>

      {/* BRAND BADGE (chip de marca sobre la imagen) */}
      <div className="ad-badge-row">
        <span
          className={`ad-badge ${brand.bg} ${brand.color}`}
          style={{ borderColor: accent }}
        >
          {brand.short}
        </span>
        <span
          className={`ad-badge ${cat.color}`}
          style={{ borderColor: accent }}
        >
          {cat.label}
        </span>
      </div>

      {/* IMAGEN */}
      <div className="ad-image-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={med.nombreComercial}
            className="ad-image"
          />
        ) : (
          <div
            className={`ad-image-placeholder ${brand.bg}`}
            style={{ borderColor: accent }}
          >
            <Pill
              className={`w-32 h-32 ${brand.color}`}
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      {/* INFO: nombre + molécula + presentación */}
      <div className="ad-info" style={{ borderTopColor: accent }}>
        <h1
          className="ad-name"
          style={{ color: accent }}
        >
          {med.nombreComercial}
        </h1>

        {med.nombreGenerico && (
          <p className="ad-generic">
            <span className="ad-label">Molécula:</span> {med.nombreGenerico}
          </p>
        )}

        <p className="ad-presentation">
          <span className="ad-label">Presentación:</span> {med.presentacion}
        </p>
      </div>

      {/* FOOTER */}
      <footer className="ad-footer" style={{ background: accent }}>
        <div className="ad-footer__row">
          <div className="ad-footer__name">Droguería FarmaCarex, S.A.</div>
          <div className="ad-footer__addr">Mixco, Guatemala</div>
        </div>
        <div className="ad-footer__row ad-footer__row--end">
          <span className="ad-footer__contact">Tel: +502 2433-5641</span>
        </div>
      </footer>
    </div>
  );
}