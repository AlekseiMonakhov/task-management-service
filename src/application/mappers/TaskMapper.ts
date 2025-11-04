import { Task } from "@domain/index.js";
import { TaskResponseDTO } from "../dto/TaskResponseDTO.js";

export class TaskMapper {
  static toDTO(task: Task): TaskResponseDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  static toDTOList(tasks: Task[]): TaskResponseDTO[] {
    return tasks.map(task => this.toDTO(task));
  }
}

