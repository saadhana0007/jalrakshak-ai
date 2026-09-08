"use client";

import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Tooltip as LeafletTooltip } from "react-leaflet";
import { FARMS } from "@/lib/mock-data";
import type { RiskLevel } from "@/types";

const riskHex: Record<RiskLevel, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#b91c1c",
};

export default function CommunityMap({ height = 480 }: { height?: number }) {
  const center: [number, number] = [19.5, 76.5];

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl">
      <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {FARMS.map((f) => (
          <div key={f.id}>
            {(f.riskLevel === "high" || f.riskLevel === "critical") && (
              <Circle
                center={[f.lat, f.lng]}
                radius={9000}
                pathOptions={{ color: riskHex[f.riskLevel], fillColor: riskHex[f.riskLevel], fillOpacity: 0.12, weight: 0 }}
              />
            )}
            <CircleMarker
              center={[f.lat, f.lng]}
              radius={7}
              pathOptions={{
                color: "#fff",
                weight: 2,
                fillColor: riskHex[f.riskLevel],
                fillOpacity: 0.95,
              }}
            >
              <LeafletTooltip direction="top" offset={[0, -6]}>
                {f.id} · {f.riskLevel.toUpperCase()}
              </LeafletTooltip>
              <Popup>
                <div className="text-xs">
                  <p className="mb-1 font-bold">{f.id} — {f.village}</p>
                  <p>Farmer: {f.farmerName}</p>
                  <p>District: {f.district}, {f.state}</p>
                  <p>Crop: {f.cropType}</p>
                  <p>Soil Moisture: {f.soilMoisture}%</p>
                  <p>Risk: <strong className="capitalize">{f.riskLevel}</strong></p>
                </div>
              </Popup>
            </CircleMarker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
