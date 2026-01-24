"use client"

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Lead, Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Building2, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Leaflet marker fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Icones coloridos para diferentes estados
const createColoredIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });
};

const icons = {
    LEAD: createColoredIcon('#f97316'), // Orange
    BUDGET: createColoredIcon('#3b82f6'), // Blue
    PROPOSAL: createColoredIcon('#a855f7'), // Purple
    PROJECT: createColoredIcon('#10b981'), // Emerald
};

interface ComercialMapProps {
    leads: Lead[];
    projects: Project[];
    budgets: any[];
    proposals: any[];
}

export function ComercialMap({ leads, projects, budgets, proposals }: ComercialMapProps) {
    const defaultCenter: [number, number] = [-23.5505, -46.6333];

    // Consolidar todos os pontos com geolocalização
    const points = [
        ...leads.filter(l => l.lat && l.lng).map(l => ({ ...l, type: 'LEAD', color: '#f97316', label: 'Lead' })),
        ...projects.filter(p => p.lat && p.lng).map(p => ({ ...p, type: 'PROJECT', color: '#10b981', label: 'Obra Ativa' }))
    ];

    return (
        <Card className="rounded-[2.5rem] overflow-hidden border border-border/20 shadow-2xl h-[calc(100vh-200px)] relative">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full z-10"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {points.map((p: any) => (
                    <Marker
                        key={p.id}
                        position={[p.lat, p.lng]}
                        icon={icons[p.type as keyof typeof icons] || DefaultIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[200px]">
                                <Badge className={cn(
                                    "mb-2 font-black text-[9px] uppercase tracking-widest border-none",
                                    p.type === 'LEAD' ? "bg-orange-500" : "bg-emerald-500"
                                )}>
                                    {p.label}
                                </Badge>
                                <h3 className="font-black text-sm text-foreground mb-1">{p.nomeObra || p.nome}</h3>
                                <p className="text-[10px] text-muted-foreground mb-3">{p.localizacao || p.endereco}</p>

                                <div className="grid grid-cols-2 gap-2 border-t border-border/20 pt-2">
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-muted-foreground">Status</p>
                                        <p className="text-[10px] font-bold text-primary">{p.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-muted-foreground">Área</p>
                                        <p className="text-[10px] font-bold text-primary">{p.areaEstimada || p.areaConstruida || '--'} m²</p>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute top-6 right-6 z-[20] pointer-events-none">
                <div className="bg-background/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Legenda Comercial</p>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                        <span className="text-xs font-bold text-foreground">Leads / Captação</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        <span className="text-xs font-bold text-foreground">Obras Ativas</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
