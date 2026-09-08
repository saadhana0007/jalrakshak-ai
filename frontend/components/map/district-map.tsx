"use client";

import { MapContainer, TileLayer, Circle, Tooltip as LeafletTooltip } from "react-leaflet";
import { districtRiskSummary } from "@/lib/mock-data";

const riskHex: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#b91c1c",
};

export default function DistrictMap({ height = 480 }: { height?: number }) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl">
      <MapContainer center={[19.7, 76.0]} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {districtRiskSummary.map((d) => (
          <Circle
            key={d.name}
            center={[d.lat, d.lng]}
            radius={20000 + d.stressPct * 500}
            pathOptions={{
              color: riskHex[d.riskLevel],
              fillColor: riskHex[d.riskLevel],
              fillOpacity: 0.35,
              weight: 1.5,
            }}
          >
            <LeafletTooltip direction="top" permanent>
              <span className="text-[10px] font-semibold">{d.name} · {d.stressPct}% stress</span>
            </LeafletTooltip>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
