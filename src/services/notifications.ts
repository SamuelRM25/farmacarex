/**
 * Notification Service
 * Handles browser notifications for upcoming visits/planning.
 */

export const notificationService = {
    /**
     * Request permission for notifications
     */
    requestPermission: async () => {
        if (!('Notification' in window)) {
            console.warn('Este navegador no soporta notificaciones.');
            return false;
        }

        if (Notification.permission === 'granted') return true;

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    /**
     * Show a notification
     */
    show: (title: string, options?: NotificationOptions) => {
        if (Notification.permission === 'granted') {
            return new Notification(title, {
                icon: '/pwa-192x192.png',
                badge: '/favicon.ico',
                ...options
            });
        }
    },

    /**
     * Check for upcoming visits and notify
     * @param planning List of planning items
     */
    checkUpcomingVisits: (planning: any[]) => {
        const now = new Date();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        planning.forEach(item => {
            if (item.dia === currentDay && item.mes === currentMonth && item.Año === currentYear) {
                // Parse time (expecting HH:mm)
                const [hours, minutes] = item.horario.split(':').map(Number);
                if (isNaN(hours)) return;

                const visitTime = new Date(now);
                visitTime.setHours(hours, minutes, 0, 0);

                const diffMinutes = (visitTime.getTime() - now.getTime()) / (1000 * 60);

                // Notify 15 minutes before
                if (diffMinutes > 14 && diffMinutes < 16) {
                    notificationService.show('Próxima Visita', {
                        body: `En 15 min: ${item.nombreMedico} en ${item.direccion}`,
                        tag: `visit-${item.id}`,
                        requireInteraction: true
                    });
                }
            }
        });
    }
};
