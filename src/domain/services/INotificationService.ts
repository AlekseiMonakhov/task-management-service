export interface INotificationService {
  enqueueNotification(taskId: string, title: string, dueDate: Date): Promise<void>;
}

