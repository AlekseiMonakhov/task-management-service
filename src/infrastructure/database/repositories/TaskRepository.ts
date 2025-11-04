import { eq } from "drizzle-orm";
import { db } from "../connection.js";
import { tasks, TaskTable } from "../schema.js";
import { Task, ITaskRepository, TaskStatus } from "@domain/index.js";

export class TaskRepository implements ITaskRepository {
  async save(task: Task): Promise<Task> {
    const existingTask = await db.select().from(tasks).where(eq(tasks.id, task.id)).limit(1);

    const taskData = {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    if (existingTask.length > 0) {
      await db.update(tasks).set(taskData).where(eq(tasks.id, task.id));
    } else {
      await db.insert(tasks).values(taskData);
    }

    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToDomain(result[0]);
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    let query = db.select().from(tasks);

    if (status) {
      query = query.where(eq(tasks.status, status)) as typeof query;
    }

    const result = await query;
    return result.map((row: TaskTable) => this.mapToDomain(row));
  }

  async delete(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async exists(id: string): Promise<boolean> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result.length > 0;
  }

  private mapToDomain(row: TaskTable): Task {
    return Task.reconstitute(
      row.id,
      row.title,
      row.description,
      row.dueDate ? new Date(row.dueDate) : null,
      row.status as TaskStatus,
      new Date(row.createdAt),
      new Date(row.updatedAt)
    );
  }
}

