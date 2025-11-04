import { Task, ITaskRepository, TaskNotFoundError } from "@domain/index.js";

export class GetTaskByIdUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<Task> {
    if (!id || id.trim().length === 0) {
      throw new TaskNotFoundError(id);
    }

    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new TaskNotFoundError(id);
    }

    return task;
  }
}

