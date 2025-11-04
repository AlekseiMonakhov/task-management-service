export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class TaskNotFoundError extends DomainError {
  constructor(taskId: string) {
    super(`Task with ID ${taskId} not found`);
  }
}

export class InvalidTaskDataError extends DomainError {
  constructor(message: string) {
    super(`Invalid task data: ${message}`);
  }
}

export class TaskValidationError extends DomainError {
  constructor(message: string) {
    super(`Task validation failed: ${message}`);
  }
}

