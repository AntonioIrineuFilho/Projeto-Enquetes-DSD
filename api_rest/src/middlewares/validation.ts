import { RequestHandler } from "express";
import { ZodError, ZodObject } from "zod";
import { StatusCodes } from "http-status-codes";
import { $ZodIssue } from "zod/v4/core";

type TAllowedFields = "body" | "query" | "header" | "params";
type TValidation = (field: TAllowedFields, schema: ZodObject) => RequestHandler;

export const validation: TValidation = (field, schema) => (req, res, next) => {
  let errors: $ZodIssue[][] = [];

  try {
    schema.parse(req[field]);
  } catch (err) {
    if (err instanceof ZodError) {
      errors.push(err.issues);
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  if (errors.length > 0) {
    return res.json({ Errors: errors[0] }).status(StatusCodes.BAD_REQUEST);
  }

  next();
};
