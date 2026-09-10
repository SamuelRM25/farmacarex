import { useState } from 'react';
import { Pill } from 'lucide-react';
import type { Marca } from '../types';
import { MARCAS } from '../types';
import { getMedImage } from '../data/medicationImages';

interface Props {
  medId: string;
  marca: Marca;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<Props['size']>, string> = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20 sm:w-24 sm:h-24',
  lg: 'w-28 h-28 sm:w-32 sm:h-32',
};

export default function MedImage({ medId, marca, size = 'md', className = '' }: Props) {
  const src = getMedImage(medId);
  const brand = MARCAS[marca];
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const showImage = src && !errored;
  const dim = SIZE_CLASS[size];

  return (
    <div
      className={`relative ${dim} shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center ${className}`}
      aria-hidden={!showImage}
    >
      {!showImage ? (
        <div className={`flex items-center justify-center w-full h-full ${brand.bg}`}>
          <Pill className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10'} ${brand.color}`} strokeWidth={1.8} />
        </div>
      ) : (
        <>
          {!loaded && (
            <div
              className={`absolute inset-0 ${brand.bg} animate-pulse`}
              aria-hidden
            />
          )}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      )}
    </div>
  );
}
