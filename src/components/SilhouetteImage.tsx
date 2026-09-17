"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SilhouetteImageProps {
  src: string;
  alt: string;
  revealed: boolean;
}

/**
 * Les images du wiki n'ont pas de fond transparent : on ne peut pas obtenir une
 * silhouette avec un simple filtre CSS (brightness(0) donnerait un carré plein noir).
 * On détecte donc la couleur de fond (coins de l'image) et on la rend transparente
 * via un canvas, pour ne garder que la découpe noire du personnage.
 */
function buildSilhouette(image: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0);

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let br = 0;
  let bg = 0;
  let bb = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    br += data[i];
    bg += data[i + 1];
    bb += data[i + 2];
  }
  br /= corners.length;
  bg /= corners.length;
  bb /= corners.length;

  const threshold = 35;
  const softEdge = 25;

  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - br;
    const dg = data[i + 1] - bg;
    const db = data[i + 2] - bb;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);

    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;

    if (distance < threshold) {
      data[i + 3] = 0;
    } else if (distance < threshold + softEdge) {
      data[i + 3] = ((distance - threshold) / softEdge) * 255;
    } else {
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

export default function SilhouetteImage({ src, alt, revealed }: SilhouetteImageProps) {
  const [silhouetteUrl, setSilhouetteUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      try {
        setSilhouetteUrl(buildSilhouette(img));
      } catch {
        // Si le canvas est "tainted" (CORS refusé), on n'affichera pas de silhouette.
        setSilhouetteUrl(null);
      }
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="flex h-64 w-64 items-center justify-center rounded-xl bg-zinc-200">
      {revealed ? (
        <Image
          src={src}
          alt={alt}
          width={240}
          height={240}
          className="h-60 w-60 object-contain"
          unoptimized
        />
      ) : silhouetteUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- image générée dynamiquement (data URL canvas), next/image ne s'applique pas ici.
        <img src={silhouetteUrl} alt="Personnage mystère" className="h-60 w-60 object-contain" />
      ) : (
        <div className="h-60 w-60 animate-pulse rounded-lg bg-zinc-400" />
      )}
    </div>
  );
}
