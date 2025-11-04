import { Task } from "../entities/Task.js";
import { TaskStatus } from "../entities/Task.js";

export interface ITaskRepository {
  
  save(task: Task): Promise<Task>;

  findById(id: string): Promise<Task | null>;

  findAll(status?: TaskStatus): Promise<Task[]>;

  delete(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;
}

