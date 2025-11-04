import { Elysia } from "elysia";
import {
  DomainError,
  TaskNotFoundError,
  InvalidTaskDataError,
  TaskValidationError,
} from "@domain/index.js";

export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    if (error instanceof TaskNotFoundError) {
      set.status = 404;
      return {
        error: "TaskNotFoundError",
        message: error.message,
      };
    }

    if (error instanceof InvalidTaskDataError || error instanceof TaskValidationError) {
      set.status = 400;
      return {
        error: "InvalidTaskDataError",
        message: error.message,
      };
    }

    if (error instanceof DomainError) {
      set.status = 400;
      return {
        error: "DomainError",
        message: error.message,
      };
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: "ValidationError",
        message: error.message,
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "NotFound",
        message: "Route not found",
      };
    }

    console.error("Unhandled error:", error);
    set.status = 500;
    return {
      error: "InternalServerError",
      message: "An unexpected error occurred",
    };
  });

