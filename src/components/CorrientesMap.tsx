"use client";

import { useMemo, useState } from "react";
import { Add, ArrowRight, Minus } from "reicon-react";
import { argentinaProvincePaths } from "./argentinaMapData";

const VIEWBOX_WIDTH = 820;
const VIEWBOX_HEIGHT = 1080;

function cleanPath(path: string) {
  return (path.match(/M[^Z]+Z/g) ?? [path])
    .filter((ring) => (ring.match(/L/g)?.length ?? 0) > 1)
    .join(" ");
}

export default function CorrientesMap() {
  const [zoom, setZoom] = useState(1);
  const [hoveredProvince, setHoveredProvince] = useState("Corrientes");
  const paths = useMemo(
    () => argentinaProvincePaths.map((province) => ({ ...province, path: cleanPath(province.path) })),
    [],
  );

  const updateZoom = (nextZoom: number) => setZoom(Math.min(1.55, Math.max(1, nextZoom)));

  return (
    <div className="map-shell">
      <div className="map-stage">
        <svg
          className="argentina-map"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          role="img"
          aria-labelledby="argentina-map-title argentina-map-description"
        >
          <title id="argentina-map-title">Mapa de Argentina con Corrientes destacada</title>
          <desc id="argentina-map-description">
            Mapa interactivo de las provincias argentinas. Corrientes está resaltada como territorio de acción de la fundación.
          </desc>
          <g transform={`translate(${(1 - zoom) * (VIEWBOX_WIDTH / 2)} ${(1 - zoom) * (VIEWBOX_HEIGHT / 2)}) scale(${zoom})`}>
            {paths.map((province) => {
              const isCorrientes = province.name === "Corrientes";
              return (
                <path
                  key={province.name}
                  d={province.path}
                  className={`map-path ${isCorrientes ? "corrientes" : ""}`}
                  role="img"
                  tabIndex={0}
                  aria-label={`Provincia de ${province.name}${isCorrientes ? ", destacada" : ""}`}
                  onMouseEnter={() => setHoveredProvince(province.name)}
                  onFocus={() => setHoveredProvince(province.name)}
                  onMouseLeave={() => setHoveredProvince("Corrientes")}
                  onBlur={() => setHoveredProvince("Corrientes")}
                />
              );
            })}
            <circle className="map-marker" cx="655" cy="224" r="9" aria-hidden="true" />
            <text className="map-label" x="666" y="220" aria-hidden="true">Corrientes</text>
          </g>
        </svg>

        <div className="map-controls" aria-label="Controles del mapa">
          <button className="map-control" type="button" onClick={() => updateZoom(zoom + 0.15)} disabled={zoom >= 1.55} aria-label="Acercar mapa">
            <Add size={18} aria-hidden />
          </button>
          <button className="map-control" type="button" onClick={() => updateZoom(zoom - 0.15)} disabled={zoom <= 1} aria-label="Alejar mapa">
            <Minus size={18} aria-hidden />
          </button>
        </div>

        <p className="absolute bottom-3 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--verde-profundo)] backdrop-blur-sm" role="status">
          Provincia: {hoveredProvince}
        </p>
      </div>

      <aside className="map-info" aria-live="polite">
        <span className="tag">Territorio destacado</span>
        <h3>Corrientes</h3>
        <p>
          Desde el nordeste argentino impulsamos educación ambiental, participación ciudadana y proyectos que cuidan nuestros ríos, humedales y comunidades.
        </p>
        <a className="map-link" href="https://www.google.com/maps/place/Corrientes,+Argentina" target="_blank" rel="noopener noreferrer">
          Explorar Corrientes <ArrowRight size={17} aria-hidden />
        </a>
      </aside>
    </div>
  );
}
