import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { TaskRepository } from "./infrastructure/database/repositories/TaskRepository.js";
import { runMigrations } from "./infrastructure/database/runMigrations.js";
import { redisClient } from "./infrastructure/redis/connection.js";
import { NotificationService } from "./infrastructure/redis/NotificationService.js";
import { NotificationWorker } from "./infrastructure/redis/NotificationWorker.js";
import {
  CreateTaskUseCase,
  GetTaskByIdUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
} from "./application/index.js";
import { tasksRoutes } from "./infrastructure/http/routes/tasks.js";
import { errorHandler } from "./infrastructure/http/middleware/errorHandler.js";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await runMigrations();

    await redisClient.connect();
    console.log("Redis connected");

    const taskRepository = new TaskRepository();
    const notificationService = new NotificationService();
    const notificationWorker = new NotificationWorker(notificationService);

    await notificationWorker.start();

    const createTaskUseCase = new CreateTaskUseCase(taskRepository, notificationService);
    const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
    const getTasksUseCase = new GetTasksUseCase(taskRepository);
    const updateTaskUseCase = new UpdateTaskUseCase(taskRepository, notificationService);
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

    const app = new Elysia()
      .use(cors())
      .use(errorHandler)
      .use(
        swagger({
          documentation: {
            info: {
              title: "Task Management Service",
              version: "1.0.0",
              description: "API for managing tasks",
            },
            tags: [{ name: "tasks", description: "Task management endpoints" }],
          },
        })
      )
      .use(
        tasksRoutes(
          createTaskUseCase,
          getTaskByIdUseCase,
          getTasksUseCase,
          updateTaskUseCase,
          deleteTaskUseCase
        )
      );

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger documentation: http://localhost:${PORT}/swagger`);
    });

    process.on("SIGINT", async () => {
      console.log("\nShutting down server...");
      await notificationWorker.stop();
      await redisClient.quit();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
