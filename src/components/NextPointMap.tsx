"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

const Map = dynamic(() => import("react-leaflet").then(m => m.MapContainer as any), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer as any), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker as any), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(m => m.Circle as any), { ssr: false });

export default function NextPointMap({ lat, lng, radius = 50 }: { lat: number; lng: number; radius?: number }) {
  useEffect(() => {
    // rien de spécial; Leaflet gère tout côté client
  }, []);
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden">
      <Map center={[lat, lng]} zoom={17} style={{ width:"100%", height:"100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
        {!!radius && <Circle center={[lat, lng]} radius={radius} />}
      </Map>
    </div>
  );
}
