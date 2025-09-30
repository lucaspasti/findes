/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap,
} from "react-leaflet";

declare global {
  interface Window {
    debugMap?: any;
  }
}

type FC = FeatureCollection<Geometry, Record<string, any>>;
type Loaded = Record<string, FC | null>;

const { BaseLayer, Overlay } = LayersControl;

// flags e cronômetro compatíveis com SSR
const DEBUG =
  typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;
const perfNow = typeof performance !== "undefined" ? performance.now() : 0;
const t0 = perfNow;
const log = (...args: any[]) => {
  if (!DEBUG) return;
  const now = typeof performance !== "undefined" ? performance.now() : 0;
  console.log(`[MultiLayersMap +${(now - t0).toFixed(1)}ms]`, ...args);
};

// valida geometria
function isEmptyGeometry(f: Feature): boolean {
  const g: any = f?.geometry;
  if (!g) return true;
  const coords = g.coordinates;
  if (!Array.isArray(coords)) return true;

  switch (g.type) {
    case "Point":
      return (
        coords.length !== 2 || coords.some((n: any) => typeof n !== "number")
      );
    case "MultiPoint":
    case "LineString":
      return coords.length === 0;
    case "MultiLineString":
    case "Polygon":
      return (
        coords.length === 0 ||
        !Array.isArray(coords[0]) ||
        coords[0].length === 0
      );
    case "MultiPolygon":
      return (
        coords.length === 0 ||
        !Array.isArray(coords[0]) ||
        coords[0].length === 0 ||
        !Array.isArray(coords[0][0]) ||
        coords[0][0].length === 0
      );
    default:
      return false;
  }
}

// normaliza qualquer entrada em FeatureCollection
function normalizeToFC(input: any): FC {
  if (!input) return { type: "FeatureCollection", features: [] };
  if (input.type === "FeatureCollection" && Array.isArray(input.features)) {
    return input as FC;
  }
  if (input.type === "Feature" && input.geometry) {
    const feature: Feature<Geometry, Record<string, any>> = {
      ...input,
      properties: input.properties ?? {},
    };
    return { type: "FeatureCollection", features: [feature] };
  }
  if (Array.isArray(input) && input.length && input[0]?.type === "Feature") {
    return {
      type: "FeatureCollection",
      features: (input as Feature[]).map((f) => ({
        ...f,
        properties: f.properties ?? {},
      })),
    };
  }
  return { type: "FeatureCollection", features: [] };
}

