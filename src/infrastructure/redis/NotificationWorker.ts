import { NotificationService } from "./NotificationService.js";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export class NotificationWorker {
  private notificationService: NotificationService;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly logDir = "./logs";
  private readonly logFile = "notifications.log";

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    try {
      await mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create log directory:", error);
    }

    this.isRunning = true;
    console.log("Notification Worker started");

    this.intervalId = setInterval(async () => {
      await this.processNotifications();
    }, 10000);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log("Notification Worker stopped");
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private async processNotifications(): Promise<void> {
    try {
      const notification = await this.notificationService.dequeueNotification();

      if (!notification) {
        return;
      }

      const formattedDueDate = this.formatDate(notification.dueDate);
      const formattedTimestamp = this.formatDate(new Date().toISOString());
      const logMessage = `[${formattedTimestamp}] Notification: Task "${notification.title}" (ID: ${notification.taskId}) is due on ${formattedDueDate}\n`;
      const logPath = join(this.logDir, this.logFile);

      await writeFile(logPath, logMessage, { flag: "a" });
      console.log(`Notification logged: ${notification.title} (due: ${formattedDueDate})`);
    } catch (error) {
      console.error("Error processing notification:", error);
    }
  }
}

