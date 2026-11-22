import { sileo } from "sileo";

const durations = { success: 2000, info: 2000, warning: 2500, error: 3000 };

export const notificationStyles = {
  fill: "var(--mc-surface)",
  styles: { title: "commerce-toast-title", description: "commerce-toast-description", badge: "commerce-toast-badge" },
  autopilot: { expand: 160 },
};

export function notify(type, title, description, position) {
  return sileo[type]({
    title,
    description,
    position,
    duration: durations[type],
  });
}
