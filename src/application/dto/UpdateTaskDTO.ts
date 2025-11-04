import { TaskStatus } from "@domain/index.js";

export interface UpdateTaskDTO {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
}

