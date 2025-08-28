import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
    });
  }

  // Known application errors
  if (error instanceof Error && 'statusCode' in error && error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  // Database constraint errors
  if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
    const field = extractFieldFromConstraintError(error.message);
    return res.status(409).json({
      error: `${field} already exists`,
      code: 'DUPLICATE_ENTRY'
    });
  }

  // JWT errors
  if (error instanceof Error && error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  // Default server error
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`
  });
};

export const createError = (message: string, statusCode: number = 400): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

const extractFieldFromConstraintError = (message: string): string => {
  // Extract field name from SQLite constraint error
  const match = message.match(/UNIQUE constraint failed: \w+\.(\w+)/);
  return match ? match[1] : 'field';
};