/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";

// Extend the Window interface to include debugMap
declare global {
  interface Window {
    debugMap?: any;
  }
}

type FC = FeatureCollection<Geometry, Record<string, any>>;
type Loaded = Record<string, FC | null>;

const { BaseLayer, Overlay } = LayersControl;

// logger com prefixo e tempo
const t0 = performance.now();
const log = (...args: any[]) =>
  console.log(
    `[MultiLayersMap +${(performance.now() - t0).toFixed(1)}ms]`,
    ...args
  );

// valida geometria
function isEmptyGeometry(f: Feature): boolean {
  const g: any = f?.geometry;
  if (!g) return true;
  if (!Array.isArray(g.coordinates)) return true;
  return g.coordinates.length === 0;
}

// normaliza em FeatureCollection
function normalizeToFC(input: any): FC {
  if (!input) {
    log("normalizeToFC: input vazio");
    return { type: "FeatureCollection", features: [] };
  }
  if (input.type === "FeatureCollection" && Array.isArray(input.features)) {
    log(
      "normalizeToFC: já é FeatureCollection com",
      input.features.length,
      "features"
    );
    return input as FC;
  }
  if (input.type === "Feature" && input.geometry) {
    log("normalizeToFC: único Feature convertido para FeatureCollection");
    // Ensure properties is always an object
    const feature: Feature<Geometry, Record<string, any>> = {
      ...input,
      properties: input.properties ?? {},
    };
    return { type: "FeatureCollection", features: [feature] };
  }
  if (Array.isArray(input) && input.length && input[0]?.type === "Feature") {
    log(
      "normalizeToFC: array de Feature convertido para FeatureCollection com",
      input.length,
      "features"
    );
    return {
      type: "FeatureCollection",
      features: (input as Feature[]).map((f) => ({
        ...f,
        properties: f.properties ?? {},
      })),
    };
  }
  log("normalizeToFC: formato desconhecido, retornando vazio", {
    keys: Object.keys(input ?? {}),
  });
  return { type: "FeatureCollection", features: [] };
}

// catálogo
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
  {
    id: "portos",
    name: "Portos",
    url: "/dados/Portos/Portos.geojson",
    color: "#33a02c",
    popup: (p: any) => {
      const website = p?.modalidade ?? "";
      const showWebsite =
        typeof website === "string" &&
        (website.startsWith("http") || website.startsWith("www"));
      return `
  <b>Porto</b><br/>
  <b>Código:</b> ${p?.cdi_tuaria ?? ""}<br/>
  <b>Nome:</b> ${p?.nome ?? p?.Name ?? ""}<br/>
  <b>Classificação:</b> ${p?.tipo ?? ""}<br/>
  ${
    showWebsite
      ? `<b>Website:</b> <a href="${website}" target="_blank">${website}</a><br/>`
      : ""
  }
  <b>Empresa:</b> ${p?.companhia ?? ""}
`;
    },
  },
  {
    id: "aeroportos",
    name: "Aeroportos",
    url: "/dados/Aeroportos/Aeroportos.geojson",
    color: "#6a3d9a",
    popup: (p: any) =>
      `<b>Aeroporto</b><br/>Nome: ${p?.nome ?? p?.Name ?? ""} - ${
        p?.códigooac ?? ""
      }`,
  },
] as const;

