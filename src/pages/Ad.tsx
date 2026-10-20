import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Pill, Phone } from 'lucide-react';
import { MEDICATION_BY_ID } from '../data/medications';
import { getMedImageInfo } from '../data/medicationImages';
import { paletteForCategory, campaignFor } from '../data/adPalettes';
import { benefitsFor, subtitleFor } from '../lib/adContent';

export default function Ad() {
  const { medId } = useParams<{ medId: string }>();
  const med = medId ? MEDICATION_BY_ID[medId] : undefined;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const palette = useMemo(
    () => (med ? paletteForCategory(med.id, med.categoria) : null),
    [med]
  );
  const benefits = useMemo(() => (med ? benefitsFor(med, 3) : []), [med]);
  const campaign = useMemo(() => (med ? campaignFor(med.id) : ''), [med]);
  const img = useMemo(() => (med ? getMedImageInfo(med.id) : undefined), [med]);

  if (!med || !palette) {
    return (
      <div className="ad-canvas ad-canvas--error">
        <p className="text-3xl font-bold text-slate-700">Producto no encontrado</p>
        <p className="text-slate-500 mt-2">{medId}</p>
      </div>
    );
  }

  const [from, to] = palette.bg;

  return (
    <div
      className="ad-canvas"
      style={
        {
          '--ad-from': from,
          '--ad-to': to,
          '--ad-deep': palette.deep,
          '--ad-accent': palette.accent,
          '--ad-glow': palette.glow,
          '--ad-line': palette.line,
        } as React.CSSProperties
      }
    >
      {/* Arte botánico de fondo */}
      <BotanicalBackdrop />

      {/* Badge de campaña */}
      <div className="ad-pill">{campaign}</div>

      {/* Emblema floral */}
      <div className="ad-emblem" aria-hidden>
        <FloralEmblem />
      </div>

      {/* Producto */}
      <div className="ad-stage">
        <div className="ad-glow" aria-hidden />
        <div className="ad-product">
          {img ? (
            <>
              <img
                src={img.src}
                alt={med.nombreComercial}
                className={`ad-product-img ${
                  img.transparent ? 'ad-product-img--alpha' : 'ad-product-img--photo'
                }`}
              />
              {img.transparent && (
                <img
                  src={img.src}
                  alt=""
                  aria-hidden
                  className="ad-product-reflect"
                />
              )}
            </>
          ) : (
            <div className="ad-product-placeholder">
              <Pill className="w-24 h-24" strokeWidth={1.4} />
            </div>
          )}
        </div>
      </div>

      {/* Hojas decorativas */}
      <LeafDecor position="bl" />
      <LeafDecor position="br" />

      {/* Texto */}
      <div className="ad-copy">
        <h1 className="ad-title">{med.nombreComercial}</h1>
        <p className="ad-subtitle">{subtitleFor(med)}</p>

        {benefits.length > 0 && (
          <ul className="ad-benefits">
            {benefits.map((b, i) => (
              <li key={i}>
                <span className="ad-bullet">•</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        <p className="ad-presentation">{med.presentacion}</p>
      </div>

      {/* Contacto */}
      <div className="ad-contact">
        <span className="ad-contact-phone">
          <Phone className="w-4 h-4" />
          +502 2433-5641
        </span>
        <span className="ad-contact-sep" aria-hidden />
        <span className="ad-contact-note">Distribuidora y droguería · Guatemala</span>
      </div>
    </div>
  );
}

/** Mandala floral en línea, al estilo del emblema de la referencia. */
function FloralEmblem() {
  const petals = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
      {petals.map((_, i) => {
        const angle = (i * 360) / petals.length;
        return (
          <path
            key={i}
            d="M100 44 C112 62 112 78 100 96 C88 78 88 62 100 44 Z"
            stroke="currentColor"
            strokeWidth="1.3"
            opacity="0.55"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
      {petals.map((_, i) => {
        const angle = (i * 360) / petals.length + 15;
        return (
          <circle
            key={`d-${i}`}
            cx="100"
            cy="34"
            r="3.2"
            fill="currentColor"
            opacity="0.45"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
      <circle cx="100" cy="100" r="26" stroke="currentColor" strokeWidth="1.6" opacity="0.65" />
      <path
        d="M100 118 L100 84 M100 100 C88 96 82 88 80 78 M100 106 C112 102 118 94 120 84"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="100" cy="92" r="6" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
    </svg>
  );
}

/** Hojas decorativas en las esquinas. */
function LeafDecor({ position }: { position: 'bl' | 'br' }) {
  const isBl = position === 'bl';
  return (
    <svg
      className={`ad-leaf ad-leaf--${position}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g transform={isBl ? 'translate(0,0)' : 'translate(200,200) rotate(180)'}>
        <path
          d="M18 188 C18 140 44 104 92 78 C96 112 84 154 48 182 C36 190 24 192 18 188 Z"
          fill="currentColor"
          opacity="0.14"
        />
        <path
          d="M22 190 C40 156 62 122 88 86"
          stroke="currentColor"
          strokeWidth="1.6"
          opacity="0.28"
          strokeLinecap="round"
        />
        <path
          d="M62 122 C82 124 96 134 104 150 C88 154 72 146 62 130"
          fill="currentColor"
          opacity="0.11"
        />
        <path
          d="M74 100 C92 106 104 118 108 132"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.22"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Fondo: ondas radiales + textura botánica difusa. */
function BotanicalBackdrop() {
  return (
    <div className="ad-backdrop" aria-hidden>
      <svg
        className="ad-rays"
        viewBox="0 0 1080 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 26 }).map((_, i) => (
          <path
            key={i}
            d="M540 540 L540 40"
            stroke="currentColor"
            strokeWidth="30"
            opacity="0.05"
            transform={`rotate(${(i * 360) / 26} 540 540)`}
          />
        ))}
      </svg>
      <svg className="ad-vine" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-40 1010 C140 930 220 790 200 620 C186 500 260 410 360 380"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.16"
        />
        {[
          { x: 120, y: 930, r: -28 },
          { x: 205, y: 830, r: 24 },
          { x: 230, y: 690, r: -14 },
          { x: 215, y: 550, r: 34 },
          { x: 270, y: 450, r: -36 },
        ].map((p, i) => (
          <path
            key={i}
            d="M0 0 C-38 -30 -38 -74 0 -96 C38 -74 38 -30 0 0 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.18"
            transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}
          />
        ))}
        <path
          d="M1120 260 C960 340 880 480 900 650 C914 770 840 860 740 890"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.16"
        />
        {[
          { x: 960, y: 340, r: 22 },
          { x: 880, y: 460, r: -20 },
          { x: 872, y: 620, r: 30 },
          { x: 830, y: 750, r: -26 },
          { x: 748, y: 850, r: 40 },
        ].map((p, i) => (
          <path
            key={`r-${i}`}
            d="M0 0 C38 -30 38 -74 0 -96 C-38 -74 -38 -30 0 0 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.18"
            transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}
          />
        ))}
      </svg>
    </div>
  );
}
