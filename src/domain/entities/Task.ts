export class Task {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly dueDate: Date | null,
    public readonly status: TaskStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    title: string,
    description: string | null = null,
    dueDate: Date | null = null
  ): Task {
    const now = new Date();
    const id = crypto.randomUUID();
    
    return new Task(
      id,
      title,
      description,
      dueDate,
      TaskStatus.PENDING,
      now,
      now
    );
  }

  static reconstitute(
    id: string,
    title: string,
    description: string | null,
    dueDate: Date | null,
    status: TaskStatus,
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(id, title, description, dueDate, status, createdAt, updatedAt);
  }

  update(
    title?: string,
    description?: string | null,
    dueDate?: Date | null,
    status?: TaskStatus
  ): Task {
    return new Task(
      this.id,
      title ?? this.title,
      description !== undefined ? description : this.description,
      dueDate !== undefined ? dueDate : this.dueDate,
      status ?? this.status,
      this.createdAt,
      new Date()
    );
  }

  complete(): Task {
    if (this.status === TaskStatus.COMPLETED) {
      return this;
    }
    return this.update(undefined, undefined, undefined, TaskStatus.COMPLETED);
  }

  isOverdue(): boolean {
    if (!this.dueDate) {
      return false;
    }
    return this.dueDate < new Date() && this.status !== TaskStatus.COMPLETED;
  }

  isDueWithin24Hours(): boolean {
    if (!this.dueDate) {
      return false;
    }
    const now = new Date();
    const diff = this.dueDate.getTime() - now.getTime();
    const hours24 = 24 * 60 * 60 * 1000;
    return diff > 0 && diff <= hours24;
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error("Task ID is required");
    }

    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Task title is required");
    }

    if (this.title.length > 255) {
      throw new Error("Task title must not exceed 255 characters");
    }

    if (this.description && this.description.length > 2000) {
      throw new Error("Task description must not exceed 2000 characters");
    }

    if (this.dueDate && this.dueDate < this.createdAt) {
      throw new Error("Task due date cannot be before creation date");
    }
  }
}

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

