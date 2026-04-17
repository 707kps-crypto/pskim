"use client";

interface LocalVideoBackgroundProps {
  src: string;
  overlayOpacity?: number;
}

export default function LocalVideoBackground({
  src,
  overlayOpacity = 0.7,
}: LocalVideoBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute z-0 top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: `rgba(10, 10, 10, ${overlayOpacity})` }}
      />
    </div>
  );
}
