import { Elysia } from "elysia";
import {
  CreateTaskUseCase,
  GetTaskByIdUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  TaskMapper,
} from "@application/index.js";
import {
  createTaskSchema,
  createTaskBodySchema,
  updateTaskSchema,
  updateTaskBodySchema,
  getTaskByIdSchema,
  deleteTaskSchema,
  getTasksSchema,
} from "../validation/schemas.js";

export const tasksRoutes = (
  createTaskUseCase: CreateTaskUseCase,
  getTaskByIdUseCase: GetTaskByIdUseCase,
  getTasksUseCase: GetTasksUseCase,
  updateTaskUseCase: UpdateTaskUseCase,
  deleteTaskUseCase: DeleteTaskUseCase
) => {
  return new Elysia()
    .post(
      "/tasks",
      async ({ body, set }) => {
        try {
          const validatedBody = createTaskBodySchema.parse(body);
          const dueDate = validatedBody.dueDate ? new Date(validatedBody.dueDate) : null;
          const task = await createTaskUseCase.execute(
            validatedBody.title,
            validatedBody.description || null,
            dueDate
          );
          set.status = 201;
          return TaskMapper.toDTO(task);
        } catch (error) {
          throw error;
        }
      },
      {
        detail: {
          tags: ["tasks"],
          summary: "Create a new task",
          description: "Creates a new task with title, optional description and due date",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: {
                      type: "string",
                      minLength: 1,
                      maxLength: 255,
                    },
                    description: {
                      type: "string",
                      maxLength: 2000,
                      nullable: true,
                    },
                    dueDate: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                  },
                },
                examples: {
                  basic: {
                    summary: "Basic task",
                    value: {
                      title: "Complete project documentation",
                      description: "Write comprehensive documentation for the task management service",
                    },
                  },
                  withDueDate: {
                    summary: "Task with due date (within 24 hours)",
                    value: {
                      title: "Review code changes",
                      description: "Review pull request #123",
                      dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                    },
                  },
                  minimal: {
                    summary: "Minimal task",
                    value: {
                      title: "Quick task",
                    },
                  },
                },
              },
            },
          },
        },
      }
    )
    .get(
      "/tasks",
      async ({ query, set }) => {
        try {
          const tasks = await getTasksUseCase.execute(query.status);
          set.status = 200;
          return TaskMapper.toDTOList(tasks);
        } catch (error) {
          throw error;
        }
      },
      {
        query: getTasksSchema.shape.query,
        detail: {
          tags: ["tasks"],
          summary: "Get all tasks",
          description: "Retrieves a list of all tasks, optionally filtered by status",
          parameters: [
            {
              name: "status",
              in: "query",
              description: "Filter tasks by status",
              required: false,
              schema: {
                type: "string",
                enum: ["pending", "completed"],
              },
              examples: {
                pending: {
                  value: "pending",
                  summary: "Get pending tasks",
                },
                completed: {
                  value: "completed",
                  summary: "Get completed tasks",
                },
              },
            },
          ],
        },
      }
    )
    .get(
      "/tasks/:id",
      async ({ params, set }) => {
        try {
          const task = await getTaskByIdUseCase.execute(params.id);
          set.status = 200;
          return TaskMapper.toDTO(task);
        } catch (error) {
          throw error;
        }
      },
      {
        params: getTaskByIdSchema.shape.params,
        detail: {
          tags: ["tasks"],
          summary: "Get task by ID",
          description: "Retrieves a specific task by its unique identifier",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "Task unique identifier (UUID)",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
          ],
        },
      }
    )
    .put(
      "/tasks/:id",
      async ({ params, body, set }) => {
        try {
          const validatedBody = updateTaskBodySchema.parse(body);
          const validatedParams = updateTaskSchema.shape.params.parse(params);
          const dueDate = validatedBody.dueDate !== undefined ? (validatedBody.dueDate ? new Date(validatedBody.dueDate) : null) : undefined;
          const task = await updateTaskUseCase.execute(
            validatedParams.id,
            validatedBody.title,
            validatedBody.description,
            dueDate,
            validatedBody.status
          );
          set.status = 200;
          return TaskMapper.toDTO(task);
        } catch (error) {
          throw error;
        }
      },
      {
        params: updateTaskSchema.shape.params,
        detail: {
          tags: ["tasks"],
          summary: "Update a task",
          description: "Updates an existing task. All fields are optional.",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "Task unique identifier (UUID)",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
          ],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      minLength: 1,
                      maxLength: 255,
                    },
                    description: {
                      type: "string",
                      maxLength: 2000,
                      nullable: true,
                    },
                    dueDate: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    status: {
                      type: "string",
                      enum: ["pending", "completed"],
                    },
                  },
                  example: {
                    status: "completed",
                  },
                },
                examples: {
                  updateStatus: {
                    summary: "Mark task as completed",
                    value: {
                      status: "completed",
                    },
                  },
                  updateTitle: {
                    summary: "Update title and description",
                    value: {
                      title: "Updated task title",
                      description: "Updated description",
                    },
                  },
                  updateDueDate: {
                    summary: "Update due date (within 24 hours)",
                    value: {
                      dueDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
                    },
                  },
                  fullUpdate: {
                    summary: "Full task update",
                    value: {
                      title: "Updated task",
                      description: "Updated description",
                      dueDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
                      status: "completed",
                    },
                  },
                },
              },
            },
          },
        },
      }
    )
    .delete(
      "/tasks/:id",
      async ({ params, set }) => {
        try {
          await deleteTaskUseCase.execute(params.id);
          set.status = 200;
          return {
            message: "Task deleted successfully",
            id: params.id,
          };
        } catch (error) {
          throw error;
        }
      },
      {
        params: deleteTaskSchema.shape.params,
        detail: {
          tags: ["tasks"],
          summary: "Delete a task",
          description: "Deletes a task by its unique identifier",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "Task unique identifier (UUID)",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
          ],
        },
      }
    );
};

