import { toast } from "react-hot-toast";
import type { CalendarEvent } from "@/types/calendar";
import { createElement } from "react";
import { EventNotification } from "@/components/notifications/EventNotification";

// Set pour stocker les IDs des notifications déjà envoyées
const sentNotifications = new Set<string>();

export const checkAndNotifyEvents = (events: CalendarEvent[]) => {
  const now = new Date();

  events.forEach((event) => {
    // Vérifications préliminaires
    if (!isValidEventForNotification(event)) return;

    const reminderTime = new Date(
      event.start.getTime() - (event.reminder || 0) * 60000
    );
    const timeDiff = reminderTime.getTime() - now.getTime();

    // Si c'est le moment de notifier et qu'on n'a pas déjà envoyé la notification
    if (shouldShowNotification(timeDiff, event.id)) {
      showEventNotification(event);
      sentNotifications.add(event.id);

      // Nettoyage des anciennes notifications après 24h
      setTimeout(() => {
        sentNotifications.delete(event.id);
      }, 24 * 60 * 60 * 1000);
    }
  });
};

const isValidEventForNotification = (event: CalendarEvent): boolean => {
  return (
    event.status === "upcoming" &&
    !!event.reminder &&
    !!event.start &&
    event.start instanceof Date &&
    !sentNotifications.has(event.id)
  );
};

const shouldShowNotification = (timeDiff: number, eventId: string): boolean => {
  return (
    timeDiff >= 0 &&
    timeDiff <= 60000 && // Dans la minute qui suit
    !sentNotifications.has(eventId)
  );
};

const showEventNotification = (event: CalendarEvent) => {
  try {
    // Notification navigateur si autorisé
    if (Notification.permission === "granted") {
      const notification = new Notification("Rappel d'événement", {
        body: `${event.title} commence dans ${event.reminder} minutes`,
        icon: "/favicon.ico", // Ajoutez le chemin de votre icône
        tag: event.id, // Évite les doublons de notifications système
      });

      // Gérer le clic sur la notification
      notification.onclick = () => {
        window.focus();
        // Vous pouvez ajouter ici une navigation vers l'événement
      };
    }

    // Toast notification
    toast.custom(
      (t) =>
        createElement(EventNotification, {
          event,
          reminderMinutes: event.reminder || 0,
          visible: t.visible,
        }),
      {
        duration: 5000,
        icon: "🔔",
        id: event.id, // Évite les doublons de toasts
      }
    );
  } catch (error) {
    // Fallback sur toast uniquement en cas d'erreur
    console.error("Erreur lors de l'envoi de la notification:", error);
    toast.error(
      `Rappel : ${event.title} commence dans ${event.reminder} minutes`
    );
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!("Notification" in window)) {
      console.warn("Ce navigateur ne supporte pas les notifications de bureau");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de la demande de permission:", error);
    return false;
  }
};

// Fonction utilitaire pour nettoyer les notifications anciennes
export const cleanupOldNotifications = () => {
  sentNotifications.clear();
};
