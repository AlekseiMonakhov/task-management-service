import { Task, ITaskRepository, InvalidTaskDataError, INotificationService } from "@domain/index.js";

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly notificationService?: INotificationService
  ) {}

  async execute(
    title: string,
    description: string | null = null,
    dueDate: Date | null = null
  ): Promise<Task> {
    if (!title || title.trim().length === 0) {
      throw new InvalidTaskDataError("Title is required");
    }

    if (title.length > 255) {
      throw new InvalidTaskDataError("Title must not exceed 255 characters");
    }

    if (description && description.length > 2000) {
      throw new InvalidTaskDataError("Description must not exceed 2000 characters");
    }

    const task = Task.create(title, description, dueDate);
    const savedTask = await this.taskRepository.save(task);

    if (this.notificationService && savedTask.isDueWithin24Hours() && savedTask.dueDate) {
      await this.notificationService.enqueueNotification(
        savedTask.id,
        savedTask.title,
        savedTask.dueDate
      );
    }

    return savedTask;
  }
}

