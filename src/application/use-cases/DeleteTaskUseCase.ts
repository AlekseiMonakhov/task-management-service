import { ITaskRepository, TaskNotFoundError } from "@domain/index.js";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new TaskNotFoundError(id);
    }

    const exists = await this.taskRepository.exists(id);

    if (!exists) {
      throw new TaskNotFoundError(id);
    }

    await this.taskRepository.delete(id);
  }
}

