import { TaskStatus } from "@domain/index.js";

export interface TaskResponseDTO {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

