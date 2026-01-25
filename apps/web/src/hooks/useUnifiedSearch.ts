import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';

export interface SearchResult {
    id: string;
    type: 'obra' | 'registro' | 'profissional' | 'task' | 'client' | 'action';
    title: string;
    subtitle: string;
    icon?: any; // We'll map icons in the component to avoid circular dep or heavy imports here
    originalData?: any;
}

export function useUnifiedSearch(query: string) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch in parallel
                const [projectsRes, recordsRes, profsRes, activitiesRes, clientsRes] = await Promise.all([
                    fetch(getApiUrl('/api/projects')), // In a real app we would pass ?q=query to search endpoint
                    fetch(getApiUrl('/api/records')),
                    fetch(getApiUrl('/api/professionals')),
                    fetch(getApiUrl('/api/activities')),
                    fetch(getApiUrl('/api/clients'))
                ]);

                // We are fetching ALL and filtering client side because the backend 
                // doesn't seem to have a unified search endpoint yet.
                // This is a temporary "Frontend Specialist" fix to get rid of Mock Data.
                // The "Backend Specialist" optimization would be to add /api/search?q=...

                const [projects, records, profs, activities, clients] = await Promise.all([
                    projectsRes.json(),
                    recordsRes.json(),
                    profsRes.json(),
                    activitiesRes.json(),
                    clientsRes.json()
                ]);

                const q = query.toLowerCase();
                const combined: SearchResult[] = [];

                // Process Projects
                if (Array.isArray(projects)) {
                    projects
                        .filter((p: any) => p.nome?.toLowerCase().includes(q) || p.endereco?.toLowerCase().includes(q))
                        .forEach((p: any) => combined.push({
                            id: p.id,
                            type: 'obra',
                            title: p.nome,
                            subtitle: p.endereco || 'Sem endereço',
                            originalData: p
                        }));
                }

                // Process Records
                if (Array.isArray(records)) {
                    records
                        .filter((r: any) => r.texto?.toLowerCase().includes(q) || r.refCodigo?.toLowerCase().includes(q))
                        .forEach((r: any) => combined.push({
                            id: r.id,
                            type: 'registro',
                            title: r.refCodigo || 'Registro',
                            subtitle: `${r.project?.nome || 'Geral'} • ${r.status}`,
                            originalData: r
                        }));
                }

                // Process Professionals
                if (Array.isArray(profs)) {
                    profs
                        .filter((p: any) => p.nome?.toLowerCase().includes(q) || p.tipo?.toLowerCase().includes(q))
                        .forEach((p: any) => combined.push({
                            id: p.id,
                            type: 'profissional',
                            title: p.nome,
                            subtitle: p.tipo,
                            originalData: p
                        }));
                }

                // Process Tasks (Activities)
                if (Array.isArray(activities)) {
                    activities
                        .filter((a: any) => a.titulo?.toLowerCase().includes(q))
                        .forEach((a: any) => combined.push({
                            id: a.id,
                            type: 'task',
                            title: a.titulo,
                            subtitle: `${a.project?.nome || 'Geral'} • ${a.status}`,
                            originalData: a
                        }));
                }

                // Process Clients
                if (Array.isArray(clients)) {
                    clients
                        .filter((c: any) => c.nome?.toLowerCase().includes(q))
                        .forEach((c: any) => combined.push({
                            id: c.id,
                            type: 'client',
                            title: c.nome,
                            subtitle: 'Cliente / Contratante',
                            originalData: c
                        }));
                }

                setResults(combined.slice(0, 15)); // Limit to 15

            } catch (err) {
                console.error("Search failed", err);
                setError("Falha ao buscar dados");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // Debounce 300ms
        return () => clearTimeout(timeoutId);

    }, [query]);

    return { results, loading, error };
}
