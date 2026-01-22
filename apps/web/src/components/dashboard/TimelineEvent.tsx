import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Pencil, CheckSquare, User, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineEventProps {
    date: string;
    type: string;
    title: string;
    user: string;
    project: string;
    onClick?: () => void;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'TEXTO': return FileText;
        case 'FOTO': return Image;
        case 'ESBOCO': return Pencil;
        case 'CHECKLIST': return CheckSquare;
        default: return FileText;
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'TEXTO': return 'bg-blue-500/10 text-blue-600';
        case 'FOTO': return 'bg-purple-500/10 text-purple-600';
        case 'ESBOCO': return 'bg-orange-500/10 text-orange-600';
        case 'CHECKLIST': return 'bg-green-500/10 text-green-600';
        default: return 'bg-gray-500/10 text-gray-600';
    }
};

export function TimelineEvent({ date, type, title, user, project, onClick }: TimelineEventProps) {
    const Icon = getTypeIcon(type);
    const colorClass = getTypeColor(type);
    const timeAgo = getRelativeTime(new Date(date));

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className="p-3 rounded-xl border-border/40 hover:border-primary/30 cursor-pointer transition-all min-w-[280px] max-w-[320px]"
                onClick={onClick}
            >
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
                        <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <User size={10} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground truncate">{user}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Building2 size={10} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground font-bold truncate">{project}</span>
                        </div>
                        <Badge variant="secondary" className="text-[8px] mt-2 h-4">
                            {timeAgo}
                        </Badge>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d atrás`;
    if (diffHours > 0) return `${diffHours}h atrás`;
    return 'Agora';
}
