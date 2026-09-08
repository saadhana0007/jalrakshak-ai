"use client";

import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from "react-leaflet";
import type { Farm } from "@/types";

const riskHex: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#b91c1c",
};

export default function FarmMap({ farm, height = 320 }: { farm: Farm; height?: number }) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl">
      <MapContainer center={[farm.lat, farm.lng]} zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={[farm.lat, farm.lng]}
          radius={600}
          pathOptions={{ color: riskHex[farm.riskLevel], fillColor: riskHex[farm.riskLevel], fillOpacity: 0.15 }}
        />
        <CircleMarker
          center={[farm.lat, farm.lng]}
          radius={9}
          pathOptions={{ color: "#fff", weight: 2, fillColor: riskHex[farm.riskLevel], fillOpacity: 1 }}
        >
          <Popup>
            <div className="text-xs">
              <p className="font-bold">{farm.id}</p>
              <p>{farm.village}, {farm.district}</p>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
