import React from 'react';
import { Budget } from '@/types';
import { BudgetDetailPage, BudgetListPage } from './BudgetManagement';

export function ComercialBudgets({
    budgets,
    selectedBudgetId,
    onSelectBudget,
    onBack,
    onCreateProposal
}: any) {

    if (selectedBudgetId) {
        const budget = budgets.find((b: Budget) => b.id === selectedBudgetId);
        if (!budget) return null;
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <BudgetDetailPage
                    budget={budget}
                    onBack={onBack}
                    onCreateProposal={onCreateProposal}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight uppercase italic">Orçamentos Técnicos</h2>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Gestão de estimativas e fluxos de validação interdepartamental.</p>
            </div>

            <BudgetListPage onSelect={(b) => onSelectBudget(b.id)} />
        </div>
    );
}
