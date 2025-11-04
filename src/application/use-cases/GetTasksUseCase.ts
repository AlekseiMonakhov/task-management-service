import { Task, ITaskRepository, TaskStatus } from "@domain/index.js";

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(status?: TaskStatus): Promise<Task[]> {
    return await this.taskRepository.findAll(status);
  }
}