export default function MultiLayersMap() {
  const [data, setData] = useState<Loaded>({});
  const mapRef = useRef<L.Map | null>(null);

  // helper global para inspecionar no console
  useEffect(() => {
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
            const layer = L.geoJSON(fc as any);
            const b = layer.getBounds?.();
            if (b?.isValid()) bounds.extend(b);
          }
        });
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.1));
      },
    };
    log(
      "window.debugMap pronto. Use debugMap.map, debugMap.data, debugMap.fitAll()"
    );
  }, [data]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      log(
        "fetch iniciando para",
        LAYERS.map((l) => `${l.id} -> ${l.url}`).join(", ")
      );
      const entries = await Promise.all(
        LAYERS.map(async (cfg) => {
          try {
            log(`[${cfg.id}] fetch ${cfg.url}`);
            const r = await fetch(cfg.url, { cache: "no-store" });
            log(`[${cfg.id}] resposta HTTP, r.status, r.statusText`);
            if (!r.ok) {
              console.error(
                `[${cfg.id}] HTTP ${r.status} ao buscar ${cfg.url}`
              );
              return [cfg.id, null] as const;
            }
            const text = await r.text();
            log(`[${cfg.id}] bytes recebidos, text.length`);
            let raw: any;
            try {
              raw = JSON.parse(text);
            } catch (e) {
              console.error(`[${cfg.id}] erro no JSON.parse, e`);
              return [cfg.id, null] as const;
            }
            const fc = normalizeToFC(raw);
            const cleanFeatures = (fc.features || []).filter(
              (f) => !isEmptyGeometry(f)
            );
            const clean: FC = {
              type: "FeatureCollection",
              features: cleanFeatures,
            };
            // amostras de propriedades
            if (clean.features.length) {
              const p = clean.features[0].properties || {};
              const g = clean.features[0].geometry || {};
              log(
                `[${cfg.id}] ok. features: ${clean.features.length}. exemplo props keys:`,
                Object.keys(p).slice(0, 10),
                "geom type:",
                (g as any).type
              );
            } else {
              log(`[${cfg.id}] nenhuma feature válida após limpeza`);
            }
            // estatística de tipos geom
            const typesCount = clean.features.reduce<Record<string, number>>(
              (acc, f) => {
                const k = f.geometry?.type ?? "unknown";
                acc[k] = (acc[k] ?? 0) + 1;
                return acc;
              },
              {}
            );
            log(`[${cfg.id}] tipos de geometria, typesCount`);
            return [cfg.id, clean] as const;
          } catch (e) {
            console.error(`[${cfg.id}] Erro ao carregar, e`);
            return [cfg.id, null] as const;
          }
        })
      );
      if (cancelled) {
        log("cancelado antes de setData");
        return;
      }
      const loaded: Loaded = Object.fromEntries(entries);
      setData(loaded);
      log("setData concluído. Layers carregados:", Object.keys(loaded));
      // fitBounds global
      const map = mapRef.current;
      if (map) {
        const bounds = new L.LatLngBounds([]);
        Object.entries(loaded).forEach(([id, fc]) => {
          if (fc && fc.features.length) {
            const layer = L.geoJSON(fc as any);
            const b = layer.getBounds?.();
            log(`[fitBounds] ${id} bounds, b?.toBBoxString?.()`);
            if (b?.isValid()) bounds.extend(b);
          } else {
            log(`[fitBounds] ${id} sem features`);
          }
        });
        if (bounds.isValid()) {
          log("[fitBounds] aplicando bounds globais", bounds.toBBoxString());
          map.fitBounds(bounds.pad(0.1));
        } else {
          log("[fitBounds] sem bounds válidos, setView fallback");
          map.setView([-15.78, -47.93], 5);
        }
      } else {
        log("mapRef.current ausente ao tentar fitBounds");
      }
    })();
    return () => {
      log("useEffect cleanup: cancelado = true");
      cancelled = true;
    };
  }, []);

  // contadores de chamadas para depurar render
  const styleCalls = useRef<Record<string, number>>({});
  const pointCalls = useRef<Record<string, number>>({});
  const onEachCalls = useRef<Record<string, number>>({});

  const makeStyle =
    (layerId: string, color: string) =>
    (feature?: Feature): L.PathOptions => {
      styleCalls.current[layerId] = (styleCalls.current[layerId] ?? 0) + 1;
      if (styleCalls.current[layerId] % 500 === 0) {
        log(`[${layerId}] style chamado, styleCalls.current[layerId]`, "vezes");
      }
      return {
        color,
        weight: 3,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: 0.25,
      };
    };

  const attachInteractivity =
    (layerId: string, popupHTML: (p: any) => string, color: string) =>
    (feature: Feature, layer: L.Layer) => {
      onEachCalls.current[layerId] = (onEachCalls.current[layerId] ?? 0) + 1;
      if (onEachCalls.current[layerId] % 500 === 0) {
        log(
          `[${layerId}] onEachFeature chamado, onEachCalls.current[layerId]`,
          "vezes"
        );
      }
      const p = (feature.properties || {}) as Record<string, any>;
      if ((layer as any).bindPopup) (layer as any).bindPopup(popupHTML(p));
      if ((layer as any).bindTooltip)
        (layer as any).bindTooltip(p?.nome ?? p?.Name ?? "", { sticky: true });

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
    };

  return (
    <MapContainer
      center={[-15.78, -47.93]}
      zoom={5}
      scrollWheelZoom
      style={{ height: "100vh", width: "100%" }}
      whenReady={() => {
        // The mapRef will be set in a useEffect below
        log("map is ready");
      }}
      ref={(instance) => {
        if (instance) {
          mapRef.current = instance;
          log("map created. size", instance.getSize());
          if (!instance.getPane("data")) {
            instance.createPane("data");
            const paneEl = instance.getPane("data")!;
            paneEl.style.zIndex = "650";
            paneEl.style.pointerEvents = "auto";
            log("pane 'data' criado com zIndex 650");
          } else {
            log("pane 'data' já existia");
          }
        }
      }}
    >
      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
            eventHandlers={{
              load: () => log("[TileLayer OSM] load"),
              tileloadstart: (e) =>
                log("[TileLayer OSM] tileloadstart", e.coords),
              tileload: (e) => {},
              tileerror: (e) =>
                console.error("[TileLayer OSM] tileerror", e.coords),
            }}
          />
        </BaseLayer>

        <BaseLayer name="Visão de Satélite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community"
          />
        </BaseLayer>

        <BaseLayer name="OpenTopo">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="© OpenTopoMap, © OpenStreetMap contributors"
            eventHandlers={{
              load: () => log("[TileLayer OpenTopo] load"),
            }}
          />
        </BaseLayer>

        {LAYERS.map((cfg) => {
          const fc = data[cfg.id];
          const featuresCount = fc?.features.length ?? 0;
          const firstGeomType = fc?.features[0]?.geometry?.type ?? "n/a";
          log(
            `[render] ${cfg.id} features=${featuresCount} firstGeom=${firstGeomType}`
          );
          return (
            <Overlay
              key={cfg.id}
              checked
              name={`${cfg.name} (${featuresCount})`}
            >
              <GeoJSON
                key={`${cfg.id}-${featuresCount}`} // força remount se mudar data
                data={
                  (fc ?? { type: "FeatureCollection", features: [] }) as any
                }
                style={makeStyle(cfg.id, cfg.color)}
                pointToLayer={(_, latlng) => {
                  pointCalls.current[cfg.id] =
                    (pointCalls.current[cfg.id] ?? 0) + 1;
                  if (pointCalls.current[cfg.id] % 500 === 0) {
                    log(
                      `[${cfg.id}] pointToLayer chamado, pointCalls.current[cfg.id]`,
                      "vezes"
                    );
                  }
                  return L.circleMarker(latlng, {
                    radius: 2,
                    color: cfg.color,
                    weight: 1,
                    fillOpacity: 0.85,
                  });
                }}
                onEachFeature={attachInteractivity(
                  cfg.id,
                  cfg.popup,
                  cfg.color
                )}
                pane="data"
              />
            </Overlay>
          );
        })}
      </LayersControl>
    </MapContainer>
  );
}
