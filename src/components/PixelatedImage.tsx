"use client";

import { useEffect, useRef, useState } from "react";

interface PixelatedImageProps {
  src: string;
  alt: string;
  /** 0 = très pixelisé, 1 = totalement net (personnage trouvé). */
  clarity: number;
}

const CANVAS_SIZE = 280;
/**
 * Nombre de blocs de pixels visibles au niveau le plus flou / le plus net.
 * MIN_BLOCKS=4 était trop extrême : à ce niveau l'image n'est qu'une bouillie de
 * couleurs moyennées, méconnaissable au point de sembler être un personnage différent
 * une fois plus nette. 10 garde un vrai défi tout en laissant deviner une silhouette.
 */
const MIN_BLOCKS = 10;
const MAX_BLOCKS = 90;

function drawPixelated(image: HTMLImageElement, canvas: HTMLCanvasElement, blocks: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const tiny = document.createElement("canvas");
  tiny.width = blocks;
  tiny.height = blocks;
  const tinyCtx = tiny.getContext("2d");
  if (!tinyCtx) return;
  tinyCtx.drawImage(image, 0, 0, blocks, blocks);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tiny, 0, 0, blocks, blocks, 0, 0, canvas.width, canvas.height);
}

export default function PixelatedImage({ src, alt, clarity }: PixelatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const blocks = Math.round(MIN_BLOCKS + (MAX_BLOCKS - MIN_BLOCKS) * Math.min(1, Math.max(0, clarity)));

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      imgRef.current = img;
      setLoaded(true);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !loaded) return;
    drawPixelated(img, canvas, clarity >= 1 ? MAX_BLOCKS * 4 : blocks);
  }, [loaded, blocks, clarity]);

  return (
    <div className="flex h-72 w-72 items-center justify-center overflow-hidden rounded-xl bg-zinc-800">
      {loaded ? (
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          aria-label={alt}
          className="h-full w-full"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-zinc-700" />
      )}
    </div>
  );
}
