import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users, Search, Plus, Filter, MapPin,
    MoreHorizontal, Phone, Mail, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lead } from '@/types';

// Wrapper for existing Lead Management View but with new styling
import { LeadDetailPage } from './LeadManagement';

export function ComercialLeads({
    leads,
    onSelectLead,
    selectedLeadId,
    onBack,
    onConvert,
    onOpenWizard
}: any) {
    // If a lead is selected, show detail view (using existing component but wrapped if needed, 
    // strictly speaking `LeadManagement.tsx` already handles list/detail toggling internally 
    // but the `ComercialDashboard` was managing it. We'll delegate back to the parent 
    // or wrap it here to match the style.)

    // Actually, looking at the previous logic, `LeadDetailPage` takes up the full slot.
    if (selectedLeadId) {
        const lead = leads.find((l: Lead) => l.id === selectedLeadId);
        if (!lead) return null;

        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <LeadDetailPage
                    lead={lead}
                    onBack={onBack}
                    onConvert={onConvert}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Gestão de Leads
                        <Badge variant="secondary" className="text-xs font-black px-2">{leads.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Pipeline de entrada e qualificação de oportunidades.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar lead..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                    </div>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20" onClick={onOpenWizard}>
                        <Plus size={16} className="mr-2" /> Novo Lead
                    </Button>
                </div>
            </div>

            {/* Reusing existing Lead list logic but could be enhanced visually here */}
            {/* For now, we wrap the existing LeadListPage to maintain functionality while we are in transition, 
                or we can render the list items directly here with the new card style. 
                Let's use the LeadListPage for now to minimize logic breakage, knowing it provides the list.
                Wait, LeadListPage handles its own layout. If we want the NEW visual std, we should reimplement the list rendering here.
            */}

            {/* Custom List Rendering matching new Standard */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {leads.map((lead: Lead) => (
                    <Card
                        key={lead.id}
                        onClick={() => onSelectLead(lead.id)}
                        className="group p-6 rounded-[2rem] border-white/5 bg-background/40 backdrop-blur-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {lead.client?.nome.charAt(0) || '?'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">{lead.client?.nome || "Cliente Novo"}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{lead.status}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground group-hover:text-primary">
                                <ArrowUpRight size={18} />
                            </Button>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Users size={12} className="shrink-0" />
                                <span className="truncate">{lead.nomeObra || "Projeto sem nome"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin size={12} className="shrink-0" />
                                <span className="truncate">{lead.localizacao}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                {new Date(lead.criadoEm).toLocaleDateString()}
                            </p>
                            <Badge variant="secondary" className="text-[10px] font-black h-5">
                                Ver Detalhes
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
