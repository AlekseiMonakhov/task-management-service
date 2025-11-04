import { Task, ITaskRepository, TaskNotFoundError, InvalidTaskDataError, TaskStatus, INotificationService } from "@domain/index.js";

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly notificationService?: INotificationService
  ) {}

  async execute(
    id: string,
    title?: string,
    description?: string | null,
    dueDate?: Date | null,
    status?: TaskStatus
  ): Promise<Task> {
    if (!id || id.trim().length === 0) {
      throw new TaskNotFoundError(id);
    }

    const existingTask = await this.taskRepository.findById(id);

    if (!existingTask) {
      throw new TaskNotFoundError(id);
    }

    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        throw new InvalidTaskDataError("Title cannot be empty");
      }

      if (title.length > 255) {
        throw new InvalidTaskDataError("Title must not exceed 255 characters");
      }
    }

    if (description !== undefined && description && description.length > 2000) {
      throw new InvalidTaskDataError("Description must not exceed 2000 characters");
    }

    const updatedTask = existingTask.update(title, description, dueDate, status);
    const savedTask = await this.taskRepository.save(updatedTask);

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

