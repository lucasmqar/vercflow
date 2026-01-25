"use client"

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

// Corrigir ícones do Leaflet que quebram no Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapSelectorProps {
    lat?: number;
    lng?: number;
    onChange: (lat: number, lng: number) => void;
    height?: string;
}

function LocationMarker({ lat, lng, onChange }: { lat?: number, lng?: number, onChange: (lat: number, lng: number) => void }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return lat && lng ? (
        <Marker position={[lat, lng]} />
    ) : null;
}

export function MapSelector({ lat, lng, onChange, height = "400px" }: MapSelectorProps) {
    const defaultCenter: [number, number] = [-23.5505, -46.6333]; // São Paulo
    const center: [number, number] = (lat && lng) ? [lat, lng] : defaultCenter;

    return (
        <Card className="relative overflow-hidden border border-border/20 rounded-xl shadow-2xl">
            <div style={{ height }}>
                <MapContainer
                    center={center}
                    zoom={lat ? 15 : 12}
                    scrollWheelZoom={true}
                    className="w-full h-full z-10"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker lat={lat} lng={lng} onChange={onChange} />
                </MapContainer>
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 z-[20] pointer-events-none">
                <div className="bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Posicionamento</p>
                            <p className="text-xs font-bold truncate max-w-[200px]">
                                {lat ? `${lat.toFixed(6)}, ${lng?.toFixed(6)}` : 'Clique no mapa para marcar a obra'}
                            </p>
                        </div>
                    </div>
                    <button
                        className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        onClick={(e) => {
                            e.preventDefault();
                            if ("geolocation" in navigator) {
                                navigator.geolocation.getCurrentPosition((position) => {
                                    onChange(position.coords.latitude, position.coords.longitude);
                                });
                            }
                        }}
                    >
                        <Navigation size={18} />
                    </button>
                </div>
            </div>
        </Card>
    );
}
