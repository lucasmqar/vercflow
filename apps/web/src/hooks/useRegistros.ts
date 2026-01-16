import { create } from 'zustand';
import { Record } from '@/types';
import { toast } from 'sonner';

interface RegistrosState {
    registros: Record[];
    isLoading: boolean;
    fetchRegistros: () => Promise<void>;
    addRegistro: (data: Partial<Record>) => Promise<Record>;
    saveSketch: (recordId: string, dataJson: string, imageUrl: string) => Promise<void>;
    updateRegistroStatus: (id: string, status: string) => Promise<void>;
    convertRegistro: (id: string, data: any) => Promise<void>;
}

export const useRegistros = create<RegistrosState>((set, get) => ({
    registros: [],
    isLoading: false,

    fetchRegistros: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('http://localhost:4000/api/records');
            const data = await response.json();
            set({ registros: data, isLoading: false });
        } catch (error) {
            toast.error('Erro ao carregar registros');
            set({ isLoading: false });
        }
    },

    addRegistro: async (data) => {
        try {
            const response = await fetch('http://localhost:4000/api/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.status === 401) {
                // Handle stale session
                const errorData = await response.json();
                import('./useAuth').then(m => m.useAuth.getState().logout());
                throw new Error(errorData.error || 'Sessão inválida');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar registro');
            }

            const newRecord = await response.json();
            set((state) => ({ registros: [newRecord, ...state.registros] }));
            return newRecord;
        } catch (error: any) {
            toast.error(error.message || 'Erro ao salvar registro');
            throw error;
        }
    },

    saveSketch: async (recordId, dataJson, imageUrl) => {
        try {
            const response = await fetch(`http://localhost:4000/api/records/${recordId}/sketch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataJson, imageUrl }),
            });

            if (!response.ok) throw new Error('Falha ao salvar esboço');

            toast.success('Esboço salvo e PDF timbrado gerado');
            await get().fetchRegistros(); // Refresh timeline
        } catch (error) {
            toast.error('Erro ao salvar esboço');
            throw error;
        }
    },

    updateRegistroStatus: async (id, status) => {
        // Optimistic UI update
        const previousRegistros = get().registros;
        set((state) => ({
            registros: state.registros.map((r) => r.id === id ? { ...r, status: status as any } : r)
        }));

        try {
            const response = await fetch(`http://localhost:4000/api/records/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('Falha ao atualizar status');

            // Optionally update with server response to sync exact fields
            const updatedRecord = await response.json();
            set((state) => ({
                registros: state.registros.map((r) => r.id === id ? updatedRecord : r)
            }));
        } catch (error) {
            toast.error('Erro ao sincronizar status com o servidor');
            // Rollback on error
            set({ registros: previousRegistros });
        }
    },

    convertRegistro: async (id, data) => {
        try {
            const response = await fetch(`http://localhost:4000/api/records/${id}/convert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Falha na conversão');

            toast.success('Registro formalizado e convertido em atividade!');
            await get().fetchRegistros(); // Refresh to get the updated status and linked info
        } catch (error) {
            toast.error('Erro ao converter registro');
            throw error;
        }
    }
}));


