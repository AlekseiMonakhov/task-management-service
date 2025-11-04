import { z } from "zod";

export const createTaskBodySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const createTaskSchema = z.object({
  body: createTaskBodySchema,
});

export const updateTaskBodySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  status: z.enum(["pending", "completed"]).optional(),
});

export const updateTaskSchema = z.object({
  body: updateTaskBodySchema,
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getTaskByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getTasksSchema = z.object({
  query: z.object({
    status: z.enum(["pending", "completed"]).optional(),
  }),
});

