import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    message?: string;
    link?: string;
    read: boolean;
    entityType?: string;
    entityId?: string;
    createdAt: string;
}

export function NotificationBell() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(getApiUrl("/api/notifications/unread-count"));
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.count || 0);
                }
            } catch (error) {
                console.error("Failed to fetch unread count:", error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const fetchNotifications = async () => {
                try {
                    const response = await fetch(getApiUrl("/api/notifications"));
                    if (response.ok) {
                        const data = await response.json();
                        setNotifications(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch notifications:", error);
                }
            };

            fetchNotifications();
        }
    }, [isOpen]);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await fetch(getApiUrl(`/api/notifications/${notificationId}/read`), {
                method: "PATCH",
            });

            setNotifications(
                notifications.map((n) =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-primary rounded-full shadow-lg">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-2xl border border-border z-20 overflow-hidden">
                        <div className="px-4 py-3 bg-muted/30 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm">Notificações</h3>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                                        {unreadCount} nova{unreadCount !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <div className="p-3 bg-muted rounded-lg w-fit mx-auto mb-2">
                                        <Bell className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground text-sm">Nenhuma notificação</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {notifications.map((notification) => (
                                        <button
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={cn(
                                                "w-full px-4 py-3 text-left transition-all hover:bg-muted/50",
                                                !notification.read && "bg-primary/5"
                                            )}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                                        <p className="font-semibold text-sm line-clamp-1">
                                                            {notification.title}
                                                        </p>
                                                        {!notification.read && (
                                                            <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                    {notification.message && (
                                                        <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                    )}
                                                    <p className="text-[10px] text-muted-foreground/60">
                                                        {new Date(notification.createdAt).toLocaleString("pt-BR")}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
