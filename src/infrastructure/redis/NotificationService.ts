import { INotificationService } from "@domain/index.js";
import { redisClient } from "./connection.js";

interface NotificationMessage {
  taskId: string;
  title: string;
  dueDate: string;
  timestamp: string;
}

export class NotificationService implements INotificationService {
  private readonly queueName = "task_notifications";

  async enqueueNotification(taskId: string, title: string, dueDate: Date): Promise<void> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const message: NotificationMessage = {
        taskId,
        title,
        dueDate: dueDate.toISOString(),
        timestamp: new Date().toISOString(),
      };

      await redisClient.lPush(this.queueName, JSON.stringify(message));
    } catch (error) {
      console.error("Failed to enqueue notification:", error);
    }
  }

  async dequeueNotification(): Promise<NotificationMessage | null> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const result = await redisClient.rPop(this.queueName);
      if (!result) {
        return null;
      }

      return JSON.parse(result) as NotificationMessage;
    } catch (error) {
      console.error("Failed to dequeue notification:", error);
      return null;
    }
  }
}