// sanitização simples para links externos em popups
function safeUrl(raw?: unknown): string | null {
  if (typeof raw !== "string") return null;
  const u = raw.trim();
  if (!/^https?:\/\//i.test(u) && !/^www\./i.test(u)) return null;
  try {
    const final = u.startsWith("http") ? u : "https://" + u;
    const parsed = new URL(final);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

// tipos de propriedades que você usa nos popups
type PortoProps = {
  cdi_tuaria?: string;
  nome?: string;
  Name?: string;
  tipo?: string;
  modalidade?: string;
  companhia?: string;
};

const LAYERS = [
  {
    id: "ferrovias",
    name: "Ferrovias",
    url: "/dados/Ferroviario/Ferrovias.geojson",
    color: "#e31a1c",
    popup: (p: any) =>
      `<b>Ferrovia</b><br/>CodigoLinh: ${p?.CodigoLinh ?? ""}<br/>CodigoFerr: ${
        p?.CodigoFerr ?? ""
      }`,
  },
  // {
  //   id: "rodoviasestaduais",
  //   name: "Rodovias Estaduais",
  //   url: "/dados/Rodoviário/estaduais.geojson",
  //   color: "#1ae37fff",
  //   popup: (p: any) =>
  //     `<b>Rodovia</b><br/>ID CIDE: ${p?.id_cide ?? ""}<br/>CodigoFerr: ${
  //       p?.CodigoFerr ?? ""
  //     }`,
  // },
  {
    id: "rodoviasfederais",
    name: "Rodovias Federais",
    url: "/dados/Rodoviário/federais.geojson",
    color: "#00c050ff",
    popup: (p: any) =>
      `<b>Rodovia</b><br/>ID CIDE: ${p?.id_cide ?? ""}<br/>CodigoFerr: ${
        p?.CodigoFerr ?? ""
      }`,
  },
  {
    id: "portos",
    name: "Portos",
    url: "/dados/Portos/Portos.geojson",
    color: "#2800b8ff",
    popup: (p: PortoProps) => {
      const website = safeUrl(p?.modalidade);
      const link = website
        ? `<b>Website:</b> <a href="${website}" target="_blank" rel="noopener">${website}</a><br/>`
        : "";
      return `
        <b>Porto</b><br/>
        <b>Código:</b> ${p?.cdi_tuaria ?? ""}<br/>
        <b>Nome:</b> ${p?.nome ?? p?.Name ?? ""}<br/>
        <b>Classificação:</b> ${p?.tipo ?? ""}<br/>
        ${link}
        <b>Empresa:</b> ${p?.companhia ?? ""}
      `;
    },
  },
  {
    id: "aeroportos",
    name: "Aeroportos",
    url: "/dados/Aeroportos/Aeroportos.geojson",
    color: "#505050ff",
    popup: (p: any) =>
      `<b>Aeroporto</b><br/>Nome: ${p?.nome ?? p?.Name ?? ""} - ${
        p?.códigooac ?? ""
      }`,
  },
] as const;

// pequeno controle para ajustar a visão ao conteúdo
function FitAllControl() {
  const map = useMap();
  useEffect(() => {
    const ctl = new L.Control({ position: "topleft" });
    ctl.onAdd = () => {
      const el = L.DomUtil.create("button", "leaflet-bar");
      el.title = "Ajustar visão";
      el.style.padding = "6px 10px";
      el.style.cursor = "pointer";
      el.textContent = "↙↗";
      el.onclick = () => (window as any).debugMap?.fitAll?.();
      return el;
    };
    ctl.addTo(map);
    return () => {
      ctl.remove();
    };
  }, [map]);
  return null;
}

export default function MultiLayersMap() {
  const [data, setData] = useState<Loaded>({});
  const mapRef = useRef<L.Map | null>(null);

  // helper global para inspecionar no console
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.debugMap = {
      get map() {
        return mapRef.current;
      },
      data,
      layers: LAYERS.map((l) => l.id),
      fitAll: () => {
        const map = mapRef.current;
        if (!map) return;
        const bounds = new L.LatLngBounds([]);
        Object.values(data).forEach((fc) => {
          if (fc && fc.features.length) {
            try {
              const layer = L.geoJSON(fc as any);
              const b = layer.getBounds?.();
              if (b?.isValid()) bounds.extend(b);
            } catch {
              // ignora geometrias corrompidas
            }
          }
        });
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.1));
      },
    };
  }, [data]);

  // carregamento das camadas
  useEffect(() => {
    let cancelled = false;
    const controllers: AbortController[] = [];
    const BASE = process.env.NEXT_PUBLIC_DATA_BASE ?? "";

    (async () => {
      const entries = await Promise.all(
        LAYERS.map(async (cfg) => {
          const controller = new AbortController();
          controllers.push(controller);
          try {
            const r = await fetch(BASE + cfg.url, {
              cache: "no-store",
              signal: controller.signal,
            });
            if (!r.ok) {
              console.error(
                `[${cfg.id}] HTTP ${r.status} ao buscar ${cfg.url}`
              );
              return [cfg.id, null] as const;
            }
            const text = await r.text();
            let raw: any;
            try {
              raw = JSON.parse(text);
            } catch (e) {
              console.error(`[${cfg.id}] erro no JSON.parse`, e);
              return [cfg.id, null] as const;
            }
            const fc = normalizeToFC(raw);
            const clean: FC = {
              type: "FeatureCollection",
              features: (fc.features || []).filter((f) => !isEmptyGeometry(f)),
            };
            return [cfg.id, clean] as const;
          } catch (e: any) {
            if (e?.name !== "AbortError") {
              console.error(`[${cfg.id}] Erro ao carregar`, e);
            }
            return [cfg.id, null] as const;
          }
        })
      );

      if (cancelled) return;

      const loaded: Loaded = Object.fromEntries(entries);
      setData(loaded);

      // fitBounds global inicial
      const map = mapRef.current;
      if (map) {
        const bounds = new L.LatLngBounds([]);
        Object.values(loaded).forEach((fc) => {
          if (fc && fc.features.length) {
            try {
              const layer = L.geoJSON(fc as any);
              const b = layer.getBounds?.();
              if (b?.isValid()) bounds.extend(b);
            } catch {
              // ignora geometrias corrompidas
            }
          }
        });
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.1));
        } else {
          map.setView([-15.78, -47.93], 5);
        }
      }
    })();

    return () => {
      cancelled = true;
      controllers.forEach((c) => c.abort());
    };
  }, []);

  // contadores só para depuração
  const styleCalls = useRef<Record<string, number>>({});
  const pointCalls = useRef<Record<string, number>>({});
  const onEachCalls = useRef<Record<string, number>>({});

  // memo das factories
  const makeStyle = useCallback(
    (layerId: string, color: string) =>
      (_?: Feature): L.PathOptions => {
        styleCalls.current[layerId] = (styleCalls.current[layerId] ?? 0) + 1;
        return {
          color,
          weight: 3,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: 0.25,
        };
      },
    []
  );

  const attachInteractivity = useCallback(
    (layerId: string, popupHTML: (p: any) => string, color: string) =>
      (feature: Feature, layer: L.Layer) => {
        onEachCalls.current[layerId] = (onEachCalls.current[layerId] ?? 0) + 1;

        const p = (feature.properties || {}) as Record<string, any>;
        (layer as any).bindPopup?.(popupHTML(p), { maxWidth: 360 });
        (layer as any).bindTooltip?.(p?.nome ?? p?.Name ?? "", {
          sticky: true,
        });

        layer.on("mouseover", () => {
          (layer as any).setStyle?.({
            weight: 5,
            opacity: 1,
            fillOpacity: 0.4,
          });
          (layer as any).bringToFront?.();
        });

        layer.on("mouseout", () => {
          (layer as any).setStyle?.({
            weight: 3,
            opacity: 0.9,
            fillOpacity: 0.25,
            color,
            fillColor: color,
          });
        });
      },
    []
  );

  // memo de Layer configs com dados calculados
  const overlayConfigs = useMemo(() => {
    return LAYERS.map((cfg) => {
      const fc = data[cfg.id];
      const featuresCount = fc?.features.length ?? 0;
      return {
        cfg,
        fc: (fc ?? { type: "FeatureCollection", features: [] }) as FC,
        featuresCount,
      };
    });
  }, [data]);

  return (
    <MapContainer
      center={[-15.78, -47.93]}
      zoom={5}
      renderer={L.canvas()}
      scrollWheelZoom
      style={{ height: "100vh", width: "100%" }}
      whenReady={() => log("map is ready")}
      ref={(instance) => {
        if (instance) {
          mapRef.current = instance;
          if (!instance.getPane("data")) {
            instance.createPane("data");
            const paneEl = instance.getPane("data")!;
            paneEl.style.zIndex = "650";
            paneEl.style.pointerEvents = "auto";
          }
        }
      }}
    >
      <FitAllControl />

      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        </BaseLayer>

        <BaseLayer name="Visão de Satélite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri, Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, swisstopo, GIS User Community"
          />
        </BaseLayer>

        <BaseLayer name="OpenTopo">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="© OpenTopoMap, © OpenStreetMap contributors"
          />
        </BaseLayer>

        {overlayConfigs.map(({ cfg, fc, featuresCount }) => (
          <Overlay key={cfg.id} checked name={`${cfg.name} (${featuresCount})`}>
            <GeoJSON
              key={`${cfg.id}-${featuresCount}`} // força remount se mudar data
              data={fc as any}
              style={makeStyle(cfg.id, cfg.color)}
              pointToLayer={(_, latlng) => {
                pointCalls.current[cfg.id] =
                  (pointCalls.current[cfg.id] ?? 0) + 1;
                return L.circleMarker(latlng, {
                  radius: 3,
                  color: cfg.color,
                  weight: 1,
                  fillOpacity: 0.85,
                });
              }}
              onEachFeature={attachInteractivity(cfg.id, cfg.popup, cfg.color)}
              pane="data"
            />
          </Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
}
